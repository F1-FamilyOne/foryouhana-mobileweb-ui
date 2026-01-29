import type { Route } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/cmm/Header';
import { BottomNavBar } from '@/components/cmm/NavBar';

import type { KidProfile } from '@/components/home/ToggleChildProfile';
import TimelineChildToggle from '@/components/timeline/TimelineChildToggle';
import TimelineFooter from '@/components/timeline/TimelineFooter';
import TimelineList from '@/components/timeline/TimelineList';
import TimelineSummary from '@/components/timeline/TimelineSummary';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// UI 데이터 타입 정의
type TimelineIcon = 'gift' | 'trending' | 'bell' | 'business';
type TimelineVariant = 'pastelGreen' | 'lightGreen' | 'purple';

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const childIdInt = Number(childId);

  if (Number.isNaN(childIdInt)) {
    return redirect('/main' as Route);
  }

  const LOGGED_IN_PARENT_ID = 1;

  const [targetChild, myChildren, timelines] = await Promise.all([
    // 현재 보고 있는 자녀 정보 조회
    // 조건: ID가 일치하고 AND "나(Parent)에게 정보를 제공(provided_to)하는 관계"여야 함
    prisma.user.findFirst({
      where: {
        id: childIdInt,
        provided_to: {
          some: {
            reader_id: LOGGED_IN_PARENT_ID,
          },
        },
      },
    }),

    // 토글 바에 표시할 "내 자녀들" 목록 조회
    // 조건: "나(Parent)를 Reader로 지정한 유저들"만 가져오기
    prisma.user.findMany({
      where: {
        provided_to: {
          some: {
            reader_id: LOGGED_IN_PARENT_ID,
          },
        },
      },
      orderBy: { born_date: 'asc' }, // 첫째, 둘째 순서
    }),

    prisma.timeline.findMany({
      where: {
        user_id: childIdInt,
      },
      orderBy: { date: 'desc' },
    }),
  ]);

  // 보안 체크: URL로 남의 자녀 ID를 입력했거나, 존재하지 않는 경우 메인으로 튕겨냄
  if (!targetChild) {
    console.log('⛔ 접근 권한이 없거나 존재하지 않는 유저입니다.');
    return redirect('/main' as Route);
  }

  const kidProfiles: KidProfile[] = myChildren.map((child) => ({
    id: child.id,
    avatarUrl: child.profile_pic || '', // profile_pic이 null일 경우 대비
  }));

  const timelineItems = timelines.map((item) => {
    const isGift = item.type.includes('입금') || item.type.includes('선물');

    return {
      id: String(item.id),
      date: item.date,
      title: item.type,
      fundName: item.description || '',
      movedMoney: 0,
      icon: (isGift ? 'gift' : 'trending') as TimelineIcon,
      variant: (isGift ? 'pastelGreen' : 'lightGreen') as TimelineVariant,
      isMessage: true,
      message: item.memo || '',
    };
  });

  const depositCount = timelines.filter((t) => t.type.includes('입금')).length;

  return (
    <main className="min-h-screen bg-white font-hana-regular">
      {/* 고정 상단 헤더 */}
      <Header content="타임라인" />

      {/* 컨텐츠 영역 */}
      <div className="p-6 pb-32">
        {/* 상단 자녀 선택 토글 */}
        <TimelineChildToggle kids={kidProfiles} selectedKidId={childIdInt} />

        {/* 요약 카드 */}
        <TimelineSummary monthsPassed={0} depositCount={depositCount} />

        {/* 타임라인 리스트 */}
        <TimelineList
          items={timelineItems}
          childName={targetChild.name}
          bornDate={targetChild.born_date}
        />

        <TimelineFooter />
      </div>

      {/* 하단 네비게이션 */}
      <div className="-translate-x-1/2 fixed bottom-0 left-1/2 z-50">
        <BottomNavBar />
      </div>
    </main>
  );
}
