'use client';

import { useEffect, useMemo } from 'react';
import {
  WheelPicker,
  type WheelPickerOption,
  WheelPickerWrapper,
} from '@/components/ui/wheel-picker';

/**
 * @page: ScrollDatePicker
 * @description: ScrolseonukimePicker
 * @author: seonukim
 * @date: 2026-01-26
 *
 * @props:
 * - year: number - 선택된 연도
 * - month: number - 선택된 월
 * - day: number - 선택된 일
 * - onChange: (date: { year: number; month: number; day: number }) => void - 날짜 변경 시 호출되는 콜백 함수
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

  const clampedDay = useMemo(
    () => Math.min(day, days.length),
    [day, days.length],
  );

  useEffect(() => {
    if (day !== clampedDay) {
      onChange({ year, month, day: clampedDay });
    }
  }, [day, clampedDay, year, month, onChange]);

  return (
    <WheelPickerWrapper>
      <WheelPicker
        options={years}
        value={year}
        onValueChange={(y) => {
          const nextDaysLen = getDays(y, month).length;
          onChange({ year: y, month, day: Math.min(day, nextDaysLen) });
        }}
      />
      <WheelPicker
        options={months}
        value={month}
        onValueChange={(m) => {
          const nextDaysLen = getDays(year, m).length;
          onChange({ year, month: m, day: Math.min(day, nextDaysLen) });
        }}
      />
      <WheelPicker
        options={days}
        value={clampedDay}
        onValueChange={(d) => onChange({ year, month, day: d })}
      />
    </WheelPickerWrapper>
  );
}
