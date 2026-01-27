/**
 * @page: IntroStatCardProps
 * @description: 인트로 카드 컴포넌트입니다. 짙은 청록색 뱃지 그라데이션이 들어갑니다.
 * @author: seonukim
 * @date: 2026-01-27
 */

type IntroStatCardProps = {
  badge: string;
  title: string;
};

export function IntroStatCard({ badge, title }: IntroStatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[14px] bg-white px-4 py-3 shadow-md">
      <div className="inline-flex items-center rounded-full bg-linear-to-r from-hana-linear-deep-green to-hana-linear-deep-green-end px-1 py-1 text-[10px] text-white">
        {badge}
      </div>
      <div className="text-[10px] text-hana-black">{title}</div>
    </div>
  );
}
