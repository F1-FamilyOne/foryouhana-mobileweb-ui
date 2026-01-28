'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import type { DraftPlanPayload } from '../result/page';
import GiftSection from './GiftSection';
import PensionSection from './PensionSection';

type PlanFormState = {
  isPension: boolean;
  isGift: boolean;
  isRegular: boolean;
  monthlyMoney: number;
  inMonth: number;
};

// draft → form 초기값 변환
function buildFormFromDraft(draft: DraftPlanPayload | null): PlanFormState {
  if (!draft) {
    return {
      isPension: false,
      isGift: true,
      isRegular: true,
      monthlyMoney: 0,
      inMonth: 0,
    };
  }

  const plan = draft.plan;

  return {
    isPension: plan.acc_type === 'PENSION',
    isGift: plan.is_promise_fixed === true,
    isRegular: plan.is_promise_fixed === true ? true : plan.in_type === true,
    monthlyMoney: plan.monthly_money ?? 0,
    inMonth: plan.in_month ?? 0,
  };
}

// form → draft 갱신
function buildDraftFromForm(
  form: PlanFormState,
  prevDraft: DraftPlanPayload,
): DraftPlanPayload {
  return {
    updated_at: new Date().toISOString(),
    plan: {
      ...prevDraft.plan,
      acc_type: form.isPension ? 'PENSION' : 'DEPOSIT',
      monthly_money: form.monthlyMoney,
      in_month: form.inMonth,
      is_promise_fixed: form.isGift && form.isRegular,
      in_type: form.isRegular,
    },
  };
}

export default function PlanEdit() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftPlanPayload | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [form, dispatch] = useReducer(
    (state: PlanFormState, action: Partial<PlanFormState>) => ({
      ...state,
      ...action,
    }),
    buildFormFromDraft(null),
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('giftPlan');
      if (!raw) return;

      const parsed = JSON.parse(raw) as DraftPlanPayload;

      setDraft(parsed); // ✅ 안전
      dispatch(buildFormFromDraft(parsed)); // 또는 dispatch({ ... })
    } catch {
      sessionStorage.removeItem('giftPlan');
    }
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  if (!draft) {
    return <p>플랜이 없습니다.</p>;
  }

  const handleSaveDraft = () => {
    const nextDraft = buildDraftFromForm(form, draft);
    sessionStorage.setItem('giftPlan', JSON.stringify(nextDraft));
    router.back();
  };

  return (
    <div className="flex flex-col">
      <Header content="플랜 직접 수정하기" />

      <main className="flex-1">
        <div className="grid w-92.25 gap-3">
          <h1 className="font-hana-light">
            원하는 대로 증여 계획을 조정해보세요.
          </h1>

          <div className="rounded-2xl border border-hana-gray-300 p-5 shadow-sm">
            <PensionSection
              select={form.isPension}
              onSelect={(isSelected) => {
                dispatch({ isPension: isSelected });
              }}
            />

            <GiftSection
              giftPlan={form.isGift}
              onGiftPlanSelected={(isSelected) => {
                dispatch({
                  isGift: isSelected,
                  isRegular: isSelected,
                });
              }}
              regular={form.isRegular}
              onRegularSelected={(isSelected) => {
                dispatch({ isRegular: isSelected });
              }}
              monthlyMoney={form.monthlyMoney}
              inMonth={form.inMonth}
              onInMonthChange={(value: number | undefined) => {
                if (value) dispatch({ inMonth: value });
              }}
              onMonthlyMoneyChange={(value: number | undefined) => {
                if (value) dispatch({ monthlyMoney: value });
              }}
            />
          </div>
        </div>
      </main>

      <div className="grid justify-center gap-2 pt-4">
        <CustomButton preset="lightgraylong" onClick={router.back}>
          돌아가기
        </CustomButton>
        <CustomButton preset="greenlong" onClick={handleSaveDraft}>
          이 플랜으로 변경하기
        </CustomButton>
      </div>
    </div>
  );
}
