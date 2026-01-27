import { notFound } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { account_acc_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { getGiftPeriodMonths } from '@/lib/utils';
import FixedPlanSection from './FixedPlanSection';
import GiftPlanSection, { GIFT_METHOD } from './GiftPlanSection';
import PensionSelection from './PensionSelection';

/**
 * @page: 증여 플랜 수정 페이지
 * @description: 가입 후 메뉴 -> 증여 플랜 수정하기 버튼을 누르면 이동되는 페이지입니다.
 * 유기정기금 신청, 연금 저축펀드 신청, 증여 플랜 기간 수정, 증여 금액 수정 가능힙니다.
 * @author: 이정수
 * @date: 2026-01-27
 */

// type PlanFormState = {
//   isPension: boolean;
//   isFixedGift: boolean;
//   isRegular: boolean;
//   monthlyMoney: number;
//   inMonth: number;
// };
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
      child_id: childIdNumber,
      acc_type: account_acc_type.PENSION,
    },
  });

  const isPension = !!account;

  //유기정기금 사용 여부, 증여 방식, 기간, 월 증여액  불러오기
  const child = await prisma.child.findUnique({
    where: {
      id: childIdNumber,
    },
  });
  if (child === null) notFound();

  const {
    is_promise_fixed: isFixedGift,
    monthly_money: monthlyMoney,
    goal_money: goalMoney,
    start_date: startDate,
    end_date: endDate,
  } = child;
  const method: GIFT_METHOD =
    monthlyMoney != null && goalMoney != null
      ? GIFT_METHOD.REGULAR
      : GIFT_METHOD.FLEXIBLE;
  const period = getGiftPeriodMonths(startDate, endDate);

  return (
    <div className="flex flex-col">
      <Header content="플랜 직접 수정하기" />
      <main className="flex-1">
        <div className="grid w-92.25 gap-3">
          <h1 className="font-hana-light">
            원하는 대로 증여 계획을 조정해보세요.
          </h1>
        </div>
        <div className="my-2 grid gap-2 rounded-2xl border border-hana-gray-300 p-4">
          <PensionSelection prev={isPension} />
          <GiftPlanSection
            method={method}
            period={period}
            amount={Number(monthlyMoney)}
            isFixed={isFixedGift}
          />
          <hr className="my-4 border-hana-gray-400" />
          <FixedPlanSection prev={isFixedGift} />
        </div>
      </main>

      <div className="grid justify-center gap-2 pt-4">
        <CustomButton preset="lightgraylong">돌아가기</CustomButton>
        <CustomButton preset="greenlong">이 플랜으로 변경하기</CustomButton>
      </div>
    </div>
  );
}
