'use client';

import { useMemo } from 'react';
import {
  WheelPicker,
  type WheelPickerOption,
  WheelPickerWrapper,
} from '@/components/ui/wheel-picker';

/**
 * @page: ScrollDatePicker
 * @description: 스크롤로 연,월,일을 선택하는 컴포넌트
 * @author: seonukim
 * @date: 2026-01-23
 *
 *
 * 입력값:
 * - year: 선택된 연도
 * - month: 선택된 월
 * - day: 선택된 일
 * - onChange: 날짜 변경 시 호출되는 함수
 *
 * 년, 월, 일 선택 휠을 제공하며, 사용자가 스크롤하여 날짜를 선택할 수 있습니다.
 * 선택된 날짜가 변경되면 onChange 콜백이 호출되어 부모 컴포넌트에서 상태를 업데이트할 수 있습니다.
 */

const CURRENT_YEAR = new Date().getFullYear();

type ScrollDatePickerProps = {
  year: number;
  month: number;
  day: number;
  onChange: (date: { year: number; month: number; day: number }) => void;
};

const years: WheelPickerOption<number>[] = Array.from(
  { length: 80 },
  (_, i) => {
    const y = CURRENT_YEAR - (79 - i);
    return { label: `${y}년`, value: y };
  },
);

const months: WheelPickerOption<number>[] = Array.from(
  { length: 12 },
  (_, i) => {
    const m = i + 1;
    return { label: `${m}월`, value: m };
  },
);

function getDays(year: number, month: number): WheelPickerOption<number>[] {
  const lastDay = new Date(year, month, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => {
    const d = i + 1;
    return { label: `${d}일`, value: d };
  });
}

export function ScrollDatePicker({
  year,
  month,
  day,
  onChange,
}: ScrollDatePickerProps) {
  const days = useMemo(() => getDays(year, month), [year, month]);

  if (day > days.length) {
    onChange({ year, month, day: days.length });
  }

  return (
    <WheelPickerWrapper>
      <WheelPicker
        options={years}
        value={year}
        onValueChange={(y) => onChange({ year: y, month, day })}
      />
      <WheelPicker
        options={months}
        value={month}
        onValueChange={(m) => onChange({ year, month: m, day })}
      />
      <WheelPicker
        options={days}
        value={day}
        onValueChange={(d) => onChange({ year, month, day: d })}
      />
    </WheelPickerWrapper>
  );
}
