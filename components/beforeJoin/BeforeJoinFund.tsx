'use client';

import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ChildListItem } from '@/actions/getUserSetup';
import MainCute from '@/components/home/MainCute';
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';

export default function BeforeJoinFund({
  initialChildId,
  childList,
}: {
  initialChildId: number;
  childList: ChildListItem[];
}) {
  const router = useRouter();

  const [selectedKidId, setSelectedKidId] = useState<number>(initialChildId);

  const pathname = usePathname();

  const selectedChild = useMemo(() => {
    return childList.find((c) => c.childId === selectedKidId) ?? null;
  }, [childList, selectedKidId]);

  const kids = useMemo<KidProfile[]>(() => {
    return childList.map((c) => ({
      id: c.childId,
      avatarUrl: c.profile ?? '/file/default.png',
    }));
  }, [childList]);

  useEffect(() => {
    if (!selectedChild) return;

    const target = (
      selectedChild.hasFundAccount
        ? `/main/${selectedChild.childId}/home`
        : `/main/${selectedChild.childId}/beforeJoin/nofund-status`
    ) as Route;

    if (pathname !== target) {
      router.replace(target);
    }
  }, [selectedChild, pathname, router]);

  if (!selectedChild) return <div className="p-6">불러오는 중...</div>;

  return (
    <div className="flex min-h-full w-full flex-col">
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
            href={`/main/${selectedKidId}/beforeJoin/test`}
            className="rounded-lg bg-hana-main hover:bg-hana-green active:bg-hana-green"
          >
            <h1 className="px-5 py-3.25 font-hana-cm text-[18px] text-white">
              펀드 리스트 보러가기
            </h1>
          </Link>
        </div>
      </div>

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
