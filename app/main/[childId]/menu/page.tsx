'use client';

import { ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getLinkedChildren } from '@/actions/menu.action';
import Header from '@/components/cmm/Header';
import { BottomNavBar } from '@/components/cmm/NavBar';
import ToggleChildProfile from '@/components/home/ToggleChildProfile';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUserContext } from '@/hooks/useUserContext';

interface ChildProfile {
  id: number;
  avatarUrl: string;
  name?: string;
}

export default function Menu() {
  const route = useRouter();
  const params = useParams();
  const { ready, userId } = useUserContext();

  const childIdFromParams = Number(params.childId);
  const isValidParamId =
    !Number.isNaN(childIdFromParams) && childIdFromParams > 0;

  const [kidsProfile, setKidsProfile] = useState<ChildProfile[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<number>(0);

  useEffect(() => {
    if (!ready || !userId) return;

    const fetchAndSyncKids = async () => {
      const PARENT_ID = Number(userId);
      if (Number.isNaN(PARENT_ID)) return;

      try {
        const kids = await getLinkedChildren(PARENT_ID);
        setKidsProfile(kids);

        if (kids.length > 0) {
          const hasMatch = kids.some((k) => k.id === childIdFromParams);

          if (isValidParamId && hasMatch) {
            setSelectedKidId(childIdFromParams);
          } else {
            setSelectedKidId(kids[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch kids:', error);
      }
    };

    fetchAndSyncKids();
  }, [ready, userId, childIdFromParams, isValidParamId]);

  return (
    <div className="relative h-full w-full bg-white">
      {/* Grid 레이아웃 적용 */}
      <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
        {/* [Row 1] Header */}
        <div className="flex justify-center">
          <Header content="메뉴" />
        </div>

        {/* [Row 2] Main: 스크롤 영역 */}
        <main
          className="overflow-y-auto pb-10 [::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* 1. 토글 영역: 오른쪽 정렬 (justify-end) */}
          {kidsProfile.length > 0 && (
            <div className="mt-2 mb-8 flex w-full justify-end pr-6">
              <ToggleChildProfile
                kids={kidsProfile}
                selectedKidId={selectedKidId}
                onSelect={(kidId) => {
                  setSelectedKidId(kidId);
                  route.push(`/main/${kidId}/menu`);
                }}
                onAddKid={() => {
                  alert('자녀 추가는 준비중입니다! 다음에 또 이용해주세요');
                }}
              />
            </div>
          )}

          {/* 2. 메뉴 리스트 영역: 가운데 정렬 (items-center) */}
          {/* 원래 코드의 구조를 그대로 가져와서 스타일을 유지합니다. */}
          <div className="flex w-full flex-col items-center justify-center space-y-15">
            {/* 설정 그룹 */}
            <div id="setting" className="w-78 space-y-2">
              <div>
                <div className="mb-3 font-hana-medium text-[20px]">설정</div>
                <div className="border-hana-gray-400 border-b-2">
                  <div className="flex justify-between pb-1 font-hana-light">
                    <div className="text-[20px]">프로필 설정</div>
                    <button
                      type="button"
                      onClick={() =>
                        selectedKidId &&
                        route.push(`/main/${selectedKidId}/profileEdit`)
                      }
                      className="hover:cursor-pointer"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="pb-1 text-[13px]">
                    자녀 프로필 사진을 변경할 수 있습니다.
                  </div>
                </div>
              </div>

              <div id="assetNotification" className="w-78">
                <div className="border-hana-gray-600 border-b-2">
                  <div className="flex justify-between pb-1 font-hana-light">
                    <div className="text-[20px]">자산 변동 알림 사용</div>
                    <Switch className="cursor-pointer data-[state=checked]:bg-hana-badge-green" />
                  </div>
                  <div className="pb-1 text-[13px]">
                    자녀 자산 변동 시 알림을 받습니다.
                  </div>
                </div>
              </div>

              <div id="serviceTermination" className="w-78">
                <div className="border-hana-gray-600 border-b-2">
                  <div className="flex justify-between pb-1 font-hana-light">
                    <div className="text-[20px]">아이앞으로 서비스 해지</div>
                    <button
                      type="button"
                      onClick={() => route.push(`/onboarding/intro`)}
                      className="hover:cursor-pointer"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="pb-1 text-[13px] text-hana-badge-red">
                    해지 시 자녀 금융 상품 관리 페이지를 볼 수 없습니다.
                  </div>
                </div>
              </div>
            </div>

            {/* 서비스 관리 그룹 */}
            <div className="w-78 space-y-2 pb-10">
              <div className="mb-3 font-hana-medium text-[20px]">
                서비스 상세 관리
              </div>
              <Button
                className="flex h-15 w-full cursor-pointer justify-between rounded-[15px] bg-hana-pastel-mint p-2 text-[18px] hover:bg-hana-pastel-mint/60"
                onClick={() =>
                  selectedKidId && route.push(`/main/${selectedKidId}/planEdit`)
                }
              >
                <p>증여 플랜 수정하기</p> <ChevronRight />
              </Button>
              <Button
                className="flex h-15 w-full cursor-pointer justify-between rounded-[15px] bg-hana-pastel-mint p-2 text-[18px] hover:bg-hana-pastel-mint/60"
                onClick={() =>
                  selectedKidId &&
                  route.push(`/main/${selectedKidId}/my-product`)
                }
              >
                <p>현재 가입 상품 보기</p> <ChevronRight />
              </Button>
            </div>
          </div>
        </main>

        {/* [Row 3] BottomNavBar */}
        <BottomNavBar />
      </div>
    </div>
  );
}
