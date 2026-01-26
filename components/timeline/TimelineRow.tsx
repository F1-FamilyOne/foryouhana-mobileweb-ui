import { TimelineIcon } from '@/components/cmm/TimelineIcon';
import CardTimeline from '../cmm/CardTimeline'; // 경로 확인

type TimelineRowProps = {
  icon: 'gift' | 'bell' | 'business' | 'trending';
  variant: 'purple' | 'pastelGreen' | 'lightGreen';
  isLast?: boolean;
  // CardTimeline에 전달할 Props들
  cardData: {
    date: Date;
    movedMoney: number;
    fundName?: string;
    title?: string;
    message?: string;
    isMessage?: boolean;
  };
  onMessageClick?: () => void;
};

export default function TimelineRow({
  icon,
  variant,
  isLast,
  cardData,
}: TimelineRowProps) {
  function onMessageClick(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex gap-4">
      {/* 1. 아이콘과 세로 연결선 */}
      <div className="flex flex-col items-center">
        <TimelineIcon icon={icon} variant={variant} />
        {/* 마지막 항목이 아닐 때만 아래로 선을 그음 */}
        {!isLast && <div className="my-1 w-0.5 flex-1 bg-gray-200" />}
      </div>

      {/* 2. 실제 내용 카드 */}
      <div className="min-w-0 flex-1 pb-6">
        {/* CardTimeline에게 클릭 함수 전달 */}
        <CardTimeline {...cardData} onMessageClick={onMessageClick} />
      </div>
    </div>
  );
}
