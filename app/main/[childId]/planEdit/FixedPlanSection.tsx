'use client';
import { useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';

export default function FixedPlanSection({ prev }: { prev: boolean }) {
  const [isFixedGift, setIsFixedGift] = useState<boolean>(prev);

  return (
    <div>
      <TitlePlanSelect title="유기정기금" />
      {isFixedGift === true ? (
        <CustomButton preset="redlong">중단 및 변경하기</CustomButton>
      ) : (
        <CustomButton preset="greenlong">변경 취소하기</CustomButton>
      )}
    </div>
  );
}
