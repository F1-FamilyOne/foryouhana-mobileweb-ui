import { Award, Shield, TrendingUp } from 'lucide-react';
import { FundKeyPointItem } from './fund-key-point-item';

/**
 * @page: fund-key-points-section
 * @description: 이 펀드의 핵심 포인트 세 개를 담은 section
 * @author: typeYu
 * @date: 2026-01-27
 */

type Item = {
  title: string;
  context: string;
};

type Props = {
  items?: {
    trendingUp?: Item;
    shield?: Item;
    award?: Item;
  };
};

export function FundKeyPointsSection({ items }: Props) {
  const trendingUp = items?.trendingUp ?? {
    title: '꾸준한 성장세',
    context:
      '최근 3년간 연평균 15.2% 수익률을 기록하며 \n 안정적인 성과를 달성했습니다.',
  };

  const shield = items?.shield ?? {
    title: '철저한 리스크 관리',
    context:
      '글로벌 분산투자로 변동성을 낮추고 \n 안정적인 포트폴리오를 구성합니다.',
  };

  const award = items?.award ?? {
    title: '검증된 전문가 운용',
    context: '20년 경력의 글로벌 투자 전문가가 \n 직접 운용 및 관리합니다.',
  };

  return (
    <div className="pt-4">
      <div className="space-y-4">
        <FundKeyPointItem
          icon={TrendingUp}
          title={trendingUp.title}
          context={trendingUp.context}
        />
        <FundKeyPointItem
          icon={Shield}
          title={shield.title}
          context={shield.context}
        />
        <FundKeyPointItem
          icon={Award}
          title={award.title}
          context={award.context}
        />
      </div>
    </div>
  );
}
