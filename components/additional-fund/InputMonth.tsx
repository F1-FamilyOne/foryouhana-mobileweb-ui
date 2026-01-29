'use client';

import { useNumericInput } from '@/hooks/useNumericInput';
import { cn } from '@/lib/utils';

/**
 * @page: InputMonth
 * @description: 개월 수 입력 컴포넌트 (1-1200개월). 자유적립식 납입기간용.
 * @author: 권순범
 * @date: 2026-01-27
 */

type InputMonthProps = {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

const MAX_MONTH = 1200; // 100년

export function InputMonth({
  value,
  onChange,
  placeholder = '',
  label = '납입 기간',
  showLabel = true,
  className,
}: InputMonthProps) {
  const { inputValue, handleChange } = useNumericInput({
    value,
    onChange,
    min: 1,
    max: MAX_MONTH,
  });

  return (
    <div className={cn('flex-1', className)}>
      {showLabel && (
        <p className="mb-2 text-[14px] text-hana-gray-600">{label}</p>
      )}
      <label className="flex h-[48px] w-full cursor-text items-center justify-center rounded-[10px] bg-hana-light-green px-4">
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-center font-medium text-[24px] outline-none placeholder:text-hana-gray-400"
        />
        <span className="ml-2 shrink-0 text-[16px] text-hana-gray-600">
          개월
        </span>
      </label>
    </div>
  );
}
