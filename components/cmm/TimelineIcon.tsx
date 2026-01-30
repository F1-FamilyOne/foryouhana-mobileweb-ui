'use client';

import { Bell, BriefcaseBusiness, Gift, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * @component: 타임라인에서 사용하는 원형 아이콘
 * @description: 색깔 3종류, 아이콘 4종류. 확장성을 위해 아이콘과 색깔 매칭 안 시킴
 * @author: typeYu
 * @date: 2026-01-25
 */

type TimelineIconType = 'gift' | 'bell' | 'business' | 'trending';
type Variant = 'purple' | 'pastelGreen' | 'lightGreen';

type Props = {
  icon: TimelineIconType;
  variant: Variant;
  className?: string;
};

function getBgClassName(variant: Variant) {
  if (variant === 'purple') {
    return 'bg-hana-light-purple';
  }
  if (variant === 'pastelGreen') {
    return 'bg-hana-pastel-green';
  }
  return 'bg-hana-light-green';
}

function getIcon(icon: TimelineIconType) {
  if (icon === 'gift') {
    return Gift;
  }
  if (icon === 'bell') {
    return Bell;
  }
  if (icon === 'trending') {
    return TrendingUp;
  }
  return BriefcaseBusiness;
}

export function TimelineIcon({ icon, variant, className }: Props) {
  const Icon = getIcon(icon);

  return (
    <div
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full',
        getBgClassName(variant),
        className,
      )}
    >
      <Icon className="h-5 w-5 text-hana-dark-navy" aria-hidden="true" />
    </div>
  );
}
