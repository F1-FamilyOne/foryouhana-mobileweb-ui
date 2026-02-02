'use client';

import { CirclePlus } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { CustomTab } from '@/components/cmm/CustomTab';
import { MyFundDetailCard } from '@/components/cmm/MyFundDetailCard';
import { Button } from '@/components/ui/button';
import { useMyFunds } from '@/hooks/useMyFunds';
import { cn } from '@/lib/utils';

/**
 * @page: 내 펀드 목록 페이지의 ui버전입니다
 * @description: 너무 길어져서 로직 분리함
 * @author: typeYu
 * @date: 2026-01-28
 */

type TabValue = 'free' | 'regular';

function SectionTitleLine({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap font-hana-regular text-[15px]">
        {title}
      </span>
      <div className="h-px w-full bg-hana-gray-300" aria-hidden="true" />
    </div>
  );
}

function FundSummaryCard({
  totalCount,
  activeCount,
  canceledCount,
}: {
  totalCount: number;
  activeCount: number;
  canceledCount: number;
}) {
  return (
    <article
      className="rounded-[10px] bg-hana-light-green p-2 font-hana-light"
      aria-label="보유 펀드 요약"
    >
      <div className="font-hana-light text-[15px]">
        보유 펀드 총 {totalCount}종 (운용 중 {activeCount}종 / 해지{' '}
        {canceledCount}종)
      </div>
    </article>
  );
}

function GoProductsButton({
  bgVariant,
  href,
}: {
  bgVariant: 'activeLike' | 'canceledLike';
  href: Route;
}) {
  return (
    <Link href={href} aria-label="새로운 상품 보러 가기 링크">
      <Button
        type="button"
        aria-label="새로운 상품 보러 가기"
        variant="ghost"
        className={cn(
          'rounded-xl border border-hana-gray-300 font-hana-regular hover:bg-hana-main',
          bgVariant === 'canceledLike'
            ? 'bg-black/4 text-hana-gray-700'
            : 'bg-hana-light-green',
        )}
        style={{ width: 210 }}
      >
        새로운 상품 보러 가기
      </Button>
    </Link>
  );
}

function EmptyActiveState({ href }: { href: Route }) {
  return (
    <div className="py-30 text-center">
      <p className="font-hana-regular text-[15px] text-hana-gray-500">
        운용중인 펀드가 없습니다.
      </p>

      <div className="mt-6 flex justify-center">
        <GoProductsButton href={href} bgVariant="canceledLike" />
      </div>
    </div>
  );
}

type Props = {
  childId: number;
};

export function MyProductUi({ childId }: Props) {
  const [tab, setTab] = useState<TabValue>('free');

  const { activeCards, canceledCards, isLoading, isError } =
    useMyFunds(childId);

  const productListHref = `/main/${childId}/product-list?type=pension` as Route;

  const activeCount = activeCards.length;
  const canceledCount = canceledCards.length;
  const totalCount = activeCount + canceledCount;

  const hasActive = activeCount > 0;

  const activeFiltered = activeCards.filter(
    (c) => c.inType === (tab === 'free'),
  );

  return (
    <main className="mx-auto w-full max-w-md px-4 pt-4 pb-24">
      <div className="flex items-center gap-2">
        <h2 className="font-hana-medium text-[25px]">상품 리스트</h2>

        <Link href={productListHref} aria-label="상품 리스트 추가 버튼">
          <CirclePlus className="h-6 w-6 text-hana-gray-700 hover:text-hana-main" />
        </Link>
      </div>

      <div className="mt-3">
        <FundSummaryCard
          totalCount={totalCount}
          activeCount={activeCount}
          canceledCount={canceledCount}
        />
      </div>

      {isLoading ? (
        <div className="py-10 text-center font-hana-regular text-[15px] text-hana-gray-500">
          불러오는 중...
        </div>
      ) : isError ? (
        <div className="py-10 text-center font-hana-regular text-[15px] text-hana-gray-500">
          데이터를 불러오지 못했습니다.
        </div>
      ) : (
        <section className="mt-6 space-y-6">
          <div className="space-y-3">
            <SectionTitleLine title={`운용중 (${activeCount}종)`} />

            {hasActive ? (
              <>
                <div className="flex justify-center">
                  <CustomTab
                    variant="big"
                    value={tab}
                    onChange={(v) => setTab(v as TabValue)}
                    tabs={[
                      { label: '자유적립식', value: 'free' },
                      { label: '정기적립식', value: 'regular' },
                    ]}
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-3">
                    {activeFiltered.map((card) => (
                      <MyFundDetailCard
                        key={`${card.id}-${card.fundId}`}
                        accountId={card.id}
                        fundId={card.fundId}
                        accNum={card.accNum}
                        variant="active"
                        title={card.title}
                        tags={card.tags}
                        depositWonText={card.depositWonText}
                        totalAmountWonText={card.totalAmountWonText}
                        profitWonText={card.profitWonText}
                        profitRateText={card.profitRateText}
                        monthlyPayWonText={card.monthlyPayWonText}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyActiveState href={productListHref} />
            )}
          </div>

          <div className="space-y-3">
            <SectionTitleLine title={`해지 (${canceledCount}종)`} />

            <div className="space-y-3">
              <div className="space-y-3">
                {canceledCards.map((card) => (
                  <MyFundDetailCard
                    key={`${card.id}-${card.fundId}`}
                    accountId={card.id}
                    fundId={card.fundId}
                    accNum={card.accNum}
                    variant="canceled"
                    title={card.title}
                    tags={card.tags}
                    depositWonText={card.depositWonText}
                    totalAmountWonText={card.totalAmountWonText}
                    profitWonText={card.profitWonText}
                    profitRateText={card.profitRateText}
                    monthlyPayWonText={card.monthlyPayWonText}
                  />
                ))}
              </div>
            </div>

            {hasActive ? (
              <div className="flex justify-center pt-2">
                <GoProductsButton
                  href={productListHref}
                  bgVariant="activeLike"
                />
              </div>
            ) : null}
          </div>
        </section>
      )}
    </main>
  );
}
