'use client';

import { Check, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';

/**
 * @page: AI 맞춤 증여 플랜 결과
 * @description: AI 시나리오 챗봇 결과를 표시하는 조회 전용 페이지
 * @author: 권순범
 * @date: 2026-01-25
 */

// 데이터 영역 (나중에 API 연결 시 이 부분만 교체)
const planData = {
  // 자녀 정보
  birthDate: '2020년 1월 1일',
  age: 6,

  // 추천 플랜
  giftPeriodYears: 14,
  monthlyAmount: 50, // 만원 단위

  // 신청 상태
  hasAnnuity: true, // 유기정기금
  hasPensionFund: true, // 연금저축펀드
};

// 계산된 값
const totalAmount = planData.giftPeriodYears * 12 * planData.monthlyAmount;

export default function AnalysisResult() {
  const router = useRouter();

  return (
    <div className="h-full bg-white">
      {/* 헤더 */}
      <Header content="AI 맞춤 증여 플랜" />

      <div className="px-5 pt-4 pb-4">
        {/* 자녀 정보 카드 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">✏️</span>
            <span className="font-semibold text-[15px]">자녀 정보</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-gray-500">생년월일</span>
            <div className="text-right">
              <div className="font-medium text-[15px]">
                {planData.birthDate}
              </div>
              <div className="text-[13px] text-hana-main">
                현재 만 {planData.age}세
              </div>
            </div>
          </div>
        </div>

        {/* 추천 증여 플랜 */}
        <div className="mt-5">
          <h2 className="mb-2 font-semibold text-[16px]">추천 증여 플랜</h2>

          <div className="flex gap-3">
            {/* 증여 기간 */}
            <div className="flex-1">
              <p className="mb-1 text-[13px] text-gray-600">증여 기간</p>
              <div className="flex h-[70px] items-center justify-center rounded-xl bg-gray-100">
                <span className="font-bold text-[22px]">
                  {planData.giftPeriodYears}년
                </span>
              </div>
            </div>

            {/* 월 증여액 */}
            <div className="flex-1">
              <p className="mb-1 text-[13px] text-gray-600">월 증여액</p>
              <div className="flex h-[70px] items-center justify-center rounded-xl bg-gray-100">
                <span className="font-bold text-[22px]">
                  {planData.monthlyAmount}만원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 총 증여액 */}
        <div className="mt-4">
          <div className="mb-1 flex items-center gap-1">
            <span className="text-[13px] text-gray-600">총 증여액</span>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <div className="rounded-xl bg-hana-light-green p-4 text-center">
            <div className="font-bold text-[26px] text-hana-main">
              {totalAmount.toLocaleString()}만원
            </div>
            <div className="text-[13px] text-gray-600">
              {planData.giftPeriodYears}년 × 12개월 × {planData.monthlyAmount}
              만원
            </div>
          </div>
        </div>

        {/* 증여세 공제 안내 */}
        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          ※ 증여세 공제는 10년마다 새로 적용됩니다.
          <br />
          19세 미만은 2,000만원, 성인은 5,000만원까지 공제되며,
          <br />
          한도를 초과한 금액에는 증여세가 부과됩니다.
        </p>

        {/* 신청 상태 */}
        <div className="mt-5 flex gap-3">
          {/* 유기정기금 신청 */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-1">
              <span className="text-[13px] text-gray-600">유기정기금 신청</span>
              <Info className="h-3 w-3 text-gray-400" />
            </div>
            <div className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gray-100">
              <span className="text-[13px]">
                {planData.hasAnnuity ? '신청함' : '신청안함'}
              </span>
              {planData.hasAnnuity && (
                <Check className="h-4 w-4 text-hana-main" />
              )}
            </div>
          </div>

          {/* 연금저축펀드 신청 */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-1">
              <span className="text-[13px] text-gray-600">
                연금저축펀드 신청
              </span>
              <Info className="h-3 w-3 text-gray-400" />
            </div>
            <div className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gray-100">
              <span className="text-[13px]">
                {planData.hasPensionFund ? '신청함' : '신청안함'}
              </span>
              {planData.hasPensionFund && (
                <Check className="h-4 w-4 text-hana-main" />
              )}
            </div>
          </div>
        </div>

        {/* 절세 효과 안내 */}
        <p className="mt-3 text-[12px] text-gray-600">
          💡 절세 효과 외에도 펀드 운용을 통해 추가 수익을 기대할 수 있어요.
        </p>

        {/* 버튼 영역 */}
        <div className="mt-5 flex flex-col gap-2">
          <CustomButton
            preset="lightgraylong"
            onClick={() => router.push('/onboarding/edit')}
          >
            플랜 수정하기
          </CustomButton>

          <CustomButton
            preset="greenlong"
            onClick={() => router.push('/register/guide')}
          >
            다음
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
