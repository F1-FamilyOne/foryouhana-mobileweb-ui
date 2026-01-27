'use client';

import { Check, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { formatWon } from '@/lib/utils';
import type { BirthInput } from '../child-info/page';

/**
 * @page: AI 맞춤 증여 플랜 결과
 */

export type DraftPlanPayload = {
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

export const EMPTY_DRAFT_PLAN: DraftPlanPayload = {
  updated_at: new Date().toISOString(),
  plan: {
    child_birth: {
      year: 0,
      month: 0,
      day: 0,
      age: 0,
    },
    goal_money: 0,
    monthly_money: 0,
    is_promise_fixed: false,
    in_month: 0,
    in_type: false,
    acc_type: 'DEPOSIT',
  },
};

export default function AnalysisResult() {
  const router = useRouter();

  let data: DraftPlanPayload = EMPTY_DRAFT_PLAN;

  try {
    const raw = sessionStorage.getItem('giftPlan');
    if (raw) {
      data = JSON.parse(raw);
    }
  } catch {
    sessionStorage.removeItem('giftPlan');
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 🔒 Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header content="AI 맞춤 증여 플랜" />
      </div>

      {/* 📜 Scrollable Content */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4 pb-28">
        {/* 자녀 정보 카드 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">✏️</span>
            <span className="font-semibold text-[15px]">자녀 정보</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-gray-500">생년월일</span>
            <div className="text-right">
              <div className="font-medium text-[15px]">
                {data.plan.child_birth.age}
              </div>
              <div className="text-[13px] text-hana-main">
                현재 만 {data.plan.child_birth.age}세
              </div>
            </div>
          </div>
        </div>

        {/* 추천 증여 플랜 */}
        <div className="mt-5">
          <h2 className="mb-2 font-semibold text-[16px]">추천 증여 플랜</h2>

          <div className="flex gap-3">
            <div className="flex-1">
              <p className="mb-1 text-[13px] text-gray-600">증여 기간</p>
              <div className="flex h-[70px] items-center justify-center rounded-xl bg-gray-100">
                <span className="font-bold text-[22px]">
                  {data.plan.in_month}개월
                </span>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-1 text-[13px] text-gray-600">월 증여액</p>
              <div className="flex h-[70px] items-center justify-center rounded-xl bg-gray-100">
                <span className="font-bold text-[22px]">
                  {formatWon(data.plan.monthly_money)}만원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 총 증여액 */}
        <div className="mt-4">
          <div className="mb-1 flex items-center gap-1">
            <span className="text-[13px] text-gray-600">총 증여액</span>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <div className="rounded-xl bg-hana-light-green p-4 text-center">
            <div className="font-bold text-[26px] text-hana-main">
              {formatWon(data.plan.goal_money)}만원
            </div>
            <div className="text-[13px] text-gray-600">
              {data.plan.in_month}개월 × {data.plan.monthly_money}만원
            </div>
          </div>
        </div>

        {/* 안내 */}
        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          ※ 증여세 공제는 10년마다 새로 적용됩니다.
          <br />
          19세 미만은 2,000만원, 성인은 5,000만원까지 공제됩니다.
        </p>

        {/* 신청 상태 */}
        <div className="mt-5 flex gap-3">
          <div className="flex-1">
            <p className="mb-1 text-[13px] text-gray-600">유기정기금 신청</p>
            <div className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gray-100">
              <span className="text-[13px]">
                {data.plan.is_promise_fixed ? '신청함' : '신청안함'}
              </span>
              {data.plan.is_promise_fixed && (
                <Check className="h-4 w-4 text-hana-main" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <p className="mb-1 text-[13px] text-gray-600">연금저축펀드 신청</p>
            <div className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gray-100">
              <span className="text-[13px]">
                {data.plan.acc_type === 'PENSION' ? '신청함' : '신청안함'}
              </span>
              {data.plan.acc_type === 'PENSION' && (
                <Check className="h-4 w-4 text-hana-main" />
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 text-[12px] text-gray-600">
          💡 절세 효과 외에도 펀드 운용을 통해 추가 수익을 기대할 수 있어요.
        </p>
      </div>

      {/* 🔘 Bottom Fixed Buttons */}
      <div className="sticky bottom-0 z-50 bg-white px-5 py-3">
        <div className="flex flex-col gap-2">
          <CustomButton
            preset="lightgraylong"
            onClick={() => router.push('/onboarding/edit')}
          >
            플랜 수정하기
          </CustomButton>

          <CustomButton
            preset="greenlong"
            onClick={() => router.push('/register/guide')}
          >
            다음
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
