import type { Route } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/cmm/Header';
// 2. 공통 컴포넌트 (cmm)
import { BottomNavBar } from '@/components/cmm/NavBar';

// 3. 도메인 컴포넌트 (home, timeline)
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';
import TimelineFooter from '@/components/timeline/TimelineFooter';
import TimelineList from '@/components/timeline/TimelineList';
import TimelineSummary from '@/components/timeline/TimelineSummary';

// 4. 라이브러리 및 설정
import { prisma } from '@/lib/prisma';
import TimelineChildToggle from '@/components/timeline/TimelineChildToggle';

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

  // 2. 데이터 병렬 조회
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

  // 3. 자녀 토글용 데이터 변환
  const kidProfiles: KidProfile[] = allChildren.map((child) => ({
    id: child.id,
    avatarUrl: child.profile_pic || '',
  }));

  // 4. UI 데이터 변환 (any 제거 및 구체적 타입 지정)
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

  // 요약 정보 계산 (간단 예시)
  const depositCount = timelines.filter((t) => t.type.includes('입금')).length;

  return (
    <main className="relative min-h-screen bg-white font-hana-regular">
      <Header content="타임라인" />

      <div className="p-6 pb-32">
        {/* ✨ 이 부분이 훨씬 깔끔해졌습니다! */}
        <TimelineChildToggle kids={kidProfiles} selectedKidId={childIdInt} />

        <TimelineSummary monthsPassed={0} depositCount={depositCount} />

        <TimelineList
          items={timelineItems}
          childName={currentChild.name}
          bornDate={currentChild.born_date}
        />

        <TimelineFooter />
      </div>

      <BottomNavBar />
    </main>
  );
}