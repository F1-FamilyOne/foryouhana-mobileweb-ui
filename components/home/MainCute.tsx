'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react'; // useRef 추가
import { IMAGES_PATH } from '@/constants/images';
import { CUTE_MESSAGES, NORMAL_MESSAGES } from '@/constants/messages';

type CharacterType = 'cute' | 'normal' | 'run';

export default function MainCute() {
  const [showBubble, setShowBubble] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [message, setMessage] = useState('엄마 사랑해! ❤️🧡💛');
  const [charType, setCharType] = useState<CharacterType>('cute');
  const [positionX, setPositionX] = useState(10);

  // 🛠️ 타이머 관리를 위한 Ref 추가
  const bounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPositionX(Math.random() * 70);

    // 🛠️ 언마운트 시 타이머 정리 (클린업)
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  const handleCharacterClick = () => {
    if (showBubble) return;

    const types: CharacterType[] = ['cute', 'normal', 'run'];
    const nextType = types[Math.floor(Math.random() * types.length)];
    setCharType(nextType);

    const targetList = nextType === 'cute' ? CUTE_MESSAGES : NORMAL_MESSAGES;
    const randomIndex = Math.floor(Math.random() * targetList.length);
    setMessage(targetList[randomIndex]);

    const newX = Math.random() * 70;
    setPositionX(newX);

    setIsBouncing(true);
    setShowBubble(true);

    // 🛠️ 기존 타이머가 작동 중이면 먼저 해제
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    // 🛠️ 타이머 ID 저장
    bounceTimerRef.current = setTimeout(() => {
      setIsBouncing(false);
    }, 300);

    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 2000);
  };

  const getCharacterImage = () => {
    switch (charType) {
      case 'cute':
        return IMAGES_PATH.CUTE;
      default:
        // 원래 코드 흐름 유지 (IMAGES_PATH.RUN이 정의되어 있어야 함)
        return IMAGES_PATH.RUN;
    }
  };

  return (
    <div className="relative h-[161px] w-full overflow-hidden rounded-t-4xl border-3 border-hana-pastel-mint shadow-md">
      <div className="absolute inset-0 z-0"></div>

      <button
        type="button"
        className="absolute bottom-[10px] z-10 flex flex-col items-center outline-none transition-all duration-500 ease-in-out active:scale-95"
        style={{ left: `${positionX}%` }}
        onClick={handleCharacterClick}
      >
        {/* 말풍선 */}
        <div
          className={`mb-2 flex transform items-center justify-center rounded-2xl bg-white px-3 py-2 shadow-lg transition-all duration-300 ease-out ${showBubble ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-50 opacity-0'}
          `}
        >
          <span className="whitespace-nowrap font-bold text-hana-main text-xs">
            {message}
          </span>
          <div className="-bottom-1.5 -translate-x-1/2 absolute left-1/2 h-3 w-3 rotate-45 bg-white"></div>
        </div>

        {/* 캐릭터 이미지 */}
        <div
          className={`relative h-[98px] w-[74px] cursor-pointer transition-transform duration-150 ${isBouncing ? '-translate-y-2 scale-110' : 'translate-y-0 scale-100'}
          `}
        >
          <Image
            src={getCharacterImage()}
            alt="character"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </button>
    </div>
  );
}
