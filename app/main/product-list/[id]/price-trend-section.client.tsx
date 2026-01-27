'use client';

import { CustomTab } from '@/components/cmm/CustomTab';

/**
 * @page: 펀드 상세설명 페이지의 그래프
 * @description: 깡구현, 개월 수 토글 변경 해도 안 바뀜
 * @author: typeYu
 * @date: 2026-01-27
 */

type Props = {
  defaultValue?: 'm1' | 'm3' | 'm6' | 'y1' | 'all';
};

export function PriceTrendSection({ defaultValue = 'm6' }: Props) {
  const handleChange = (_v: string) => {};

  return (
    <div>
      <div className="flex items-center justify-between pt-10">
        <div className="font-hana-bold text-[16px] text-black">가격 추이</div>

        <CustomTab
          variant="small"
          tabs={[
            { label: '1M', value: 'm1' },
            { label: '3M', value: 'm3' },
            { label: '6M', value: 'm6' },
            { label: '1Y', value: 'y1' },
            { label: '전체', value: 'all' },
          ]}
          value={defaultValue}
          onChange={handleChange}
        />
      </div>

      <div className="pt-3">
        <div className="rounded-xl bg-white p-3">
          <div className="flex gap-3">
            <div className="flex flex-col justify-between pb-5 font-hana-cm text-[12px] text-hana-gray-400"></div>

            <div className="w-full">
              <svg
                viewBox="0 0 300 140"
                role="img"
                aria-label="가격 추이 그래프"
                className="h-36 w-full"
              >
                <line
                  x1="0"
                  y1="120"
                  x2="300"
                  y2="120"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-hana-gray-200"
                />
                <line
                  x1="0"
                  y1="90"
                  x2="300"
                  y2="90"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-hana-gray-200"
                />
                <line
                  x1="0"
                  y1="60"
                  x2="300"
                  y2="60"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-hana-gray-200"
                />
                <line
                  x1="0"
                  y1="30"
                  x2="300"
                  y2="30"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-hana-gray-200"
                />

                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-hana-badge-red"
                  points="0,120 50,102 100,92 150,80 200,62 250,28 300,15"
                />

                <g className="text-hana-badge-red">
                  <circle cx="60" cy="100" r="4" fill="currentColor" />
                  <circle cx="120" cy="88" r="4" fill="currentColor" />
                  <circle cx="180" cy="70" r="4" fill="currentColor" />
                  <circle cx="240" cy="35" r="4" fill="currentColor" />
                </g>
              </svg>

              <div className="flex justify-between pt-1 font-hana-cm text-[12px] text-hana-gray-400">
                <span>9월</span>
                <span>10월</span>
                <span>11월</span>
                <span>12월</span>
                <span>1월</span>
                <span>2월</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-12 h-[8px] w-full bg-hana-gray-100" />
    </div>
  );
}
