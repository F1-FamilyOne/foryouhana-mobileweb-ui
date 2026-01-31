'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AgreeTermsWithNav } from '@/components/additional-fund/AgreeTermsWithNav';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';

/**
 * @page: 추가 펀드 가입 - 약관 동의
 * @description: 펀드 가입 전 약관 동의 페이지. 모든 약관에 동의해야 다음 단계로 진행.
 * @author: 권순범
 * @date: 2026-01-26
 */

/** 약관 항목 설정 */
const TERMS_CONFIG = {
  group1: [
    { id: 'financial-basic', content: '금융거래 기본약관' },
    { id: 'pension-savings', content: '연금저축 약관' },
    { id: 'collective-investment', content: '집합투자규약' },
    { id: 'investment-product', content: '투자성 상품 설명 확인' },
  ],
  group2: [{ id: 'hana-account', content: '하나통장 약관 및 필수확인사항' }],
} as const;

/** 초기 동의 상태 생성 */
const createInitialAgreements = (): Record<string, boolean> => {
  const agreements: Record<string, boolean> = {};
  for (const term of TERMS_CONFIG.group1) {
    agreements[term.id] = false;
  }
  for (const term of TERMS_CONFIG.group2) {
    agreements[term.id] = false;
  }
  return agreements;
};

export default function AdditionalFundTermsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const childId = params.childId as string;
  const fundId = searchParams.get('fundId');

  // 단일 상태 객체로 모든 약관 동의 상태 관리
  const [agreements, setAgreements] = useState<Record<string, boolean>>(
    createInitialAgreements,
  );

  const setAgreement = (termId: string, value: boolean) => {
    setAgreements((prev) => ({ ...prev, [termId]: value }));
  };

  const navigateToTerm = (termId: string) => {
    router.push(
      `/main/${childId}/additional-fund/terms/${termId}?fundId=${fundId}`,
    );
  };

  const group1Items = TERMS_CONFIG.group1.map((term) => ({
    content: term.content,
    checked: agreements[term.id],
    onCheckedChange: (value: boolean) => setAgreement(term.id, value),
    onNavigate: () => navigateToTerm(term.id),
  }));

  const group2Items = TERMS_CONFIG.group2.map((term) => ({
    content: term.content,
    checked: agreements[term.id],
    onCheckedChange: (value: boolean) => setAgreement(term.id, value),
    onNavigate: () => navigateToTerm(term.id),
  }));

  const allAgreed = Object.values(agreements).every(Boolean);

  const handleConfirm = () => {
    if (allAgreed) {
      router.push(`/main/${childId}/additional-fund/setup?fundId=${fundId}`);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <Header content="약관 동의하기" />

      <main className="flex flex-1 flex-col px-3">
        <h1 className="mt-6 font-bold text-[22px] text-hana-gray-800">
          약관에
          <br />
          동의해 주세요
        </h1>

        <div className="mt-6 flex flex-col gap-4">
          {/* 약관 그룹 1: 투자 관련 */}
          <AgreeTermsWithNav label="전체 동의" items={group1Items} />

          {/* 약관 그룹 2: 통장 약관 */}
          <AgreeTermsWithNav
            label="하나통장 약관 및 필수확인사항"
            items={group2Items}
            onLabelNavigate={() => navigateToTerm('hana-account')}
          />
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="flex shrink-0 flex-col gap-2 px-3 pb-4">
        <CustomButton
          preset="greenlong"
          onClick={handleConfirm}
          disabled={!allAgreed}
          className="h-[40px]"
        >
          확인
        </CustomButton>
      </div>
    </div>
  );
}
