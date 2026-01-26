import TimelineFooter from '@/components/timeline/TimelineFooter';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import TimelineList from '@/components/timeline/TimelineList'; // Row가 아니라 List임에 주의!
import TimelineSummary from '@/components/timeline/TimelineSummary';
import { prisma } from '@/lib/prisma';

// 👇 캐시 끄기 (팝업 테스트를 위해 필수)
export const dynamic = 'force-dynamic';

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
  const { childId } = await params;
  const childIdInt = Number(childId);

  if (Number.isNaN(childIdInt)) {
    return <div className="p-10 text-center">잘못된 접근입니다. (ID 오류)</div>;
  }

  // 1. 헤더용 데이터 조회
  const currentChild = await prisma.child.findUnique({
    where: { id: childIdInt },
    select: { name: true, born_date: true },
  });

  const allChildren = await prisma.child.findMany({
    select: { id: true, name: true, profile_pic: true },
    orderBy: { born_date: 'asc' },
  });

  // 2. 타임라인 데이터 조회
  const timelines = await prisma.timeline.findMany({
    where: { child_id: childIdInt },
    orderBy: { date: 'desc' },
  });

  // -----------------------------------------------------------
  // ✅ [복구 완료] 요약 정보 계산 로직 (이게 빠져서 에러가 난 겁니다!)
  // -----------------------------------------------------------
  const depositItems = timelines.filter((t) => t.type.includes('입금'));
  const depositCount = depositItems.length;

  let monthsPassed = 0;
  if (depositCount > 0) {
    // timelines는 최신순(desc)이므로, 배열의 맨 마지막이 '첫 입금'입니다.
    const firstDepositDate = depositItems[depositItems.length - 1].date;
    const today = new Date();

    monthsPassed =
      (today.getFullYear() - firstDepositDate.getFullYear()) * 12 +
      (today.getMonth() - firstDepositDate.getMonth());

    if (monthsPassed < 0) monthsPassed = 0;
  }
  // -----------------------------------------------------------

  // 3. UI 데이터로 변환
  const timelineItems: TimelineItemData[] = timelines.map((item) => {
    let icon: TimelineItemData['icon'] = 'business';
    let variant: TimelineItemData['variant'] = 'lightGreen';
    let isMessage = false;

    if (item.type.includes('입금') || item.type.includes('선물')) {
      icon = 'gift';
      variant = 'pastelGreen';
      isMessage = true;
    } else if (
      item.type.includes('가입') ||
      item.type.includes('개설') ||
      item.type.includes('펀드')
    ) {
      icon = 'trending';
      variant = 'lightGreen';
    }

    return {
      id: String(item.id),
      date: item.date,
      title: item.type,
      fundName: item.description || '',
      movedMoney: 0,
      icon,
      variant,
      isMessage,
      message: item.memo || '',
    };
  });

  // 마지막 아이템 선 끊기 처리
  if (timelineItems.length > 0) {
    timelineItems[timelineItems.length - 1].isLast = true;
  }

  return (
    <main className="min-h-screen bg-white p-6 pb-20 font-hana-regular">
      <TimelineHeader childrenList={allChildren} />

      {/* ✅ 이제 monthsPassed 변수가 정의되어서 에러가 사라집니다 */}
      <TimelineSummary
        monthsPassed={monthsPassed}
        depositCount={depositCount}
      />

      {/* ✅ 조건문 삭제됨: 데이터가 없어도 TimelineList는 실행됨 (그래야 팝업 로직이 돔) */}
      <TimelineList
        items={timelineItems}
        childName={currentChild?.name || ''}
        bornDate={currentChild?.born_date || new Date()}
      />

      <TimelineFooter />
    </main>
  );
}
