import { Mail } from 'lucide-react';

/**
 * @page: 타임라인 카드
 * @description: 타임라인 내 이력카드. isMessage에 따라 메세지 카드 / 일반 펀드구매 카드 분기
 * @author: 승빈
 * @updated: 2026-01-26 (메시지 클릭 이벤트 추가)
 */

type Props = {
  date: Date;
  movedMoney: number;
  fundName?: string;
  title?: string;
  message?: string;
  isMessage?: boolean;
  onMessageClick?: () => void; // 👈 추가된 부분: 클릭 핸들러 받기
};

export default function CardTimeline({
  date,
  movedMoney,
  fundName,
  title,
  message,
  isMessage = false,
  onMessageClick, // 👈 구조 분해 할당
}: Props) {
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    // h-24.5 (약 98px) -> min-h로 변경하여 내용이 길어지면 늘어나도록 유연성 확보
    <div className="min-h-24.5 flex-1 rounded-[24px] bg-[#E9F4EF] p-4 font-hana-regular shadow-sm transition-all hover:shadow-md">
      <div className="mb-1 flex items-start justify-between text-[15px]">
        <p className="font-bold text-gray-800">{isMessage ? '입금' : title}</p>
        <p className="font-bold text-gray-800">
          {movedMoney > 0 && `+${movedMoney.toLocaleString()}원`}
        </p>
      </div>

      <div className="text-[12px] text-gray-500">
        <div className="mb-2 flex items-center gap-2">
          <span>{formattedDate}</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMessageClick?.();
            }}
            className="-ml-1 flex cursor-pointer items-center justify-center rounded-full p-1 text-gray-400 transition-all hover:bg-white/50 hover:text-hana-mint"
            aria-label="메시지 남기기"
          >
            <Mail size={16} />
          </button>
        </div>

        {isMessage ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMessageClick?.();
            }}
            className="w-full cursor-pointer rounded-2xl bg-white px-3 py-2 text-left text-[13px] text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
          >
            {message ? (
              `"${message}"`
            ) : (
              <span className="text-gray-300">메시지를 남겨보세요</span>
            )}
          </button>
        ) : (
          <div className="flex items-center text-[13px] text-gray-600">
            <span className="mr-1 font-medium text-gray-800">{fundName}</span>
            (으)로
            <span className="ml-1">
              {movedMoney.toLocaleString()}원 투자완료
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
