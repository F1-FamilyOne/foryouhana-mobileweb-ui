'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TimelineHeader({
  childrenList,
}: {
  childrenList: { id: number; name: string; profile_pic: string | null }[];
}) {
  const params = useParams();

  const currentChildId = Number(params.childId);

  const activeProfileClass =
    'border-(--color-hana-light-green) scale-110 z-20 shadow-md';
  const inactiveProfileClass = 'border-white z-10 opacity-70 hover:opacity-100';

  return (
    <header className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="font-bold text-[24px] text-hana-dark-navy leading-tight">
          타임라인
        </h1>
        <p className="mt-1 text-[14px] text-gray-400">
          시작부터 지금까지의 과정
        </p>
      </div>

      <div className="-space-x-3 flex items-center pt-2">
        {childrenList.map((child) => (
          <Link
            key={child.id}
            href={`/main/${child.id}/timeline`}
            className={`relative h-11 w-11 overflow-hidden rounded-full border-2 transition-all duration-300 ${
              currentChildId === child.id
                ? activeProfileClass
                : inactiveProfileClass
            }`}
          >
            {child.profile_pic ? (
              <Image
                src={child.profile_pic}
                alt={child.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[10px] text-gray-500">
                {child.name}
              </div>
            )}
          </Link>
        ))}
      </div>
    </header>
  );
}
