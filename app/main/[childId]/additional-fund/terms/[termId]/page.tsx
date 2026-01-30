'use client';

import { useParams, useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';

/**
 * @page: 약관 상세 페이지 (Stub)
 * @description: 개별 약관 내용 표시 페이지. 현재는 stub으로 구현.
 * @author: 권순범
 * @date: 2026-01-27
 */

const TERM_TITLES: Record<string, string> = {
  'financial-basic': '금융거래 기본약관',
  'pension-savings': '연금저축 약관',
  'collective-investment': '집합투자규약',
  'investment-product': '투자성 상품 설명 확인',
  'hana-account': '하나통장 약관 및 필수확인사항',
};

export default function TermDetailPage() {
  const router = useRouter();
  const params = useParams();
  const termId = params.termId as string;

  const title = TERM_TITLES[termId] || '약관';

  return (
    <div className="h-full bg-white">
      <Header content={title} />

      <main className="flex flex-1 flex-col items-center justify-center px-3">
        <p className="text-center text-[16px] text-hana-gray-500">
          {title} 내용이 여기에 표시됩니다.
        </p>
        <p className="mt-2 text-center text-[14px] text-hana-gray-400">
          (Stub 페이지)
        </p>
      </main>

      <div className="mt-auto flex justify-center pb-6">
        <CustomButton preset="greenlong" onClick={() => router.back()}>
          돌아가기
        </CustomButton>
      </div>
    </div>
  );
}
