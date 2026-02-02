import Image from 'next/image';
import Link from 'next/link';
import {
  getAccountBasics,
  getAccumulatedGiftAmount,
  getChildTaxInfo,
  getFamilyStats,
  getFormattedFundList,
  getThisMonthInputAmount,
} from '@/actions/home.action';
import { BottomNavBar } from '@/components/cmm/NavBar';
import ChildAccountInfoCard from '@/components/home/ChildAccountInfoCard';
import ChildFundSection from '@/components/home/ChildFundSection';
import GiftStatusSection from '@/components/home/GiftStatusSection';
import GiftTaxSection from '@/components/home/GiftTaxSection';
import HomeClientWrapper from '@/components/home/HomeClientWrapper';

type Props = {
  params: Promise<{ childId: string }>;
};

export default async function home({ params }: Props) {
  const { childId } = await params;
  const currentChildId = Number(childId);
  Number(childId);
  const PARENT_ID = 1; //로그인 구현 안되어있으므로 하드코딩

  // 1. 기본 데이터 페칭 (병렬 처리)
  const [basics, familyStats, fundList] = await Promise.all([
    getAccountBasics(currentChildId),
    getFamilyStats(PARENT_ID),
    getFormattedFundList(currentChildId),
  ]);

  // 2. basics 결과에 의존하는 2차 페칭
  // Promise.all로 묶어서 다시 병렬 처리
  const [thisMonthInputAmount, childTaxInfo] = await Promise.all([
    basics.giftAccount ? getThisMonthInputAmount(basics.giftAccount.id) : 0,
    getChildTaxInfo(currentChildId, basics.giftAccount?.id),
  ]);

  // 3. 누적 증여액 계산 (TaxInfo의 결과를 활용)
  const accumulatedAmount = await getAccumulatedGiftAmount(
    currentChildId,
    childTaxInfo?.is_promise_fixed || false,
    PARENT_ID,
    basics.giftAccount?.id,
  );

  // 4. UI 데이터 가공
  const currentChildData = familyStats.find((k) => k.id === currentChildId);
  const kidsProfiles = familyStats.map((k) => ({
    id: k.id,
    avatarUrl: k.avatarUrl,
  }));

  return (
    <main className="flex flex-col gap-4 bg-hana-white-50">
      {/* 상단: 자녀 선택 및 전체 통계 */}
      <HomeClientWrapper
        initialChildId={currentChildId}
        kidsProfiles={kidsProfiles}
        kidsChartData={familyStats}
        is_promise_fixed={childTaxInfo?.is_promise_fixed || false}
        hasPensionAccount={basics.hasPensionAccount}
      />

      {/* 중단: 현재 선택된 자녀의 증여 현황 카드 */}
      {currentChildData && (
        <GiftStatusSection
          accumulatedAmount={accumulatedAmount}
          bornDate={childTaxInfo?.born_date || new Date()}
          isPromiseFixed={childTaxInfo?.is_promise_fixed || false}
        />
      )}

      {/* 중단: 현재 선택된 자녀의 증여용 계좌 현황 카드 */}
      <ChildAccountInfoCard
        childId={childId}
        deposit={Number(basics.giftAccount?.deposit || 0)}
        thisMonthAmount={thisMonthInputAmount}
        monthlyMoney={BigInt(childTaxInfo?.monthly_money || 0)}
      />

      {/* 중단: 현재 선택된 자녀의 증여세 신고 정보 카드 */}
      {childTaxInfo && <GiftTaxSection childInfo={childTaxInfo} />}

      {/* 중단: 현재 선택된 자녀의 펀드 리스트 카드 */}
      <ChildFundSection childId={currentChildId} fundList={fundList} />

      {/* 챗봇 */}
      <div className="sticky bottom-20 z-50 flex justify-end px-4">
        <Link
          href={`/main/${childId}/chatbot`}
          className="cursor-pointer transition-transform hover:scale-100 active:scale-95"
        >
          <Image
            src="/chatbot/icon/starbot.svg"
            alt="hana-bot"
            width={90}
            height={90}
            className="drop-shadow-lg"
          />
        </Link>
      </div>
      {/* Header (부모 상단) */}
      <BottomNavBar />
    </main>
  );
}
