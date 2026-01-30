'use client';

/**
 * @page: SetupForm
 * @description: 추가 펀드 가입 - 납입 설정 폼 (클라이언트 컴포넌트)
 * @author: 권순범
 * @date: 2026-01-27
 */

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createFundAccount } from '@/actions/additional-fund';
import { CustomButton } from '@/components/cmm/CustomButton';
import type { fund_saving_type } from '@/lib/generated/prisma/client';
import { formatWon } from '@/lib/utils';
import { InputAmountFlex } from './InputAmountFlex';
import { InputDayFlex } from './InputDayFlex';
import { InputMonth } from './InputMonth';
import { InputYear } from './InputYear';
import { InvestTypeToggle } from './InvestTypeToggle';

type InvestType = 'REGULAR' | 'FREE';

type SetupFormProps = {
  childId: number;
  fundId: number;
  fundSavingType: fund_saving_type;
  depositAccountId: number;
};

// fund.saving_type에서 허용된 투자 타입 추출
function getAllowedTypes(savingType: fund_saving_type): InvestType[] {
  switch (savingType) {
    case 'BOTH':
      return ['REGULAR', 'FREE'];
    case 'REGULAR':
      return ['REGULAR'];
    case 'FREE':
      return ['FREE'];
    default:
      return ['REGULAR', 'FREE'];
  }
}

export function SetupForm({
  childId,
  fundId,
  fundSavingType,
  depositAccountId,
}: SetupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 초기 투자 타입 설정
  const allowedTypes = getAllowedTypes(fundSavingType);
  const initialInvestType =
    !allowedTypes.includes('REGULAR') && allowedTypes.includes('FREE')
      ? 'FREE'
      : 'REGULAR';

  // 폼 상태
  const [investType, setInvestType] = useState<InvestType>(initialInvestType);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 기간은 개월 단위로 통합 관리 (정기/자유 전환 시 동기화)
  const [totalMonths, setTotalMonths] = useState<number | undefined>(108);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(50);
  const [transferDay, setTransferDay] = useState<number | undefined>(25);

  // 정기적립식용 년 단위 변환 (표시용)
  const displayYears =
    totalMonths !== undefined ? Math.floor(totalMonths / 12) : undefined;

  // 년 단위 입력 핸들러 (개월로 변환하여 저장)
  const handleYearChange = (years: number | undefined) => {
    setTotalMonths(years !== undefined ? years * 12 : undefined);
  };

  // 총 납입액 계산 (정기적립식)
  const totalPayment =
    investType === 'REGULAR' && displayYears && monthlyAmount
      ? displayYears * 12 * monthlyAmount
      : 0;

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    // 기존 에러 초기화
    setErrorMessage(null);

    if (totalMonths === undefined) {
      setErrorMessage('납입 기간을 선택해주세요.');
      return;
    }

    if (investType === 'REGULAR' && (!monthlyAmount || !transferDay)) {
      setErrorMessage('납입 금액과 납입일을 입력해주세요.');
      return;
    }

    startTransition(async () => {
      const result = await createFundAccount({
        childId,
        fundId,
        depositAccountId,
        investType,
        months: totalMonths,
        monthlyAmount: investType === 'REGULAR' ? monthlyAmount : undefined,
        transferDay: investType === 'REGULAR' ? transferDay : undefined,
      });

      if (result.success) {
        router.replace(
          `/main/${childId}/additional-fund/complete?accountNumber=${result.accountNumber}`,
        );
      } else {
        setErrorMessage(result.error || '펀드 가입에 실패했습니다.');
      }
    });
  };

  const isFormValid =
    investType === 'REGULAR'
      ? totalMonths && monthlyAmount && transferDay
      : totalMonths;

  return (
    <div className="flex h-[calc(100%-65px-12px)] flex-col">
      <main className="flex-1 px-3">
        <h1 className="mt-4 font-bold text-[18px] text-hana-gray-800">
          납입 금액과 기간을 설정해 주세요
        </h1>

        {/* 설정 카드 - 정기적립식 기준 고정 높이 */}
        <div className="mt-4 h-[388px] rounded-[15px] bg-hana-gray-100 p-4">
          {/* 납입 방식 */}
          <div className="mb-4">
            <p className="mb-3 font-medium text-[14px] text-hana-gray-700">
              납입 방식
            </p>
            <InvestTypeToggle
              value={investType}
              onChange={setInvestType}
              allowedTypes={allowedTypes}
            />
          </div>

          {investType === 'REGULAR' ? (
            <>
              {/* 정기적립식: 2열 배치 */}
              <div className="mb-4 flex gap-3">
                <InputYear
                  value={displayYears}
                  onChange={handleYearChange}
                  label="납입 기간"
                />
                <InputAmountFlex
                  value={monthlyAmount}
                  onChange={setMonthlyAmount}
                  label="월 납입액"
                />
              </div>

              {/* 월 납입일 */}
              <div className="mb-4">
                <p className="mb-2 text-[14px] text-hana-gray-600">월 납입일</p>
                <InputDayFlex value={transferDay} onChange={setTransferDay} />
              </div>

              {/* 총 납입액 */}
              <div className="mb-2 border-hana-gray-300 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-hana-gray-600">
                    총 납입액
                  </span>
                  <span className="font-bold text-[20px] text-hana-main">
                    {formatWon(totalPayment)}만원
                  </span>
                </div>
                {displayYears && monthlyAmount ? (
                  <p className="mt-1 text-right text-[12px] text-hana-gray-500">
                    {displayYears}년 x 12개월 x {formatWon(monthlyAmount)}만원
                  </p>
                ) : null}
              </div>

              {/* 증여세 안내 */}
              <p className="mt-2 text-[11px] text-hana-gray-500 leading-relaxed">
                ※ 증여세 공제는 10년마다 새로 적용돼요.
                <br />
                19세 미만은 2,000만원, 성인은 5,000만원까지 공제되며, 한도를
                초과한 금액에는 증여세가 부과됩니다.
              </p>
            </>
          ) : (
            <>
              {/* 자유적립식: 납입기간(개월) */}
              <div className="mb-4">
                <InputMonth
                  value={totalMonths}
                  onChange={setTotalMonths}
                  label="납입 기간"
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="flex shrink-0 flex-col gap-2 px-3 pb-4">
        {errorMessage && (
          <p className="text-center text-[14px] text-red-500">{errorMessage}</p>
        )}
        <CustomButton
          preset="graylong"
          onClick={handleBack}
          className="h-[40px]"
        >
          돌아가기
        </CustomButton>
        <CustomButton
          preset="greenlong"
          onClick={handleSubmit}
          disabled={!isFormValid || isPending}
          className="h-[40px]"
        >
          {isPending ? '처리 중...' : '상품 가입하기'}
        </CustomButton>
      </div>
    </div>
  );
}
