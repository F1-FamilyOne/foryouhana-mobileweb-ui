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
    <div className="flex h-full flex-col bg-white">
      <Header content={title} />

      <main className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="font-hana-bold text-[18px] text-hana-gray-800">
          {title}
        </h2>
        <div className="mt-4 flex flex-col gap-5 font-hana-regular text-[14px] text-hana-gray-600 leading-relaxed">
          <section>
            <h3 className="font-hana-medium text-[15px] text-hana-gray-800">
              제1조 (목적)
            </h3>
            <p className="mt-1">
              이 약관은 주식회사 하나은행(이하 &quot;은행&quot;)이 제공하는
              금융투자상품 거래 서비스의 이용조건 및 절차에 관한 기본적인 사항을
              정함을 목적으로 합니다.
            </p>
          </section>
          <section>
            <h3 className="font-hana-medium text-[15px] text-hana-gray-800">
              제2조 (정의)
            </h3>
            <p className="mt-1">
              ① &quot;금융투자상품&quot;이란 이익을 얻거나 손실을 회피할
              목적으로 현재 또는 장래의 특정 시점에 금전 등을 지급하기로
              약정함으로써 취득하는 권리를 말합니다.
            </p>
            <p className="mt-1">
              ② &quot;투자자&quot;란 은행과 금융투자상품의 매매 및 기타 거래를
              하기 위하여 계좌를 개설한 고객을 말합니다.
            </p>
          </section>
          <section>
            <h3 className="font-hana-medium text-[15px] text-hana-gray-800">
              제3조 (약관의 효력 및 변경)
            </h3>
            <p className="mt-1">
              ① 이 약관은 투자자가 약관의 내용에 동의하고 은행이 승낙함으로써
              효력이 발생합니다.
            </p>
            <p className="mt-1">
              ② 은행이 약관을 변경하는 경우 변경 내용을 변경되는 약관의 시행일
              1개월 전에 고객에게 통지합니다.
            </p>
          </section>
          <section>
            <h3 className="font-hana-medium text-[15px] text-hana-gray-800">
              제4조 (계좌의 개설)
            </h3>
            <p className="mt-1">
              ① 투자자가 금융투자상품을 거래하고자 할 때에는 은행에 계좌를
              개설하여야 합니다.
            </p>
            <p className="mt-1">
              ② 계좌 개설 시 투자자는 실명 확인이 가능한 신분증을 제시하여야
              합니다.
            </p>
          </section>
          <section>
            <h3 className="font-hana-medium text-[15px] text-hana-gray-800">
              제5조 (면책사항)
            </h3>
            <p className="mt-1">
              은행은 천재지변, 전시, 사변 또는 이에 준하는 불가항력으로 인하여
              서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
              면제됩니다.
            </p>
          </section>
        </div>
        <p className="mt-6 text-center text-[12px] text-hana-gray-400">
          본 내용은 예시이며, 실제 약관 내용은 추후 반영됩니다.
        </p>
      </main>

      <div className="flex justify-center pb-6">
        <CustomButton preset="greenlong" onClick={() => router.back()}>
          돌아가기
        </CustomButton>
      </div>
    </div>
  );
}
