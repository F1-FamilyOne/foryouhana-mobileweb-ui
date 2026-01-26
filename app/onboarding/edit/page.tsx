'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import GiftSection from './GiftSection';
import PensionSection from './PensionSection';

type PlanFormState = {
  isPension: boolean;
  isGift: boolean;
  isRegular: boolean;
  monthlyMoney: number;
  inMonth: number;
};

type DraftPlanPayload = {
  updated_at: string; // ISO string
  plan: {
    goal_money: number;
    monthly_money: number;
    is_promise_fixed: boolean;
    in_month: number;
    in_type: boolean;
    acc_type: 'PENSION' | 'DEPOSIT';
  };
};

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

export default function planEdit() {
  const [isReady, setIsReady] = useState(false);
  const [draft, setDraft] = useState<DraftPlanPayload | null>(null);
  const [form, dispatch] = useReducer(
    (state: PlanFormState, action: Partial<PlanFormState>) => ({
      ...state,
      ...action,
    }),
    {
      isPension: false,
      isGift: true,
      isRegular: true,
      monthlyMoney: 0,
      inMonth: 0,
    },
  );
  const router = useRouter();

  useEffect(() => {
    console.log('mounted');
    const raw = sessionStorage.getItem('giftPlan');
    if (!raw) return;
    // 최신 plan 가져오기
    try {
      const parsed = JSON.parse(raw) as DraftPlanPayload;
      setDraft(parsed);

      console.log(parsed.plan);
      if (parsed?.plan.acc_type === 'PENSION') {
        dispatch({ isPension: true });
      } else dispatch({ isPension: false });
      if (parsed?.plan.is_promise_fixed === true) {
        dispatch({ isGift: true });
        dispatch({ isRegular: true });
      } else {
        dispatch({ isGift: false });
        if (parsed?.plan.in_type) dispatch({ isRegular: true });
        else dispatch({ isRegular: false });
      }
    } catch {
      // 깨진 데이터면 폐기
      sessionStorage.removeItem('giftPlan');
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!draft) {
    return '플랜이 없습니다.';
  }

  const handleSaveDraft = () => {
    if (!draft) return;

    const nextDraft = buildDraftFromForm(form, draft);

    sessionStorage.setItem('giftPlan', JSON.stringify(nextDraft));
    console.log(draft);
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
          <div className="rounded-2xl border border-hana-gray-300 p-5 shadow-hana-gray-300 shadow-sm">
            <PensionSection
              select={form.isPension}
              onSelect={(isSelected) => {
                dispatch({ isPension: isSelected });
              }}
            />
            <GiftSection
              giftPlan={form.isGift}
              onGiftPlanSelected={(isSelected) => {
                dispatch({ isGift: isSelected, isRegular: isSelected });
              }}
              regular={form.isRegular}
              onRegularSelected={(isSelected) => {
                dispatch({ isRegular: isSelected });
              }}
              monthlyMoney={Number(draft?.plan.monthly_money)}
              inMonth={Number(draft?.plan.in_month)}
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
