import { getPrevPlanFromDB, saveEditPlan } from '@/actions/plan.action';
import Header from '@/components/cmm/Header';
import type { GiftMethod } from '@/constants/gift';
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

export type ReloadProps = {
  isPension: boolean;
  currentDateString: string;
  endDateString: string;
  startDateString: string;
  isFixedGift: boolean;
  monthlyMoney: number;
  period: number | null;
  method: GiftMethod;
  totalDeposit: bigint;
};

export default async function PlanEdit({ params }: PageProps) {
  const { childId } = await params;
  const childIdNumber = Number(childId);

  const {
    isPension,
    currentDateString,
    endDateString,
    startDateString,
    isFixedGift,
    monthlyMoney,
    period,
    method,
    totalDeposit,
  } = await getPrevPlanFromDB({ childId: childIdNumber });

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
        currentDate={currentDateString}
        startDate={startDateString}
        endDate={endDateString}
        totalDeposit={totalDeposit}
      />
    </div>
  );
}
