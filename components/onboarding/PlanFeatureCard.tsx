import Image from 'next/image';

/**
 * @page: PlanFeatureCard
 * @description: 증여 플랜 소개 화면에서 사용되는 기능 설명 카드 컴포넌트
 * - 동일한 UI 패턴의 카드가 반복되는 경우 재사용을 목적으로 분리함
 * - 증여 플랜, 자산 분석, AI 추천 등 기능 소개 영역에서 사용
 * - 디자인 변경 시 단일 컴포넌트 수정으로 전체 카드 UI 관리 가능
 *
 * @author: minyoung
 * @date: 2026-01-25
 */

interface PlanFeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function PlanFeatureCard({
  icon,
  title,
  description,
}: PlanFeatureCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border p-4">
      <Image src={icon} alt="" width={40} height={40} />

      <div>
        <p className="font-hana-cm text-[15px]">{title}</p>
        <p className="mt-1 font-hana-regular text-[11px] text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}
