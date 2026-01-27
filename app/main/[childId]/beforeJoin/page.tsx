'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import MainCute from '@/components/home/MainCute';
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';

const kidsProfile: KidProfile[] = [
  { id: 1, avatarUrl: '/file/자녀1.jpg' },
  { id: 2, avatarUrl: '/file/자녀2.jpg' },
  { id: 3, avatarUrl: '/file/자녀3.jpg' },
];

export default function BeforeJoinFund() {
  const [selectedKidId, setSelectedKidId] = useState<number>(1);

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <div className="relative">
        <MainCute />

        <div className="-bottom-6.5 absolute right-0 flex justify-center">
          <ToggleChildProfile
            kids={kidsProfile}
            selectedKidId={selectedKidId}
            onSelect={setSelectedKidId}
            onAddKid={() => console.log('자녀 추가')}
          />
        </div>
      </div>

      {/* 메인 카드 */}
      <div className="mt-5.75 px-4">
        <div className="flex flex-col items-center rounded-2xl bg-hana-light-green py-8 shadow-sm">
          <Image
            src="/beforeJoin/MoneyCircle.svg"
            width={300}
            height={235}
            alt="코인"
            className="mb-4"
          />

          <h1 className="mb-4 text-center font-hana-bold text-[25px] leading-tight">
            본격적으로
            <br />
            가입할 상품을 선택하러 가요!
          </h1>

          <Link
            href={`/onboarding/intro`}
            className="rounded-lg bg-hana-main hover:bg-hana-green active:bg-hana-green"
          >
            <h1 className="px-5 py-3.25 font-hana-cm text-[18px] text-white">
              펀드 리스트 보러가기
            </h1>
          </Link>
        </div>
      </div>

      {/* 하단 카드 2개 */}
      <div className="mt-4 grid grid-cols-2 gap-6 px-4">
        <div className="rounded-xl bg-hana-light-purple p-4 shadow-sm">
          <h2 className="font-hana-cm text-[20px]">
            펀드에 대해
            <br />
            알고싶어요!
          </h2>
          <p className="font-hana-light text-[16px] text-gray-600">
            금융 전문가가 알려주는 원큐 설명
          </p>
        </div>

        <div className="rounded-xl bg-hana-pastel-yellow p-4 shadow-sm">
          <h2 className="font-hana-cm text-[20px]">
            복리?
            <br />
            연금저축?
          </h2>
          <p className="font-hana-light text-[16px] text-gray-600">
            연금저축펀드에 대해 알아보아요
          </p>
        </div>
      </div>
    </div>
  );
}
