/**
 * @page: NumericKeypad
 * @description: 입금 금액 입력을 위한 커스텀 숫자 키패드 컴포넌트
 * @author: 권순범
 * @date: 2026-01-27
 */

'use client';

import { Delete } from 'lucide-react';

type Props = {
  onNumberPress: (num: string) => void;
  onBackspace: () => void;
  onComplete: () => void;
  disabled?: boolean;
};

export default function NumericKeypad({
  onNumberPress,
  onBackspace,
  onComplete,
  disabled = false,
}: Props) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onNumberPress(key)}
          disabled={disabled}
          className="flex h-[56px] items-center justify-center rounded-lg bg-white font-hana-medium text-[24px] text-gray-800 transition-colors hover:bg-hana-gray-100 active:bg-hana-gray-200 disabled:opacity-50"
        >
          {key}
        </button>
      ))}

      {/* 백스페이스 */}
      <button
        type="button"
        onClick={onBackspace}
        disabled={disabled}
        className="flex h-[56px] items-center justify-center rounded-lg bg-white text-gray-600 transition-colors hover:bg-hana-gray-100 active:bg-hana-gray-200 disabled:opacity-50"
      >
        <Delete size={24} />
      </button>

      {/* 0 */}
      <button
        type="button"
        onClick={() => onNumberPress('0')}
        disabled={disabled}
        className="flex h-[56px] items-center justify-center rounded-lg bg-white font-hana-medium text-[24px] text-gray-800 transition-colors hover:bg-hana-gray-100 active:bg-hana-gray-200 disabled:opacity-50"
      >
        0
      </button>

      {/* 완료 */}
      <button
        type="button"
        onClick={onComplete}
        disabled={disabled}
        className="flex h-[56px] items-center justify-center rounded-lg bg-hana-main font-hana-bold text-[18px] text-white transition-colors hover:bg-hana-main/90 active:bg-hana-main/80 disabled:opacity-50"
      >
        완료
      </button>
    </div>
  );
}
