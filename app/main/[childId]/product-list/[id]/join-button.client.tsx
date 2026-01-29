'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Props = {
  childId: number;
  fundId: number;
};

export function JoinButton({ childId, fundId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    const href =
      `/main/${childId}/additional-fund/terms?fundId=${fundId}` as Route;

    router.push(href);
  };

  return (
    <Button
      type="button"
      className="mx-5 mb-3 bg-hana-main p-5 hover:bg-hana-linear-deep-green"
      onClick={handleClick}
      aria-label="펀드 가입하기"
    >
      가입하기
    </Button>
  );
}
