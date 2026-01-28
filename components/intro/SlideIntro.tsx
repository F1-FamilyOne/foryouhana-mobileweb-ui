import { HandCoins, PiggyBank, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FeatureCard from './FeatureCard';
import InvestChartCard from './InvestChartCard';

/**
 * @page: onboarding/intro 화면의 첫번째 슬라이드
 * @description: 인트로 슬라이드입니다.
 * @author: seonukim
 * @date: 2026-01-27
 */

export default function SlideIntro() {
  return (
    <div className="w-full">
      <Card className="h-31.25 w-full border border-white bg-linear-to-r from-hana-gray-green/30 to-white/60">
        <CardContent className="w-full items-center justify-center p-0">
          <h1 className="text-center font-hana-light text-[12px] leading-relaxed">
            <span className="font-hana-cm">자녀 1명 키우는데 드는 비용은</span>
            <br />
            <span className="font-hana-cm text-hana-red">최소 3억원</span>
            이라고 해요.
            <br />
            자녀의 미래와 나의 노후를
            <br />
            똑똑하게 준비 해볼까요?
          </h1>
        </CardContent>
      </Card>
      <div className="pt-4.25 font-hana-medium">
        <h2 className="text-[15px]">
          자녀에게{' '}
          <span className="font-hana-bold text-hana-main">꾸준히 증여</span>
          하며 재테크 해봐요.
        </h2>
        <h1 className="text-[20px]">
          <span className="font-hana-bold text-hana-main">놀라실만한 혜택</span>
          을 알려드릴게요.
        </h1>
      </div>

      <div className="flex gap-2.75 pt-8.5">
        <FeatureCard
          icon={<HandCoins className="aspect-square w-6 text-white" />}
          title="절세 혜택"
        />
        <FeatureCard
          icon={<TrendingUp className="aspect-square w-6 text-white" />}
          title="장기 수익률"
        />
        <FeatureCard
          icon={<PiggyBank className="aspect-square w-6 text-white" />}
          title="내 자산 분석"
        />
      </div>

      <div>
        <div className="pt-8">
          <InvestChartCard />
        </div>
      </div>
      <div className="relative mt-5 w-full">
        <h1 className="absolute right-0 bottom-0 text-[12px] text-hana-gray-400">
          1/3
        </h1>
      </div>
    </div>
  );
}
