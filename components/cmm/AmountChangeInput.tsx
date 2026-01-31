import { InputMonth } from './InputDayAmount';
import TitlePlanSelect from './TitlePlanSelect';

type Props = {
  disabled?: boolean;
  amount: number;
  onChangeAmount: (v: number) => void;
};

export default function AmountChangeInput({
  disabled,
  amount,
  onChangeAmount,
}: Props) {
  return (
    <div className="flex justify-between pt-4">
      {/* <div>
        <TitlePlanSelect title="증여 기간" />
        <InputMonth
          disabled={disabled ?? disabledMonth}
          value={period ?? undefined}
          unit="개월"
          className={
            disabledMonth
              ? 'h-[42px] w-[155px] bg-hana-gray-300 font-hana-regular'
              : 'h-[42px] w-[155px] bg-hana-light-green font-hana-regular'
          }
          onChange={(v) => onChangePeriod(v ?? 0)}
        />
      </div> */}
      <div>
        <TitlePlanSelect title="월 증여액" />
        <InputMonth
          disabled={disabled}
          value={amount ?? undefined}
          unit="원"
          className={
            disabled
              ? 'h-[42px] w-[342px] bg-hana-gray-300 font-hana-regular'
              : 'h-[42px] w-[342px] bg-hana-light-green font-hana-regular'
          }
          onChange={(v) => onChangeAmount(v ?? 0)}
        />
      </div>
    </div>
  );
}
