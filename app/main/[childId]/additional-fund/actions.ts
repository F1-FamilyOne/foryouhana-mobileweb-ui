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

  try {
    // 계좌번호 생성
    const accNum = generateAccountNumber();

    // 정기적립식의 경우 필수 값 검증
    if (investType === 'REGULAR') {
      if (!monthlyAmount || !transferDay) {
        return {
          success: false,
          error: '정기적립식은 월 납입액과 납입일이 필요합니다.',
        };
      }
    }

    // 펀드 계좌 생성
    const newAccount = await prisma.account.create({
      data: {
        child_id: childId,
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
      await prisma.auto_transfer.create({
        data: {
          transfer_day: transferDay,
          transfer_count: months, // 총 납입횟수
          amount: BigInt(monthlyAmount * 10000), // 만원 → 원 변환
          source_account_id: depositAccountId,
          target_account_id: newAccount.id,
        },
      });
    }

    return {
      success: true,
      accountId: newAccount.id,
      accountNumber: accNum,
    };
  } catch (error) {
    console.error('펀드 계좌 생성 실패:', error);
    return {
      success: false,
      error: '펀드 계좌 생성에 실패했습니다.',
    };
  }
}

/**
 * 아이의 입금계좌(DEPOSIT) 조회
 */
export async function getChildDepositAccount(childId: number) {
  const account = await prisma.account.findFirst({
    where: {
      child_id: childId,
      acc_type: 'DEPOSIT',
    },
  });

  if (!account) return null;

  return {
    ...account,
    plus_rate: account.plus_rate ? Number(account.plus_rate) : null,
  };
}

/**
 * 펀드 정보 조회
 */
export async function getFundById(fundId: number) {
  const fund = await prisma.fund.findUnique({
    where: { id: fundId },
  });

  if (!fund) return null;

  return {
    ...fund,
    total_fee: fund.total_fee ? Number(fund.total_fee) : null,
    sell_fee: fund.sell_fee ? Number(fund.sell_fee) : null,
    plus_1: fund.plus_1 ? Number(fund.plus_1) : null,
    plus_5: fund.plus_5 ? Number(fund.plus_5) : null,
    plus_10: fund.plus_10 ? Number(fund.plus_10) : null,
  };
}

/**
 * 아이의 현재 월 증여액 합계 조회
 */
export async function getChildMonthlyGiftTotal(childId: number) {
  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { monthly_money: true },
  });

  return child?.monthly_money ? Number(child.monthly_money) : 0;
}
