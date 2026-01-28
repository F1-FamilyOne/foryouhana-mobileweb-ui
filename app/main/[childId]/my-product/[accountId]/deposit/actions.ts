/**
 * @page: DepositActions
 * @description: 입금 처리를 위한 서버 액션
 * @author: 권순범
 * @date: 2026-01-27
 */

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { formatWon } from '@/lib/utils';

type DepositInput = {
  childId: number;
  sourceAccountId: number;
  targetAccountId: number;
  amount: number;
};

type DepositResult = {
  success: boolean;
  error?: string;
};

export async function processDeposit(
  input: DepositInput,
): Promise<DepositResult> {
  const { childId, sourceAccountId, targetAccountId, amount } = input;

  // 1. 입력 검증
  if (amount <= 0) {
    return { success: false, error: '금액은 0원보다 커야 합니다.' };
  }

  if (!sourceAccountId) {
    return { success: false, error: '출금 계좌를 선택해주세요.' };
  }

  if (!targetAccountId) {
    return { success: false, error: '입금 계좌를 찾을 수 없습니다.' };
  }

  try {
    // 2. 모든 DB 작업을 트랜잭션 내부에서 수행 (Race Condition 방지)
    await prisma.$transaction(async (tx) => {
      // 2-1. 출금 계좌 조회 및 검증
      const sourceAccount = await tx.account.findUnique({
        where: { id: sourceAccountId },
      });

      if (!sourceAccount) {
        throw new Error('출금 계좌를 찾을 수 없습니다.');
      }

      // 2-2. BigInt 직접 비교 (정밀도 손실 방지)
      if (sourceAccount.deposit < BigInt(amount)) {
        throw new Error('잔액이 부족합니다.');
      }

      // 2-3. 입금 계좌 조회 및 검증
      const targetAccount = await tx.account.findUnique({
        where: { id: targetAccountId },
      });

      if (!targetAccount) {
        throw new Error('입금 계좌를 찾을 수 없습니다.');
      }

      // 2-4. 출금 계좌 잔액 감소
      await tx.account.update({
        where: { id: sourceAccountId },
        data: { deposit: { decrement: BigInt(amount) } },
      });

      // 2-5. 입금 계좌 잔액 증가
      await tx.account.update({
        where: { id: targetAccountId },
        data: { deposit: { increment: BigInt(amount) } },
      });

      // 2-6. history 레코드 생성
      await tx.history.create({
        data: {
          money: BigInt(amount),
          source_account_id: sourceAccountId,
          target_account_id: targetAccountId,
        },
      });

      // 2-7. timeline 레코드 생성
      await tx.timeline.create({
        data: {
          child_id: childId,
          type: '증여 입금',
          description: `${formatWon(amount)}원 입금 완료!`,
          date: new Date(),
        },
      });

      // 2-8. alert 생성 (GIFT_COMPLETE)
      await tx.alert.create({
        data: {
          child_id: childId,
          type: 'GIFT_COMPLETE',
          title: '이번 달 증여가 완료됐어요!',
          description: `아이 계좌로 ${formatWon(amount)}원이 입금되었어요.`,
          button_text: '확인',
          screen: 'timeline',
        },
      });
    });

    // 3. 캐시 무효화
    revalidatePath(`/main/${childId}/home`);
    revalidatePath(`/main/${childId}/timeline`);
    revalidatePath(`/main/${childId}/my-product`);

    return { success: true };
  } catch (error) {
    console.error('Deposit error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '입금 처리 중 오류가 발생했습니다.' };
  }
}
