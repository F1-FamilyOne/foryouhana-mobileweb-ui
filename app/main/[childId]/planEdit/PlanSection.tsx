'use client';
import FixedPlanSection from './FixedPlanSection';
import GeneralPlanSection from './GeneralPlanSection';
import { BLOCK_STATUS, GIFT_METHOD, type YUGI_STATUS } from './MainSection';

type Props = {
  yugi: YUGI_STATUS;
  method: GIFT_METHOD;
  period: number | null;
  newPeriod: number | null;
  amount: number | null;
  newAmount: number | null;
  isFixed: boolean;
  blockStatus: BLOCK_STATUS;
  onMethodChange: (v: GIFT_METHOD) => void;
  onAmountChange: (v: number | null) => void;
  onPeriodChange: (v: number | null) => void;
};

export default function PlanSection({
  yugi,
  method,
  period,
  amount,
  isFixed,
  newPeriod,
  newAmount,
  blockStatus,
  onPeriodChange,
  onAmountChange,
  onMethodChange,
}: Props) {
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
          onChangeAmount={(v) => onAmountChange(v)}
          onChangePeriod={(v) => onPeriodChange(v)}
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
          onChangeAmount={onAmountChange}
          onChangePeriod={onPeriodChange}
        />
      )}
    </div>
  );
}
