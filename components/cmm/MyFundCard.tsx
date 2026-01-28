'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @page: 내 펀드 카드
 * @description: 내 펀드 요약 정보를 카드로 보여줍니다.
 * @author: typeYu
 * @date: 2026-01-25
 */

type PaymentType = 'regular' | 'irregular';

type Props = {
  paymentType: PaymentType;
  rate: number; // +{rate}%
  title: string;
  amountEok: string; // {숫자}억원
  monthlyAmountWon: string; // 매달 {숫자}원 납입
  className?: string;
};

function getPaymentLabel(paymentType: PaymentType) {
  if (paymentType === 'regular') {
    return '정기 적립';
  }
  return '자유 적립';
}

export function MyFundCard({
  paymentType,
  rate,
  title,
  amountEok,
  monthlyAmountWon,
  className,
}: Props) {
  return (
    <article
      className={cn(
        'w-78 rounded-2xl border border-hana-gray-300 bg-white p-5 shadow-md',
        className,
      )}
      aria-label="내 펀드 카드"
    >
      {/* 뱃지 2개 */}
      <div className="flex gap-2">
        <Badge
          variant="outline"
          className="rounded-md border-transparent bg-hana-fade-green text-hana-badge-green"
        >
          {getPaymentLabel(paymentType)}
        </Badge>

        <Badge
          variant="outline"
          className="rounded-md border-transparent bg-hana-fade-red text-hana-badge-red"
        >
          +{rate}%
        </Badge>
      </div>

      <div className="mt-3 font-hana-cm text-[14px]">{title}</div>

      <div className="mt-3 flex items-baseline gap-1 font-hana-cm text-hana-dark-navy">
        <span className="text-[16px]">총 {amountEok}원/</span>
        <span className="text-[10px]"> 매달 {monthlyAmountWon}원 납입</span>
      </div>
    </article>
  );
}
