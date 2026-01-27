'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/cmm/Header';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: 투자성향 분석중
 * @description: 투자성향 분석 로딩화면
 * @author: 승빈
 * @date: 2026-01-27
 */

const STEPS = [
  { icon: '🌱', text: '우리 아이의 소중한 성향을\n세심하게 살펴보고 있어요' },
  { icon: '📊', text: '더 나은 미래를 위해\n데이터를 꼼꼼히 비교 중이에요' },
  { icon: '💖', text: '부모님의 사랑을 담아\n한 발자국 씩 모아가요' },
  { icon: '🎁', text: '거의 다 됐어요!\n아이를 위한 선물이 완성되어 가요' },
];

const TOTAL_DURATION = 8000;

export default function InvestTestAnalysis() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const ratio = Math.min(elapsed / TOTAL_DURATION, 1);

      const elasticProgress =
        ratio < 0.25
          ? ratio * 140
          : ratio < 0.5
            ? 35 + (ratio - 0.25) * 40
            : ratio < 0.75
              ? 45 + (ratio - 0.5) * 160
              : 85 + (ratio - 0.75) * 60;

      const safeProgress = Math.min(elasticProgress, 100);
      setProgress(safeProgress);

      const nextStepIndex =
        safeProgress >= 85
          ? 3
          : safeProgress >= 50
            ? 2
            : safeProgress >= 25
              ? 1
              : 0;
      setStepIndex(nextStepIndex);

      if (elapsed < TOTAL_DURATION) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (childId) {
        router.push(`/main/${childId}/beforeJoin/test-result`);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [childId, router]);

  if (!mounted) return <Header content="자녀 펀드 만들기" />;

  const currentStep = STEPS[stepIndex];

  return (
    <div className="-m-3 relative flex h-[calc(100%+24px)] flex-col overflow-hidden bg-white">
      {/* 1. 헤더 */}
      <div className="-mb-3 relative z-20 px-3 pt-3">
        <Header content="자녀 펀드 만들기" />
      </div>

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        {/* 오로라 텍스처와 플로팅 아이콘 */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* 몽환적인 메인 광채  */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-hana-pastel-mint/30 via-blue-50/20 to-hana-badge-green/20 blur-[120px]" />
          <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] animate-pulse rounded-full bg-blue-100/30 blur-[100px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-[250px] w-[250px] animate-pulse rounded-full bg-hana-pastel-mint/20 blur-[80px] [animation-delay:2s]" />

          {/* 플로팅 데코 아이콘들  */}
          <div className="absolute top-[15%] left-[15%] animate-float text-4xl opacity-20 blur-[1px] [animation-duration:4s]">
            📈
          </div>
          <div className="absolute top-[20%] right-[10%] animate-float text-3xl opacity-15 blur-[2px] [animation-delay:1s] [animation-duration:6s]">
            💸
          </div>
          <div className="absolute bottom-[25%] left-[10%] animate-float text-2xl opacity-20 blur-[1px] [animation-delay:0.5s] [animation-duration:5s]">
            📊
          </div>
          <div className="absolute right-[20%] bottom-[15%] animate-float text-4xl opacity-10 blur-[3px] [animation-duration:7s]">
            💎
          </div>
        </div>

        {/* 📦 컨텐츠 레이어 */}
        <div className="relative z-10 flex w-full flex-col items-center px-6">
          {/* 캐릭터 영역: 유리질(Glassmorphism) 효과 강화 */}
          <div className="relative mb-6 flex h-[240px] w-[240px] items-center justify-center">
            {/* 이중 후광 플레이트 */}
            <div className="absolute h-60 w-60 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute h-56 w-56 rounded-full border-2 border-white/60 bg-white/40 shadow-[0_25px_50px_rgba(0,0,0,0.04)] backdrop-blur-[10px]" />

            <div className="relative z-10 h-[175px] w-[175px] animate-float">
              <Image
                src={IMAGES_PATH.STARDOLL_3D}
                alt="character"
                fill
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                priority
              />
            </div>
            {/* 캐릭터 하단 그림자: 더 부드럽게 */}
            <div className="-translate-x-1/2 absolute bottom-6 left-1/2 h-4 w-28 animate-shadow-scale rounded-[100%] bg-black/5 blur-[10px]" />
          </div>

          {/* 메시지 영역: 카드 형태의 배경 살짝 추가 */}
          <div className="mb-10 flex h-[160px] flex-col items-center justify-center text-center font-hana-regular">
            <div
              key={stepIndex}
              className="flex animate-fade-slide-up flex-col items-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] border border-white bg-white/80 text-4xl shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-sm">
                {currentStep.icon}
              </div>
              <h2 className="whitespace-pre-line font-bold text-[21px] text-gray-800 leading-tight tracking-tight">
                {currentStep.text}
              </h2>

              <div className="mt-6 flex items-center gap-2 rounded-full border border-hana-main/10 bg-hana-main/5 px-4 py-1.5">
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hana-main" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hana-main [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hana-main [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>

          {/* 프로그레스 바 영역: 네온 느낌 추가 */}
          <div className="w-full max-w-[300px]">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
              <div
                className="h-full animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-hana-main via-[#4ADE80] to-hana-main shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-1">
              <span className="font-bold text-[15px] text-hana-main/80 uppercase tracking-widest">
                분석중
              </span>
              <div className="flex gap-1">
                <span className="font-bold text-[18px] text-hana-main tabular-nums">
                  {Math.floor(progress)}
                </span>
                <span className="font-bold text-[15px] text-hana-main/40">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-15px) rotate(5deg); } 
        }
        @keyframes shadow-scale { 
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.1; } 
          50% { transform: translateX(-50%) scale(1.3); opacity: 0.04; } 
        }
        @keyframes fadeSlideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes shimmer { 
          0% { background-position: 200% 0; } 
          100% { background-position: -200% 0; } 
        }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        .animate-shadow-scale { animation: shadow-scale 3.5s ease-in-out infinite; }
        .animate-fade-slide-up { animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-shimmer { animation: shimmer 2.5s linear infinite; }
      `}</style>
    </div>
  );
}
