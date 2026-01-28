'use client';

import { Camera, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
    const savedImage = localStorage.getItem(`child_${childId}_image`); // 이미지도 불러옴

    if (savedName) setNickname(savedName);
    if (savedImage) setPreviewUrl(savedImage);
  }, [childId]);

  // [중요] 이미지를 문자열(Base64)로 변환하는 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 읽기가 끝나면 결과물(긴 문자열)을 상태에 저장
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file); // 파일을 문자열로 읽기 시작
    }
  };

  const handleSave = async () => {
    // 이름 저장
    localStorage.setItem(`child_${childId}_name`, nickname);

    localStorage.setItem(`child_${childId}_image`, previewUrl);

    router.push(`/main/${childId}/menu`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-5 pb-32">
        <div className="mb-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push(`/main/${childId}/menu`)}
            className="p-1"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="mr-6 flex-1 text-center font-hana-bold text-xl">
            프로필 수정
          </h1>
        </div>

        <div className="mb-12 flex flex-col items-center">
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

        <div className="space-y-6">
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
        </div>

        <div className="mt-10">
          <Button
            onClick={handleSave}
            style={{ backgroundColor: '#008485' }}
            className="h-15 w-full rounded-2xl font-bold text-lg text-white shadow-lg hover:opacity-90"
          >
            저장하기
          </Button>
        </div>
      </div>

      <div className="-translate-x-1/2 fixed bottom-0 left-1/2 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
