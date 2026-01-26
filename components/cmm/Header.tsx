'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * @page: 헤더
 * @description: 다수의 페이지에 들어가는 헤더입니다. content를 받아 표시합니다.
 * @author: 승빈
 * @date: 2026-01-23
 */

type Props = {
  content: string;
};
export default function Header({ content }: Props) {
  const router = useRouter();
  return (
    <div className="-mx-3 -my-3 relative mb-3 flex h-[65px] w-[393px] items-center justify-center rounded-t-4xl border-b border-b-[var(--color-hana-gray-300)] bg-white font-hana-cm shadow-b-xs">
      <button
        onClick={() => router.back()}
        type="button"
        className="absolute left-6 hover:cursor-pointer"
      >
        <ChevronLeft />
      </button>
      <div className="text-[18px]">{content}</div>
    </div>
  );
}
