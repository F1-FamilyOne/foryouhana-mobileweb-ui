'use client';

import { useNumericInput } from '@/hooks/useNumericInput';
import { cn } from '@/lib/utils';

/**
 * @page: InputYear
 * @description: 년수 입력 컴포넌트 (1-100년). InputDay 패턴 참조.
 * @author: 권순범
 * @date: 2026-01-26
 */

type InputYearProps = {
  value?: number;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

const MAX_YEAR = 100;

export function InputYear({
  value,
  onChange,
  placeholder = '',
  label = '납입 기간',
  showLabel = true,
  className,
}: InputYearProps) {
  const { inputValue, handleChange } = useNumericInput({
    value,
    onChange,
    min: 1,
    max: MAX_YEAR,
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
        <span className="ml-2 shrink-0 text-[16px] text-hana-gray-600">년</span>
      </label>
    </div>
  );
}
