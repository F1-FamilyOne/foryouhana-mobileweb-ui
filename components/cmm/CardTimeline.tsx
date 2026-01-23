import { Mail } from 'lucide-react';

/**
 * @page: 타임라인 카드
 * @description: 타임라인 내 이력카드. isMessage에 따라 메세지 카드 / 일반 펀드구매 카드 분기
 * <입력값>
 * 메세지 - date, movedMoney, message, isMessage(true값)
 * 자동 투자 내역 - date, movedMoney, title
 *
 * - date 는 그냥 new Date처럼 시간으로 넣어주면 자동포멧팅
 * @author: 승빈
 * @date: 2026-01-23
 */

type Props = {
  date: Date;
  movedMoney: number;
  fundName?: string;
  title?: string;
  message?: string;
  isMessage?: boolean;
};

export default function CardTimeline({
  date,
  movedMoney,
  fundName,
  title,
  message,
  isMessage = false,
}: Props) {
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="h-24.5 w-75 rounded-4xl bg-(--color-hana-light-green) p-3 font-hana-regular">
      <div className="flex justify-between text-[16px]">
        <p>{isMessage ? '입금' : title}</p>
        <p>{isMessage && `+${movedMoney.toLocaleString()}원`}</p>
      </div>
      <div className="text-(--color-hana-gray-500) text-[13px]">
        <div className="flex gap-2">
          {formattedDate}
          <Mail size={20} />
        </div>

        {isMessage ? (
          <div className="grid h-7 w-full place-items-center rounded-[15px] bg-white">
            {`"${message}"`}
          </div>
        ) : (
          <div className="flex h-7 items-center">
            {fundName}로 {movedMoney.toLocaleString()}원 투자완료
          </div>
        )}
      </div>
    </div>
  );
}
