import TimelineFooter from '@/components/timeline/TimelineFooter';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import TimelineRow from '@/components/timeline/TimelineRow';
import TimelineSummary from '@/components/timeline/TimelineSummary';
import { account_acc_type } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

// 타임라인 아이템 타입 정의
type TimelineItemData = {
  id: string;
  date: Date;
  title?: string;
  fundName?: string;
  movedMoney?: number;
  icon: 'bell' | 'business' | 'trending' | 'gift';
  variant: 'purple' | 'pastelGreen' | 'lightGreen';
  isMessage: boolean;
  message?: string;
  isLast?: boolean;
};

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  // 1. URL 파라미터 가져오기 (Next.js 15+ 대응)
  const { childId } = await params;
  const childIdInt = Number(childId);

  // ID 유효성 검사
  if (Number.isNaN(childIdInt)) {
    return <div className="p-10 text-center">잘못된 접근입니다. (ID 오류)</div>;
  }

  // 2. 헤더용: 모든 자녀 목록 조회 (프로필 사진 표시용)
  const allChildren = await prisma.child.findMany({
    select: { id: true, name: true, profile_pic: true },
    orderBy: { born_date: 'asc' },
  });

  // 3. 데이터 병렬 조회: 알림 & 계좌 먼저 가져오기
  const [alerts, accounts] = await Promise.all([
    // A. 알림 조회
    prisma.alert.findMany({
      where: { child_id: childIdInt },
      orderBy: { created_at: 'desc' },
    }),
    // B. 계좌 조회 (펀드 정보 포함)
    prisma.account.findMany({
      where: { child_id: childIdInt },
      orderBy: { opened_at: 'desc' },
      include: { fund: true },
    }),
  ]);

  // 4. 자녀의 계좌 ID 목록 추출 (History 조회용)
  const childAccountIds = accounts.map((acc) => acc.id);

  // 5. 송금 이력 조회 (수정된 로직: target_account_id IN [...ids])
  const histories = await prisma.history.findMany({
    where: {
      target_account_id: { in: childAccountIds },
    },
    orderBy: { created_at: 'desc' },
  });

  // 6. 데이터 가공 (DB 데이터 -> UI 포맷)
  const timelineItems: TimelineItemData[] = [];

  // (1) 알림(Alert) 데이터 매핑
  alerts.forEach((alert) => {
    // Alert Type에 따른 아이콘/색상 분기 (Seed 데이터 기반)
    let icon: TimelineItemData['icon'] = 'bell';
    let variant: TimelineItemData['variant'] = 'purple';

    if (alert.type === '1') {
      icon = 'gift';
      variant = 'pastelGreen';
    } // 입금 알림
    else if (alert.type === '3') {
      icon = 'trending';
      variant = 'lightGreen';
    } // 펀드 만기

    timelineItems.push({
      id: `alert-${alert.id}`,
      date: alert.created_at || new Date(),
      title: alert.title,
      fundName: alert.description || undefined, // 설명이 길면 fundName 자리에 표시
      icon: icon,
      variant: variant,
      isMessage: false,
    });
  });

  // (2) 송금 이력(History) 매핑
  histories.forEach((history) => {
    timelineItems.push({
      id: `history-${history.id}`,
      date: history.created_at,
      movedMoney: Number(history.money), // BigInt -> Number 변환
      message: '부모님으로부터 입금 완료! 🎁',
      icon: 'gift',
      variant: 'pastelGreen',
      isMessage: true,
    });
  });

  // (3) 계좌(Account) 개설 이력 매핑
  accounts.forEach((acc) => {
    // 입출금 계좌
    if (acc.acc_type === account_acc_type.DEPOSIT) {
      timelineItems.push({
        id: `acc-${acc.id}`,
        date: acc.opened_at,
        title: '입출금 통장 개설',
        fundName: '첫 금융 생활의 시작',
        movedMoney: Number(acc.deposit),
        icon: 'business',
        variant: 'lightGreen',
        isMessage: false,
      });
    }
    // 펀드 및 연금 계좌
    else {
      const isPension = acc.acc_type === account_acc_type.PENSION;
      timelineItems.push({
        id: `acc-${acc.id}`,
        date: acc.opened_at,
        title: isPension ? '연금저축펀드 가입' : '펀드 상품 가입',
        fundName: acc.fund?.name || '알 수 없는 펀드',
        movedMoney: Number(acc.deposit),
        icon: 'trending',
        variant: isPension ? 'purple' : 'lightGreen',
        isMessage: false,
      });
    }
  });

  // 7. 날짜순 정렬 (최신순)
  timelineItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  // 8. 마지막 아이템 처리 (선 연결 끊기)
  if (timelineItems.length > 0) {
    timelineItems[timelineItems.length - 1].isLast = true;
  }

  return (
    <main className="min-h-screen bg-white p-6 pb-20 font-hana-regular">
      {/* 헤더: 자녀 목록 전달 */}
      <TimelineHeader childrenList={allChildren} />

      <TimelineSummary />

      <section className="flex flex-col">
        {timelineItems.length > 0 ? (
          timelineItems.map((item) => (
            <TimelineRow
              key={item.id}
              icon={item.icon}
              variant={item.variant}
              isLast={item.isLast}
              cardData={{
                date: item.date,
                title: item.title,
                fundName: item.fundName,
                movedMoney: item.movedMoney || 0,
                isMessage: item.isMessage,
                message: item.message,
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>아직 기록된 활동이 없어요.</p>
          </div>
        )}
      </section>

      <TimelineFooter />
    </main>
  );
}
