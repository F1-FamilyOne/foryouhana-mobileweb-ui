import { cn } from '@/lib/utils';

/**
 * @page: FundStatCard
 * @description: 펀드 세부 보기 화면에서 펀드 주요 정보 카드
 * @author: seonukim
 * @date: 2026-01-25
 *
 * 입력값:
 * - title: 카드 제목
 * - value: 카드 값
 * - highlight: 강조 여부 (기본값: false)
 * 강조시 초록색 배경과 형광 빛 그림자
 */

type FundStatCardProps = {
  title: string;
  value: string;
  highlight?: boolean;
};

export default function FundStatCard({
  title,
  value,
  highlight = false,
}: FundStatCardProps) {
  return (
    <div
      className={cn(
        'h-[112.5px] w-26.5 gap-0.5 rounded-2xl pt-7.75 pl-2.75',
        highlight
          ? 'bg-hana-light-mint text-white shadow-[0_4px_6px_-1px_#D0FAE5]'
          : 'bg-[#f3f4f6]',
      )}
    >
      <div className="font-hana-cm text-[11px] opacity-80">{title}</div>
      <div className="font-hana-bold text-[18px]">{value}</div>
    </div>
  );
}
