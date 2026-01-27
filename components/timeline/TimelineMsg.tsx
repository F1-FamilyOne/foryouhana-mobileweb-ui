'use client';

import { useEffect, useState } from 'react';

interface TimelineMsgProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: string) => void;
  existingMessage?: string | null; // 추가: 이미 저장된 메시지가 있는지 확인
}

export default function TimelineMsg({
  isOpen,
  onClose,
  onSave,
  existingMessage,
}: TimelineMsgProps) {
  const [text, setText] = useState('');
  const MAX_LENGTH = 30;

  // 읽기 전용 여부 판단 (기존 메시지가 있으면 true)
  const isReadOnly = !!existingMessage;

  // 모달이 열릴 때 텍스트 설정
  useEffect(() => {
    if (isOpen) {
      // 기존 메시지가 있으면 보여주고, 없으면 빈 값으로 초기화
      setText(existingMessage || '');
    }
  }, [isOpen, existingMessage]);

  // 글자 수 제한 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 읽기 전용이면 입력 방지
    if (isReadOnly) return;

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
    // 1. 배경 (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 font-hana-regular">
      {/* 2. 모달 카드 본체 */}
      <div className="fade-in zoom-in w-full max-w-[320px] animate-in overflow-hidden rounded-4xl bg-white shadow-xl duration-200">
        {/* 헤더: 파스텔 민트 배경 */}
        <div className="bg-[#E9F4EF] py-4 text-center">
          <h2 className="font-bold text-[16px] text-gray-800">
            {isReadOnly ? '남겨진 마음' : '마음 담아'} {/* 타이틀 변경 */}
          </h2>
        </div>

        {/* 바디: 입력 영역 */}
        <div className="p-5">
          <div
            className={`relative rounded-xl border px-4 py-3 transition-colors ${
              isReadOnly
                ? 'border-transparent bg-gray-50' // 읽기 전용 스타일
                : 'border-gray-300 bg-white focus-within:border-hana-mint' // 작성 모드 스타일
            }`}
          >
            <textarea
              className={`h-24 w-full resize-none border-none bg-transparent text-[14px] leading-relaxed focus:outline-none focus:ring-0 ${
                isReadOnly
                  ? 'cursor-default text-gray-600' // 읽기 전용 텍스트 색상
                  : 'text-gray-800 placeholder-gray-400'
              }`}
              placeholder="아이에게 짧은 메세지를 남겨보세요."
              value={text}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
            {/* 작성 모드일 때만 카운터 표시 */}
            {!isReadOnly && (
              <div className="mt-2 text-right text-[12px] text-gray-400">
                {text.length} / {MAX_LENGTH}
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="mt-5 flex gap-3">
            {isReadOnly ? (
              // 읽기 전용일 땐 '닫기' 버튼 하나만 꽉 차게
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-[14px] text-gray-600 transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
            ) : (
              // 작성 모드일 땐 '취소'와 '저장' 버튼
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-300 bg-white py-3 font-medium text-[14px] text-gray-600 transition-colors hover:bg-gray-50"
                >
                  취소
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-[#E9F4EF] py-3 font-bold text-[14px] text-gray-800 transition-colors hover:bg-[#dcefe6]"
                >
                  저장
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
