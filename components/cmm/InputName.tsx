'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * @page: 공통 컴포넌트 - 이름 입력
 * @description: 밑줄 스타일의 이름 입력 컴포넌트
 * <입력값>
 * label - 입력 필드 위에 표시되는 라벨 텍스트
 * value - 입력값 (controlled)
 * onChange - 값 변경 시 호출되는 콜백 함수
 * placeholder - 입력 필드의 placeholder 텍스트
 * className - 컨테이너에 추가할 클래스
 *
 * 사용 예시 ) <InputName label="자녀 이름" value={name} onChange={(val) => setName(val)} />
 *
 * @author: 권순범
 * @date: 2026-01-25
 */

type Props = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function InputName({
  label,
  value,
  onChange,
  placeholder = '',
  className,
}: Props) {
  const [inputValue, setInputValue] = useState(value ?? '');

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={cn('h-[138px] w-full bg-hana-gray-350 px-6 pt-6', className)}
    >
      {label && (
        <p className="mb-3 font-semibold text-[18px] text-hana-black">
          {label}
        </p>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border-hana-black border-b bg-transparent pb-2 text-[16px] outline-none placeholder:text-hana-gray-400"
      />
    </div>
  );
}
