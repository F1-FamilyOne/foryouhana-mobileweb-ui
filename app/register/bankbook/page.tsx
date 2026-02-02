'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { IMAGES_PATH } from '@/constants/images';

export default function BankBookRegisterPage() {
  const router = useRouter();
  const handleNext = () => {
    router.push('/register/verification/verify-complete');
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header content="내아이통장만들기" />
      {/* 상단 영역 */}
      <div className="bg-white px-6 pt-6 pb-10">
        <div className="text-center">
          <p className="mb-3 font-bold text-xl leading-snug">
            모바일로 간편하게!
            <br />
            아빠 엄마가 만들어주는 통장
          </p>

          <p className="mb-8 text-gray-500 text-sm">
            미성년 자녀의 친권을 가진 부모님만
            <br />
            신청할 수 있어요.
          </p>

          {/* 지갑 이미지 */}
          <div className="flex justify-center">
            <Image
              alt="bankbook"
              src={IMAGES_PATH.BANKBOOK_PNG}
              width={300}
              height={300}
              className="animate-subtle-float"
            />
          </div>
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="-mt-6 px-4">
        <div className="divide-y rounded-2xl bg-white px-6 shadow-sm">
          {/* 통장 만들기 */}
          <button
            type="button"
            className="flex w-full items-center justify-between py-5 text-left"
            onClick={() => {}}
          >
            <div>
              <div className="mb-1 font-semibold text-base">통장 만들기</div>
              <p className="text-gray-500 text-sm">입출금 통장을 개설해요.</p>
            </div>
            <span className="text-gray-400 text-lg">{'>'}</span>
          </button>
        </div>
        <CustomButton className="mt-55" preset="greenlong" onClick={handleNext}>
          개설 완료
        </CustomButton>
      </div>
    </div>
  );
}
