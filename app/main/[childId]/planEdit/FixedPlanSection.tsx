import AmountChangeInput from '@/components/cmm/AmountChangeInput';
import { BinaryToggle } from '@/components/cmm/BinaryToggle';
import { CustomButton } from '@/components/cmm/CustomButton';
import PlanChangeInput from '@/components/cmm/PlanChangeInput';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import {
  BLOCK_STATUS,
  type BlockStatus,
  GIFT_METHOD,
  type GiftMethod,
  YUGI_STATUS,
  type YugiStatus,
} from '@/constants/gift';
import { formatWonNatural } from '@/lib/utils';

type Props = {
  yugi: YugiStatus;
  method: GiftMethod;
  period: number;
  amount: number;
  blockStatus: BlockStatus;
  totalDeposit: bigint;
  newStart: string;
  newEnd: string;
  prevAmount: number | null;
  prevPeriod: number | null;
  onChangeStart: (v: string | null) => void;
  onChangeEnd: (v: string | null) => void;
  onMethodChange: (v: GiftMethod) => void;
  onChangeAmount: (value: number) => void;
  onChangePeriod: (value: number) => void;
};

export default function FixedPlanSection({
  yugi,
  method,
  period,
  amount,
  blockStatus,
  newEnd,
  totalDeposit,
  prevAmount,
  prevPeriod,
  onChangeEnd,
  onMethodChange,
  onChangeAmount,
  onChangePeriod,
}: Props) {
  const hasPrevPlan =
    prevAmount !== null &&
    prevPeriod !== null &&
    prevAmount > 0 &&
    prevPeriod > 0;

  const baseTotal = BigInt((period ?? 0) * (amount ?? 0)) + totalDeposit;

  const prevPlanTotal =
    prevAmount !== null && prevPeriod !== null
      ? BigInt(prevAmount * prevPeriod)
      : 0n;
  const totalAmount = baseTotal + prevPlanTotal;
  return (
    <div>
      <TitlePlanSelect title="증여 방식" />
      <div>
        {blockStatus !== BLOCK_STATUS.BLOCK ? (
          <div>
            {blockStatus === BLOCK_STATUS.AFTERHOMETAX ? (
              <div>
                {yugi === YUGI_STATUS.CHANGE ? (
                  <div>
                    <CustomButton
                      disabled
                      preset="lightgraylong"
                      className="grid gap-0"
                    >
                      <span className="text-[14px] text-hana-black">
                        정기 이체 방식
                      </span>
                      <span className="text-[9px] text-hana-black">
                        유기정기금 운용 중
                      </span>
                    </CustomButton>
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
                    </div>
                  </div>
                ) : (
                  <div>
                    {yugi === YUGI_STATUS.STOP && (
                      <div>
                        <BinaryToggle
                          falseLabel="자유 이체"
                          trueLabel="정기 이체"
                          value={method === GIFT_METHOD.REGULAR}
                          onChange={(v) => {
                            onMethodChange(
                              v ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE,
                            );
                          }}
                        />
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
              </div>
            ) : (
              <div>
                <CustomButton
                  disabled
                  preset="lightgraylong"
                  className="grid gap-0"
                >
                  <span className="text-[14px] text-hana-black">
                    정기 이체 방식
                  </span>
                  <span className="text-[9px] text-hana-black">
                    유기정기금 운용 중
                  </span>
                </CustomButton>
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
              </div>
            )}
          </div>
        ) : (
          <div>
            <BinaryToggle
              falseLabel="자유 이체"
              trueLabel="정기 이체"
              value={method === GIFT_METHOD.REGULAR}
              onChange={(v) => {
                onMethodChange(v ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE);
              }}
            />
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

        <div className="grid gap-2 pt-3">
          <TitlePlanSelect title="총 증여액" />
          <div className="grid justify-center gap-2 rounded-xl bg-hana-light-green px-10 py-5">
            <h4 className="text-center text-hana-badge-green">
              {formatWonNatural(totalAmount)}
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
      </div>
    </div>
  );
}
