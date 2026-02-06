'use client';

/**
 * @page: FundMaturityModal
 * @description: 펀드 만기 도달 알림 팝업. 메모하기 버튼으로 타임라인 화면 이동.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { X } from 'lucide-react';
import { CardModal } from '@/components/ui/CardModal';

interface FundMaturityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

export function FundMaturityModal({
  isOpen,
  onClose,
  onAction,
}: FundMaturityModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-0 p-1"
            aria-label="닫기"
          >
            <X className="h-6 w-6 text-hana-gray-500" />
          </button>
          <h2 className="px-8 font-hana-bold text-black text-lg">
            펀드 만기에 도달했어요 🌟
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          축하합니다! 🎉
          <br />
          펀드 만기의 순간을 메모로 남겨보세요!
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onAction}
          className="w-full rounded-full bg-hana-main py-4 font-hana-medium text-lg text-white"
        >
          메모하기
        </button>
      </div>
    </CardModal>
  );
}
