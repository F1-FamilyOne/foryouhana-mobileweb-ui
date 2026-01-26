'use client';

import { useEffect, useState } from 'react';

interface TimelineMsgProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: string) => void;
}

export default function TimelineMsg({
  isOpen,
  onClose,
  onSave,
}: TimelineMsgProps) {
  const [text, setText] = useState('');
  const MAX_LENGTH = 30;

  // 모달이 열릴 때마다 텍스트 초기화
  useEffect(() => {
    if (isOpen) {
      setText('');
    }
  }, [isOpen]);

  // 글자 수 제한 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setText(value);
    }
  };

  const handleSave = () => {
    if (text.trim().length === 0) {
      alert('메시지를 입력해주세요!');
      return;
    }
    onSave(text);
    onClose();
  };

  if (!isOpen) return null;

  return (
    // 1. 배경 (Backdrop): 어두운 반투명 배경
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 font-hana-regular">
      {/* 2. 모달 카드 본체 */}
      <div className="fade-in zoom-in w-full max-w-[320px] animate-in overflow-hidden rounded-4xl bg-white shadow-xl duration-200">
        {/* 헤더: 파스텔 민트 배경 */}
        <div className="bg-[#E9F4EF] py-4 text-center">
          <h2 className="font-bold text-[16px] text-gray-800">마음 담아</h2>
        </div>

        {/* 바디: 입력 영역 */}
        <div className="p-5">
          <div className="relative rounded-xl border border-gray-300 px-4 py-3 transition-colors focus-within:border-hana-mint">
            <textarea
              className="h-24 w-full resize-none border-none bg-transparent text-[14px] text-gray-800 leading-relaxed placeholder-gray-400 focus:outline-none focus:ring-0"
              placeholder="아이에게 짧은 메세지를 남겨보세요."
              value={text}
              onChange={handleChange}
            />
            {/* 글자 수 카운터 (우측 하단) */}
            <div className="mt-2 text-right text-[12px] text-gray-400">
              {text.length} / {MAX_LENGTH}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-5 flex gap-3">
            {/* 취소 버튼: 흰색 배경 + 테두리 */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3 font-medium text-[14px] text-gray-600 transition-colors hover:bg-gray-50"
            >
              취소
            </button>

            {/* 저장 버튼: 파스텔 민트 배경 (이미지와 동일 색상) */}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-[#E9F4EF] py-3 font-bold text-[14px] text-gray-800 transition-colors hover:bg-[#dcefe6]"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
