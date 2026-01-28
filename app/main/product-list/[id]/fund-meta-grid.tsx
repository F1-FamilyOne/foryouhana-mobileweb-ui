/**
 * @page: fund-list-detail
 * @description: 운용사, 설정일, 총 보수, 판매 수수료가 담겨 있는 상자
 * @author: typeYu
 * @date: 2026-01-27
 */

type Props = {
  company: string;
  setDate: Date;
  totalFee: unknown;
  sellFee: unknown;
};

function formatDecimal(v: unknown) {
  if (v == null) return '0';
  return String(v);
}

function formatYmd(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

export function FundMetaGrid({ company, setDate, totalFee, sellFee }: Props) {
  return (
    <div className="pt-4">
      <div className="rounded-2xl bg-hana-gray-100 p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-hana-cm text-[12px] text-hana-gray-400">
              운용사
            </div>
            <div className="pt-1 font-hana-cm text-[14px] text-hana-dark-navy">
              {company}
            </div>
          </div>

          <div>
            <div className="font-hana-cm text-[12px] text-hana-gray-400">
              설정일
            </div>
            <div className="pt-1 font-hana-cm text-[14px] text-hana-dark-navy">
              {formatYmd(setDate)}
            </div>
          </div>

          <div>
            <div className="font-hana-cm text-[12px] text-hana-gray-400">
              총 보수
            </div>
            <div className="pt-1 font-hana-cm text-[14px] text-hana-dark-navy">
              {formatDecimal(totalFee)}
            </div>
          </div>

          <div>
            <div className="font-hana-cm text-[12px] text-hana-gray-400">
              판매 수수료
            </div>
            <div className="pt-1 font-hana-cm text-[14px] text-hana-dark-navy">
              {formatDecimal(sellFee)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
