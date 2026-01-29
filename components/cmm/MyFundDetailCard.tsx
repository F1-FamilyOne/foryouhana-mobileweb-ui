'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @page: 내 펀드 상세 카드
 * @description: active / canceled 상태를 모두 지원합니다.
 * @author: typeYu
 * @date: 2026-01-25
 */

type Variant = 'active' | 'canceled';

type Props = {
  variant?: Variant;
  title: string;
  tags?: [string?, string?, string?];
  totalAmountWonText: string;
  profitRateText: string;
  monthlyPayWonText?: string;
  className?: string;
};

function getCardClassName(variant: Variant) {
  if (variant === 'canceled') {
    return 'bg-black/4';
  }
  return 'bg-white';
}

function getTagClassName(variant: Variant) {
  if (variant === 'canceled') {
    return 'border border-hana-gray-400 bg-hana-gray-300';
  }
  return 'border-transparent bg-hana-main text-white';
}

export function MyFundDetailCard({
  variant = 'active',
  title,
  tags = [],
  totalAmountWonText,
  profitRateText,
  monthlyPayWonText,
  className,
}: Props) {
  const visibleTags = tags.filter(
    (t) => typeof t === 'string' && t.trim().length > 0,
  );

  const params = useParams<{ childId: string; accountId: string }>();
  const childId = params.childId;
  const accountId = params.accountId;

  const depositHref =
    `/main/${childId}/my-product/${accountId}/deposit` as const;

  return (
    <article
      className={cn(
        'w-full rounded-2xl border border-hana-gray-300 p-3 shadow-md',
        getCardClassName(variant),
        className,
      )}
      aria-label="내 펀드 상세 카드"
    >
      {/* 제목 */}
      <div className={cn('flex justify-between font-hana-regular text-[15px]')}>
        {title}
        <Link href={depositHref} className="font-hana-light">
          입금하기
        </Link>
      </div>

      {/* 태그 */}
      {visibleTags.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {visibleTags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                'rounded-2xl px-3 py-1 text-[13px]',
                getTagClassName(variant),
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      {/* 정보 */}
      <div className={cn('mt-2')}>
        <div className="flex items-center justify-between font-hana-regular text-[15px]">
          <span>평가금</span>
          <span>{totalAmountWonText} 원</span>
        </div>

        <div className="mt-2 flex items-center justify-between font-hana-regular text-[15px]">
          <span>수익률</span>
          <span className={cn('text-hana-point-red')}>+{profitRateText}%</span>
        </div>

        {monthlyPayWonText ? (
          <div className="mt-2 flex items-center justify-between font-hana-regular text-[15px]">
            <span>정기 납입금</span>
            <span>매월 {monthlyPayWonText} 원</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
