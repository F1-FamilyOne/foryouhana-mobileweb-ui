'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { ScrollDatePicker } from '@/components/cmm/ScrollDatePicker';
import type { DraftPlanPayload } from '../result/page';

/**
 * @page: onboarding/ChildInfo
 * @description: 자녀 생년월일 입력화면
 * @author: seonukim
 * @date: 2026-01-26
 *
 * 스크롤 픽커로 자녀의 생년 월일을 입력받아 나이를 입력합니다.
 * prisma를 통한 데이터 전송 로직을 나중에 추가해 주세요.
 * 자녀의 생년월일은 brirth에 (year, month, day)로 들어갑니다.
 */

export type BirthInput = {
  year: number;
  month: number; // 1 ~ 12
  day: number; // 1 ~ 31
  age: number;
};

export default function ChildInfoDetail() {
  const TODAY = new Date();
  const [birth, setBirth] = useState({
    year: TODAY.getFullYear(),
    month: TODAY.getMonth() + 1,
    day: TODAY.getDate(),
  });
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  const saveBirth = (age: number) => {
    const payload: DraftPlanPayload = {
      updated_at: new Date().toISOString(),
      plan: {
        child_birth: { ...birth, age },
        goal_money: 0,
        monthly_money: 0,
        is_promise_fixed: false,
        in_month: 0,
        in_type: false,
        acc_type: 'DEPOSIT',
      },
    };
    sessionStorage.setItem('giftPlan', JSON.stringify(payload));
    router.push('/onboarding/method');
  };

  const age = useMemo(() => {
    const today = new Date();
    let age = today.getFullYear() - birth.year;

    const isBeforeBirthday =
      today.getMonth() + 1 < birth.month ||
      (today.getMonth() + 1 === birth.month && today.getDate() < birth.day);

    if (isBeforeBirthday) age -= 1;
    return age;
  }, [birth]);

  return (
    <div className="flex min-h-full flex-col overflow-hidden bg-white">
      <Header content="AI 맞춤 증여 플랜" />

      <div className="flex flex-1 flex-col overflow-y-scroll px-5 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-6">
          <h1 className="font-bold text-xl leading-snug">
            자녀의 <span className="text-hana-main">생년월일</span>을 <br />
            입력해주세요!
          </h1>
          <p className="mt-2 text-hana-gray-500 text-sm">
            별벗 AI가 나의 자산과 자녀의 나이를 기반으로 <br /> 최적의 증여
            플랜을 계산해드려요.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <ScrollDatePicker
            year={birth.year}
            month={birth.month}
            day={birth.day}
            onChange={(date) => setBirth(date)}
          />
        </div>

        <div className="text-center font-bold text-lg">
          만 <span className="text-hana-main text-xl">{age}</span>세
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center px-6 pb-10">
        <label className="mb-7 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 accent-hana-main"
          />
          [필수] 마이데이터 수집 및 활용에 동의합니다.
        </label>

        <CustomButton
          preset="greenlong"
          disabled={!agree}
          onClick={() => saveBirth(age)}
        >
          증여 플랜 확인하기
        </CustomButton>
      </div>
    </div>
  );
}
