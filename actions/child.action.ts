'use server';

import { randomBytes, randomInt } from 'node:crypto';
import { account_acc_type, invest_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

export type BirthInput = {
  year: number;
  month: number;
  day: number;
  age: number;
};

export type DraftPlanPayload = {
  child_id: string | number | null;
  child_name: string | { name: string };
  isSigned: boolean;
  updated_at: string;
  plan: {
    child_birth: BirthInput;
    goal_money: number;
    monthly_money: number;
    is_promise_fixed: boolean;
    in_month: number;
    in_type: boolean;
    acc_type: 'PENSION' | 'DEPOSIT' | 'GIFT_DEPOSIT';
  };
};

function generateSecureAccNum(prefix?: string): string {
  const timestamp = Date.now().toString().slice(-4);
  const secureRandom = randomInt(10000000, 99999999).toString();
  return prefix
    ? `${prefix}-${timestamp}${secureRandom.slice(0, 4)}`
    : `${timestamp}${secureRandom}`;
}

function generateSecureDeposit(): bigint {
  const amount = randomInt(10, 101) * 10000;
  return BigInt(amount);
}

export async function createChildAndAccount(
  sessionData: DraftPlanPayload,
  parentId: number,
) {
  try {
    // 0. 유효성 검사
    if (!sessionData || !sessionData.plan) {
      throw new Error('전달된 플랜 데이터가 유효하지 않습니다.');
    }

    if (!parentId || Number.isNaN(parentId)) {
      throw new Error('유효한 부모 ID가 필요합니다. 다시 로그인해주세요.');
    }

    const { child_name, plan } = sessionData;
    const {
      child_birth,
      goal_money,
      monthly_money,
      is_promise_fixed,
      in_month,
      in_type,
      acc_type,
    } = plan;

    const finalName =
      typeof child_name === 'object' ? child_name.name : child_name;
    const startDate = new Date();
    const endDate = new Date();
    if (in_month) {
      endDate.setMonth(startDate.getMonth() + in_month);
    }

    const bornDate = new Date(
      child_birth.year,
      child_birth.month - 1,
      child_birth.day,
    );

    const identityHash =
      sessionData.child_id?.toString() || randomBytes(16).toString('hex');

    // DB 트랜잭션 시작
    const result = await prisma.$transaction(async (tx) => {
      // 1. 자녀 유저 생성/업데이트 (User 모델 통합 버전)
      const child = await tx.user.upsert({
        where: { identity_hash: identityHash },
        update: {
          name: finalName,
          goal_money: goal_money ? BigInt(goal_money) : 0n,
          monthly_money: monthly_money ? BigInt(monthly_money) : 0n,
          is_promise_fixed,
          invest_type: invest_type.NOBASE,
          start_date: startDate,
          end_date: endDate,
        },
        create: {
          name: finalName,
          born_date: bornDate,
          goal_money: goal_money ? BigInt(goal_money) : 0n,
          monthly_money: monthly_money ? BigInt(monthly_money) : 0n,
          is_promise_fixed,
          identity_hash: identityHash,
          start_date: startDate,
          end_date: endDate,
        },
      });

      // 2. 증여 원천 계좌(GIFT_DEPOSIT) 존재 여부 확인 및 생성
      const existingGiftAccount = await tx.account.findFirst({
        where: {
          user_id: child.id,
          acc_type: account_acc_type.GIFT_DEPOSIT,
        },
      });

      if (!existingGiftAccount) {
        await tx.account.create({
          data: {
            user_id: child.id,
            acc_num: generateSecureAccNum('1002-888'),
            acc_type: account_acc_type.GIFT_DEPOSIT,
            opened_at: new Date(),
            deposit: generateSecureDeposit(),
            in_type: false, // 정기
            status: 'ACTIVE',
          },
        });
      }

      // 3. 특정 플랜 계좌(PENSION 등) 생성 (타입이 다를 경우에만)
      if (acc_type !== 'GIFT_DEPOSIT') {
        const existingPlanAccount = await tx.account.findFirst({
          where: {
            user_id: child.id,
            acc_type: acc_type as account_acc_type,
          },
        });

        if (!existingPlanAccount) {
          await tx.account.create({
            data: {
              user_id: child.id,
              acc_num: generateSecureAccNum(),
              acc_type: acc_type as account_acc_type,
              opened_at: startDate,
              in_month: in_month,
              in_type: in_type,
              deposit: 0n,
            },
          });
        }
      }

      // 4. 부모-자녀 관계 설정 (read_auth) - reader: 부모 ID, provider: 자녀 ID
      await tx.read_auth.upsert({
        where: {
          reader_id_provider_id: {
            reader_id: parentId,
            provider_id: child.id,
          },
        },
        update: {}, // 이미 관계가 있으면 업데이트할 내용 없음
        create: {
          reader_id: parentId,
          provider_id: child.id,
        },
      });

      return child;
    });

    return { success: true, childId: result.id };
  } catch (error) {
    console.error('DB 저장 중 오류 발생 (Rollback):', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '데이터 저장 중 오류 발생',
    };
  }
}
