'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // useEffect 추가
import { createChildAndAccount } from '@/actions/child.action';
import { CustomButton } from '@/components/cmm/CustomButton';
import { IMAGES_PATH } from '@/constants/images';
import { useUserContext } from '@/hooks/useUserContext';

/**
 * @page: 서비스 가입완료
 * @description: 서비스 가입완료 페이지. 자녀 및 자녀 입출금 생성 후 db에 저장합니다.
 * @author: 승빈 (Gemmin Teacher)
 * @date: 2026-01-28
 */

export default function RegisterComplete() {
  const route = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ready, userId } = useUserContext();

  // 화면 진입 시 userId가 준비되면 sessionStorage에 parentId 동기화
  useEffect(() => {
    if (ready && userId) {
      sessionStorage.setItem('parentId', userId);
    }
  }, [ready, userId]);

  const handleStartService = async () => {
    // 유저 정보 로딩 중이거나 제출 중이면 방어
    if (!ready || !userId || isSubmitting) return;

    const rawData = sessionStorage.getItem('giftPlan');
    if (!rawData) {
      console.error('가입 정보를 찾을 수 없습니다.');
      route.push('/');
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionData = JSON.parse(rawData);

      const result = await createChildAndAccount(sessionData, Number(userId));

      if (result.success && result.childId) {
        sessionStorage.clear();
        route.push(`/main/${result.childId}/beforeJoin`);
      } else {
        alert(result.error || '저장 중 오류가 발생했습니다.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('처리 중 에러 발생:', error);
      setIsSubmitting(false);
    }
  };

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
          className="font-hana-cm text-[20px] hover:cursor-pointer disabled:opacity-70"
          onClick={handleStartService}
          disabled={isSubmitting || !ready} // ready 아닐 때도 비활성화
        >
          {isSubmitting
            ? '아이 정보를 등록 중...'
            : '아이앞으로 서비스 들어가기'}
        </CustomButton>
      </div>
    </div>
  );
}
