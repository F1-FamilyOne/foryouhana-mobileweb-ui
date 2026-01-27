import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { BinaryToggle } from '@/components/cmm/BinaryToggle';
import { CustomButton } from '@/components/cmm/CustomButton';
import { InputMonth } from '@/components/cmm/InputDayAmount';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import { formatWonNatural } from '@/lib/utils';
import { GIFT_METHOD } from './GiftPlanSection';

export default function MethodSection({
  isRegular,
  onChange,
  isFixed,
  period,
  amount,
}: {
  isRegular: boolean;
  onChange: (v: GIFT_METHOD) => void;
  isFixed: boolean;
  period: number;
  amount: number;
}) {
  const [regular, setGiftMethod] = useState<boolean>(isRegular);
  const [newAmount, setNewAmount] = useState<number | null>(amount);
  const [newPeriod, setNewPeriod] = useState<number | null>(period);
  return (
    <div>
      {isRegular === true ? (
        <div>
          <BinaryToggle
            falseLabel="자유 이체"
            trueLabel="정기 이체"
            value={isRegular}
            onChange={(v) => {
              //   setGiftMethod(v);
              onChange(v === true ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE);
            }}
          />
        </div>
      ) : (
        <div>
          {!regular ? (
            <div>
              <CustomButton
                preset="lightgreenlong"
                onClick={() => setGiftMethod(!regular)}
              >
                정기 이체로 변경
              </CustomButton>
            </div>
          ) : (
            <div>
              <CustomButton
                onClick={() => setGiftMethod(!regular)}
                preset="lightgreenlong"
              >
                자유 이체로 변경
              </CustomButton>
            </div>
          )}
        </div>
      )}
      {regular === true ? (
        <div className="flex justify-between pt-4">
          <div>
            <TitlePlanSelect title="증여 기간" />
            <InputMonth
              disabled={isFixed ?? false}
              value={period ?? undefined}
              unit="개월"
              className={
                isFixed
                  ? 'h-[42px] w-[155px] bg-hana-gray-300 font-hana-regular text-hana-gray-600'
                  : 'h-[42px] w-[155px] bg-hana-light-green font-hana-regular'
              }
              onChange={(v) => setNewPeriod(v ?? null)}
            />
          </div>
          <div>
            <TitlePlanSelect title="월 증여액" />
            <InputMonth
              disabled={isFixed ?? false}
              value={amount ?? undefined}
              unit="원"
              className={
                isFixed
                  ? 'h-[42px] w-[155px] bg-hana-gray-300 font-hana-regular text-hana-gray-600'
                  : 'h-[42px] w-[155px] bg-hana-light-green font-hana-regular'
              }
              onChange={(v) => setNewAmount(v ?? null)}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {regular ? (
        <div className="grid gap-2 pt-3">
          <div className="flex gap-1">
            <h2 className="font-hana-light text-xs">총 증여액</h2>
            <InfoIcon className="h-4 w-4 text-hana-gray-400" />
          </div>
          <div className="grid justify-center rounded-xl bg-hana-light-green px-10 py-5">
            <h4 className="text-center text-hana-badge-green">
              {formatWonNatural((newPeriod ?? 0) * (newAmount ?? 0))}
            </h4>
            <h4 className="text-hana-gray-500 text-xs">
              약 {formatWonNatural(newAmount ?? 0)} X {newPeriod ?? 0}
              개월
            </h4>
          </div>
          <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
            ※ 증여세 공제는 10년마다 새로 적용돼요. 19세 미만은 2,000만원,
            성인은 5,000만원까지 공제되며, 한도를 초과한 금액에는 증여세가
            부과됩니다.
          </h4>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
