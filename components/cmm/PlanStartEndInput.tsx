import TitlePlanSelect from './TitlePlanSelect';

type Props = {
  startDisable?: boolean;
  endDisable?: boolean;
  startDate: string;
  endDate: string;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
};

export default function PlanStartEndInput({
  startDisable,
  endDisable,
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: Props) {
  const handleChangeEnd = (value: string) => {
    if (startDate && value <= startDate) {
      alert('종료 날짜는 시작 날짜 이후여야 합니다.');
      return;
    }
    onChangeEnd(value);
  };

  return (
    <div className="flex justify-between pt-4">
      <div>
        <TitlePlanSelect title="시작 날짜" />
        <input
          type="date"
          disabled={startDisable}
          value={startDate ?? ''}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChangeStart(e.target.value)}
          className={
            startDisable
              ? 'h-[42px] w-[155px] rounded-md bg-hana-gray-300 px-2 font-hana-regular'
              : 'h-[42px] w-[155px] rounded-md bg-hana-light-green px-2 font-hana-regular'
          }
        />
        {/* <InputMonth
          disabled={disabled}
          value={period ?? undefined}
          unit="개월"
          className={
            disabled
              ? 'h-[42px] w-[155px] bg-hana-gray-300 font-hana-regular'
              : 'h-[42px] w-[155px] bg-hana-light-green font-hana-regular'
          }
          onChange={(v) => onChangePeriod(v ?? 0)}
        /> */}
      </div>
      <div>
        <TitlePlanSelect title="종료 날짜" />
        <input
          type="date"
          disabled={endDisable}
          value={endDate ?? ''}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => handleChangeEnd(e.target.value)}
          className={
            endDisable
              ? 'h-[42px] w-[155px] rounded-md bg-hana-gray-300 px-2 font-hana-regular'
              : 'h-[42px] w-[155px] rounded-md bg-hana-light-green px-2 font-hana-regular'
          }
        />
      </div>
    </div>
  );
}
