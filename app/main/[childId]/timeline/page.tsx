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

  // 1. 데이터 병렬 조회
  const [currentChild, allChildren, timelines] = await Promise.all([
    prisma.child.findUnique({ where: { id: childIdInt } }),
    prisma.child.findMany({ orderBy: { born_date: 'asc' } }),
    prisma.timeline.findMany({
      where: { child_id: childIdInt },
      orderBy: { date: 'desc' },
    }),
  ]);

  // 자녀 정보가 없을 경우 리다이렉트
  if (!currentChild) {
    return redirect('/main' as Route);
  }

  // 2. 자녀 토글용 데이터 변환
  const kidProfiles: KidProfile[] = allChildren.map((child) => ({
    id: child.id,
    avatarUrl: child.profile_pic || '',
  }));

  // 3. UI 데이터 변환
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

  // 요약 정보 계산
  const depositCount = timelines.filter((t) => t.type.includes('입금')).length;

  return (
    <main className="min-h-screen bg-white font-hana-regular">
      {/* 고정 상단 헤더 */}
      <Header content="타임라인" />

      {/* 컨텐츠 영역: pb-32를 통해 하단 네비바에 가려지는 부분을 방지합니다. */}
      <div className="p-6 pb-32">
        <TimelineChildToggle kids={kidProfiles} selectedKidId={childIdInt} />

        <TimelineSummary monthsPassed={0} depositCount={depositCount} />

        <TimelineList
          items={timelineItems}
          childName={currentChild.name}
          bornDate={currentChild.born_date}
        />

        <TimelineFooter />
      </div>

      {/* 플로팅 하단 네비게이션 
        - fixed: 뷰포트 고정
        - bottom-0: 바닥 밀착
        - left-1/2 & -translate-x-1/2: 중앙 정렬
        - z-50: 컨텐츠보다 항상 위
      */}
      <div className="-translate-x-1/2 fixed bottom-0 left-1/2 z-50">
        <BottomNavBar />
      </div>
    </main>
  );
}
