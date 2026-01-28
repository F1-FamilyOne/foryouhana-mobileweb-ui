import Header from '@/components/cmm/Header';
import { BottomNavBar } from '@/components/cmm/NavBar';
import type { fund_danger, fund_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { FundHeaderSection } from './fund-header-section';
import { FundKeyPointsSection } from './fund-key-points-section';
import { FundMetaGrid } from './fund-meta-grid';
import { FundOverviewSection } from './fund-overview-section';
import { FundRiskBadge } from './fund-risk-badge';
import { FundStatSection } from './fund-stat-section';
import { PriceTrendSection } from './price-trend-section.client';

/**
 * @page: 펀드 상품 리스트 화면_가입설명(서버 컴포넌트)
 * @description: 펀드 카드를 누르면 나오는 각 펀드의 디테일한 설명 페이지(길어서 컴포넌트로 많이 뺌)
 * @author: typeYu
 * @date: 2026-01-27
 */

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ type?: string }>;
};

type RiskUi = 'high' | 'mid' | 'low';
type DetailIcon = 'hana' | 'king' | 'sp';

function dangerToRisk(d: fund_danger): RiskUi {
  if (d === 'HIGH') return 'high';
  if (d === 'MID') return 'mid';
  return 'low';
}

function pickIcon(isPension: boolean, t: fund_type) {
  if (isPension) return 'hana' as const;
  return t === 'ETF' ? ('sp' as const) : ('king' as const);
}

function getLogoSrc(icon: DetailIcon) {
  if (icon === 'hana') return '/fund-card/hanalogo.svg';
  if (icon === 'sp') return '/fund-card/S&P.svg';
  return '/fund-card/king.svg';
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const fundId = Number(id);

  const isInvalidId = !Number.isFinite(fundId);

  const fund = isInvalidId
    ? null
    : await prisma.fund.findUnique({
        where: { id: fundId },
        select: {
          id: true,
          name: true,
          company: true,
          danger: true,
          type: true,
          total_fee: true,
          sell_fee: true,
          set_date: true,
          total_money: true,
          plus_1: true,
          plus_5: true,
          plus_10: true,
          is_pension: true,
        },
      });

  return (
    <div className="relative h-full w-full">
      <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
        <Header content="상품 상세보기" />

        <main
          className="overflow-y-auto pb-20 [::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {isInvalidId ? (
            <div className="p-4 font-hana-cm text-[14px] text-hana-dark-navy">
              잘못된 접근입니다.
            </div>
          ) : !fund ? (
            <div className="p-4 font-hana-cm text-[14px] text-hana-dark-navy">
              상품을 찾을 수 없습니다.
            </div>
          ) : (
            <div className="px-4">
              {(() => {
                const risk = dangerToRisk(fund.danger);
                const icon = pickIcon(fund.is_pension, fund.type);
                const logoSrc = getLogoSrc(icon);

                return (
                  <>
                    <FundHeaderSection
                      company={fund.company}
                      logoSrc={logoSrc}
                      icon={icon}
                    />

                    <div className="my-3 h-px w-full bg-hana-gray-200" />

                    <FundRiskBadge risk={risk} />

                    <div className="pt-3 font-hana-bold text-[24px] text-black">
                      {fund.name}
                    </div>

                    <div className="pt-2 font-hana-cm text-[14px] text-hana-gray-600">
                      <div>글로벌 우량 기업에 투자하여</div>
                      <div>안정적인 수익을 추구하는 펀드</div>
                    </div>

                    <FundStatSection
                      plus1={fund.plus_1}
                      totalMoney={fund.total_money}
                      setDate={new Date(fund.set_date)}
                    />

                    <div className="my-2 mt-10 h-[8px] w-full bg-hana-gray-100" />

                    <PriceTrendSection defaultValue="m6" />

                    <FundOverviewSection />

                    <FundMetaGrid
                      company={fund.company}
                      setDate={new Date(fund.set_date)}
                      totalFee={fund.total_fee}
                      sellFee={fund.sell_fee}
                    />

                    <div className="pt-15 font-hana-bold text-[16px] text-black">
                      이 펀드의 핵심 포인트
                    </div>

                    <FundKeyPointsSection />

                    <div className="h-6" />
                  </>
                );
              })()}
            </div>
          )}
        </main>

        <BottomNavBar />
      </div>
    </div>
  );
}
