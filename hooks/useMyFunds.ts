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

export function useMyFunds(childId: number) {
  const [activeCards, setActiveCards] = useState<FundCardItem[]>([]);
  const [canceledCards, setCanceledCards] = useState<FundCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setIsLoading(true);
      setIsError(false);

      try {
        const res = await fetch(`/api/my/funds?childId=${childId}`, {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error(`fetch failed: ${res.status}`);
        }

        const data = (await res.json()) as ApiResult;

        if (mounted) {
          setActiveCards(data.activeCards);
          setCanceledCards(data.canceledCards);
        }
      } catch (e) {
        console.error(e);

        if (mounted) {
          setActiveCards([]);
          setCanceledCards([]);
          setIsError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [childId]);

  return {
    activeCards,
    canceledCards,
    isLoading,
    isError,
  };
}
