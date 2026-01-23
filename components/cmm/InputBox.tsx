'use client';

import { useState } from 'react';

/**
 * @page: 공통 컴포넌트 - 인풋 박스
 * @description: 텍스트 입력 + 전송 버튼이 포함된 인풋 박스.
 * <입력값>
 * placeholder - 인풋 placeholder 텍스트
 * onSubmit - 전송 시 호출되는 콜백 함수 (입력값 전달)
 *
 * - Enter 키 또는 버튼 클릭으로 전송 가능
 * - 전송 후 입력값 자동 초기화
 *
 * 사용 예시 ) <InputBox placeholder="메시지 입력" onSubmit={(val) => console.log(val)} />
 *
 * @author: 권순범
 * @date: 2026-01-23
 */

type Props = {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
};

export default function InputBox({
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
      className={[
        'flex h-[58px] w-[360px] items-center rounded-[10px] border border-[#B5B5B5] bg-[#F5F6FA] px-4',
        className ?? '',
      ].join(' ')}
    >
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
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
