'use client';

import { useNumericInput } from '@/hooks/useNumericInput';
import { cn } from '@/lib/utils';

/**
 * @page: InputAmountFlex
 * @description: Flexible width amount input. Copied from cmm/InputDayAmount.tsx and extended.
 * @author: 권순범
 * @date: 2026-01-27
 */

type InputAmountFlexProps = {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

const MAX_INT = 2147483647;

const formatWithComma = (num: number) => num.toLocaleString();

export function InputAmountFlex({
  value,
  onChange,
  placeholder = '',
  label = '월 납입액',
  showLabel = true,
  className,
}: InputAmountFlexProps) {
  const { inputValue, handleChange } = useNumericInput({
    value,
    onChange,
    max: MAX_INT,
    format: formatWithComma,
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
          만원
        </span>
      </label>
    </div>
  );
}
