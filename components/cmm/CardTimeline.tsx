import { Mail } from 'lucide-react';

/**
 * @page: 타임라인 카드
 * @description: 제목(type), 설명(description), 메모(message)를 순차적으로 배치
 * @author: 승빈
 * @updated: 2026-01-27
 */

type Props = {
  date: Date;
  movedMoney: number;
  fundName?: string; // Prisma의 description 데이터가 이리로 들어옵니다
  title?: string; // Prisma의 type 데이터가 이리로 들어옵니다
  message?: string;
  isMessage?: boolean;
  onMessageClick?: () => void;
};

export default function CardTimeline({
  date,
  fundName,
  title,
  message,
  onMessageClick,
}: Props) {
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-24.5 flex-1 rounded-[24px] bg-[#E9F4EF] p-4 font-hana-regular shadow-sm transition-all hover:shadow-md">
      {/* 1. 상단 타이틀 영역 (Prisma의 type 노출) */}
      <div className="mb-1 flex items-start justify-between text-[15px]">
        <p className="font-bold text-gray-800">{title}</p>
      </div>

      <div className="text-[12px] text-gray-500">
        {/* 2. 날짜 및 메시지 아이콘 */}
        <div className="mb-2 flex items-center gap-2">
          <span>{formattedDate}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMessageClick?.();
            }}
            className="-ml-1 flex cursor-pointer items-center justify-center rounded-full p-1 text-gray-400 transition-all hover:bg-white/50 hover:text-hana-mint"
          >
            <Mail size={16} />
          </button>
        </div>

        {/* 3. 상세 설명 영역 (Prisma의 description 노출) */}
        {/* 설명에 '50,000원' 혹은 '상품명 (으)로 0원' 등이 적힌 대로 나옵니다. */}
        <div className="mb-2 break-keep text-[13px] text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-700">{fundName}</p>
        </div>

        {/* 4. 메모 영역 (설명 바로 아래에 위치) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMessageClick?.();
          }}
          className="w-full cursor-pointer rounded-2xl bg-white/70 px-3 py-2 text-left text-[13px] text-gray-600 shadow-sm transition-colors hover:bg-white"
        >
          {message ? (
            <span className="text-gray-700 italic">"{message}"</span>
          ) : (
            <span className="text-gray-300">메시지를 남겨보세요</span>
          )}
        </button>
      </div>
    </div>
  );
}
