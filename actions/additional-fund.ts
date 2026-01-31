'use server';

/**
 * @page: 추가 펀드 가입 Server Actions
 * @description: 펀드 계좌 생성 및 자동이체 설정을 처리합니다.
 * @author: 권순범
 * @date: 2026-01-26
 */

import { prisma } from '@/lib/prisma';
import { generateAccountNumber } from '@/lib/utils/account-number';

type CreateFundAccountInput = {
  childId: number;
  fundId: number;
  depositAccountId: number; // 출금계좌 (입금계좌)
  investType: 'REGULAR' | 'FREE'; // 정기적립식 / 자유적립식
  months: number; // 납입 기간 (개월)
  monthlyAmount?: number; // 월 납입액 (만원 단위) - 정기적립식만
  transferDay?: number; // 월 납입일 (1-31) - 정기적립식만
};

type CreateFundAccountResult = {
  success: boolean;
  accountId?: number;
  accountNumber?: string;
  error?: string;
};

/**
 * 펀드 계좌 생성
 * - 정기적립식: account + auto_transfer 생성
 * - 자유적립식: account만 생성
 */
export async function createFundAccount(
  input: CreateFundAccountInput,
): Promise<CreateFundAccountResult> {
  const {
    childId,
    fundId,
    depositAccountId,
    investType,
    months,
    monthlyAmount,
    transferDay,
  } = input;

  // 정기적립식의 경우 필수 값 검증 (트랜잭션 밖에서)
  if (investType === 'REGULAR' && (!monthlyAmount || !transferDay)) {
    return {
      success: false,
      error: '정기적립식은 월 납입액과 납입일이 필요합니다.',
    };
  }

  const MAX_RETRY_COUNT = 5;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 동일 펀드 중복 가입 방지
      const existingAccount = await tx.account.findFirst({
        where: {
          user_id: childId,
          fund_id: fundId,
          status: 'ACTIVE',
        },
      });
      if (existingAccount) {
        throw new Error('DUPLICATE_FUND_ACCOUNT');
      }

      // 중복되지 않는 계좌번호 생성 (재시도 로직)
      let accNum = '';
      for (let attempt = 0; attempt < MAX_RETRY_COUNT; attempt++) {
        accNum = generateAccountNumber();
        const existing = await tx.account.findFirst({
          where: { acc_num: accNum },
        });
        if (!existing) break;
        if (attempt === MAX_RETRY_COUNT - 1) {
          throw new Error('ACCOUNT_NUMBER_GENERATION_FAILED');
        }
      }

      // 펀드 계좌 생성
      const account = await tx.account.create({
        data: {
          user_id: childId,
          fund_id: fundId,
          acc_num: accNum,
          acc_type: 'FUND',
          opened_at: new Date(),
          deposit: BigInt(0),
          in_type: investType === 'FREE', // 0=정기(false), 1=자유(true)
          plus_rate: 0,
          plus_money: BigInt(0),
          in_month: months,
        },
      });

      // 정기적립식인 경우 auto_transfer 생성
      if (investType === 'REGULAR' && monthlyAmount && transferDay) {
        await tx.auto_transfer.create({
          data: {
            transfer_day: transferDay,
            transfer_count: months, // 총 납입횟수
            amount: BigInt(monthlyAmount * 10000), // 만원 → 원 변환
            source_account_id: depositAccountId,
            target_account_id: account.id,
          },
        });
      }

      return { accountId: account.id, accountNumber: accNum };
    });

    return {
      success: true,
      accountId: result.accountId,
      accountNumber: result.accountNumber,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'DUPLICATE_FUND_ACCOUNT') {
        return {
          success: false,
          error: '이미 가입된 펀드 상품입니다.',
        };
      }
      if (error.message === 'ACCOUNT_NUMBER_GENERATION_FAILED') {
        return {
          success: false,
          error: '계좌번호 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
        };
      }
    }
    console.error('펀드 계좌 생성 실패:', error);
    return {
      success: false,
      error: '펀드 계좌 생성에 실패했습니다.',
    };
  }
}
