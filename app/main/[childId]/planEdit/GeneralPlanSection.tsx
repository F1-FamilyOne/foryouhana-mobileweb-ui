import { InfoIcon } from 'lucide-react';
import AmountChangeInput from '@/components/cmm/AmountChangeInput';
import { BinaryToggle } from '@/components/cmm/BinaryToggle';
import { CustomButton } from '@/components/cmm/CustomButton';
import PlanChangeInput from '@/components/cmm/PlanChangeInput';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import {
  type BlockStatus,
  GIFT_METHOD,
  type GiftMethod,
  YUGI_STATUS,
  type YugiStatus,
} from '@/constants/gift';
import { formatWonNatural } from '@/lib/utils';

type Props = {
  isRegular: boolean;
  onChange: (v: GiftMethod) => void;
  isFixed: boolean;
  period: number;
  amount: number;
  yugi: YugiStatus;
  newStart: string;
  newEnd: string;
  prevAmount: number | null;
  prevPeriod: number | null;
  totalDeposit: bigint;
  onChangeEnd: (v: string | null) => void;
  onChangeStart: (v: string | null) => void;
  blockStatus: BlockStatus;
  onChangeAmount: (value: number | null) => void;
  onChangePeriod: (value: number | null) => void;
};

export default function GeneralPlanSection({
  isRegular,
  yugi,
  onChange,
  period,
  amount,
  newEnd,
  prevAmount,
  prevPeriod,
  totalDeposit,
  onChangeEnd,
  onChangeAmount,
  onChangePeriod,
}: Props) {
  const hasPrevPlan =
    isRegular &&
    prevAmount !== null &&
    prevPeriod !== null &&
    prevAmount > 0 &&
    prevPeriod > 0;
  return (
    <div>
      {yugi === YUGI_STATUS.CHANGE ? (
        <CustomButton disabled preset="lightgraylong" className="grid gap-0">
          <span className="text-[14px] text-hana-black">정기 이체 방식</span>
          <span className="text-[9px] text-hana-black">유기정기금 운용 중</span>
        </CustomButton>
      ) : (
        <div>
          {isRegular ? (
            <div>
              <TitlePlanSelect title="증여 방식" />
              <BinaryToggle
                falseLabel="자유 이체"
                trueLabel="정기 이체"
                value={isRegular}
                onChange={(v) => {
                  onChange(
                    v === true ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE,
                  );
                }}
              />
            </div>
          ) : (
            <div>
              <CustomButton
                preset="lightgreenlong"
                onClick={() =>
                  onChange(
                    !isRegular ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE,
                  )
                }
              >
                정기 이체로 변경
              </CustomButton>
            </div>
          )}
        </div>
      )}
      {yugi === YUGI_STATUS.CHANGE ? (
        <div>
          {isRegular && (
            <div>
              <PlanChangeInput
                period={period}
                endDate={newEnd}
                onChangePeriod={onChangePeriod}
                disabledMonth={true}
                disabledEnd={true}
                handleChangeEnd={onChangeEnd}
              />
              <AmountChangeInput
                amount={amount}
                onChangeAmount={onChangeAmount}
                disabled={true}
              />
              {/* TODO 논의 필요
              중간에 유기정기금으로 바꿀 시에 날짜와 금액을 어떻게 입력받을것인지? */}
            </div>
          )}
        </div>
      ) : (
        <div>
          {isRegular && (
            <div>
              <PlanChangeInput
                period={period}
                endDate={newEnd}
                onChangePeriod={onChangePeriod}
                disabledMonth={true}
                disabledEnd={false}
                handleChangeEnd={onChangeEnd}
              />
              <AmountChangeInput
                amount={amount}
                onChangeAmount={onChangeAmount}
                disabled={false}
              />
            </div>
          )}
        </div>
      )}

      {isRegular && (
        <div className="grid gap-2 pt-3">
          <div className="flex gap-1">
            <h2 className="font-hana-light text-xs">총 증여액</h2>
          </div>
          <div className="grid justify-center gap-2 rounded-xl bg-hana-light-green px-10 py-5">
            <h4 className="text-center text-hana-badge-green">
              {formatWonNatural(
                BigInt((period ?? 0) * (amount ?? 0)) + totalDeposit,
              )}
            </h4>
            <h4 className="text-hana-gray-500 text-xs">
              현재 총 증여액 {formatWonNatural(totalDeposit)}{' '}
              {hasPrevPlan && (
                <span>
                  {' '}
                  + 기존 플랜 적용 {formatWonNatural(prevAmount * prevPeriod)}
                </span>
              )}
              + 변경 플랜 (약 {formatWonNatural(amount ?? 0)} X {period ?? 0}
              개월)
            </h4>
          </div>
          <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
            ※ 증여세 공제는 10년마다 새로 적용돼요. 19세 미만은 2,000만원,
            성인은 5,000만원까지 공제되며, 한도를 초과한 금액에는 증여세가
            부과됩니다.
          </h4>
        </div>
      )}
    </div>
  );
}
