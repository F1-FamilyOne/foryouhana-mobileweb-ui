'use client';

import { MoveDownIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CardIcon from '@/components/cmm/CardIcon';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: registGuidePage
 * @description: 가입 절차 안내 페이지
 * - 아이 명의 펀드 가입 전, 전체 절차를 카드 형태로 안내하는 화면
 * @author: minyoung
 * @date: 2026-01-26
 */

export default function registGuidePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <Header content="아이앞으로 가입" />
      <h1 className="mx-3 mt-5 font-hana-cm text-[24px] leading-tight">
        아이앞으로는
        <br />
        아래의 절차로 만들어져요.
      </h1>

      <div className="relative min-h-full">
        <Image
          src={IMAGES_PATH.REGIST_STARSPRING_IMG}
          alt="가입절차_별봄"
          width={274}
          height={392}
          className="pointer-events-none absolute top-[200px] left-[-40px] opacity-22"
        />
        <div className="relative z-10 mt-6 flex flex-col items-center justify-center gap-3 px-6">
          <CardIcon
            title="가족관계 확인하기"
            content={`가족관계증명서로 
            부모-아이를 확인해요.`}
            imageSrc={IMAGES_PATH.REGIST_HEART}
          />
          <MoveDownIcon />
          <CardIcon
            title="자녀 계좌 개설"
            content={`이제 본격적으로 
            아이 앞으로 차곡차곡 모아보아요.`}
            imageSrc={IMAGES_PATH.REGIST_MONEY_ICON}
          />
          <MoveDownIcon />
          <CardIcon
            title="펀드 계좌 개설"
            content={`아이 이름으로 
            차근차근 투자를 시작해요.`}
            imageSrc={IMAGES_PATH.REGIST_FUNDACCOUNT_ICON}
          />
          <MoveDownIcon />
          <CardIcon
            title="자녀 투자성향 분석 및 펀드 선택"
            content={`자녀의 투자 성향을 분석해줘요.
            여러 금융사의 상품을 보여드려요.`}
            imageSrc={IMAGES_PATH.REGIST_FUNDPRODUCT_ICON}
          />
        </div>
        <div className="flex flex-col gap-3 px-3 pt-20 pb-10">
          <CustomButton
            preset="greenlong"
            onClick={() => router.push('/register/verification/child-info')}
          >
            우리 아이 펀드 가입하러 가기
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
