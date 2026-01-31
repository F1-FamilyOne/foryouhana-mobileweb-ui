'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  childId: string;
  deposit: number; // 통장 잔액
  thisMonthAmount: number; // 이번 달 입금액
  monthlyMoney: bigint; // 증여 플랜에 따른 월 납입 금액
  onDetailClick?: () => void; // 상세 내역 클릭 이벤트
};

export default function ChildAccountInfoCard({
  childId,
  deposit = 0,
  monthlyMoney,
  thisMonthAmount = 0,
}: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-hana-gray-150 bg-white p-6 font-hana-cm shadow-sm">
      {/* 상단 타이틀 및 링크 */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 text-lg">자녀 증여용 입출금 통장</h3>
        <Link
          href={`/main/${childId}/timeline`}
          className="flex items-center font-medium text-hana-main text-sm transition-opacity hover:opacity-70"
        >
          입출금내역
          <ChevronRight size={16} className="ml-0.5" />
        </Link>
      </div>

      {/* 메인 잔액 표시 */}
      <div className="mt-1">
        <span className="font-bold text-3xl text-hana-main">
          {deposit.toLocaleString()}
        </span>
        <span className="ml-1 font-bold text-2xl text-hana-main">원</span>
      </div>

      {/* 이번 달 변동 내역 */}
      <div className="mt-1 flex items-center gap-1.5 font-medium text-gray-500 text-sm">
        <span>이번달</span>
        <span className="text-hana-main">
          +{thisMonthAmount.toLocaleString()}원
        </span>
      </div>

      {monthlyMoney < thisMonthAmount && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-orange-50 p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
          <p className="font-medium text-[13px] text-red-500 leading-relaxed">
            이번달 납입 금액이 증여플랜에서 설정한 월 납입예정 <br />
            금액을 초과했습니다. 예상치 못한 증여세가 부과될 수 있으니
            주의하세요.
          </p>
        </div>
      )}
    </div>
  );
}
