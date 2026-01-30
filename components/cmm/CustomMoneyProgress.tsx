import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * @page: CustomMoneyProgress
 * @description: 증여 구간 금액 표시용 프로그래스 바
 * @author: seonukim
 * @date: 2026-01-25
 *
 *
 * 입력값:
 * - current: number - 현재 금액
 * - total: number - 목표 금액
 *
 * @example:
 * <CustomMoneyProgress current={12000000} total={15000000} />
 */

type MoneyProgressProps = {
  current: number;
  total: number;
};

export function CustomMoneyProgress({ current, total }: MoneyProgressProps) {
  const percent = Math.min((current / total) * 100, 100);
  return (
    <div className={cn('w-full', 'font-hana-cm')}>
      <Progress
        value={percent}
        className="h-3 bg-hana-gray-200 [&>div]:rounded-full [&>div]:bg-linear-to-r [&>div]:from-hana-text-bold-green [&>div]:to-hana-main"
      />

      <div className="flex items-center justify-end pt-2 text-[11.6px] text-hana-gray-500">
        <span>{percent.toFixed(1)}%</span>
      </div>
    </div>
  );
}
