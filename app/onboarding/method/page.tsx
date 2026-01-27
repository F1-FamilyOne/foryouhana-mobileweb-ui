'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { PlanFeatureCard } from '@/components/onboarding/PlanFeatureCard';
import { IMAGES_PATH } from '@/constants/images';
import type { DraftPlanPayload } from '../result/page';

/**
 * @page: analysisMethodPage
 * @description: AI 맞춤 증여 플랜 분석 방법 선택 페이지
 * @author: minyoung
 * @date: 2026-01-25
 */

export default function analysisMethodPage() {
  const router = useRouter();
  const saveMyData = () => {
    const raw = sessionStorage.getItem('giftPlan');
    const prevData: DraftPlanPayload = raw
      ? JSON.parse(raw)
      : {
          updated_at: new Date().toISOString(),
          plan: {},
        };

    const sessionData = {
      ...prevData.plan,
      child_id: null,
      isSigned: false, // ✅ 요청하신 대로 false 설정
      updated_at: new Date().toISOString(),
      plan: {
        ...prevData.plan,
        goal_money: 50000000,
        monthly_money: 416000,
        is_promise_fixed: true,
        in_month: 120,
        acc_type: 'PENSION',
        in_type: true,
        //임시 MYDATE
      },
    };

    sessionStorage.setItem('giftPlan', JSON.stringify(sessionData));
    console.log('✅ 플랜 데이터 저장 완료 (isSigned: false):', sessionData);
    router.push('/onboarding/loading');
  };
  return (
    <div className="flex flex-col">
      <Header content="AI 맞춤 증여 플랜" />
      <div className="mt-7 text-center">
        <h1 className="font-hana-medium text-[24px] leading-tight">
          스마트한 증여 플랜,
          <br />
          <span className="text-hana-mint">별봇이 설계합니다</span>
        </h1>

        <p className="mx-3 mt-3 font-hana-regular text-[15px] text-gray-400">
          고객님의 자산 현황을 분석하여
          <br />
          최적의 증여 전략을 제안해드려요
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <Image
          src={IMAGES_PATH.REGIST_STARBOT_ICON}
          alt="가입_별봇"
          width={160}
          height={160}
        />
      </div>
      <div className="mt-6 flex flex-col gap-4 px-3">
        <PlanFeatureCard
          icon={IMAGES_PATH.REGIST_CALC_ICON}
          title="마이데이터 기반 자산 분석"
          description="내 자산을 분석하여 최적의 시나리오를 추천해줘요"
        />
        <PlanFeatureCard
          icon={IMAGES_PATH.REGIST_NOTE_ICON}
          title="정밀 분석으로 더 디테일한 금융 플랜"
          description="미래 지출 계획을 고려하여 더 구체적인 계획을 수립해요"
        />
        <PlanFeatureCard
          icon={IMAGES_PATH.REGIST_PROTECT_ICON}
          title="절세 전략"
          description="세금을 최소화하는 분할 증여 시점과 금액을 추천해줘요 => 증여 방법을 추천해줘요"
        />
      </div>

      <div className="flex flex-col gap-3 px-3 pt-5 pb-6">
        <CustomButton preset="lightgraylong" onClick={saveMyData}>
          간단 분석으로 증여 플랜 시작하기
        </CustomButton>
        <CustomButton
          preset="greenlong"
          onClick={() => router.push('/onboarding/chatbot')}
        >
          정밀 분석으로 증여 플랜 시작하기
        </CustomButton>
      </div>
    </div>
  );
}
