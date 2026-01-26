type TimelineSummaryProps = {
  monthsPassed: number;
  depositCount: number;
};

export default function TimelineSummary({
  monthsPassed,
  depositCount,
}: TimelineSummaryProps) {
  return (
    <section className="mb-8 grid grid-cols-2 gap-2 rounded-2xl bg-[#f4f9f7] p-4 text-center">
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] text-gray-500">시작한 지</p>
        <p className="font-bold text-gray-800 text-lg">{monthsPassed}개월</p>
      </div>
      <div className="flex flex-col gap-0.5 border-gray-200 border-l">
        <p className="text-[12px] text-gray-500">입금 횟수</p>
        <p className="font-bold text-gray-800 text-lg">{depositCount}회</p>
      </div>
    </section>
  );
}
