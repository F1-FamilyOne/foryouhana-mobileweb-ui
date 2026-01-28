'use client';

import { ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import AccGiftCard from '../cmm//AccGiftCard';
import { CustomMoneyProgress } from '../cmm/CustomMoneyProgress';

type Props = {
  accumulatedAmount: number; // 연저펀, 또는 펀드 납입 금액 
};

export default function GiftStatusSection({ accumulatedAmount }: Props) {
  // 1. 세율 구간 로직 정의 (비과세 한도 2천만 원 기준)
  const FREE_LIMIT = 20000000;

  // 현재 적용 세율 및 다음 구간 계산
  let currentTaxRate = 0;
  let nextLimit = FREE_LIMIT;
  let description = '20,000,000원 초과 시 10% 세율로 변경됩니다';

  if (accumulatedAmount <= FREE_LIMIT) {
    currentTaxRate = 0;
    nextLimit = FREE_LIMIT;
    description = '20,000,000원 초과 시 10% 세율로 변경됩니다';
  } else {
    // 2천만 원 초과 시 로직 (필요 시 더 확장 가능하오)
    currentTaxRate = 10;
    nextLimit = 120000000; // 공제액 2천 + 1억 구간
    description = '1억 2천만 원 초과 시 20% 세율로 변경됩니다';
  }

  const remainingAmount = Math.max(nextLimit - accumulatedAmount, 0);

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-hana-gray-150 bg-white p-6 font-hana-cm shadow-sm">
      {/* 헤더 영역 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-bold text-gray-800 text-lg">증여 현황</h2>
        <Link
          href="https://www.hometax.go.kr"
          target="_blank"
          className="flex items-center gap-1 text-[13px] text-hana-main"
        >
          {/* 홈택스 아이콘 경로 확인 필요 */}
          홈택스 신고하러가기
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* 카드 영역 */}
      <div className="mb-6 flex gap-4">
        <AccGiftCard
          title="누적 증여액"
          value={`${accumulatedAmount.toLocaleString()}원`}
          highlight={true}
        />
        <AccGiftCard
          title="세율 변경까지"
          value={`${remainingAmount.toLocaleString()}원`}
        />
      </div>

      {/* 프로그레스 바 영역 */}
      <div className="mb-6">
        <CustomMoneyProgress current={accumulatedAmount} total={nextLimit} />
      </div>

      {/* 세율 알림 영역 */}
      <div className="mb-2 flex items-center justify-between rounded-2xl bg-hana-badge-yellow p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-hana-orange/20">
            <Info size={14} className="text-hana-badge-orange" />
          </div>
          <span className="font-medium text-[15px] text-hana-dark-navy">
            현재 적용 세율
          </span>
        </div>
        <span className="text-2xl text-hana-badge-orange">
          {currentTaxRate}%
        </span>
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-[12px] text-hana-gray-500">
        {description}
      </p>
    </div>
  );
}
