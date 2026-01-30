'use client';
import {
  BLOCK_STATUS,
  type BlockStatus,
  GIFT_METHOD,
  type GiftMethod,
  type YugiStatus,
} from '@/constants/gift';
import FixedPlanSection from './FixedPlanSection';
import GeneralPlanSection from './GeneralPlanSection';

type Props = {
  yugi: YugiStatus;
  method: GiftMethod;
  period: number | null;
  newPeriod: number | null;
  amount: number | null;
  newAmount: number | null;
  isFixed: boolean;
  blockStatus: BlockStatus;
  newStart: string | null;
  newEnd: string | null;
  totalDeposit: bigint;
  onMethodChange: (v: GiftMethod) => void;
  onAmountChange: (v: number | null) => void;
  onPeriodChange: (v: number | null) => void;
  onChangeStart: (v: string | null) => void;
  onChangeEnd: (v: string | null) => void;
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
  newStart,
  newEnd,
  totalDeposit,
  onChangeStart,
  onChangeEnd,
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
          prevAmount={amount}
          prevPeriod={period}
          totalDeposit={totalDeposit}
          method={method}
          blockStatus={blockStatus}
          newStart={newStart ?? ''}
          newEnd={newEnd ?? ''}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
          onChangeAmount={(v) => onAmountChange(v)}
          onChangePeriod={(v) => onPeriodChange(v)}
          onMethodChange={(v) => onMethodChange(v)}
        />
      ) : (
        <GeneralPlanSection
          prevAmount={amount}
          prevPeriod={period}
          yugi={yugi}
          blockStatus={blockStatus}
          isRegular={method === GIFT_METHOD.REGULAR}
          onChange={onMethodChange}
          isFixed={isFixed}
          newStart={newStart ?? ''}
          newEnd={newEnd ?? ''}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
          totalDeposit={totalDeposit}
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
