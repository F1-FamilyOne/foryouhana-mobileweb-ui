'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  accountId: number | string;
  fundId: number | string;
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
  accountId,
  fundId,
  variant = 'active',
  title,
  tags = [],
  totalAmountWonText,
  profitRateText,
  monthlyPayWonText,
  className,
}: Props) {
  const router = useRouter();
  const params = useParams<{ childId: string }>();
  const childId = String(params.childId);

  const visibleTags = tags.filter(
    (t) => typeof t === 'string' && t.trim().length > 0,
  );

  const depositHref =
    `/main/${childId}/my-product/${accountId}/deposit` as const;
  const detailHref = `/main/${childId}/product-list/${fundId}` as const;

  const isDisabled = variant === 'canceled';

  const handleMoveDetail = () => {
    if (isDisabled) {
      return;
    }
    router.push(detailHref);
  };

  return (
    <button
      type="button"
      aria-label={isDisabled ? '해지된 펀드 카드' : '펀드 상품 상세로 이동'}
      onClick={handleMoveDetail}
      disabled={isDisabled}
      className={cn(
        'w-full rounded-2xl border border-hana-gray-300 p-3 text-left shadow-md',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        getCardClassName(variant),
        className,
      )}
    >
      {/* 제목 */}
      <div className="flex justify-between font-hana-regular text-[15px]">
        <span>{title}</span>

        {variant === 'active' ? (
          <Link
            href={depositHref}
            className="font-hana-light hover:text-hana-main"
            aria-label="입금하기"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            입금하기
          </Link>
        ) : null}
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
      <div className="mt-2">
        <div className="flex items-center justify-between font-hana-regular text-[15px]">
          <span>평가금</span>
          <span>{totalAmountWonText} 원</span>
        </div>
        <div className="flex items-center justify-between font-hana-regular text-[15px]">
          <span>원금</span>
          <span>{totalAmountWonText} 원</span>
        </div>
        <div className="flex items-center justify-between font-hana-regular text-[15px]">
          <span>수익금</span>
          <span>{totalAmountWonText} 원</span>
        </div>
        <div className="mt-2 flex items-center justify-between font-hana-regular text-[15px]">
          <span>수익률</span>
          <span className="text-hana-point-red">+{profitRateText}%</span>
        </div>

        {monthlyPayWonText ? (
          <div className="mt-2 flex items-center justify-between font-hana-regular text-[15px]">
            <span>정기 납입금</span>
            <span>매월 {monthlyPayWonText} 원</span>
          </div>
        ) : null}
      </div>
    </button>
  );
}
