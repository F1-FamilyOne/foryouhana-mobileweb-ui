'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import ModalAllChart, {
  type KidFundAmount,
} from '@/components/home/ModalAllChart';
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';
import { BottomNavBar } from '../cmm/NavBar';
import { Badge } from '../ui/badge';
import MainCute from './MainCute';

type Props = {
  initialChildId: number;
  kidsProfiles: KidProfile[];
  kidsChartData: KidFundAmount[];
  is_promise_fixed: boolean;
  hasPensionAccount: boolean; // 연금저축계좌 존재 여부
};

export default function HomeClientWrapper({
  initialChildId,
  kidsProfiles,
  kidsChartData,
  is_promise_fixed,
  hasPensionAccount,
}: Props) {
  const [isChartOpen, setIsChartOpen] = useState(false);
  const router = useRouter();

  const handleChildSelect = (id: number) => {
    // 자녀 선택 시 해당 자녀의 홈으로 이동하시오
    router.push(`/main/${id}/home`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 캐릭터와 토글을 감싸는 상대 경로 컨테이너 */}
      <div className="relative mb-6">
        {/* 1. 메인 캐릭터 카드 */}
        <MainCute />

        {/* 2. 자녀 프로필 토글 (하단에 걸치게 배치) */}
        <div className="-bottom-6 absolute right-4 z-20">
          <ToggleChildProfile
            kids={kidsProfiles}
            onSelect={handleChildSelect}
            selectedKidId={initialChildId}
          />
        </div>
      </div>

      {/**전체통계보기 버튼은 항상 보이고, 클릭하면 ModalAllChart가 뜨게 */}
      {/* 2. shadcn 뱃지 및 전체 통계 버튼 영역 */}
      <div className="mt-2 flex items-center justify-between px-2">
        {/* 왼쪽: shadcn Badge 적용 */}
        <div className="flex gap-2">
          {hasPensionAccount && (
            <Badge className="w-fit whitespace-nowrap border-none bg-hana-pastel-green px-3 py-1 font-bold text-hana-linear-deep-green text-xs">
              연금저축계좌
            </Badge>
          )}

          <Badge className="w-fit whitespace-nowrap border-none bg-hana-pastel-green px-3 py-1.5 font-bold text-hana-linear-deep-green text-xs shadow-sm">
            {is_promise_fixed ? '유기정기금 적용 중' : '유기정기금 미적용 중'}
          </Badge>
        </div>

        <CustomButton
          // 스타일: 마우스 올렸을때 바뀌는 색까리 너무 진한데 조금만 연하게
          className="size-1.0 rounded-2xl bg-hana-light-gray px-3 py-1.5 text-hana-gray-600 text-xs shadow-sm hover:bg-hana-gray-200/50"
          onClick={() => setIsChartOpen(true)}
        >
          전체 통계보기
        </CustomButton>
      </div>

      {/* 3. 통계 모달 */}
      {isChartOpen && (
        <ModalAllChart
          onClose={() => setIsChartOpen(false)}
          kids={kidsChartData}
        />
      )}

      <BottomNavBar />
    </div>
  );
}
