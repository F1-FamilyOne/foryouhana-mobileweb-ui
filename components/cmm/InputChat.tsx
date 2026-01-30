'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * @page: 공통 컴포넌트 - 채팅 입력
 * @description: 전송 버튼이 포함된 채팅 스타일 입력 컴포넌트
 * <입력값>
 * placeholder - 인풋 placeholder 텍스트
 * onSubmit - 전송 시 호출되는 콜백 함수 (입력값 전달)
 *
 * - Enter 키 또는 버튼 클릭으로 전송 가능
 * - 전송 후 입력값 자동 초기화
 *
 * 사용 예시 ) <InputChat placeholder="메시지 입력" onSubmit={(val) => console.log(val)} />
 *
 * @author: 권순범
 * @date: 2026-01-23
 */

type Props = {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
};

export default function InputChat({
  placeholder = '',
  onSubmit,
  className,
}: Props) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        'flex h-[58px] w-full items-center rounded-[10px] border border-hana-gray-400 bg-hana-input-bg px-4',
        className,
      )}
    >
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-hana-gray-400"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="ml-2 flex h-[39px] w-[39px] shrink-0 items-center justify-center rounded-full bg-hana-main"
        aria-label="전송"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>전송 아이콘</title>
          <path
            d="M7 0L14 7M14 7L7 14M14 7H0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
