import clsx from 'clsx';
import { Plus } from 'lucide-react';
import Image from 'next/image';

/**
 * @page: ToggleChildProfile
 * @description: 홈화면 상단에 나타나는 자녀 토글입니다.
 * 프로필을 선택하면 선택된 자녀가 바뀝니다.
 * 해당 컴포넌트의 onSelect 함수를 이용하여 선택된 자녀의 id를 외부로 전달합니다.
 * @author: 이정수
 * @date: 2026-01-25
 */

export type KidProfile = {
  id: number;
  avatarUrl: string;
};

type Props = {
  onSelect: (kidId: number) => void;
  selectedKidId: number;
  kids: KidProfile[];
  onAddKid?: () => void;
};

export default function ToggleChildProfile({
  kids,
  onSelect,
  selectedKidId,
  onAddKid,
}: Props) {
  const orderedKids = [
    ...kids.filter((kid) => kid.id === selectedKidId),
    ...kids.filter((kid) => kid.id !== selectedKidId),
  ];
  return (
    <div className="flex">
      <ul className="group ml-auto flex items-center">
        {orderedKids.map((kid, index) => {
          return (
            <li
              key={kid.id}
              style={{ zIndex: kids.length - index }}
              className={clsx(
                '-ml-10 transition-all duration-200 ease-out group-hover:ml-0',
                kid.id === selectedKidId &&
                  'rounded-full text-hana-complete ring-2',
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(kid.id)}
                className="flex h-13 w-13 justify-center overflow-hidden rounded-full hover:scale-105"
              >
                <Image
                  width={400}
                  height={400}
                  src={kid.avatarUrl || `/file/default.png`}
                  alt={`${kid.id.toString()}프로필`}
                  className="object-cover"
                />
              </button>
            </li>
          );
        })}
        <li
          className="-ml-10 transition-all duration-200 ease-out group-hover:ml-0"
          style={{ zIndex: 0 }}
        >
          <button
            type="button"
            className="flex h-13 w-13 items-center justify-center overflow-hidden rounded-full bg-hana-gray-400 hover:scale-105"
            onClick={onAddKid}
            aria-label="자녀 추가"
          >
            <Plus />
          </button>
        </li>
      </ul>
    </div>
  );
}
