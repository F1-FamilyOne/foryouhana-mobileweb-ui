'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  type ScriptableContext,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

/**
 * @page: InvestChartCard
 * @description: 인트로 화면에 들어가는 소개 이미지 차트 컴포넌트입니다.
 * @author: seonukim
 * @date: 2026-01-27
 *
 * chartjs를 통해 생성했습니다.
 *
 * 다양한 중첩 (상단 글씨 표시) 등이 들어가기 때문에 다른 화면에 쓰기에 용이하진 않습니다.
 */

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const labels = [
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
];

const values = [
  1.5, 1.7, 2.2, 2.9, 3.8, 4.3, 4.6, 5.5, 6.8, 8.2, 9.8, 10.6, 12.8, 15.2, 18.0,
  21.0, 22.0, 24.5, 27.0, 30.0, 31.5,
];

export default function InvestChartCard() {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: '#1AA89C',
        borderWidth: 3,
        tension: 0.35,
        pointRadius: 0,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<'line'>) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return;

          const g = c.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          g.addColorStop(0, 'rgba(26,168,156,0.28)');
          g.addColorStop(1, 'rgba(26,168,156,0.08)');
          return g;
        },
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#A7ADB3', font: { size: 12 } },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 32,
        ticks: {
          stepSize: 8,
          color: '#A7ADB3',
          font: { size: 12 },
          callback: (v) => `${v}억`,
        },
        grid: {
          color: '#E9ECEF',
          tickBorderDash: [6, 6],
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="relative h-61.25 w-full rounded-[26px] border border-hana-main bg-white px-2.5 pt-4.5 pb-3.5 shadow-sm">
      <div className="flex justify-between">
        <div className="font-hana-light text-[8px] leading-tight">
          NASDAQ + S&amp;P 500에
          <br />
          매월 20만원씩 20년 투자했을 경우
        </div>
        <div className="text-right">
          <div className="font-hana-light text-[8px]">만기 평가금액</div>
          <div className="font-hana-medium text-[13px] text-hana-main">
            2.94억원
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-23 right-0 left-0 text-center">
        <div className="font-hana-bold text-[16px] text-hana-red">
          약 6배 상승
        </div>
      </div>

      <div className="mt-3 h-41.25">
        <Line data={data} options={options} />
      </div>

      <div className="pointer-events-none absolute top-35 left-6.5 text-left">
        <div className="font-hana-light text-[8px]">투자 원금</div>
        <div className="font-hana-medium text-[13px] text-hana-main">
          4,860만원
        </div>
      </div>
    </div>
  );
}
