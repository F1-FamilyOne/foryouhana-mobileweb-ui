import { Card, CardContent } from '@/components/ui/card';

/**
 * @page: FeatureCard
 * @description: 슬라이드 첫번째에 들어가는 둥근 원형의 루시드 아이콘을 담은 작은 카드입니다.
 * @author: seonukim
 * @date: 2026-01-27
 */

type Feature = {
  icon: React.ReactNode;
  title: string;
};

export default function FeatureCard({ icon, title }: Feature) {
  return (
    <Card className="aspect-square w-25 rounded-2xl border-2 border-hana-main bg-white shadow-md">
      <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-0">
        <div className="flex aspect-square items-center justify-center rounded-full bg-hana-main p-2">
          {icon}
        </div>
        <div className="text-center font-hana-bold text-[12px]">{title}</div>
      </CardContent>
    </Card>
  );
}
