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

  // 👇 [수정 1] Promise.all 배열에 'firstAccount' 조회 추가
  const [targetChild, myChildren, timelines, firstAccount] = await Promise.all([
    // 1. 현재 보고 있는 자녀 정보 조회
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

    // 2. 토글 바에 표시할 "내 자녀들" 목록 조회
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

    // 3. 타임라인 목록 조회
    prisma.timeline.findMany({
      where: {
        user_id: childIdInt,
      },
      orderBy: { date: 'desc' },
    }),

    // 4. ✨ [New] 자녀의 가장 오래된 계좌 조회 (개설일 확인용)
    prisma.account.findFirst({
      where: { user_id: childIdInt },
      orderBy: { opened_at: 'asc' }, // 가장 옛날 계좌 순서
      select: { opened_at: true }, // 날짜만 가져오기
    }),
  ]);

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

  // 👇 [수정 2] 개월 수 계산 로직 추가
  let monthsPassed = 0;

  if (firstAccount?.opened_at) {
    const start = new Date(firstAccount.opened_at);
    const now = new Date();

    // 연도 차이 * 12 + 월 차이
    const yearsDiff = now.getFullYear() - start.getFullYear();
    const monthsDiff = now.getMonth() - start.getMonth();

    monthsPassed = yearsDiff * 12 + monthsDiff;

    // 혹시 미래 날짜라 음수가 나오면 0으로 처리
    if (monthsPassed < 0) monthsPassed = 0;
  }

  return (
    <div className="relative h-full w-full bg-white font-hana-regular">
      <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
        {/* [Row 1] Header */}
        <div className="flex justify-center">
          <Header content="타임라인" />
        </div>

        {/* [Row 2] Main */}
        <main
          className="overflow-y-auto p-6 pb-10 [::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <TimelineChildToggle kids={kidProfiles} selectedKidId={childIdInt} />

          {/* 👇 [수정 3] 계산된 monthsPassed 전달 */}
          <TimelineSummary
            monthsPassed={monthsPassed}
            depositCount={depositCount}
          />

          <TimelineList
            items={timelineItems}
            childName={targetChild.name}
            bornDate={targetChild.born_date}
          />

          <TimelineFooter />
        </main>

        {/* [Row 3] BottomNavBar */}
        <BottomNavBar />
      </div>
    </div>
  );
}
