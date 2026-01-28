import Header from '@/components/cmm/Header';
import { BottomNavBar } from '@/components/cmm/NavBar';
import type { fund_danger, fund_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { ProductListClient } from './ProductListClient';

/**
 * @page: 상품 리스트 페이지
 * @description: 일반펀드 / 연금저축펀드 구분
 * @author: typeYu
 * @date: 2026-01-27
 */

type Props = {
  searchParams?: Promise<{ type?: string }>;
};

function dangerToRisk(d: fund_danger) {
  if (d === 'HIGH') return 'high' as const;
  if (d === 'MID') return 'mid' as const;
  return 'low' as const;
}

function formatPct(v: unknown) {
  if (v == null) return '0.0';
  return String(v);
}

function formatPerformance(f: {
  plus_1: unknown;
  plus_5: unknown;
  plus_10: unknown;
}) {
  return `1년 +${formatPct(f.plus_1)}%  |  5년 +${formatPct(f.plus_5)}%  |  10년 +${formatPct(f.plus_10)}%`;
}

function pickIcon(isPension: boolean, t: fund_type) {
  if (isPension) return 'hana' as const;
  return t === 'ETF' ? ('sp' as const) : ('king' as const);
}

export default async function ProductListPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const type = sp.type === 'pension' ? 'pension' : 'general';
  const isPension = type === 'pension';

  const funds = await prisma.fund.findMany({
    where: { is_pension: isPension },
    orderBy: { id: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      danger: true,
      type: true,
      plus_1: true,
      plus_5: true,
      plus_10: true,
      is_pension: true,
    },
  });

  const items = funds.map((f) => ({
    id: f.id,
    title: f.name,
    risk: dangerToRisk(f.danger),
    extraBadgeText: undefined as string | undefined,
    subText: isPension ? undefined : f.name,
    performanceText: formatPerformance(f),
    icon: pickIcon(isPension, f.type),
  }));

  return (
    <div className="relative h-full w-full">
      <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
        <Header content="상품 리스트" />

        <main
          className="overflow-y-auto pb-20 [::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <ProductListClient type={type} items={items} />
        </main>

        <BottomNavBar />
      </div>
    </div>
  );
}
