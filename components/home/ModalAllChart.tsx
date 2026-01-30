'use client';

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { ChartPie } from 'lucide-react';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { CustomButton } from '../cmm/CustomButton';

/**
 * @page: ModalAllChart
 * @description: 홈화면에 전체 통계 버튼 눌렀을 때 나오는 증여 전체 통계 모달입니다.
 * @author: 이정수
 * @date: 2026-01-24
 */

ChartJS.register(ArcElement, Tooltip, Legend);

export type KidFundAmount = {
  name: string;
  depositAmount: number;
  profitAmount: number;
};

type ModalAllChartProps = {
  onClose: () => void;
  kids: KidFundAmount[];
};

const backgroundColor = [
  'rgb(30, 166, 152)',
  'rgb(255, 153, 153)',
  'rgb(255, 141, 40)',
  'rgb(255, 248, 214)',
];

export default function ModalAllChart({ onClose, kids }: ModalAllChartProps) {
  const [activeTab, setActiveTab] = useState<'ratio' | 'contribution'>('ratio');

  // 전체 금액 합산
  const totalDepositAmount: number = kids.reduce(
    (acc, cur) => acc + cur.depositAmount,
    0,
  );
  const totalProfitAmount: number = kids.reduce(
    (acc, cur) => acc + cur.profitAmount,
    0,
  );

  // 파이 차트 데이터 설정
  const chartData = {
    labels: kids.map((kid) => kid.name),
    datasets: [
      {
        data:
          activeTab === 'ratio'
            ? kids.map((kid) => kid.depositAmount)
            : kids.map((kid) => kid.profitAmount),
        backgroundColor,
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 하단 리스트가 있으므로 범례는 숨겼소.
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="모달 닫기"
        className="absolute inset-0 bg-hana-main/30"
      ></button>

      <div className="relative w-88.25 overflow-hidden rounded-3xl bg-white font-hana-cm shadow-2xl">
        <div className="grid gap-4 p-6">
          {/* 헤더 */}
          <div className="flex items-center gap-3">
            <ChartPie className="text-hana-main" />
            <h1 className="font-bold text-hana-black text-xl">
              펀드 현황 통계
            </h1>
          </div>

          {/* 탭 버튼 */}
          <div className="flex gap-2">
            <CustomButton
              preset={
                activeTab === 'ratio' ? 'maingreenshort' : 'lightgrayshort'
              }
              onClick={() => setActiveTab('ratio')}
            >
              펀드 납입액
            </CustomButton>
            <CustomButton
              preset={
                activeTab === 'contribution'
                  ? 'maingreenshort'
                  : 'lightgrayshort'
              }
              onClick={() => setActiveTab('contribution')}
            >
              펀드 수익금
            </CustomButton>
          </div>

          {/* 요약 카드 영역 */}
          <div
            className={`flex h-24 w-full flex-col justify-center gap-1 rounded-2xl p-4 transition-colors ${
              activeTab === 'ratio' ? 'bg-hana-light-green' : 'bg-[#FDF2F8]'
            }`}
          >
            <div className="font-medium text-hana-gray-600 text-sm">
              {activeTab === 'ratio' ? '전체 납입 금액' : '전체 수익 금액'}
            </div>
            <div
              className={`font-bold text-2xl ${
                activeTab === 'ratio' ? 'text-hana-main' : 'text-[#D61F69]'
              }`}
            >
              {activeTab === 'ratio'
                ? `${totalDepositAmount.toLocaleString()}원`
                : `${totalProfitAmount.toLocaleString()}원`}
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="relative flex h-56 w-full items-center justify-center py-2">
            <Pie data={chartData} options={chartOptions} />
          </div>

          {/* 하단 리스트 영역 */}
          <div className="max-h-44 overflow-y-auto pr-1">
            <ul className="grid gap-4">
              {kids.map((kid, idx) => {
                const currentVal =
                  activeTab === 'ratio' ? kid.depositAmount : kid.profitAmount;
                const totalVal =
                  activeTab === 'ratio'
                    ? totalDepositAmount
                    : totalProfitAmount;
                const percentage =
                  totalVal > 0 ? Math.round((currentVal / totalVal) * 100) : 0;

                return (
                  <li
                    key={kid.name}
                    className="flex items-center justify-between text-[15px]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full shadow-sm"
                        style={{
                          backgroundColor:
                            backgroundColor[idx % backgroundColor.length],
                        }}
                      ></span>
                      <span className="font-medium text-hana-black">
                        {kid.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-hana-black">
                        {currentVal.toLocaleString()}원
                      </div>
                      <div className="mt-0.5 text-hana-gray-500 text-xs">
                        {percentage}%
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
