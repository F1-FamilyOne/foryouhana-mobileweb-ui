import TimelineFooter from '@/components/timeline/TimelineFooter';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import TimelineList from '@/components/timeline/TimelineList';
import TimelineSummary from '@/components/timeline/TimelineSummary';
import { prisma } from '@/lib/prisma';

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

  // 요약 정보 계산
  const depositItems = timelines.filter((t) => t.type.includes('입금'));
  const depositCount = depositItems.length;

  let monthsPassed = 0;
  if (depositCount > 0) {
    const firstDepositDate = depositItems[depositItems.length - 1].date;
    const today = new Date();

    monthsPassed =
      (today.getFullYear() - firstDepositDate.getFullYear()) * 12 +
      (today.getMonth() - firstDepositDate.getMonth());

    if (monthsPassed < 0) monthsPassed = 0;
  }

  // 3. UI 데이터로 변환 (여기가 핵심 수정 부분입니다!)
  const timelineItems: TimelineItemData[] = timelines.map((item) => {
    let icon: TimelineItemData['icon'] = 'business';
    let variant: TimelineItemData['variant'] = 'lightGreen';
    let isMessage = false;

    // 1) 기본 아이콘/색상 결정
    if (item.type.includes('입금') || item.type.includes('선물')) {
      icon = 'gift';
      variant = 'pastelGreen';
      isMessage = true; // 입금/선물은 기본적으로 메시지 타입
    } else if (
      item.type.includes('가입') ||
      item.type.includes('개설') ||
      item.type.includes('펀드')
    ) {
      icon = 'trending';
      variant = 'lightGreen';
    }

    // ⭐ [핵심 수정] DB에 저장된 메모(memo)가 있다면, 강제로 메시지 모드로 변경! ⭐
    // 빈 문자열이 아닌 실제 내용이 있을 때만 적용
    if (item.memo && item.memo.trim().length > 0) {
      isMessage = true;
    }

    return {
      id: String(item.id),
      date: item.date,
      title: item.type,
      fundName: item.description || '',
      movedMoney: 0,
      icon,
      variant,
      isMessage, // 수정된 로직이 반영된 값
      message: item.memo || '',
    };
  });

  if (timelineItems.length > 0) {
    timelineItems[timelineItems.length - 1].isLast = true;
  }

  return (
    <main className="min-h-screen bg-white p-6 pb-20 font-hana-regular">
      <TimelineHeader childrenList={allChildren} />
      <TimelineSummary
        monthsPassed={monthsPassed}
        depositCount={depositCount}
      />

      <TimelineList
        items={timelineItems}
        childName={currentChild?.name || ''}
        bornDate={currentChild?.born_date || new Date()}
      />

      <TimelineFooter />
    </main>
  );
}
