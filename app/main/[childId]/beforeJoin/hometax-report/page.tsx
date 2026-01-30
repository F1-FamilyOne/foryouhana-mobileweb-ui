'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { HometaxReportCard } from '@/components/cmm/HometaxSupportCard';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: HomeTaxReportPage
 * @description: 홈택스 유기정기금 신고를 안내하고, 신고 완료 후에만 다음 단계(홈 화면)로 이동할 수 있도록 제어하는 페이지
 * @state isReported
 * - 홈택스 신고 완료 여부를 나타내는 상태값
 * - true일 경우만 하단 버튼 활성화
 * @navigation
 * - 신고 완료 후 "홈 화면으로 이동" 버튼 클릭 시 이동
 * @author: minyoung
 * @date: 2026-01-26
 */

export default function HomeTaxReportPage() {
  const [isReported, setIsReported] = useState(false);

  const router = useRouter();
  const params = useParams();

  const handleNext = () => {
    router.push(`/main/${params.childId}/beforeJoin/nofund-status`);
  };

  return (
    <div className="flex flex-col">
      <div className="relative min-h-full">
        <Image
          src={IMAGES_PATH.HOMETAX_TREEIMG}
          alt="background"
          width={600}
          height={800}
          className="pointer-events-none absolute top-[360px] left-[-100px] opacity-20"
          priority
        />
      </div>
      <Header content="홈택스 신고" />
      <section className="mx-3 mt-5">
        <h1 className="font-hana-cm text-[22px] leading-tight">
          유기정기금 신고를 진행해주세요.
        </h1>
      </section>
      <div className="relative z-10 mt-30">
        <section className="mx-3 mt-3">
          <HometaxReportCard onReportComplete={() => setIsReported(true)} />
        </section>

        <section className="mx-4 mt-3.5 space-y-1">
          <p className="font-hana-regular text-[13px] text-hana-red">
            ※ 다음 안내사항을 반드시 숙지해주세요.
          </p>
          <p className="font-hana-medium text-[12px] text-hana-gray-600 leading-relaxed">
            유기정기금 중단·변경 사항은 본 서비스에 자동 반영되지 않습니다.
            <br />
            국세청 신고 및 서비스 내 플랜 변경은 사용자가 직접 진행해야 합니다.
            서비스 표시는 증여 관리 참고용입니다.
          </p>
        </section>
      </div>

      <div className="flex w-full justify-end">
        <Image
          src={IMAGES_PATH.HOMETAX_STARTSPRING}
          alt={'starspringseed'}
          width={150}
          height={150}
          className="mt-15"
        />
      </div>

      <div className="-mt-55 relative z-10 px-3">
        <CustomButton
          className="mt-55"
          preset="greenlong"
          disabled={!isReported}
          onClick={handleNext}
        >
          다음
        </CustomButton>
      </div>
    </div>
  );
}
