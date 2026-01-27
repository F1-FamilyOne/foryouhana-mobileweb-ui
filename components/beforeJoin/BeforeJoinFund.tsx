'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  type ChildList,
  getAllChildWithIsHaveFund,
} from '@/actions/getUserSetup';
import MainCute from '@/components/home/MainCute';
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';
import { useUserContext } from '@/hooks/useUserContext';

export default function BeforeJoinFund({
  initialChildId,
}: {
  initialChildId: number;
}) {
  const router = useRouter();
  const { userId, ready } = useUserContext();

  const [children, setChildren] = useState<ChildList[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<number>(initialChildId);

  useEffect(() => {
    if (!ready || !userId) return;

    (async () => {
      const result = await getAllChildWithIsHaveFund(Number(userId));
      if (!result.exists) return;

      setChildren(result.children);

      const valid =
        result.children.find((c) => c.childId === initialChildId) ??
        result.children[0];

      setSelectedKidId(valid.childId);
    })();
  }, [ready, userId, initialChildId]);

  /** derive */
  const selectedChild = useMemo(() => {
    return children.find((c) => c.childId === selectedKidId) ?? null;
  }, [children, selectedKidId]);

  const kids = useMemo<KidProfile[]>(() => {
    return children.map((c) => ({
      id: c.childId,
      avatarUrl: c.profile ?? '/file/자녀1.jpg',
    }));
  }, [children]);

  useEffect(() => {
    if (!selectedChild) return;

    if (selectedChild.hasFundAccount) {
      router.replace(`/main/${selectedChild.childId}/home`);
    }
  }, [selectedChild, router]);

  if (!selectedChild) return null;

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <div className="relative">
        <MainCute />

        <div className="-bottom-6.5 absolute right-0 flex justify-center">
          <ToggleChildProfile
            kids={kids}
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
