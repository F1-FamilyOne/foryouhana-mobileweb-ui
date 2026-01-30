import { cn } from '@/lib/utils';

/**
 * @page: AccGiftCard
 * @description: 홈 화면에서 누적 증여액과 잔여 증여액 보여주는 카드
 * @author: seonukim
 * @date: 2026-01-25
 *
 * @props:
 * - title: 카드 제목
 * - value: 카드에 보여줄 값 (string)
 * - highlight?: 초록색 배경 여부 (boolean)
 *
 * @example:
 * <AccGiftCard title="누적 증여액" value="8,500,000원" highlight={true} />
 * <AccGiftCard title="잔여 증여액" value="11,500,000원" />
 */

type AccGiftCardProps = {
  title: string;
  value: string;
  highlight?: boolean;
};

export default function AccGiftCard({
  title,
  value,
  highlight,
}: AccGiftCardProps) {
  return (
    <div
      className={cn(
        'h-25 w-37.5 rounded-[14px] pt-4.5 pl-3.25 font-hana-cm',
        highlight ? 'bg-hana-light-green' : 'bg-hana-gray-150',
      )}
    >
      <div className="font-hana-cm text-[12px]">{title}</div>
      <div className="pt-2 text-[20px] text-hana-main">{value}</div>
    </div>
  );
}
