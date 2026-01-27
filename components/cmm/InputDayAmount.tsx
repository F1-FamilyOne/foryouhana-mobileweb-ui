'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * @page: 공통 컴포넌트 - 일수/금액 입력
 * @description: 단위가 붙은 숫자 입력 컴포넌트 모음
 *
 * <InputDay>
 * - 월/일에서 일수를 입력받는 컴포넌트 (1-31일)
 * - 사용 예시: <InputDay value={25} onChange={(val) => setDay(val)} />
 *
 * <InputAmount>
 * - 월 증여액을 만원 단위로 입력받는 컴포넌트
 * - int형 최대값(2,147,483,647)까지 입력 가능
 * - 천 단위 콤마 자동 포맷팅
 * - 사용 예시: <InputAmount value={50} onChange={(val) => setAmount(val)} />
 *
 * @author: 권순범
 * @date: 2026-01-24
 */

type InputDayProps = {
  value?: number;
  unit: string;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
};

type InputAmountProps = {
  value?: number;
  unit: string;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

const MAX_INT = 2147483647;

export function InputDay({
  value,
  unit,
  onChange,
  placeholder = '',
  className,
}: InputDayProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? '');

  useEffect(() => {
    setInputValue(value?.toString() ?? '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');

    if (raw === '') {
      setInputValue('');
      onChange?.(undefined);
      return;
    }

    const num = Number.parseInt(raw, 10);

    if (num > 31) {
      setInputValue('31');
      onChange?.(31);
      return;
    }

    if (num < 1 && raw !== '') {
      setInputValue('1');
      onChange?.(1);
      return;
    }

    setInputValue(raw);
    onChange?.(num);
  };

  return (
    <label
      className={cn(
        'flex h-[42px] w-[334px] cursor-text items-center justify-center rounded-[10px] bg-hana-gray-200 px-4',
        className,
      )}
    >
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-center font-medium outline-none placeholder:text-hana-gray-400"
      />
      <span className="ml-2 shrink-0 text-hana-gray-600">{unit}</span>
    </label>
  );
}

export function InputAmount({
  value,
  onChange,
  unit,
  placeholder = '',
  label = '월 증여액',
  showLabel = true,
  className,
}: InputAmountProps) {
  const [inputValue, setInputValue] = useState(value?.toLocaleString() ?? '');

  useEffect(() => {
    setInputValue(value?.toLocaleString() ?? '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');

    if (raw === '') {
      setInputValue('');
      onChange?.(undefined);
      return;
    }

    const num = Number.parseInt(raw, 10);

    if (num > MAX_INT) {
      setInputValue(MAX_INT.toLocaleString());
      onChange?.(MAX_INT);
      return;
    }

    setInputValue(num.toLocaleString());
    onChange?.(num);
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <p className="mb-2 text-[14px] text-hana-gray-600">{label}</p>
      )}
      <label className="flex h-[42px] w-[153px] cursor-text items-center justify-center rounded-[10px] bg-hana-light-green px-4">
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-center font-medium outline-none placeholder:text-hana-gray-400"
        />
        <span className="ml-2 shrink-0 text-hana-gray-600">{unit}</span>
      </label>
    </div>
  );
}
