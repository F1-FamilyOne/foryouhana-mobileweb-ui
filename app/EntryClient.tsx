'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUserSetup } from '@/actions/getUserSetup';
import { useUserContext } from '@/hooks/useUserContext';

/**
 * @page: root/EntryClient
 * @description: 홈은 그대로 두고, 라우팅 전용 컴포넌트 화면을 만들었습니다.
 * @author: seonukim
 * @date: 2026-01-27
 *
 * 컨텍스트에서 가져온 유저 아이디를 기반으로 한
 * 화면 분기 처리를 담당합니다.
 *
 * 아이디를 통해 화면을 분기합니다.
 *
 * 지금 펀드 미가입시 beforeJoin/으로 보냈습니다.
 * 해당 경로의 페이지가 없어서 에러가 나는데 무시해주세요~
 *
 */

export default function EntryClient() {
  const { userId, ready } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    console.log(userId, ready);
    if (!ready || !userId) return;

    (async () => {
      const result = await getUserSetup(Number(userId));

      if (!result.exists) {
        return console.error('there is no User, User must login');
      }

      if (!result.hasChild) return router.replace('/onboarding/intro');
      if (!result.hasFundAccount)
        return router.replace(`/main/${result.firstChildId}/beforeJoin/`);
      return router.replace(`/main/${result.firstChildId}/home`);
    })();
  }, [ready, userId, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      초기셋팅 중...
    </div>
  );
}
