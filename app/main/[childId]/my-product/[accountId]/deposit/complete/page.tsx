/**
 * @page: DepositCompletePage
 * @description: 입금 완료 페이지
 * @author: 권순범
 * @date: 2026-01-27
 */

'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { CustomButton } from '@/components/cmm/CustomButton';
import { IMAGES_PATH } from '@/constants/images';

export default function DepositCompletePage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;

  return (
    <div className="-m-3 relative z-0 min-h-[calc(100%+1.5rem)] overflow-hidden bg-hana-pastel-mint/10">
      <div className="relative h-[720px] w-full overflow-hidden pb-3">
        {/* 텍스트 */}
        <div className="absolute top-[150px] left-[30px] z-20 w-full px-5">
          <h1 className="font-hana-cm text-[32px] text-gray-900">
            입금이 완료되었어요!
          </h1>
          <p className="font-hana-light text-[16px] text-hana-gray-600">
            아이의 미래를 위한 소중한 한 걸음
          </p>
        </div>

        {/* 사다리 별봄이 */}
        <div className="absolute right-5 bottom-0 z-10 h-[392px] w-[274px]">
          <Image
            src={IMAGES_PATH.LADDER_CUTE}
            alt="ladder character"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* 별 장식 */}
      {[
        'top-[52px] left-[40px]',
        'top-[93px] left-[146px] rotate-45',
        'top-[84px] left-[283px]',
        'top-[247px] left-[54px]',
        'top-[271px] left-[197px] rotate-45',
      ].map((position) => (
        <Image
          key={position}
          src={IMAGES_PATH.REGISTER_STAR}
          width={35}
          height={35}
          alt="star"
          className={`absolute z-100 ${position}`}
        />
      ))}

      {/* 확인 버튼 */}
      <div className="relative z-30 mt-4 p-5">
        <CustomButton
          preset="greenlong"
          className="font-hana-cm text-[20px] hover:cursor-pointer"
          onClick={() => {
            router.push(`/main/${childId}/my-product`);
          }}
        >
          확인
        </CustomButton>
      </div>
    </div>
  );
}
