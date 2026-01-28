'use server';
/**
 * @page: plan.action.ts
 * @description: 플랜 수정 로직에서 사용되는 server actions를 모아놓은 파일입니다.
 * @author: 이정수
 * @date: 2026-01-28
 */

import { GIFT_METHOD } from '@/app/main/[childId]/planEdit/MainSection';
import { prisma } from '@/lib/prisma';

type Prop = {
  childId: number;
  form: {
    fixed: boolean;
    amount: number;
    period: number;
    pension: boolean;
    method: GIFT_METHOD;
  };
};

export const saveEditPlan = async ({ childId, form }: Prop) => {
  const { fixed, amount, period, method } = form;
  let monthlyMoney: bigint | null;
  let goalMoney: bigint | null;
  if (method === GIFT_METHOD.FLEXIBLE) {
    monthlyMoney = null;
    goalMoney = null;
  } else {
    monthlyMoney = BigInt(amount);
    goalMoney = BigInt(amount) * BigInt(period);
  }

  await prisma.child.update({
    where: { id: childId },
    data: {
      is_promise_fixed: fixed,
      monthly_money: monthlyMoney,
      goal_money: goalMoney,
      // TODO start date 랑 end date 추가
    },
  });
};

export const getPlan = async ({ childId }: { childId: number }) => {
  return {};
};
