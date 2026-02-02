'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

type Props = {
  childId: string;
  deposit: number;
  thisMonthAmount: number;
  monthlyMoney: bigint;
  accountNum: string;
  onDetailClick?: () => void;
};

export default function ChildAccountInfoCard({
  childId,
  deposit = 0,
  monthlyMoney,
  thisMonthAmount = 0,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-hana-gray-150 bg-white p-6 font-hana-cm shadow-sm">
      {/* 상단 계좌 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">하나 123-456789-01234</span>

          <Button
            title="복사"
            onClick={() => navigator.clipboard.writeText('123-456789-01234')}
            className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600 text-xs transition hover:bg-gray-200 active:scale-95"
          >
            복사
          </Button>
        </div>

        <Link
          href={`/main/${childId}/timeline`}
          className="flex items-center font-medium text-hana-main text-sm transition-opacity hover:opacity-70"
        >
          입출금내역
          <ChevronRight size={16} className="ml-0.5" />
        </Link>
      </div>

      {/* 통장 이름 */}
      <h3 className="text-gray-800 text-lg">자녀 증여용 입출금 통장</h3>

      {/* 잔액 */}
      <div className="flex items-end gap-1">
        <span className="font-bold text-3xl text-hana-main">
          {deposit.toLocaleString()}
        </span>
        <span className="font-bold text-2xl text-hana-main">원</span>
      </div>

      {/* 이번 달 변동 */}
      <div className="flex items-center gap-2 font-medium text-gray-500 text-sm">
        <span>이번달</span>
        <span className="text-hana-main">
          +{thisMonthAmount.toLocaleString()}원
        </span>
      </div>

      {/* 지원 요청 버튼 */}
      <Button
        title="지원 요청 버튼"
        onClick={() => {}}
        className="w-fit rounded-full border border-hana-main px-4 py-1 font-bold text-[12px] text-hana-main transition hover:bg-hana-main hover:text-white"
      >
        지원 요청
      </Button>

      {/* 경고 메시지 */}
      {monthlyMoney < thisMonthAmount && (
        <div className="flex items-start gap-2 rounded-xl bg-orange-50 p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
          <p className="font-medium text-[13px] text-red-500 leading-relaxed">
            이번 달 납입 금액이 증여 플랜에서 설정한 월 납입 예정 금액을
            초과했습니다.
            <br />
            예상치 못한 증여세가 부과될 수 있으니 주의하세요.
          </p>
        </div>
      )}
    </div>
  );
}
