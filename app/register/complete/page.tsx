'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: 서비스 가입완료
 * @description: 서비스 가입완료 페이지
 * @author: 승빈
 * @date: 2026-01-28
 */

export default function RegisterComplete() {
  const route = useRouter();
  const [childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    const rawData = sessionStorage.getItem('giftPlan');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setChildId(parsed.child_id || null);
      } catch (e) {
        console.error('세션 파싱 에러:', e);
      }
    }
  }, []);

  return (
    <div className="-m-3 relative z-0 min-h-[calc(100%+1.5rem)] overflow-hidden bg-hana-pastel-mint/10">
      <div className="relative h-[720px] w-full overflow-hidden pb-3">
        <div className="absolute top-[150px] left-[30px] z-20 w-full px-5">
          <h1 className="font-hana-cm text-[32px] text-gray-900">
            가입이 완료되었어요!
          </h1>
          <p className="font-hana-light text-[16px] text-hana-gray-600">
            아이를 위한 시작, 앞으로의 한걸음
          </p>
        </div>

        <div className="absolute right-5 bottom-0 z-10 h-[392px] w-[274px]">
          <Image
            src={IMAGES_PATH.LADDER_CUTE}
            alt="ladder character"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {[
        'top-[52px] left-[40px]',
        'top-[93px] left-[146px] rotate-45',
        'top-[84px] left-[283px]',
        'top-[247px] left-[54px]',
        'top-[271px] left-[197px] rotate-45',
      ].map((position) => (
        <Image
          key={position}
          src={IMAGES_PATH.REGISTER_STAR}
          width={35}
          height={35}
          alt="star"
          className={`absolute z-100 ${position}`}
        />
      ))}

      <div className="relative z-30 mt-4 p-5">
        <CustomButton
          preset="greenlong"
          className="font-hana-cm text-[20px] hover:cursor-pointer"
          onClick={() => {
            if (childId) {
              const finalId = childId;
              sessionStorage.clear();
              route.push(`/main/${finalId}/beforeJoin/test`);
            } else {
              console.error(
                'childId가 세션 스토리지에 없습니다. 홈으로 리디렉션합니다.',
              );
              route.push('/');
            }
          }}
        >
          아이앞으로 서비스 들어가기
        </CustomButton>
      </div>
    </div>
  );
}
