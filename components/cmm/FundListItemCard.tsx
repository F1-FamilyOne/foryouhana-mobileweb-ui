'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @page: 펀드 리스트 카드
 * @description: 펀드들의 정보를 카드로 볼 수 있습니다. 뱃지 1개는 필수(위험도), 이후 선택
 * @author: typeYu
 * @date: 2026-01-23
 */

type RiskLevel = 'high' | 'mid' | 'low';
type FundIcon = 'king' | 'sp';

type Props = {
  title: string;
  risk: RiskLevel;
  extraBadgeText?: string;
  performanceText: string;
  icon?: FundIcon;
  className?: string;
};

function getRiskLabel(risk: RiskLevel) {
  if (risk === 'high') {
    return '높은 위험성';
  }
  if (risk === 'mid') {
    return '보통 위험성';
  }
  return '낮은 위험성';
}

function getRiskClassName(risk: RiskLevel) {
  if (risk === 'high') {
    return 'bg-hana-fade-red text-hana-badge-red border-transparent';
  }
  if (risk === 'mid') {
    return 'bg-hana-badge-yellow text-hana-badge-orange border-transparent';
  }
  return 'bg-hana-fade-green text-hana-badge-green border-transparent';
}

function getFundIconSrc(icon?: FundIcon) {
  if (icon === 'king') {
    return '/fund-card/king.svg';
  }
  if (icon === 'sp') {
    return '/fund-card/S&P.svg';
  }
  return null;
}

export function FundListItemCard({
  title,
  risk,
  extraBadgeText,
  performanceText,
  icon,
  className,
}: Props) {
  const iconSrc = getFundIconSrc(icon);

  return (
    <article
      className={cn('relative rounded-2xl bg-white p-2.5 shadow-md', className)}
      style={{ width: 360, height: 100 }}
      aria-label="펀드 리스트 아이템"
    >
      {/* 상단: 제목 + chevron */}
      <div className="flex items-center justify-between">
        <div className="font-hana-medium">{title}</div>
        <ChevronRight className="text-hana-gray-400" aria-hidden="true" />
      </div>

      {/* 뱃지 + 수익률 */}
      <div>
        <div className="flex items-center gap-2 py-2.5">
          <Badge
            variant="outline"
            className={cn(
              'h-5.5 w-20 justify-center font-hana-regular text-[13px]',
              getRiskClassName(risk),
            )}
          >
            {getRiskLabel(risk)}
          </Badge>

          {extraBadgeText ? (
            <Badge
              variant="outline"
              className="h-5.5 w-20 justify-center border-transparent bg-hana-fade-red font-hana-regular text-[13px] text-hana-badge-red"
            >
              {extraBadgeText}
            </Badge>
          ) : null}
        </div>

        <p className="text-[11px] text-hana-badge-red">{performanceText}</p>
      </div>

      {/* 우측 하단 아이콘 (40x40) */}
      {iconSrc ? (
        <div className="absolute right-2.5 bottom-2.5">
          <Image
            src={iconSrc}
            alt={icon === 'king' ? 'king' : 'S&P'}
            width={40}
            height={40}
          />
        </div>
      ) : null}
    </article>
  );
}
