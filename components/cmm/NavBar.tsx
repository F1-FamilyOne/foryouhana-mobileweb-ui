'use client';

import { CircleEllipsisIcon } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * @page: BottomNavBar (공통 하단 네비게이션바)
 * @description: 공통으로 사용되는 하단 네비게이션바 컴포넌트
 * @example
 * <BottomNavBar />
 *
 * - 하단 고정 네비게이션 컴포넌트
 * - 홈 / 타임라인 / 메뉴 탭 제공
 * - PNG 아이콘 + Lucide 아이콘 혼용
 * - 내부 상태로 active 탭 관리
 *
 * @notes
 * - absolute positioning 사용 (공통 레이아웃 수정 불가 상황에 대응)
 * - 모바일 카드 UI 기준 width: 394px
 * - 실제 라우팅 연동 시 activeTab을 usePathname로 대체 가능
 * @author: minyoung
 * @date: 2026-01-25
 */

type NavTab = 'home' | 'timeline' | 'menu';

function NavIcon({ children }: { children: ReactNode }) {
  return <div className="flex h-8 items-center justify-center">{children}</div>;
}

/**
 * @page: getTabPath
 * @description: 탭 경로 판단 function
 * @author: seonukim
 * @date: 2026-01-29
 * /main/[childId]/{tab} 형식으로 경로 생성
 * @example
 * /main/123/home → /main/123/timeline
 * /main/456/menu?query=1 → /main/456/timeline
 */

function getTabPath(currentPath: string, newTab: NavTab): Route {
  const pathWithoutQuery = currentPath.split('?')[0];
  const segments = pathWithoutQuery.split('/').filter(Boolean);

  const childId = segments[1];
  return `/main/${childId}/${newTab}` as Route;
}

function getActiveTab(pathname: string): NavTab {
  const pathWithoutQuery = pathname.split('?')[0];
  const segments = pathWithoutQuery.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (['home', 'timeline', 'menu'].includes(lastSegment)) {
    return lastSegment as NavTab;
  }

  // 기본값
  return 'home';
}

export function BottomNavBar() {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  const menuColor =
    activeTab === 'menu'
      ? 'var(--color-hana-pastel-mint)'
      : 'var(--color-hana-gray-400)';

  return (
    <nav
      aria-label="하단 네비게이션"
      className="-translate-x-1/2 absolute bottom-0 left-1/2 h-[70px] w-[393px] rounded-t-2xl border-hana-gray-200 border-t bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="flex h-full items-center justify-around px-5 pb-0">
        {/* 홈 */}
        <Link
          href={getTabPath(pathname, 'home')}
          className="flex flex-col items-center gap-0.5"
        >
          <NavIcon>
            <div className="-translate-y-[1px] relative h-8 w-8">
              <Image
                src={
                  activeTab === 'home'
                    ? '/nav/icon/home_active.png'
                    : '/nav/icon/home_inactive.png'
                }
                alt="홈"
                fill
                className="object-contain"
              />
            </div>
          </NavIcon>
          <span
            className={`font-hana-medium text-[12px] ${
              activeTab === 'home' ? 'text-hana-mint-500' : 'text-hana-gray-600'
            }`}
          >
            홈
          </span>
        </Link>

        {/* 타임라인 */}
        <Link
          href={getTabPath(pathname, 'timeline')}
          className="flex flex-col items-center gap-0.5"
        >
          <NavIcon>
            <div className="-translate-y-[1px] relative h-8 w-8">
              <Image
                src={
                  activeTab === 'timeline'
                    ? '/nav/icon/clock_active.png'
                    : '/nav/icon/clock_inactive.png'
                }
                alt="타임라인"
                fill
                className="object-contain"
              />
            </div>
          </NavIcon>
          <span
            className={`font-hana-medium text-[12px] ${
              activeTab === 'timeline'
                ? 'text-hana-mint-500'
                : 'text-hana-gray-600'
            }`}
          >
            타임라인
          </span>
        </Link>

        {/* 메뉴 */}
        <Link
          href={getTabPath(pathname, 'menu')}
          className="flex flex-col items-center gap-0.5"
        >
          <NavIcon>
            <CircleEllipsisIcon
              size={22}
              strokeWidth={2.4}
              color={menuColor}
              className="translate-y-[1px]"
            />
          </NavIcon>
          <span
            className={`font-hana-medium text-[12px] ${
              activeTab === 'menu' ? 'text-hana-mint-500' : 'text-hana-gray-600'
            }`}
          >
            메뉴
          </span>
        </Link>
      </div>
    </nav>
  );
}
