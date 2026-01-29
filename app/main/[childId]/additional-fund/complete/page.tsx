'use client';

import { CircleCheck } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';

/**
 * @page: 추가 펀드 가입 - 가입 완료 (Stub)
 * @description: 펀드 가입 완료 페이지. 계좌번호 표시 및 홈 이동.
 * @author: 권순범
 * @date: 2026-01-26
 */

export default function AdditionalFundCompletePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const childId = params.childId as string;
  const accountNumber = searchParams.get('accountNumber');

  const handleGoHome = () => {
    router.push(`/main/${childId}/home`);
  };

  return (
    <div className="h-full bg-white">
      <Header content="가입 완료" />

      <main className="flex flex-1 flex-col items-center justify-center px-3">
        <div className="flex flex-col items-center text-center">
          <CircleCheck className="h-16 w-16 text-hana-main" />

          <h1 className="mt-6 font-bold text-[24px] text-hana-gray-800">
            가입 완료
          </h1>

          <p className="mt-3 text-[16px] text-hana-gray-600">
            펀드 계좌가 성공적으로 개설되었습니다.
          </p>

          {accountNumber && (
            <div className="mt-6 rounded-[10px] bg-hana-gray-100 px-6 py-4">
              <p className="text-[12px] text-hana-gray-500">계좌번호</p>
              <p className="mt-1 font-bold text-[18px] text-hana-gray-800">
                {accountNumber}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="mt-auto flex justify-center pb-6">
        <CustomButton preset="greenlong" onClick={handleGoHome}>
          홈으로
        </CustomButton>
      </div>
    </div>
  );
}
