import FundStatCard from '@/components/cmm/FundStatCard';

/**
 * @page: fundcard
 * @description: 여러가지를 담고 있는데 펀드리스트 가입설명 페이지가 너무 길어져서 따로 일부를 컴포넌트화시킴
 * 숫자가 길어지면 조정
 * @author: typeYu
 * @date: 2026-01-27
 */

type Props = {
  plus1: unknown;
  totalMoney: unknown;
  setDate: Date;
};

function formatDecimal(v: unknown) {
  if (v == null) return '0';
  return String(v);
}

function formatMoney(v: unknown) {
  if (v == null) return '0';

  const raw = String(v);

  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;

  const abs = Math.abs(n);

  if (abs >= 100_000_000) {
    const eok = n / 100_000_000;
    return `${eok.toFixed(1).replace(/\.0$/, '')}억원`;
  }

  if (abs >= 10_000_000) {
    const cheon = n / 10_000_000;
    return `${cheon.toFixed(1).replace(/\.0$/, '')}천만원`;
  }

  return n.toLocaleString('ko-KR');
}

function calcOperatingPeriod(setDate: Date) {
  const now = new Date();
  const months =
    (now.getFullYear() - setDate.getFullYear()) * 12 +
    (now.getMonth() - setDate.getMonth());
  if (months <= 0) return '0개월';
  const years = Math.floor(months / 12);
  const rest = months % 12;

  if (years <= 0) return `${rest}개월`;
  if (rest === 0) return `${years}년`;
  return `${years}년 ${rest}개월`;
}

export function FundStatSection({ plus1, totalMoney, setDate }: Props) {
  const stat3m = `${formatDecimal(plus1)}%`;
  const statTotalMoney = formatMoney(totalMoney);
  const statPeriod = calcOperatingPeriod(setDate);

  return (
    <div className="mt-9">
      <div className="flex gap-2">
        <FundStatCard title="3개월 수익률" value={stat3m} highlight />
        <FundStatCard title="설정액" value={statTotalMoney} />
        <FundStatCard title="운용기간" value={statPeriod} />
      </div>
    </div>
  );
}
