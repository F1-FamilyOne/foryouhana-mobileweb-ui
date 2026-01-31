'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Mode = 'join' | 'cancel';

type Props = {
  childId: number;
  fundId: number;
  mode: Mode;
  accountId: number | null;
};

export function JoinButton({ childId, fundId, mode, accountId }: Props) {
  const router = useRouter();

  const handleJoin = () => {
    const href =
      `/main/${childId}/additional-fund/terms?fundId=${fundId}` as Route;

    router.push(href);
  };

  const handleCancel = async () => {
    if (!accountId) {
      return;
    }

    const res = await fetch(`/api/my/funds/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });

    if (!res.ok) {
      alert('해지에 실패했습니다.');
      return;
    }

    alert('해지되었습니다.');
    router.refresh();
  };

  return (
    <Button
      type="button"
      className={
        mode === 'cancel'
          ? 'mx-5 mb-3 bg-hana-badge-red p-5 hover:opacity-90'
          : 'mx-5 mb-3 bg-hana-main p-5 hover:bg-hana-linear-deep-green'
      }
      onClick={mode === 'cancel' ? handleCancel : handleJoin}
      aria-label={mode === 'cancel' ? '펀드 해지하기' : '펀드 가입하기'}
    >
      {mode === 'cancel' ? '해지하기' : '가입하기'}
    </Button>
  );
}
