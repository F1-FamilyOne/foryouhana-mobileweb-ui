import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @page: fund-key-point-item
 * @description: 이 펀드의 핵심 포인트가 3개 있어서 컴포넌트화
 * @author: typeYu
 * @date: 2026-01-27
 */

type Props = {
  icon: LucideIcon;
  title: string;
  context: string;
  className?: string;
};

export function FundKeyPointItem({
  icon: Icon,
  title,
  context,
  className,
}: Props) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="pt-1 text-hana-main" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex flex-col">
        <div className="font-hana-bold text-[16px] text-black">{title}</div>
        <div className="pt-1 font-hana-cm text-[14px] text-hana-gray-600">
          {context}
        </div>
      </div>
    </div>
  );
}
