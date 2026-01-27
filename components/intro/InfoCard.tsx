import InfoBadge from './IntroBadge';

/**
 * @page: InfoCard
 * @description: InfoCard
 * @author: seonukim
 * @date: 2026-01-27
 *
 * 슬라이드 안쪽에 둥근 알약 모양의 뱃지와 함께 하는 카드 컴포넌트입니다.
 */

type InfoCardProps = {
  badge: string;
  children: React.ReactNode;
};

export function InfoCard({ badge, children }: InfoCardProps) {
  return (
    <div className="relative w-full rounded-[14px] bg-white px-4 py-2 shadow-md">
      <div className="mb-1 flex justify-center">
        <InfoBadge label={badge} />
      </div>
      <div className="text-center text-[15px] text-hana-black leading-relaxed">
        {children}
      </div>
    </div>
  );
}
