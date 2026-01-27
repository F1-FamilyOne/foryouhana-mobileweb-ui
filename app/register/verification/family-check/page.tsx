'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import ProgressBar from '@/components/cmm/ProgressBar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: familyCheckPage
 * @description: 가족관계증명 단계에서 하나인증서로 인증하는 화면
 * @author: minyoung
 * @date: 2026-01-27
 */

export default function familyCheckPage() {
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const router = useRouter();
  const handleNext = () => {
    router.push('/register/verification/verify-list');
  };

  return (
    <div>
      <Header content="아이앞으로 가입" />
      <div className="mt-6">
        <ProgressBar
          step="current"
          step2="pending"
          content1="가족관계 확인하기"
          content2="계좌 개설"
        />

        <div className="flex items-center">
          <Image
            src={IMAGES_PATH.FAMILYCHECK_SCOURT_ICON}
            alt="전자가족관계등록시스템로고"
            width={70}
            height={70}
            className="mx-3 mt-5 mb-2 object-contain"
            priority
          />
          <span className="font-hana-medium text-[22px]">
            전자가족관계등록시스템
          </span>
        </div>

        <div className="flex items-center justify-center">
          <Image
            src={IMAGES_PATH.FAMILYCHECK_HANA_ICON}
            alt="전자서명 인증시스템 하나로고"
            width={70}
            height={70}
            className="mx-3 mt-18 mb-2"
            priority
          />
        </div>

        <p className="mt-3 flex items-center justify-center font-hana-light text-[18px]">
          전자서명 인증시스템
        </p>
        <span className="mt-3 flex items-center justify-center font-hana-medium text-[24px]">
          하나인증서로 인증해주세요
        </span>
        <p className="mt-3 flex items-center justify-center font-hana-light text-[18px]">
          본인이 아닐 경우 즉시 신고 요망 <br />
          하나은행 고객센터 1599-1111
        </p>

        <Label className="mx-3 mt-45 flex cursor-pointer items-center justify-center gap-2">
          <Checkbox
            className="border-gray-300 data-[state=checked]:border-hana-main data-[state=checked]:bg-hana-main data-[state=checked]:text-white"
            onCheckedChange={(checked) => setIsAgreed(checked === true)}
          />
          <span className="font-hana-medium text-[16px]">
            [필수] 개인(신용)정보 제3자제공 동의
          </span>
        </Label>

        <CustomButton
          className="mx-3 mt-4"
          preset={'greenlong'}
          disabled={!isAgreed}
          onClick={handleNext}
        >
          다음
        </CustomButton>
      </div>
    </div>
  );
}
