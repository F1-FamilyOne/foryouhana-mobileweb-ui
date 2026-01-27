'use client';

import { CircleDot } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getChild, setRandomInvestTypeForChild } from '@/actions/test.action';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: 투자성향 분석 완료
 * @description: 투자성향 분석 완료 페이지
 * @author: 승빈
 * @date: 2026-01-27
 */

const INVEST_MAP = {
  NOBASE: {
    label: '입문자형',
    assets: '정기예금 · 적립식 저축',
    tags: ['#차근차근', '#현금지킴이'],
  },
  DEFENSIVE: {
    label: '안정형',
    assets: '국공채 펀드 · 우량 채권',
    tags: ['#멘탈관리사', '#안전제일'],
  },
  OFFENSIVE: {
    label: '균형형',
    assets: '지수 ETF · 혼합형 펀드',
    tags: ['#성장가속도', '#밸런스천재'],
  },
  DOPAMINE: {
    label: '공격형',
    assets: '개별 성장주 · 레버리지 ETF',
    tags: ['#수익률풀배팅', '#도파민중독'],
  },
};

export default function InvestTestResult() {
  const params = useParams();
  const childId = Number(params.childId as string);
  const route = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [childName, setChildName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. 중복 실행 방지를 위한 Ref 선언
  const isInitialized = useRef(false);

  useEffect(() => {
    // 2. 이미 실행되었다면 바로 리턴 (Strict Mode 중복 호출 차단)
    if (isInitialized.current) return;

    const initAnalysis = async () => {
      try {
        // 실행 직후 true로 변경하여 다음 호출을 막음
        isInitialized.current = true;

        const [investType, childData] = await Promise.all([
          setRandomInvestTypeForChild(childId),
          getChild(childId),
        ]);

        setResult(investType);
        setChildName(childData?.name || '자녀');
        setTimeout(() => setIsVisible(true), 100);
      } catch (error) {
        console.error('Failed to load investment result:', error);
        // 에러 시 재시도가 필요하다면 다시 false로 바꿀 수도 있음
        isInitialized.current = false;
      }
    };

    if (childId) initAnalysis();

    // 스크롤 방지
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [childId]);

  const currentInvest = result
    ? INVEST_MAP[result as keyof typeof INVEST_MAP]
    : null;

  return (
    <>
      <Header content="자녀 펀드 만들기" />

      {/* 스크롤 절대 방지 컨테이너 */}
      <div className="relative w-full overflow-hidden bg-white">
        {/* translate 대신 고정 px 느낌으로 위치 고정 */}
        <main
          className={`flex w-full flex-col items-center px-6 transition-all duration-1000 ease-out ${
            isVisible ? 'pt-[60px] opacity-100' : 'pt-[80px] opacity-0'
          }`}
        >
          {/* 상단: 캐릭터 (쉐도우 유지) */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-6 h-28 w-28">
              <div className="-z-10 absolute inset-0 animate-pulse rounded-full bg-[#008485]/20 blur-[40px]" />
              <div className="absolute inset-0 rounded-[35px] bg-white shadow-[0_0_30px_rgba(0,132,133,0.15)] ring-1 ring-[#008485]/10" />
              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={IMAGES_PATH.AFTER_TEST}
                  width={75}
                  height={75}
                  alt="Status"
                  className="animate-subtle-float"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="mb-2 font-bold text-[#008485] text-[10px] uppercase tracking-[0.4em]">
                Propensity Analysis
              </p>
              <h1 className="font-light text-[26px] text-slate-900 leading-tight">
                {childName}님의 성향은 <br />
                <span className="font-extrabold text-[#008485]">
                  {currentInvest?.label || '분석 중'}
                </span>
              </h1>
            </div>

            <div className="mt-4 flex gap-2">
              {currentInvest?.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-100 bg-white px-3 py-1 font-bold text-[9px] text-slate-400 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 메인: 전략 카드 */}
          <div className="relative mb-10 w-full max-w-[340px] overflow-hidden rounded-[32px] bg-[#0f172a] p-8 shadow-2xl">
            <div className="-top-10 -right-10 absolute h-32 w-32 rounded-full bg-[#008485]/15 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDot className="text-[#008485]" size={12} />
                  <span className="font-bold text-[9px] text-slate-500 uppercase tracking-[0.2em]">
                    Strategy Report
                  </span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#008485]" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 font-bold text-[9px] text-slate-500 uppercase tracking-wider">
                    Recommended Asset
                  </p>
                  <p className="font-bold text-[22px] text-white tracking-tight">
                    {currentInvest?.assets}
                  </p>
                  <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#008485]/30 to-transparent" />
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed opacity-90">
                  AI 분석을 통해 도출된 {childName}님만을 위한 <br /> 장기
                  맞춤형 자산 운용 전략입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 버튼: 화면 하단에 너무 붙지 않게 여백 조절 */}
          <div className="w-full max-w-[340px]">
            <CustomButton
              preset="greenlong"
              className="mt-5 h-[56px] w-full font-hana-cm text-[18px] shadow-lg hover:cursor-pointer"
              onClick={() => route.push('/main/product-list')}
            >
              펀드 투자상품 보러가기
            </CustomButton>
          </div>
        </main>

        <style jsx global>{`
          /* 스크롤바 강제 제거 */

          @keyframes subtle-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .animate-subtle-float { animation: subtle-float 5s ease-in-out infinite; }
        `}</style>
      </div>
    </>
  );
}
