import Image from 'next/image';
import Link from 'next/link';
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
  Number(childId);
  const PARENT_ID = 1;

  // 1. 이번 달 시작일 계산 (예: 2026-01-01 00:00:00)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  //연금저축계좌 존재 여부 확인 (count 사용)
  const pensionCount = await prisma.account.count({
    where: {
      user_id: currentChildId,
      acc_type: 'PENSION', // 연금저축계좌 타입 확인
    },
  });

  const hasPensionAccount = pensionCount > 0;

  //자녀 입출금 통장 정보
  const giftAccount = await prisma.account.findFirst({
    where: { user_id: currentChildId, acc_type: 'GIFT_DEPOSIT' },
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
  const childInfo = await prisma.user.findUnique({
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
  const isPromiseFixed = childInfo?.is_promise_fixed || false;

  //증여세 신고 정보
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  threeMonthsAgo.setDate(1);

  // 1. 해당 자녀의 펀드 및 연금 계좌 ID 리스트 추출
  const childAccounts = await prisma.account.findMany({
    where: {
      user_id: currentChildId,
      acc_type: { in: ['FUND', 'PENSION'] },
      closed_at: null,
    },
    select: { id: true },
  });

  const accountIds = childAccounts.map((acc) => acc.id);

  // 2. history 테이블에서 최근 3개월간 해당 계좌들로 입금된 금액 합산
  // 자녀의 증여 계좌로 들어온 금액 중 타인이 준 것만
  //let 써도 되나
  let recentHistory = null;
  if (childInfo?.is_promise_fixed === false) {
    recentHistory = await prisma.history.aggregate({
      where: {
        source_account_id: { notIn: accountIds },
        target_account_id: giftAccount?.id,

        created_at: { gte: threeMonthsAgo },
      },
      _sum: {
        money: true,
      },
    });
  }
  console.log(recentHistory?._sum);

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
  const childrenList = await prisma.read_auth.findMany({
    where: { reader_id: PARENT_ID },
    select: {
      provider_id: true,
    },
  });
  const childrenListMapped = childrenList.map((auth) => auth.provider_id);
  const childrenData = await prisma.user.findMany({
    where: {
      id: { in: childrenListMapped },
    },
    select: {
      id: true,
      name: true,
      profile_pic: true,
      account: {
        where: {
          acc_type: { in: ['FUND', 'PENSION'] }, //전체 통계보기는 "펀드", "연금"만
          closed_at: null, //환매 안한 펀드만
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
    // 해당 자녀의 전체 보유금(납입액) 합산
    const totalDepositAmount = child.account.reduce(
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
      depositAmount: totalDepositAmount,
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
      user_id: currentChildId,
      acc_type: { in: ['FUND', 'PENSION'] },
      closed_at: null,
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

      // 자유적립/정기적립 펀드의 월 자동이체 금액
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
        paymentType: (f.in_month ? 'regular' : 'irregular') as
          | 'regular'
          | 'irregular',
        rate: Number(f.plus_rate || 0),
        plusMoney: Number(f.plus_money || 0),
        title: f.fund?.name || '하나 연금저축펀드',
        deposit: Number(f.deposit),
        totalValue: Number(f.deposit) + Number(f.plus_money || 0),
        autoTransferAmount: autoTransferAmount, // 계산된 이번 달 금액 적용
      };
    }),
  );

  //유기정기금 아닌 경우 최근 타인의 계좌에서 자녀 증여용 계좌로 10년치 입금 금액
  async function getRecent10YGiftAmount(childId: number) {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    const childAccountIds = await prisma.account
      .findMany({
        where: { user_id: Number(childId) },
        select: { id: true },
      })
      .then((accounts) => accounts.map((a) => a.id));

    return await prisma.history.aggregate({
      where: {
        target_account_id: giftAccount?.id, // 자녀의 증여용 계좌
        created_at: { gte: tenYearsAgo }, // 10년 이내
        OR: [
          {
            // 1. 다른 사람이 하나은행 계좌에서 보낸 경우 (자녀 본인 계좌 제외)
            source_account_id: {
              notIn: childAccountIds,
              not: null,
            },
          },
          {
            // 2. 타 은행에서 보낸 경우 (source_account_id가 없고 etc에 정보가 있을 때)
            source_account_id: null,
            etc: { not: null },
          },
        ],
      },
      _sum: {
        money: true,
      },
    });
  }

  //유기 정기금 납부 현황:
  // 필요 정보1: 정기이체 테이블에서 부모 명의 계좌로 자녀 증여용 계좌에 납부할 자동이체 설정액의 금액
  //필요 정보2: user 테이블에서 start_date와 end_date와 goal_money 가져오기
  //history에서 start_date 이후로 부모 명의 계좌로 정기이체 납부 금액만큼 납부하면 그 달에는 그거 하나만 카운트.
  //정기이체한 내역 합산 반환
  async function getFixedTermGiftStatus(childUserId: number) {
    if (!childInfo?.is_promise_fixed) return 0;
    // 1. 자녀의 유기정기금 플랜 정보 가져오기 (start_date, end_date, goal_money)
    const childPlan = await prisma.user.findUnique({
      where: { id: childUserId },
      select: {
        start_date: true,
        end_date: true,
        goal_money: true,
        is_promise_fixed: true,
        monthly_money: true,
      },
    });

    if (
      !childPlan ||
      !childPlan.start_date ||
      !childPlan.end_date ||
      !childPlan.monthly_money ||
      !childPlan.goal_money
    ) {
      throw new Error('증여 플랜 정보가 없음.');
    }

    // 2. 자녀 계좌로 들어오는 정기이체 설정 가져오기 (부모 -> 자녀)
    // 자녀의 모든 계좌(GIFT_DEPOSIT, FUND 등)를 대상으로 함
    const transferSetting = await prisma.auto_transfer.findFirst({
      where: {
        source_account: { user_id: PARENT_ID },
        target_account_id: giftAccount?.id,
        amount: childPlan.monthly_money,
      },
      select: {
        amount: true,
        source_account: true,
        transfer_day: true,
      },
    });

    if (!transferSetting) {
      return { message: '설정된 정기이체 정보가 없소.' };
    }

    // 3. 증여 시작일부터 현재까지의 history 조회
    const histories = await prisma.history.findMany({
      where: {
        account_history_target_account_idToaccount: { user_id: childUserId },
        created_at: {
          gte: childPlan.start_date,
          lte:
            childPlan.end_date < new Date() ? childPlan.end_date : new Date(), // 증여일이 끝나는 날까지 정기 이체 내역만 조회
        },
      },
      orderBy: { created_at: 'asc' },
    });

    // 4. 월별 합산 로직 (한 달에 정기이체 금액과 일치하는 건이 있으면 1회만 카운트)
    const monthlyValidGifts = new Map<string, bigint>();

    histories.forEach((record) => {
      const monthKey = record.created_at.toISOString().slice(0, 7); // "2024-05" 형식

      // 조건: 해당 월에 이미 카운트된 내역이 없고, 입금액이 정기이체 설정액과 일치할 때
      if (
        !monthlyValidGifts.has(monthKey) &&
        record.money === transferSetting.amount
      ) {
        monthlyValidGifts.set(monthKey, record.money);
      }
    });

    // 5. 결과 계산
    const totalGiftAmount = Array.from(monthlyValidGifts.values()).reduce(
      (acc, curr) => acc + curr,
      BigInt(0),
    );

    return totalGiftAmount;
  } //유기정기금일때, 지금까지의 납부 합산 금액

  //증여 현황 카드 - 유기정기금일때와 아닐때 통합 변수
  // [수정 후]
  let amountValue: number = 0;
  if (isPromiseFixed) {
    const result = await getFixedTermGiftStatus(Number(childId));
    amountValue = typeof result === 'object' ? 0 : Number(result);
  } else {
    const result = await getRecent10YGiftAmount(Number(childId));
    amountValue = Number(result._sum.money || 0);
  }
  const amountForGiftStatusSection = amountValue;

  return (
    <main className="flex flex-col gap-4 bg-hana-white-50">
      {/* 상단: 자녀 선택 및 전체 통계 */}
      <HomeClientWrapper
        initialChildId={currentChildId}
        kidsProfiles={kidsProfilesForToggle}
        kidsChartData={kidsDataForChart} //지금까지의 모든 증여 금액 합산
        is_promise_fixed={childInfo?.is_promise_fixed || false}
        hasPensionAccount={hasPensionAccount}
      />

      {/* 중단: 현재 선택된 자녀의 증여 현황 카드 */}
      {currentChildData && (
        <GiftStatusSection
          accumulatedAmount={amountForGiftStatusSection}
          bornDate={childTaxInfo.born_date}
          isPromiseFixed={isPromiseFixed}
        />
      )}

      <ChildAccountInfoCard
        childId={childId}
        deposit={Number(giftAccount?.deposit || 0)}
        thisMonthAmount={thisMonthInputAmount}
        monthlyMoney={BigInt(childInfo?.monthly_money || 0)}
      />

      {/* 하단: 이후 추가될 입출금 통장/펀드 상세 카드들... */}
      {childInfo && <GiftTaxSection childInfo={childTaxInfo} />}

      <ChildFundSection childId={currentChildId} fundList={formattedFundList} />
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
            className="drop-shadow-lg" // 마진 제거 및 그림자 효과 추가
          />
        </Link>
      </div>
    </main>
  );
}
