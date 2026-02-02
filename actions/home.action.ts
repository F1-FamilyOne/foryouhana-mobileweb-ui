'use server';

import { prisma } from '@/lib/prisma';

// 1. 연금 계좌 여부 및 기본 증여 계좌 정보 조회
export async function getAccountBasics(childId: number) {
  const [pensionCount, giftAccount] = await Promise.all([
    prisma.account.count({
      where: { user_id: childId, acc_type: 'PENSION' },
    }),
    prisma.account.findFirst({
      where: { user_id: childId, acc_type: 'GIFT_DEPOSIT' },
      select: { id: true, deposit: true },
    }),
  ]);

  return {
    hasPensionAccount: pensionCount > 0,
    giftAccount,
  };
}

// 2. 이번 달 입금 총액 계산
export async function getThisMonthInputAmount(giftAccountId: number) {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const historyAgg = await prisma.history.aggregate({
    where: {
      target_account_id: giftAccountId,
      created_at: { gte: startOfMonth },
    },
    _sum: { money: true },
  });
  return Number(historyAgg._sum.money || 0);
}

// 3. 자녀 세금 관련 정보 및 최근 입금 내역 조회
export async function getChildTaxInfo(childId: number, giftAccountId?: number) {
  const childInfo = await prisma.user.findUnique({
    where: { id: childId },
    select: {
      is_promise_fixed: true,
      monthly_money: true,
      goal_money: true,
      start_date: true,
      end_date: true,
      born_date: true,
    },
  });

  if (!childInfo) return null;

  let in_money_sum = 0;
  if (!childInfo.is_promise_fixed && giftAccountId) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    threeMonthsAgo.setDate(1);

    const recentHistory = await prisma.history.aggregate({
      where: {
        target_account_id: giftAccountId,
        created_at: { gte: threeMonthsAgo },
        // 타인 입금 조건: 본인 계좌 리스트 제외 로직 추가 가능
      },
      _sum: { money: true },
    });
    in_money_sum = Number(recentHistory._sum.money || 0);
  }

  return {
    ...childInfo,
    monthly_money: childInfo.monthly_money
      ? Number(childInfo.monthly_money)
      : null,
    goal_money: childInfo.goal_money ? Number(childInfo.goal_money) : null,
    in_money_sum,
    is_promise_fixed: childInfo.is_promise_fixed || false,
  };
}

// 4. 부모와 연결된 모든 자녀의 통계 데이터 (토글 & 차트용)
export async function getFamilyStats(parentId: number) {
  const childrenList = await prisma.read_auth.findMany({
    where: { reader_id: parentId },
    select: { provider_id: true },
  });

  const childrenIds = childrenList.map((auth) => auth.provider_id);
  const childrenData = await prisma.user.findMany({
    where: { id: { in: childrenIds } },
    select: {
      id: true,
      name: true,
      profile_pic: true,
      account: {
        where: { acc_type: { in: ['FUND', 'PENSION'] }, closed_at: null },
        select: { deposit: true, plus_money: true },
      },
    },
  });

  return childrenData.map((child) => ({
    id: child.id,
    name: child.name,
    avatarUrl: child.profile_pic || '',
    depositAmount: child.account.reduce(
      (sum, acc) => sum + Number(acc.deposit),
      0,
    ),
    profitAmount: child.account.reduce(
      (sum, acc) => sum + Number(acc.plus_money || 0),
      0,
    ),
  }));
}

// 5. 펀드 리스트 상세 조회
export async function getFormattedFundList(childId: number) {
  const fundList = await prisma.account.findMany({
    where: {
      user_id: childId,
      acc_type: { in: ['FUND', 'PENSION'] },
      closed_at: null,
    },
    include: { fund: { select: { name: true } } },
  });

  if (fundList.length === 0) return [];

  // 한 번의 쿼리로 모든 해당 계좌의 자동이체 합계 조회 (N+1 방지)
  const transferSums = await prisma.auto_transfer.groupBy({
    by: ['target_account_id'],
    where: { target_account_id: { in: fundList.map((f) => f.id) } },
    _sum: { amount: true },
  });

  const transferMap = new Map(
    transferSums.map((s) => [s.target_account_id, Number(s._sum.amount || 0)]),
  );

  return fundList.map((f) => ({
    paymentType: (f.in_month ? 'regular' : 'irregular') as
      | 'regular'
      | 'irregular',
    rate: Number(f.plus_rate || 0),
    plusMoney: Number(f.plus_money || 0),
    title: f.fund?.name || '하나 연금저축펀드',
    deposit: Number(f.deposit),
    totalValue: Number(f.deposit) + Number(f.plus_money || 0),
    autoTransferAmount: transferMap.get(f.id) || 0,
  }));
}

// 6. 증여 현금 합계 계산 (유기정기금 여부에 따른 로직)
export async function getAccumulatedGiftAmount(
  childId: number,
  isPromiseFixed: boolean,
  parentId: number,
  giftAccountId?: number,
) {
  if (!giftAccountId) return 0;

  if (isPromiseFixed) {
    const result = await getFixedTermGiftStatus(
      childId,
      giftAccountId,
      isPromiseFixed,
      parentId,
    );
    return Number(result);
  } else {
    const result = await getRecent10YGiftAmount(childId, giftAccountId);
    return Number(result._sum.money || 0);
  }
}

async function getRecent10YGiftAmount(childId: number, giftAccountId: number) {
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
      target_account_id: giftAccountId, // 자녀의 증여용 계좌
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
async function getFixedTermGiftStatus(
  childUserId: number,
  giftAccountId: number,
  isPromiseFixed: boolean,
  parentId: number,
) {
  if (!isPromiseFixed) return 0;
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
      source_account: { user_id: parentId },
      target_account_id: giftAccountId,
      amount: childPlan.monthly_money,
    },
    select: {
      amount: true,
      source_account: true,
      transfer_day: true,
    },
  });

  if (!transferSetting) {
    return { message: '설정된 정기이체 정보 없음.' };
  }

  // 3. 증여 시작일부터 현재까지의 history 조회
  const histories = await prisma.history.findMany({
    where: {
      account_history_target_account_idToaccount: { user_id: childUserId },
      created_at: {
        gte: childPlan.start_date,
        lte: childPlan.end_date < new Date() ? childPlan.end_date : new Date(), // 증여일이 끝나는 날까지 정기 이체 내역만 조회
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
