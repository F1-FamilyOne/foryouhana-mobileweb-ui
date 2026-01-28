'use server';

import { randomBytes, randomInt } from 'node:crypto';
import { account_acc_type, invest_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

/**
 * @page: 자녀 & 자녀 입출금 계좌 생성
 * @description: 자녀 및 목표/원천 계좌를 트랜잭션으로 생성하며, 중복 계좌 생성을 방지합니다.
 * @author: 승빈
 * @date: 2026-01-28
 */

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
    acc_type: 'PENSION' | 'DEPOSIT';
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
    // 0. 기초 데이터 및 parentId 유효성 검사
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

    // 생일 날짜 객체 안전 생성
    const bornDate = new Date(
      child_birth.year,
      child_birth.month - 1,
      child_birth.day,
      0,
      0,
      0,
    );

    const identityHash =
      sessionData.child_id?.toString() || randomBytes(16).toString('hex');

    const result = await prisma.$transaction(async (tx) => {
      // 1. 자녀 생성/업데이트 (Upsert)
      const child = await tx.child.upsert({
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
          parent_id: parentId, // 🚀 전달받은 parentId 사용
          name: finalName,
          born_date: bornDate,
          goal_money: goal_money ? BigInt(goal_money) : 0n,
          monthly_money: monthly_money ? BigInt(monthly_money) : 0n,
          is_promise_fixed,
          identity_hash: identityHash,
          start_date: startDate,
          end_date: endDate,
          account: {
            create: {
              acc_num: generateSecureAccNum(),
              acc_type:
                acc_type === 'PENSION'
                  ? account_acc_type.PENSION
                  : account_acc_type.DEPOSIT,
              opened_at: startDate,
              in_month: in_month,
              in_type: in_type,
              deposit: 0n,
            },
          },
        },
      });

      // 2. [수정부] 기존 원천 계좌(gift_account_id)가 있는지 체크하여 고아 데이터 방지
      let finalChild = child;

      if (!child.gift_account_id) {
        // 원천 계좌가 없을 때만 새로 생성
        const sourceAccount = await tx.account.create({
          data: {
            child_id: child.id,
            acc_num: generateSecureAccNum('1002-888'),
            acc_type:
              acc_type === 'PENSION'
                ? account_acc_type.PENSION
                : account_acc_type.DEPOSIT,
            opened_at: new Date('2024-01-01'),
            deposit: generateSecureDeposit(),
            in_type: false,
          },
        });

        // 생성된 계좌를 자녀 정보에 연결
        finalChild = await tx.child.update({
          where: { id: child.id },
          data: { gift_account_id: sourceAccount.id },
        });
      }

      return finalChild;
    });

    return { success: true, childId: result.id };
  } catch (error) {
    console.error('DB 저장 중 오류 발생 (Rollback):', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '데이터 저장 중 오류가 발생했습니다.',
    };
  }
}
