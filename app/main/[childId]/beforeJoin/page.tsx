'use client';

import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import {
  type AllChildWithIsHaveFundReturn,
  getAllChildWithIsHaveFund,
} from '@/actions/getUserSetup';
import BeforeJoinFund from '@/components/beforeJoin/BeforeJoinFund';
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
  const { childId } = use(params);
  const { userId, ready } = useUserContext();
  const [result, setResult] = useState<AllChildWithIsHaveFundReturn | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ready || !userId) return;

    (async () => {
      try {
        setIsLoading(true);
        const res = await getAllChildWithIsHaveFund(Number(userId));
        console.log(res);
        setResult(res);
      } catch (error) {
        console.error('Failed to fetch children:', error);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ready, userId]);

  if (!ready || isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!result) return null;

  if (!result.exists) notFound();

  const childIdNum = Number(childId);
  const childExists = result.children.some(
    (child) => child.childId === childIdNum,
  );

  if (!childExists) {
    notFound();
  }

  return (
    <div className="min-h-full overflow-y-scroll">
      <BeforeJoinFund
        initialChildId={Number(childId)}
        childList={result.children}
      />
    </div>
  );
}
