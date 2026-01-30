'use client';

import { useEffect, useState } from 'react';

/**
 * @page: my-fund-list의 hook 페이지
 * @description: my-fund-list 로직 분리
 * @author: typeYu
 * @date: 2026-01-28
 */

export type FundCardItem = {
  id: string;
  fundId: string;
  variant: 'active' | 'canceled';
  title: string;
  tags?: [string?, string?, string?];
  totalAmountWonText: string;
  profitRateText: string;
  monthlyPayWonText?: string;
  inType?: boolean;
};

type ApiResult = {
  activeCards: FundCardItem[];
  canceledCards: FundCardItem[];
};

function isValidId(n: number) {
  return Number.isFinite(n) && n > 0;
}

export function useMyFunds(childId: number) {
  const [activeCards, setActiveCards] = useState<FundCardItem[]>([]);
  const [canceledCards, setCanceledCards] = useState<FundCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isValidId(childId)) {
      setActiveCards([]);
      setCanceledCards([]);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    const controller = new AbortController();

    async function run() {
      setIsLoading(true);
      setIsError(false);

      try {
        const res = await fetch(`/api/my/funds?childId=${childId}`, {
          method: 'GET',
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`fetch failed: ${res.status}`);
        }

        const data = (await res.json()) as ApiResult;

        setActiveCards(Array.isArray(data.activeCards) ? data.activeCards : []);
        setCanceledCards(
          Array.isArray(data.canceledCards) ? data.canceledCards : [],
        );
      } catch (e) {
        if ((e as { name?: string }).name === 'AbortError') {
          return;
        }

        console.error(e);
        setActiveCards([]);
        setCanceledCards([]);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    run();

    return () => {
      controller.abort();
    };
  }, [childId]);

  return {
    activeCards,
    canceledCards,
    isLoading,
    isError,
  };
}
