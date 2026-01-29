'use client';

import { cn } from '@/lib/utils';

/**
 * @page: InvestTypeToggle
 * @description: 정기적립식/자유적립식 선택 토글 버튼. fund.saving_type에 따라 선택 가능 타입 제한.
 * @author: 권순범
 * @date: 2026-01-26
 */

type InvestType = 'REGULAR' | 'FREE';

type InvestTypeToggleProps = {
  value: InvestType;
  onChange: (value: InvestType) => void;
  allowedTypes: InvestType[];
  className?: string;
};

export function InvestTypeToggle({
  value,
  onChange,
  allowedTypes,
  className,
}: InvestTypeToggleProps) {
  const isRegularAllowed = allowedTypes.includes('REGULAR');
  const isFreeAllowed = allowedTypes.includes('FREE');

  return (
    <div className={cn('flex w-full gap-3', className)}>
      <button
        type="button"
        onClick={() => isRegularAllowed && onChange('REGULAR')}
        disabled={!isRegularAllowed}
        className={cn(
          'flex h-[48px] flex-1 items-center justify-center rounded-[10px] font-medium text-[16px] transition-colors',
          value === 'REGULAR'
            ? 'bg-hana-main text-white'
            : 'bg-hana-gray-200 text-hana-gray-600',
          !isRegularAllowed && 'cursor-not-allowed opacity-50',
        )}
      >
        정기적립식
      </button>
      <button
        type="button"
        onClick={() => isFreeAllowed && onChange('FREE')}
        disabled={!isFreeAllowed}
        className={cn(
          'flex h-[48px] flex-1 items-center justify-center rounded-[10px] font-medium text-[16px] transition-colors',
          value === 'FREE'
            ? 'bg-hana-main text-white'
            : 'bg-hana-gray-200 text-hana-gray-600',
          !isFreeAllowed && 'cursor-not-allowed opacity-50',
        )}
      >
        자유적립식
      </button>
    </div>
  );
}
