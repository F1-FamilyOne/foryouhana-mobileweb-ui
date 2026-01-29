'use client';

import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { MyFundCard } from '@/components/cmm/MyFundCard';
import AvgAccCard from '../cmm/AvgAccCard';

type FundItem = {
  paymentType: 'regular' | 'irregular';
  rate: number;
  title: string;
  plusMoney: number;
  deposit: number;
  autoTransferAmount: number;
  totalValue: number;
};

type Props = {
  childId: number;
  fundList: FundItem[];
};

export default function ChildFundSection({ childId, fundList }: Props) {
  // --- [계산 로직 시작] ---
  const hasFunds = fundList.length > 0;

  // 1. 평균 수익금 계산 (수익금 합계 / 펀드 개수)
  const avgPlusMoney = hasFunds
    ? fundList.reduce((acc, cur) => acc + cur.plusMoney, 0) / fundList.length
    : 0;

  // 2. 평균 수익률 계산 (산술 평균)
  const avgRate = hasFunds
    ? fundList.reduce((acc, cur) => acc + cur.rate, 0) / fundList.length
    : 0;

  // 3. 포맷팅
  const formattedPlusMoney = `${avgPlusMoney >= 0 ? '+' : ''}${Math.floor(avgPlusMoney).toLocaleString()}원`;
  const formattedRate = `${avgRate >= 0 ? '+' : ''}${avgRate.toFixed(2)}%`;
  // --- [계산 로직 끝] ---

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-gray-100 bg-white p-6 font-hana-cm shadow-sm">
      <div className="flex flex-col gap-4">
        {/* 상단 헤더 영역 */}
        <div className="flex items-center justify-between">
          <h2 className="font-hana-light-bold text-gray-800 text-lg">
            투자 중인 펀드
          </h2>
          <Link
            href={`/main/${childId}/my-product`}
            className="flex items-center gap-0.5 font-medium text-hana-text-bold-green text-sm transition-colors hover:text-gray-600"
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* 펀드 리스트 */}
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col gap-3">
            {fundList.map((fund) => (
              <MyFundCard
                key={fund.title}
                paymentType={fund.paymentType}
                rate={fund.rate}
                title={fund.title}
                amountEok={fund.totalValue.toLocaleString()}
                monthlyAmountWon={fund.autoTransferAmount.toLocaleString()}
              />
            ))}
          </div>

          {!hasFunds && (
            <p className="py-10 text-center text-gray-400 text-sm">
              투자 중인 상품이 없습니다.
              <br />
              새로운 펀드를 시작해보세요!
            </p>
          )}
          {/* 
          <Link
            href={`/main/product-list`}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-hana-pastel-green py-2.5 font-bold text-gray-600 text-sm transition-colors hover:bg-hana-pastel-mint"
          >
            <Plus size={18} className="text-gray-500" />새 상품 가입하기
          </Link> */}
        </div>

        {/* 펀드 통계 섹션: 펀드가 있을 때만 노출 */}
        {hasFunds && (
          <>
            <div className="mt-2 flex flex-col gap-3">
              <h2 className="font-hana-light-bold text-gray-800 text-lg">
                펀드 통계
              </h2>
              <div className="flex gap-3">
                <AvgAccCard title="평균 수익금" value={formattedPlusMoney} />
                <AvgAccCard
                  title="평균 수익률"
                  value={formattedRate}
                  subText="원금 대비 수익률"
                />
              </div>
            </div>

            {/* 하단 안내 문구 */}
            <div className="mt-2 flex flex-col items-center gap-1 text-center text-[10px] text-gray-400 leading-relaxed">
              <p>* 위 통계는 현재 운용 중인 펀드에 대한 통계입니다.</p>
              <p>* 수익률은 과거 실적이며 미래 수익을 보장하지 않습니다.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
