'use client';
import { useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import MethodSection from './MethodSection';

export enum GIFT_METHOD {
  REGULAR = 'REGULAR', // 정기 이체
  FLEXIBLE = 'FLEXIBLE', //자유 이제
}

export default function GiftPlanSection({
  method,
  period,
  amount,
  isFixed,
}: {
  method: GIFT_METHOD;
  period: number | null;
  amount: number | null;
  isFixed: boolean;
}) {
  const [giftMethod, setGiftMethod] = useState<GIFT_METHOD>(method);
  //   const [newAmount, setNewAmount] = useState<number | null>(amount);
  //   const [newPeriod, setNewPeriod] = useState<number | null>(period);
  return (
    <div>
      <TitlePlanSelect title="증여 방식" />
      {isFixed === true ? (
        <CustomButton disabled preset="lightgraylong" className="grid gap-0">
          <span className="text-[14px] text-hana-black">정기 이체 방식</span>
          <span className="text-[9px] text-hana-black">유기정기금 운용 중</span>
        </CustomButton>
      ) : (
        <MethodSection
          isRegular={giftMethod === GIFT_METHOD.REGULAR}
          onChange={(v) =>
            setGiftMethod(v ? GIFT_METHOD.REGULAR : GIFT_METHOD.FLEXIBLE)
          }
          isFixed={isFixed}
          amount={amount ?? 0}
          period={period ?? 0}
        />
      )}
    </div>
  );
}
