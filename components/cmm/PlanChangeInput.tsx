import { InputMonth } from './InputDayAmount';
import TitlePlanSelect from './TitlePlanSelect';

type Props = {
  disabledMonth?: boolean;
  period: number;
  disabledEnd?: boolean;
  endDate: string;
  onChangePeriod: (v: number) => void;
  handleChangeEnd: (v: string) => void;
};

export default function PlanChangeInput({
  disabledMonth = false,
  period,
  disabledEnd = false,
  endDate,
  onChangePeriod,
  handleChangeEnd,
}: Props) {
  const endMonth = endDate?.slice(0, 7) ?? '';
  return (
    <div className="flex justify-between pt-4">
      <div>
        <TitlePlanSelect title="증여 기간" />
        <InputMonth
          disabled={disabledMonth}
          value={period ?? undefined}
          unit="개월"
          className={
            disabledMonth
              ? 'h-[42px] w-[155px] bg-hana-gray-300 font-hana-regular'
              : 'h-[42px] w-[155px] bg-hana-light-green font-hana-regular'
          }
          onChange={(v) => onChangePeriod(v ?? 0)}
        />
      </div>
      <div>
        <TitlePlanSelect title="종료 날짜" />
        <input
          type="month"
          disabled={disabledEnd}
          value={endMonth ?? ''}
          min={new Date().toISOString().slice(0, 7)}
          onChange={(e) => handleChangeEnd(e.target.value)}
          className={
            disabledEnd
              ? 'h-[42px] w-[155px] rounded-md bg-hana-gray-300 px-2 font-hana-regular'
              : 'h-[42px] w-[155px] rounded-md bg-hana-light-green px-2 font-hana-regular'
          }
        />
      </div>
    </div>
  );
}
