'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: AI 분석 - 총 자산 분석중... 페이지
 * @description: 총 자산을 분석 하는 progress bar가 점점 차다가 분석이 마무리 됨. 아직 1초 후에 다음 페이지 넘어가는 건 구현 안함
 * @author: typeyu
 * @date: 2026-01-25
 */

export default function AnalysisLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const durationMs = 4500; // 게이지 차오르는 시간
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(Math.round(t * 100));

      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const isDone = progress >= 100;

  useEffect(() => {
    if (!isDone) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.push('/onboarding/result');
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isDone, router]);

  const HanabotImage = (
    <Image
      src={IMAGES_PATH.LOADING_HANABOT_IMG}
      alt="hanabot"
      width={180}
      height={180}
      priority
    />
  );

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {!isDone ? (
        <div className="flex flex-col items-center">
          {/* hanabot */}
          <div className="mt-6 animate-hanabot-float">{HanabotImage}</div>

          {/* text */}
          <p className="pt-5 font-hana-regular text-[24px] text-hana-gray-600">
            총 자산 분석중...
          </p>

          {/* progress bar */}
          <div
            className="mt-6 h-3 w-78 overflow-hidden rounded-full bg-hana-gray-300"
            role="progressbar"
            aria-label="총 자산 분석 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full bg-hana-main transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6">
          {HanabotImage}

          <p className="font-hana-cm text-[32px] text-hana-gray-600">
            분석이 마무리 되었어요
          </p>
        </div>
      )}
    </main>
  );
}
