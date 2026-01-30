import { cn } from '@/lib/utils';

/**
 * @page: AvgAccCard
 * @description: 홈 화면에서 펀드 리스트 아래 누적 통계 보여줄 때 쓰는 카드
 * @author: seonukim
 * @date: 2026-01-25
 *
 * @props:
 * - title: 카드 제목
 * - value: 카드에 보여줄 값 (string)
 * - subText: (선택) 카드에 보여줄 부가 설명 텍스트
 *
 * @example:
 * <AvgAccCard title="평균 누적 수익금" value="+1,269,000원" />
 * <AvgAccCard title="평균 누적 수익률" value="+10.57%" subText="원금 대비 수익률" />
 */

type AvgAccCardProps = {
  title: string;
  value: string;
  subText?: string;
};

export default function AvgAccCard({ title, value, subText }: AvgAccCardProps) {
  return (
    <div
      className={cn(
        'h-26 w-37.25 gap-1 rounded-[14px] bg-linear-to-r from-hana-linear-green to-hana-linear-green-end pt-5 pl-5 font-hana-cm',
      )}
    >
      <div className="font-hana-cm text-[14px] text-hana-gray-600">{title}</div>
      <div className="text-[16px] text-hana-badge-green">{value}</div>
      {subText && (
        <div className="text-[12px] text-hana-gray-500">{subText}</div>
      )}
    </div>
  );
}
