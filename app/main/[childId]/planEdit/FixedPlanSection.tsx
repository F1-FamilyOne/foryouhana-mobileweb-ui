import { BinaryToggle } from '@/components/cmm/BinaryToggle';
import { CustomButton } from '@/components/cmm/CustomButton';
import { InputMonth } from '@/components/cmm/InputDayAmount';
import ShowPlanInput from '@/components/cmm/ShowPlanInput';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import { formatWonNatural } from '@/lib/utils';
import { BLOCK_STATUS, GIFT_METHOD, YUGI_STATUS } from './MainSection';

export default function FixedPlanSection({
  yugi,
  method,
  fixed,
  period,
  amount,
  blockStatus,
  onMethodChange,
  onChangeAmount,
  onChangePeriod,
}: {
  yugi: YUGI_STATUS;
  method: GIFT_METHOD;
  fixed: boolean;
  period: number;
  amount: number;
  blockStatus: BLOCK_STATUS;
  onMethodChange: (v: GIFT_METHOD) => void;
  onChangeAmount: (value: number) => void;
  onChangePeriod: (value: number) => void;
}) {
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
                    <ShowPlanInput
                      amount={amount}
                      onChangeAmount={onChangeAmount}
                      period={period}
                      onChangePeriod={onChangePeriod}
                      disabled={true}
                    />
                  </div>
                ) : (
                  <div>
                    {yugi === YUGI_STATUS.STOP && (
                      <div>
                        <BinaryToggle
                          // disabled={true}
                          falseLabel="자유 이체"
                          trueLabel="정기 이체"
                          value={method === GIFT_METHOD.REGULAR}
                          onChange={(v) => {
                            onMethodChange(
                              v ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE,
                            );
                          }}
                        />

                        <ShowPlanInput
                          amount={amount}
                          onChangeAmount={onChangeAmount}
                          period={period}
                          onChangePeriod={onChangePeriod}
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
                <ShowPlanInput
                  amount={amount}
                  onChangeAmount={onChangeAmount}
                  period={period}
                  onChangePeriod={onChangePeriod}
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
            <ShowPlanInput
              amount={amount}
              onChangeAmount={onChangeAmount}
              period={period}
              onChangePeriod={onChangePeriod}
              disabled={false}
            />
          </div>
        )}

        <div className="grid gap-2 pt-3">
          <TitlePlanSelect title="총 증여액" />
          <div className="grid justify-center rounded-xl bg-hana-light-green px-10 py-5">
            <h4 className="text-center text-hana-badge-green">
              {formatWonNatural((period ?? 0) * (amount ?? 0))}
            </h4>
            <h4 className="text-hana-gray-500 text-xs">
              약 {formatWonNatural(amount ?? 0)} X {period ?? 0}
              개월
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
