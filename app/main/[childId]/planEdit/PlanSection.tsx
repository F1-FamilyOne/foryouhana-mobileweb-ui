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
  startDate: string;
  endDate: string;
  newStart: string | null;
  newEnd: string | null;
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
  startDate,
  endDate,
  newStart,
  newEnd,
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
          method={method}
          blockStatus={blockStatus}
          startDate={startDate}
          endDate={endDate}
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
          yugi={yugi}
          blockStatus={blockStatus}
          isRegular={method === GIFT_METHOD.REGULAR}
          onChange={onMethodChange}
          isFixed={isFixed}
          // startDate={startDate}
          // endDate={endDate}
          newStart={newStart ?? ''}
          newEnd={newEnd ?? ''}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
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
