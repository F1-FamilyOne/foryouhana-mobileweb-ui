'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';

/**
 * @page: 추가 펀드 가입 - 펀드 상세 (Stub)
 * @description: 펀드 상세 정보 표시. 최소 UI로 구현. 추후 확장 예정.
 * @author: 권순범
 * @date: 2026-01-26
 */

export default function AdditionalFundDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const childId = params.childId as string;
  const fundId = searchParams.get('fundId');

  const handleJoin = () => {
    router.push(`/main/${childId}/additional-fund/terms?fundId=${fundId}`);
  };

  return (
    <div className="h-full bg-white">
      <Header content="펀드 상세" />

      <main className="flex flex-1 flex-col items-center justify-center px-3">
        <div className="text-center">
          <p className="text-[16px] text-hana-gray-600">펀드 ID: {fundId}</p>
          <p className="mt-2 text-[14px] text-hana-gray-500">
            펀드 상세 정보가 표시됩니다.
          </p>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="mt-auto flex justify-center pb-6">
        <CustomButton preset="greenlong" onClick={handleJoin}>
          가입하기
        </CustomButton>
      </div>
    </div>
  );
}
