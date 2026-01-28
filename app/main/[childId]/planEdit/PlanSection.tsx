'use client';
import { useState } from 'react';
import FixedPlanSection from './FixedPlanSection';
import GeneralPlanSection from './GeneralPlanSection';
import { BLOCK_STATUS, GIFT_METHOD, type YUGI_STATUS } from './MainSection';

export default function PlanSection({
  yugi,
  method,
  period,
  amount,
  isFixed,
  blockStatus,
  onMethodChange,
}: {
  yugi: YUGI_STATUS;
  method: GIFT_METHOD;
  period: number | null;
  amount: number | null;
  isFixed: boolean;
  blockStatus: BLOCK_STATUS;
  onMethodChange: (v: GIFT_METHOD) => void;
}) {
  const [newAmount, setNewAmount] = useState<number | null>(amount);
  const [newPeriod, setNewPeriod] = useState<number | null>(period);
  return (
    <div>
      {isFixed ? (
        <FixedPlanSection
          yugi={yugi}
          amount={
            (blockStatus === BLOCK_STATUS.REVERT ? amount : newAmount) ?? 0
          }
          period={
            (blockStatus === BLOCK_STATUS.REVERT ? period : newPeriod) ?? 0
          }
          method={method}
          blockStatus={blockStatus}
          onChangeAmount={(v) => setNewAmount(v)}
          onChangePeriod={(v) => setNewPeriod(v)}
          onMethodChange={(v) => onMethodChange(v)}
        />
      ) : (
        <GeneralPlanSection
          yugi={yugi}
          blockStatus={blockStatus}
          isRegular={method === GIFT_METHOD.REGULAR}
          onChange={onMethodChange}
          isFixed={isFixed}
          amount={
            (blockStatus === BLOCK_STATUS.REVERT ? amount : newAmount) ?? 0
          }
          period={
            (blockStatus === BLOCK_STATUS.REVERT ? period : newPeriod) ?? 0
          }
          onChangeAmount={setNewAmount}
          onChangePeriod={setNewPeriod}
        />
      )}
    </div>
  );
}
