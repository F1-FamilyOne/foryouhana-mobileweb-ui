'use server';
import { GIFT_METHOD, type GiftMethod } from '@/constants/gift';
import { account_acc_type } from '@/lib/generated/prisma/enums';

/**
 * @page: plan.action.ts
 * @description: 플랜 수정 로직에서 사용되는 server actions를 모아놓은 파일입니다.
 * @author: 이정수
 * @date: 2026-01-28
 */

import { notFound } from 'next/navigation';
import type { ReloadProps } from '@/app/main/[childId]/planEdit/page';
import { prisma } from '@/lib/prisma';
import { getGiftPeriodMonths, yearMonthToDateWithTodayDay } from '@/lib/utils';

type Prop = {
  childId: number;
  form: {
    fixed: boolean;
    amount: number;
    period: number;
    start: string | null;
    end: string | null;
    pension: boolean;
    prevAmount: number;
    prevPeriod: number;
    method: GiftMethod;
    totalDeposit: bigint;
  };
};

export const saveEditPlan = async ({ childId, form }: Prop) => {
  const {
    fixed,
    amount,
    period,
    method,
    start,
    end,
    prevAmount,
    prevPeriod,
    totalDeposit,
  } = form;
  const baseTotal = BigInt((period ?? 0) * (amount ?? 0)) + totalDeposit;

  const prevPlanTotal =
    prevAmount !== null && prevPeriod !== null
      ? BigInt(prevAmount * prevPeriod)
      : 0n;
  const totalAmount = baseTotal + prevPlanTotal;

  let monthlyMoney: bigint | null;
  let goalMoney: bigint | null;
  let startDate: Date | null;
  let endDate: Date | null;

  if (method === GIFT_METHOD.FLEXIBLE) {
    monthlyMoney = null;
    goalMoney = null;
    startDate = null;
    endDate = null;
  } else {
    if (start === null || end === null) {
      throw new Error('올바른 날짜를 선택해주세요.');
    }
    monthlyMoney = BigInt(amount);
    goalMoney = totalAmount;
    startDate = yearMonthToDateWithTodayDay(start);
    endDate = yearMonthToDateWithTodayDay(end);
  }

  await prisma.user.update({
    where: { id: childId },
    data: {
      is_promise_fixed: fixed,
      monthly_money: monthlyMoney,
      goal_money: goalMoney,
      start_date: startDate,
      end_date: endDate,
    },
  });
};

const getTotalDepositByChildId = async (childId: number) => {
  const result = await prisma.account.aggregate({
    where: {
      user_id: childId,
      acc_type: {
        not: account_acc_type.DEPOSIT,
      },
    },
    _sum: {
      deposit: true,
    },
  });

  return result._sum.deposit ?? BigInt(0);
};

export async function getPrevPlanFromDB({
  childId,
}: {
  childId: number;
}): Promise<ReloadProps> {
  //연금저축펀드 사용 여부 불러오기
  const account = await prisma.account.findFirst({
    where: {
      user_id: childId,
      acc_type: account_acc_type.PENSION,
    },
  });

  const isPension = !!account;

  //유기정기금 사용 여부, 증여 방식, 기간, 월 증여액  불러오기
  const child = await prisma.user.findUnique({
    where: {
      id: childId,
    },
  });
  if (child === null) notFound();

  const today = new Date();

  const currentDateString = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}`;
  const { start_date: startDate, end_date: endDate } = child;

  const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
  const startDateString = startDate
    ? startDate.toISOString().split('T')[0]
    : '';

  const {
    is_promise_fixed: isFixedGift,
    monthly_money: monthlyMoneyBigInt,
    goal_money: goalMoney,
  } = child;

  if (isFixedGift === null) notFound();

  const period = getGiftPeriodMonths(startDate, endDate);

  const method =
    monthlyMoneyBigInt !== null && goalMoney !== null
      ? GIFT_METHOD.REGULAR
      : GIFT_METHOD.FLEXIBLE;

  const totalDeposit = await getTotalDepositByChildId(childId);

  return {
    isPension,
    currentDateString,
    endDateString,
    startDateString,
    isFixedGift,
    monthlyMoney: Number(monthlyMoneyBigInt),
    period,
    method,
    totalDeposit,
  };
}

export async function reloadPlan(childId: number) {
  return getPrevPlanFromDB({ childId });
}
