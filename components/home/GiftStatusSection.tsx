'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AccGiftCard from '../cmm//AccGiftCard';
import { CustomMoneyProgress } from '../cmm/CustomMoneyProgress';

type Props = {
  accumulatedAmount: number; // 연저펀, 또는 펀드 납입 금액
  bornDate: Date;
  isPromiseFixed: boolean;
};

export default function GiftStatusSection({
  accumulatedAmount,
  bornDate,
  isPromiseFixed,
}: Props) {
  // 1. 비과세 한도 설정  const FREE_LIMIT = age >= 19 ? 50000000 : 20000000;
  const calculateFullAge = (birth: Date | string) => {
    const today = new Date();
    const birthDate = new Date(birth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // 생일이 지나지 않았으면 1살을 뺌
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateFullAge(bornDate);
  const FREE_LIMIT = age >= 19 ? 50000000 : 20000000;
  const isExceeded = accumulatedAmount > FREE_LIMIT;
  const remainingAmount = isExceeded ? 0 : FREE_LIMIT - accumulatedAmount;
  const exceededAmount = isExceeded ? accumulatedAmount - FREE_LIMIT : 0;

  const description = isPromiseFixed
    ? `* 자녀 증여용 계좌에 정기 이체를 설정한 계좌의 입금 내역만 반영한 결과입니다.`
    : `* 이 증여액은 지난 10년 동안의 증여액만 반영했습니다.`;
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-hana-gray-150 bg-white p-6 font-hana-cm shadow-sm">
      {/* 헤더 영역 */}
      <div className="mb-6 flex items-center justify-between">
        {isPromiseFixed ? (
          <h2 className="font-bold text-gray-800 text-lg">유기정기금 현황</h2>
        ) : (
          <h2 className="font-bold text-gray-800 text-lg">증여 현황</h2>
        )}

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

        {isPromiseFixed ? (
          <AccGiftCard
            title={isExceeded ? '목표금액 초과' : '목표금액 도달까지'}
            value={
              isExceeded
                ? `${exceededAmount.toLocaleString()}원`
                : `${remainingAmount.toLocaleString()}원`
            }
          />
        ) : (
          <AccGiftCard
            title={isExceeded ? '공제 초과금액' : '공제 한도까지'}
            value={
              isExceeded
                ? `${exceededAmount.toLocaleString()}원`
                : `${remainingAmount.toLocaleString()}원`
            }
          />
        )}
      </div>

      {/* 프로그레스 바 영역 */}
      <div className="mb-6">
        <CustomMoneyProgress current={accumulatedAmount} total={FREE_LIMIT} />
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-[12px] text-hana-gray-500">
        {description}
      </p>
    </div>
  );
}
