'use client';

import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Header from '@/components/cmm/Header';
import { BottomNavBar } from '@/components/cmm/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChildProfileEdit() {
  const router = useRouter();
  const { childId } = useParams();

  const initialImage = '/file/자녀1.jpg';

  const [previewUrl, setPreviewUrl] = useState<string>(initialImage);
  const [nickname, setNickname] = useState('우리 아이');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 페이지 로드 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedName = localStorage.getItem(`child_${childId}_name`);
    const savedImage = localStorage.getItem(`child_${childId}_image`);

    if (savedName) setNickname(savedName);
    if (savedImage) setPreviewUrl(savedImage);
  }, [childId]);

  // 이미지를 문자열(Base64)로 변환하는 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    localStorage.setItem(`child_${childId}_name`, nickname);
    localStorage.setItem(`child_${childId}_image`, previewUrl);
    router.push(`/main/${childId}/menu`);
  };

  return (
    // 1. 전체 화면 컨테이너
    <div className="relative h-full w-full bg-white font-hana-regular">
      {/* 2. Grid 레이아웃 */}
      <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
        {/* [Row 1] Header */}
        <div className="flex justify-center">
          <Header content="프로필 수정" />
        </div>

        {/* [Row 2] Main */}
        <main
          className="overflow-y-auto p-5 pb-10 [::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* 프로필 이미지 */}
          <div className="mt-4 mb-8 flex flex-col items-center">
            <div className="relative">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#66d2ce]">
                <Image
                  src={previewUrl}
                  alt="아이 프로필"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-0 bottom-0 rounded-full bg-gray-600 p-2 text-white shadow-md transition-colors hover:bg-black"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="mt-4 font-hana-light text-gray-400 text-sm">
              사진을 클릭하여 변경하세요
            </p>
          </div>

          {/* 입력 폼 */}
          <div className="space-y-2">
            <label
              htmlFor="nickname"
              className="ml-1 font-hana-medium text-gray-500 text-sm"
            >
              자녀 이름(닉네임)
            </label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-14 rounded-xl border-gray-300 text-[18px] focus:ring-2 focus:ring-hana-mint"
              placeholder="이름을 입력해 주세요"
            />
          </div>

          {/* 저장 버튼 (중복 제거됨) */}
          <div className="mt-10">
            <Button
              onClick={handleSave}
              style={{ backgroundColor: '#008485' }}
              className="h-15 w-full rounded-2xl font-bold text-lg text-white shadow-lg hover:opacity-90"
            >
              저장하기
            </Button>
          </div>
        </main>

        {/* [Row 3] Bottom Nav */}
        <BottomNavBar />
      </div>
    </div>
  );
}
