'use client';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DraftPlanPayload } from '@/actions/child.action';
import { reloadPlan } from '@/actions/plan.action';
import { CustomButton } from '@/components/cmm/CustomButton';
import {
  BLOCK_STATUS,
  type BlockStatus,
  GIFT_METHOD,
  type GiftMethod,
  YUGI_STATUS,
  type YugiStatus,
} from '@/constants/gift';
import { addMonthsToYearMonth, getMonthDiff } from '@/lib/utils';
import PensionSelection from './PensionSelection';
import PlanSection from './PlanSection';
import YugiSection from './YugiSection';

type Props = {
  isPension: boolean;
  method: GiftMethod;
  period: number;
  isFixedGift: boolean;
  monthlyMoney: number;
  childId: number;
  startDate: string;
  currentDate: string;
  endDate: string;
  totalDeposit: bigint;
  onSave: (params: {
    childId: number;
    form: {
      fixed: boolean;
      amount: number;
      period: number;
      prevAmount: number;
      prevPeriod: number;
      pension: boolean;
      method: GiftMethod;
      start: string | null;
      end: string | null;
      totalDeposit: bigint;
    };
  }) => Promise<void>;
};

export default function MainSection({
  isPension,
  method,
  childId,
  period,
  isFixedGift,
  monthlyMoney,
  endDate,
  totalDeposit,
  currentDate,
  onSave,
}: Props) {
  const [giftMethod, setGiftMethod] = useState<GiftMethod>(
    isFixedGift ? GIFT_METHOD.REGULAR : method,
  );
  const [blocked, setBlocked] = useState<BlockStatus>(BLOCK_STATUS.NONBLOCK);
  const [fixed, setFixed] = useState<boolean>(isFixedGift);
  const [yugi, setYugi] = useState<YugiStatus>(YUGI_STATUS.SAME);
  const router = useRouter();
  const [newPension, setNewPension] = useState<boolean>(isPension);
  const [newAmount, setNewAmount] = useState<number | null>(
    Number(monthlyMoney),
  );
  const [newPeriod, setNewPeriod] = useState<number | null>(period);
  const [newStart, setNewStart] = useState<string | null>(currentDate);
  const [newEnd, setNewEnd] = useState<string | null>(endDate);
  const [draft, setDraft] = useState<DraftPlanPayload | null>(null);
  const [totalMoney, setTotalMoney] = useState(totalDeposit);

  useEffect(() => {
    if (newStart && newEnd) {
      const month = getMonthDiff(newStart, newEnd);
      setNewPeriod(month);
    }
  }, [newStart, newEnd]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('giftPlan');
      if (!raw) return;

      const parsed = JSON.parse(raw) as DraftPlanPayload;
      if (parsed.isChatbot) {
        setDraft(parsed);
        setGiftMethod(
          parsed.plan.in_type ? GIFT_METHOD.FLEXIBLE : GIFT_METHOD.REGULAR,
        );
        setFixed(parsed.plan.is_promise_fixed);
        setNewPension(parsed.plan.acc_type === 'PENSION');
        setNewAmount(parsed.plan.monthly_money);
        setNewPeriod(parsed.plan.in_month);
        setNewEnd(
          addMonthsToYearMonth(currentDate ?? '', parsed.plan.in_month),
        );
      } else {
        setDraft(null);
      }
    } catch {
      sessionStorage.removeItem('giftPlan');
    }
  }, [currentDate]);

  const onReload = async ({ childId }: { childId: number }) => {
    return await reloadPlan(childId);
  };

  return (
    <div>
      <main className="flex-1">
        <div className="flex w-92.25 items-end justify-between gap-3">
          <h1 className="font-hana-light">
            원하는 대로 증여 계획을 조정해보세요.
          </h1>
          {draft !== null && (
            <button
              type="button"
              className="relative text-hana-blue text-xs hover:underline"
              onClick={async () => {
                const {
                  isPension,
                  currentDateString,
                  endDateString,
                  isFixedGift,
                  monthlyMoney,
                  period,
                  method,
                  totalDeposit,
                } = await onReload({ childId });
                setNewPension(isPension);
                setFixed(isFixedGift);
                setNewAmount(Number(monthlyMoney));
                setGiftMethod(isFixedGift ? GIFT_METHOD.REGULAR : method);
                setNewPeriod(period);
                setNewStart(currentDateString);
                setNewEnd(endDateString);
                setTotalMoney(totalDeposit);
              }}
            >
              내 플랜 불러오기
            </button>
          )}
        </div>
        <div className="my-2 grid justify-center gap-2 rounded-2xl border border-hana-gray-300 p-4">
          <PensionSelection
            prev={isPension}
            now={newPension}
            onChange={setNewPension}
          />
          <PlanSection
            yugi={yugi}
            method={giftMethod}
            period={period}
            amount={Number(monthlyMoney)}
            isFixed={isFixedGift}
            blockStatus={blocked}
            onMethodChange={setGiftMethod}
            newAmount={newAmount}
            newPeriod={newPeriod}
            newStart={newStart}
            newEnd={newEnd}
            onChangeStart={setNewStart}
            onChangeEnd={setNewEnd}
            onAmountChange={setNewAmount}
            onPeriodChange={setNewPeriod}
            totalDeposit={totalMoney}
          />
          <hr className="my-4 border-hana-gray-400" />
          <YugiSection
            yugi={yugi}
            setYugi={setYugi}
            prev={isFixedGift}
            isFixed={fixed}
            onChange={(v: boolean) => {
              setFixed(v);
              if (v) setGiftMethod(GIFT_METHOD.REGULAR);
            }}
            onBlockedChange={setBlocked}
          />
        </div>
      </main>
      <div className="grid justify-center gap-2 pt-4">
        <CustomButton preset="lightgraylong" onClick={router.back}>
          돌아가기
        </CustomButton>
        <CustomButton
          preset="greenlong"
          onClick={async () => {
            await onSave({
              childId,
              form: {
                fixed,
                amount: newAmount ?? monthlyMoney,
                period: newPeriod ?? period,
                start: newStart,
                end: newEnd,
                pension: newPension,
                method: giftMethod,
                totalDeposit: totalMoney,
                prevAmount: monthlyMoney,
                prevPeriod: period,
              },
            });
            sessionStorage.removeItem('giftPlan');
            if (isPension === false && newPension === true) {
              router.push(`/main/${childId}/product-list` as Route);
              console.log(childId);
            } else {
              router.push(`/main/${childId}/home`);
            }
          }}
          disabled={blocked === BLOCK_STATUS.BLOCK}
        >
          이 플랜으로 변경하기
        </CustomButton>
      </div>
    </div>
  );
}
