import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @page: fund list detail - badge
 * @description: 뱃지 분기점 컴포넌트화
 * @author: typeYu
 * @date: 2026-01-27
 */

type RiskUi = 'high' | 'mid' | 'low';

type Props = {
  risk: RiskUi;
};

function getRiskLabel(risk: RiskUi) {
  if (risk === 'high') return '높은 위험성';
  if (risk === 'mid') return '보통 위험성';
  return '낮은 위험성';
}

function getRiskClassName(risk: RiskUi) {
  if (risk === 'high') {
    return 'bg-hana-fade-red text-hana-badge-red border-transparent';
  }
  if (risk === 'mid') {
    return 'bg-hana-badge-yellow text-hana-badge-orange border-transparent';
  }
  return 'bg-hana-fade-green text-hana-badge-green border-transparent';
}

export function FundRiskBadge({ risk }: Props) {
  return (
    <div className="pt-1">
      <Badge
        variant="outline"
        className={cn(
          'h-5.5 w-20 justify-center font-hana-regular text-[13px]',
          getRiskClassName(risk),
        )}
      >
        {getRiskLabel(risk)}
      </Badge>
    </div>
  );
}
