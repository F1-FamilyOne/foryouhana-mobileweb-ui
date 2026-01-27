'use client';

import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import ProgressBar from '@/components/cmm/ProgressBar';
import AccountInfoCard from '@/components/register/AccountInfoCard';

/**
 * @page: verifyCompletePage
 * @description: 계좌 및 펀드 가입 신청 완료 페이지
 * @author: minyoung
 * @date: 2026-01-27
 */

export default function verifyComplete() {
  const summaryItems = [
    { label: '계좌명', value: '하나은행 일반입출금통장 for 펀드' },
    { label: '정기입금일', value: '1일' },
    { label: '전자금융 출금계좌등록', value: '인터넷뱅킹' },
  ];

  const router = useRouter();

  const handleNext = () => {
    router.push('/register/complete');
  };

  return (
    <div>
      <Header content="아이앞으로 가입" />
      <div className="mt-6">
        <ProgressBar
          step="completed"
          step2="completed"
          content1="가족관계 확인하기"
          content2="계좌 개설"
        />
      </div>
      <div>
        <h1 className="mx-3 mt-3 font-hana-bold text-[20px] leading-snug">
          신청내역을 <br /> 확인해 주세요
        </h1>
        <hr className="mx-3.5 my-8 w-[335px] border-hana-gray-400 border-t" />
        <h1 className="mx-3 mt-3 font-hana-bold text-[15px] leading-snug">
          입출금 정보
        </h1>
      </div>
      <div className="mt-5">
        <AccountInfoCard items={summaryItems} />
      </div>
      <div className="mx-3 mt-80 flex flex-col gap-8">
        <CustomButton preset="greenlong" onClick={handleNext}>
          다음
        </CustomButton>
      </div>
    </div>
  );
}
