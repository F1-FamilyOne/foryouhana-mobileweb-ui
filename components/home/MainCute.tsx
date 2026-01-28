'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IMAGES_PATH } from '@/constants/images';
import * as MSG from '@/constants/messages';

/**
 * @page: 별봄이
 * @description: 별봄이 배경, 캐릭터 메시지
 * @author: 승빈
 * @date: 2026-01-27
 */

type CharacterType = 'dance' | 'good' | 'heart' | 'hi' | 'water' | 'wink';

interface Petal {
  id: number;
  left: number;
  top: number;
  delay: number;
}

// 🎯 매핑 객체를 컴포넌트 외부로 분리하여 코드의 가독성과 확장성을 높입니다.
const CHARACTER_MESSAGES: Record<CharacterType, string[]> = {
  dance: MSG.DANCE_MESSAGES,
  good: MSG.GOOD_MESSAGES,
  heart: MSG.HEART_MESSAGES,
  hi: MSG.HI_MESSAGES,
  water: MSG.WATER_MESSAGES,
  wink: MSG.WINK_MESSAGES,
};

const CHARACTER_IMAGES: Record<CharacterType, string> = {
  dance: IMAGES_PATH.CUTE_DANCE,
  good: IMAGES_PATH.CUTE_GOOD,
  heart: IMAGES_PATH.CUTE_HEART,
  hi: IMAGES_PATH.CUTE_HI,
  water: IMAGES_PATH.CUTE_WATER,
  wink: IMAGES_PATH.CUTE_WINK,
};

export default function MainCute() {
  const [mounted, setMounted] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [message, setMessage] = useState('하나 정원에서 같이 놀아요! ✨');
  const [charType, setCharType] = useState<CharacterType>('hi');
  const [positionX, setPositionX] = useState(20);
  const [petals, setPetals] = useState<Petal[]>([]);

  const bounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    setPositionX(20 + Math.random() * 40);

    const newPetals = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 50,
      delay: i * 0.8,
    }));
    setPetals(newPetals);

    // ✨ [Cleanup] 컴포넌트 언마운트 시 활성화된 모든 타이머를 정리하여 메모리 누수를 방지합니다.
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  const handleCharacterClick = () => {
    if (showBubble) return;

    const types = Object.keys(CHARACTER_MESSAGES) as CharacterType[];
    const nextType = types[Math.floor(Math.random() * types.length)];
    setCharType(nextType);

    // 🚀 매핑 객체를 사용하여 타겟 메시지 리스트 확보
    const targetList = CHARACTER_MESSAGES[nextType];
    const randomIndex = Math.floor(Math.random() * targetList.length);
    setMessage(targetList[randomIndex]);

    const newX = 20 + Math.random() * 40;
    setPositionX(newX);

    setIsBouncing(true);
    setShowBubble(true);

    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    bounceTimerRef.current = setTimeout(() => setIsBouncing(false), 300);
    bubbleTimerRef.current = setTimeout(() => setShowBubble(false), 2500);
  };

  if (!mounted)
    return <div className="h-[161px] w-full rounded-t-[40px] bg-[#f9ffff]" />;

  return (
    <div className="relative h-[161px] w-full">
      <div className="absolute inset-0 overflow-hidden rounded-t-[40px] bg-[#f9ffff] shadow-[0_-8px_30px_rgba(0,132,133,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E6F7F5] via-[#F0F4FF] to-[#FFF0F5]">
          <div className="absolute top-4 left-[15%] h-8 w-8 animate-bounce rounded-full bg-white/40 blur-xl duration-[5s]"></div>
          <div className="absolute top-12 left-[45%] h-12 w-12 animate-pulse rounded-full bg-hana-main/10 blur-xl"></div>
          <div className="absolute top-6 right-[20%] h-10 w-10 animate-bounce rounded-full bg-[#FFD1DC]/30 blur-xl duration-[4s]"></div>
        </div>

        <div className="absolute bottom-[-20px] left-[-10%] h-[60px] w-[120%] rotate-[-1deg] rounded-[100%] bg-gradient-to-b from-[#EDF9F6] to-[#D7EAE5] shadow-inner"></div>

        <div className="pointer-events-none absolute inset-0">
          {petals.map((petal) => (
            <div
              key={`petal-${petal.id}`}
              className="absolute h-1.5 w-1.5 animate-petal rounded-full bg-[#FFD1DC]"
              style={{
                left: `${petal.left}%`,
                top: `${petal.top}%`,
                animationDelay: `${petal.delay}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-[16px] z-10 flex flex-col items-center outline-none transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          left: `${positionX}%`,
          transform: 'translateX(-50%)',
        }}
        onClick={handleCharacterClick}
      >
        <div
          className={`mb-3 flex transform items-center justify-center rounded-[24px] border border-white/60 bg-white/80 px-5 py-2.5 shadow-[0_12px_24px_rgba(0,132,133,0.1)] backdrop-blur-md transition-all duration-400 ${
            showBubble
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-4 scale-75 opacity-0'
          }`}
        >
          <span className="whitespace-nowrap font-hana-bold text-[#006A6B] text-[13px] tracking-tight">
            {message}
          </span>
          <div className="-bottom-1.5 -translate-x-1/2 absolute left-1/2 h-3 w-3 rotate-45 bg-white/80"></div>
        </div>

        <div
          className={`relative h-[90px] w-[70px] cursor-pointer transition-transform duration-200 ${
            isBouncing ? '-translate-y-6 scale-110' : 'translate-y-0 scale-100'
          }`}
        >
          <div
            className={`-bottom-1 -translate-x-1/2 absolute left-1/2 h-2 rounded-[100%] bg-[#4A635E]/10 blur-[4px] transition-all duration-200 ${
              isBouncing ? 'w-4 opacity-20' : 'w-10 opacity-100'
            }`}
          ></div>

          {/* 🚀 getCharacterImage 함수 대신 매핑 객체에서 직접 꺼내 씀으로써 일관성 확보 */}
          <Image
            src={CHARACTER_IMAGES[charType]}
            alt="character"
            fill
            className="object-contain"
            priority
          />
        </div>
      </button>

      <style>{`
        @keyframes petal {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translate(20px, 40px) rotate(360deg); opacity: 0; }
        }
        .animate-petal {
          animation: petal 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
