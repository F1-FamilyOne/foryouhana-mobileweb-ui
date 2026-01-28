//마스코트 + 메시지
//뱃지

import ChildAccountInfoCard from '@/components/home/ChildAccountInfoCard';
import ChildFundSection from '@/components/home/ChildFundSection';
import GiftStatusSection from '@/components/home/GiftStatusSection';
import GiftTaxSection from '@/components/home/GiftTaxSection';
import HomeClientWrapper from '@/components/home/HomeClientWrapper';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ childId: string }>;
};

export default async function home({ params }: Props) {
  const { childId } = await params;
  const currentChildId = Number(childId);
  const PARENT_ID = 2;

  // 1. 이번 달 시작일 계산 (예: 2026-01-01 00:00:00)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  //필요한 자녀 정보 통합
  const child = await prisma.child.findUnique({
    where: { id: currentChildId, parent_id: PARENT_ID },
    select: {
      id: true,
      name: true,
      profile_pic: true,
      gift_account_id: true,
    },
  });

  //연금저축계좌 존재 여부 확인 (count 사용)
  const pensionCount = await prisma.account.count({
    where: {
      child_id: currentChildId,
      acc_type: 'PENSION', // 연금저축계좌 타입 확인
    },
  });

  const hasPensionAccount = pensionCount > 0;

  //자녀 입출금 통장 정보
  const giftAccount = await prisma.account.findUnique({
    where: { id: child?.gift_account_id || -1 }, // -1은 null 방지용 임시값
    select: {
      id: true,
      deposit: true,
    },
  });

  // 3. 입출금 통장의 "이번 달 입금 총액" 계산
  let thisMonthInputAmount = 0;
  if (giftAccount) {
    const historyAgg = await prisma.history.aggregate({
      where: {
        target_account_id: giftAccount.id,
        created_at: { gte: startOfMonth },
      },
      _sum: {
        money: true,
      },
    });
    thisMonthInputAmount = Number(historyAgg._sum.money || 0);
  }

  //이 정보가 ChildTaxSection 컴포넌트에서 필요함
  const childInfo = await prisma.child.findUnique({
    where: { id: currentChildId },
    select: {
      is_promise_fixed: true,
      monthly_money: true,
      goal_money: true,
      start_date: true,
      end_date: true,
      born_date: true,
    },
  });

  //증여세 신고 정보
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  threeMonthsAgo.setDate(1);

  // 1. 해당 자녀의 펀드 및 연금 계좌 ID 리스트 추출
  const childAccounts = await prisma.account.findMany({
    where: {
      child_id: currentChildId,
      acc_type: { in: ['FUND', 'PENSION'] },
    },
    select: { id: true },
  });

  const accountIds = childAccounts.map((acc) => acc.id);

  // 2. history 테이블에서 최근 3개월간 해당 계좌들로 입금된 금액 합산
  // (target_account_id가 자녀의 펀드계좌인 경우만 추출)
  //let 써도 되나
  let recentHistory = null;
  if (childInfo?.is_promise_fixed === false) {
    recentHistory = await prisma.history.aggregate({
      where: {
        target_account_id: { in: accountIds },
        created_at: { gte: threeMonthsAgo },
      },
      _sum: {
        money: true,
      },
    });
  }

  const childTaxInfo = {
    is_promise_fixed: childInfo?.is_promise_fixed || false,
    monthly_money: childInfo?.monthly_money
      ? Number(childInfo.monthly_money)
      : null,
    goal_money: childInfo?.goal_money ? Number(childInfo.goal_money) : null,
    start_date: childInfo?.start_date ? new Date(childInfo.start_date) : null,
    end_date: childInfo?.end_date ? new Date(childInfo.end_date) : null,
    born_date: childInfo?.born_date || new Date(),
    in_money_sum: Number(recentHistory?._sum.money) || null, // history 기반 실제 입금 합계
  };
  //--- TaxInfo 데이터 조회 끝 ---

  // 1. 자녀 정보 조회 (입출금 통장 제외 필터링 적용)
  const childrenData = await prisma.child.findMany({
    where: { parent_id: PARENT_ID },
    select: {
      id: true,
      name: true,
      profile_pic: true,
      account: {
        where: {
          acc_type: { in: ['FUND', 'PENSION'] },
        },
        select: {
          deposit: true,
          plus_money: true,
          acc_type: true,
        },
      },
    },
  });

  // 2. Toggle용 프로필 데이터 가공
  const kidsProfilesForToggle = childrenData.map((c) => ({
    id: c.id,
    avatarUrl: c.profile_pic || '',
  }));

  // 3. 차트 및 증여 현황용 데이터 가공
  const kidsDataForChart = childrenData.map((child) => {
    // 펀드, 연금 등 증여성 계좌의 입금 총합
    const totalGiftAmount = child.account.reduce(
      (sum, acc) => sum + Number(acc.deposit),
      0,
    );

    // 해당 자녀의 전체 수익금(plus_money) 합산
    const totalProfitAmount = child.account.reduce(
      (sum, acc) => sum + Number(acc.plus_money || 0),
      0,
    );

    return {
      name: child.name,
      giftamount: totalGiftAmount,
      profitAmount: totalProfitAmount,
      childId: child.id, // 현재 자녀 식별을 위해 추가하시오.
    };
  });

  // 4. 현재 페이지의 주인공(currentChildId) 데이터만 추출
  const currentChildData = kidsDataForChart.find(
    (kid) => kid.childId === currentChildId,
  );

  //펀드 리스트 데이터
  const fundList = await prisma.account.findMany({
    where: {
      child_id: currentChildId,
      acc_type: 'FUND',
    },
    select: {
      id: true,
      fund: {
        select: {
          name: true,
        },
      },
      plus_rate: true,
      in_month: true,
      deposit: true,
      plus_money: true,
    },
  });

  const formattedFundList = await Promise.all(
    fundList.map(async (f) => {
      let autoTransferAmount = Number(f.in_month || 0);

      // 비정기 납입(in_month가 없는 경우)이라면 History에서 이번 달 입금 총액 조회
      const historySum = await prisma.auto_transfer.aggregate({
        where: {
          target_account_id: f.id, // 해당 펀드 계좌 ID
        },
        _sum: {
          amount: true,
        },
      });
      autoTransferAmount = Number(historySum._sum.amount || 0);

      return {
        paymentType: f.in_month ? 'regular' : 'irregular',
        rate: Number(f.plus_rate || 0),
        plusMoney: Number(f.plus_money || 0),
        title: f.fund?.name || '알 수 없는 펀드',
        deposit: f.deposit,
        totalValue: Number(f.deposit) + Number(f.plus_money || 0),
        autoTransferAmount: autoTransferAmount, // 계산된 이번 달 금액 적용
      };
    }),
  );

  return (
    <main className="flex flex-col gap-4 bg-hana-white-50">
      {/* 상단: 자녀 선택 및 전체 통계 */}
      <HomeClientWrapper
        initialChildId={currentChildId}
        kidsProfiles={kidsProfilesForToggle}
        kidsChartData={kidsDataForChart}
        is_promise_fixed={childInfo?.is_promise_fixed || false}
        hasPensionAccount={hasPensionAccount}
      />

      {/* 중단: 현재 선택된 자녀의 증여 현황 카드 */}
      {currentChildData && (
        <GiftStatusSection accumulatedAmount={currentChildData.giftamount} />
      )}

      <ChildAccountInfoCard
        childId={childId}
        deposit={Number(giftAccount?.deposit || 0)}
        thisMonthAmount={thisMonthInputAmount}
      />

      {/* 하단: 이후 추가될 입출금 통장/펀드 상세 카드들... */}
      {childInfo && <GiftTaxSection childInfo={childTaxInfo} />}

      <ChildFundSection childId={currentChildId} fundList={formattedFundList} />
    </main>
  );
}
