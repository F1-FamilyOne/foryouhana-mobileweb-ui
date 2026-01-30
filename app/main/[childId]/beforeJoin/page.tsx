'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { getUserAndChildWithFixed } from '@/actions/getUserSetup';
import { useUserContext } from '@/hooks/useUserContext';

/**
 * @page: beforeJoin page
 * @description: 상품 가입하러가기 전 화면
 * @author: seonukim
 * @date: 2026-01-29
 */

export default function Page({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const router = useRouter();
  const { childId } = use(params);
  const { userId, ready } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    if (!ready || !userId) return;

    (async () => {
      try {
        const res = await getUserAndChildWithFixed(
          Number(userId),
          Number(childId),
        );

        if (!res.exists || !res.isValidChild) {
          setError(true);
          return;
        }

        const targetUrl = res.isPromiseFixed
          ? `/main/${childId}/beforeJoin/hometax-report`
          : `/main/${childId}/beforeJoin/nofund-status`;

        router.push(targetUrl as Route);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ready, userId, childId, router]);

  return (
    <div className="flex min-h-full items-center justify-center">
      {isLoading ? (
        <p>체크중...</p>
      ) : isError ? (
        <p>자녀를 찾을 수 없습니다</p>
      ) : (
        <p>체크중입니다...</p>
      )}
    </div>
  );
}
