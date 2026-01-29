'use client';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import {
  BLOCK_STATUS,
  type BlockStatus,
  GIFT_METHOD,
  type GiftMethod,
  YUGI_STATUS,
  type YugiStatus,
} from '@/constants/gift';
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
  endDate: string;
  onSave: (params: {
    childId: number;
    form: {
      fixed: boolean;
      amount: number;
      period: number;
      pension: boolean;
      method: GiftMethod;
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
  startDate,
  endDate,
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
  const [newStart, setNewStart] = useState<string | null>(startDate);
  const [newEnd, setNewEnd] = useState<string | null>(endDate);

  return (
    <div>
      <main className="flex-1">
        <div className="grid w-92.25 gap-3">
          <h1 className="font-hana-light">
            원하는 대로 증여 계획을 조정해보세요.
          </h1>
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
                pension: newPension,
                method: giftMethod,
              },
            });

            if (isPension === false && newPension === true) {
              router.push(`/main/${childId}/product-list` as Route);
              console.log(childId);
            } else {
              router.back();
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
