'use client';

import type { Route } from 'next';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { CustomTab } from '@/components/cmm/CustomTab';
import { FundListItemCard } from '@/components/cmm/FundListItemCard';

/**
 * @page: ProductListClient
 * @description: 상품 리스트 탭 UI와 카드 클릭 이동을 담당하는 Client 컴포넌트
 *
 * - Server Page에서 조회한 items를 받아 렌더링
 * - CustomTab으로 type(general/pension) 쿼리를 router.push로 변경
 * - 카드 클릭 시 /main/product-list/[id] 상세 페이지로 이동
 *
 * @author: typeYu
 * @date: 2026-01-27
 */

const tabs = [
  { label: '일반펀드', value: 'general' },
  { label: '연금저축펀드', value: 'pension' },
];

type Props = {
  type: 'general' | 'pension';
  items: {
    id: number;
    title: string;
    risk: 'high' | 'mid' | 'low';
    extraBadgeText?: string;
    subText?: string;
    performanceText: string;
    icon?: 'hana' | 'king' | 'sp';
  }[];
};

export function ProductListClient({ type, items }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const childId = params.childId as string;

  const handleChange = (nextValue: string) => {
    const next = nextValue === 'pension' ? 'pension' : 'general';
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', next);
    router.push(`${pathname}?${params.toString()}` as Route);
  };

  return (
    <div>
      <div className="flex justify-center pt-5 pb-5">
        <CustomTab
          tabs={tabs}
          value={type}
          onChange={handleChange}
          variant="big"
        />
      </div>

      <div className="px-4">
        <div className="font-hana-cm text-[16px] text-black">
          전체 <span className="text-hana-main">{items.length}</span>
        </div>

        <div className="pt-2 text-right font-hana-main text-[13px] text-hana-main">
          보유중 · {items.length}
        </div>

        <div className="space-y-3 pt-3">
          {items.map((it) => (
            <Link
              key={it.id}
              href={{
                pathname: `/main/${childId}/product-list/${it.id}`,
                query: { type },
              }}
              className="block"
              aria-label={`${it.title} 상세보기로 이동`}
            >
              <FundListItemCard
                title={it.title}
                risk={it.risk}
                extraBadgeText={it.extraBadgeText}
                subText={it.subText}
                performanceText={it.performanceText}
                icon={it.icon}
                className="w-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
