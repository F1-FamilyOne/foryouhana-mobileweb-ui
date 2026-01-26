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

export type KidGiftAmount = {
  name: string;
  giftamount: number;
};

type ModalAllChartProps = {
  onClose: () => void;
  kids: KidGiftAmount[];
};

const backgroundColor = [
  'rgb(30, 166, 152)',
  'rgb(255, 153, 153)',
  'rgb(255, 141, 40)',
  'rgb(255, 248, 214)',
];

export default function ModalAllChart({ onClose, kids }: ModalAllChartProps) {
  const [activeTab, setActiveTab] = useState<'ratio' | 'contribution'>('ratio');
  const totalGiftAmount: number = kids.reduce((acc, cur) => {
    return acc + cur.giftamount;
  }, 0);
  const data = {
    labels: kids.map((kid) => kid.name),
    datasets: [
      {
        label: '증여된 금액',
        data: kids.map((kid) => kid.giftamount),
        backgroundColor,
        hoverOffset: 5,
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="모달 닫기"
        className="absolute inset-0 bg-hana-main/30"
      ></button>

      <div className="relative w-88.25 rounded-3xl bg-white shadow-2xl">
        <div className="grid gap-3 p-4">
          <div className="flex items-center gap-3">
            <ChartPie className="text-hana-main" />
            <h1>전체통계</h1>
          </div>
          <div className="flex gap-3">
            <CustomButton
              preset={
                activeTab === 'ratio' ? 'maingreenshort' : 'lightgrayshort'
              }
              onClick={() => setActiveTab('ratio')}
            >
              자녀별 증여 비중
            </CustomButton>

            <CustomButton
              preset={
                activeTab === 'contribution'
                  ? 'maingreenshort'
                  : 'lightgrayshort'
              }
              onClick={() => setActiveTab('contribution')}
            >
              자녀별 수익 기여도
            </CustomButton>
          </div>
          <div className="flex h-24 w-fill flex-col justify-center gap-2 rounded-[14px] bg-hana-light-green p-4">
            <div className="text-hana-gray-600 text-sm">전체 증여 금액</div>
            <div className="text-hana-main">
              {totalGiftAmount.toLocaleString('ko-KR')}원
            </div>
          </div>
          <div className="flex h-66 w-fill items-center justify-center">
            <Pie data={data}></Pie>
          </div>
          <div>
            <ul>
              {data.labels.map((kid, idx) => {
                return (
                  <li key={kid}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span
                          style={{
                            color:
                              data.datasets[0].backgroundColor[
                                idx % backgroundColor.length
                              ],
                          }}
                        >
                          ●
                        </span>
                        {kid}
                      </div>
                      <div>
                        <div>
                          {data.datasets[0].data[idx].toLocaleString('ko-KR')}원
                        </div>
                        <div className="text-right text-hana-gray-600 text-xs">
                          {Math.round(
                            (data.datasets[0].data[idx] / totalGiftAmount) *
                              100,
                          )}{' '}
                          %
                        </div>
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
