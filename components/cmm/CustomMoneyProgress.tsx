import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn, formatWon } from '@/lib/utils';

/**
 * @page: CustomMoneyProgress
 * @description: 증여 구간 금액 표시용 프로그래스 바
 * @author: seonukim
 * @date: 2026-01-25
 *
 *
 * 입력값:
 * - title: string - 프로그래스 바 제목
 * - current: number - 현재 금액
 * - total: number - 목표 금액
 * - variant: 'compact' | 'detailed' - 컴포넌트 스타일 선택 (기본값: 'compact'),
 * detailed의 경우 상단에 큰 글씨로 Total 금액 표시됨
 *
 */

type MoneyProgressVariant = 'compact' | 'detailed';

type MoneyProgressProps = {
  title: string;
  current: number;
  total: number;
  variant?: MoneyProgressVariant;
};

export function CustomMoneyProgress({
  title,
  current,
  total,
  variant = 'compact',
}: MoneyProgressProps) {
  const percent = Math.min((current / total) * 100, 100);
  return (
    <div
      className={cn(
        'w-full',
        'font-hana-cm',
        variant === 'detailed' && 'space-y-4',
        variant === 'compact' && 'space-y-2',
      )}
    >
      {variant === 'compact' && (
        <div className="flex items-center justify-between font-hana-cm text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-hana-gray-600">
              <Target />
            </span>
            <span className="text-hana-gray-600">{title}</span>
          </div>
          <span className="font-bold">{formatWon(total)}원</span>
        </div>
      )}

      {variant === 'detailed' && (
        <div className="space-y-1">
          <div className="font-medium text-gray-700">{title}</div>
          <div className="flex items-end gap-2 pl-1">
            <span className="font-bold text-4xl">{formatWon(total)}</span>
            <span className="text-gray-400 text-xl">원</span>
          </div>
          <div className="flex justify-end">{formatWon(total)}원</div>
        </div>
      )}

      <Progress
        value={percent}
        className="h-3 bg-hana-gray-200 [&>div]:rounded-full [&>div]:bg-linear-to-r [&>div]:from-hana-text-bold-green [&>div]:to-hana-main"
      />

      <div className="flex items-center justify-between text-gray-500 text-sm">
        <span>현재 {formatWon(current)}원</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
    </div>
  );
}
