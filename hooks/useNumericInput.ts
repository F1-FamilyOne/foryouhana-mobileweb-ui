'use client';

import { useEffect, useState } from 'react';

/**
 * @page: useNumericInput
 * @description: 숫자 입력 처리 로직을 공유하는 커스텀 훅. 포맷팅, min/max 범위 제한 지원.
 * @author: 권순범
 * @date: 2026-01-28
 */

type UseNumericInputOptions = {
  value?: number;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  format?: (num: number) => string;
};

type UseNumericInputReturn = {
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useNumericInput({
  value,
  onChange,
  min,
  max,
  format = (num) => num.toString(),
}: UseNumericInputOptions): UseNumericInputReturn {
  const [inputValue, setInputValue] = useState(
    value !== undefined ? format(value) : '',
  );

  useEffect(() => {
    setInputValue(value !== undefined ? format(value) : '');
  }, [value, format]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');

    if (raw === '') {
      setInputValue('');
      onChange?.(undefined);
      return;
    }

    const num = Number.parseInt(raw, 10);

    if (max !== undefined && num > max) {
      setInputValue(format(max));
      onChange?.(max);
      return;
    }

    if (min !== undefined && num < min && raw !== '') {
      setInputValue(format(min));
      onChange?.(min);
      return;
    }

    setInputValue(format(num));
    onChange?.(num);
  };

  return { inputValue, handleChange };
}
