'use client';

import { useNumericInput } from '@/hooks/useNumericInput';
import { cn } from '@/lib/utils';

/**
 * @page: InputDayFlex
 * @description: Flexible width day input. Copied from cmm/InputDayAmount.tsx and extended.
 * @author: 권순범
 * @date: 2026-01-27
 */

type InputDayFlexProps = {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
};

export function InputDayFlex({
  value,
  onChange,
  placeholder = '',
  className,
}: InputDayFlexProps) {
  const { inputValue, handleChange } = useNumericInput({
    value,
    onChange,
    min: 1,
    max: 31,
  });

  return (
    <label
      className={cn(
        'flex h-[48px] w-full cursor-text items-center justify-center rounded-[10px] bg-hana-gray-200 px-4',
        className,
      )}
    >
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-center font-medium text-[24px] outline-none placeholder:text-hana-gray-400"
      />
      <span className="ml-2 shrink-0 text-[16px] text-hana-gray-600">일</span>
    </label>
  );
}
