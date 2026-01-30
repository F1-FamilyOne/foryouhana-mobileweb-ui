import { TimelineIcon } from '@/components/cmm/TimelineIcon';
import CardTimeline from '../cmm/CardTimeline';

type TimelineRowProps = {
  icon: 'gift' | 'bell' | 'business' | 'trending';
  variant: 'purple' | 'pastelGreen' | 'lightGreen';
  isLast?: boolean;
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
  onMessageClick,
}: TimelineRowProps) {
  return (
    <div className="flex gap-4">
      {/* 1. 아이콘과 세로 연결선 */}
      <div className="flex flex-col items-center">
        <TimelineIcon icon={icon} variant={variant} />
        {!isLast && <div className="my-1 w-0.5 flex-1 bg-gray-200" />}
      </div>

      {/* 2. 실제 내용 카드 */}
      <div className="min-w-0 flex-1 pb-6">
        <CardTimeline {...cardData} onMessageClick={onMessageClick} />
      </div>
    </div>
  );
}
