import { notFound } from 'next/navigation';
import { saveEditPlan } from '@/actions/plan.action';
import Header from '@/components/cmm/Header';
import { GIFT_METHOD } from '@/constants/gift';
import { account_acc_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { getGiftPeriodMonths } from '@/lib/utils';
import MainSection from './MainSection';

/**
 * @page: 증여 플랜 수정 페이지
 * @description: 가입 후 메뉴 -> 증여 플랜 수정하기 버튼을 누르면 이동되는 페이지입니다.
 * 유기정기금 신청, 연금 저축펀드 신청, 증여 플랜 기간 수정, 증여 금액 수정 가능힙니다.
 * @author: 이정수
 * @date: 2026-01-27
 */

type PageProps = {
  params: {
    childId: string;
  };
};

export default async function PlanEdit({ params }: PageProps) {
  const { childId } = await params;
  const childIdNumber = Number(childId);

  //연금저축펀드 사용 여부 불러오기
  const account = await prisma.account.findFirst({
    where: {
      user_id: childIdNumber,
      acc_type: account_acc_type.PENSION,
    },
  });

  const isPension = !!account;

  //유기정기금 사용 여부, 증여 방식, 기간, 월 증여액  불러오기
  const child = await prisma.user.findUnique({
    where: {
      id: childIdNumber,
    },
  });
  if (child === null) notFound();

  const { start_date: startDate, end_date: endDate } = child;

  const startDateString = startDate
    ? startDate.toISOString().split('T')[0]
    : '';
  const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';

  const {
    is_promise_fixed: isFixedGift,
    monthly_money: monthlyMoney,
    goal_money: goalMoney,
  } = child;

  if (isFixedGift === null) notFound();

  const method =
    monthlyMoney !== null && goalMoney !== null
      ? GIFT_METHOD.REGULAR
      : GIFT_METHOD.FLEXIBLE;

  const period = getGiftPeriodMonths(startDate, endDate);

  return (
    <div className="flex flex-col">
      <Header content="플랜 직접 수정하기" />
      <MainSection
        monthlyMoney={Number(monthlyMoney)}
        period={period ?? 0}
        isFixedGift={isFixedGift}
        method={method}
        isPension={isPension}
        onSave={saveEditPlan}
        childId={childIdNumber}
        startDate={startDateString}
        endDate={endDateString}
      />
    </div>
  );
}
