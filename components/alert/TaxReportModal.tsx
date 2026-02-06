'use client';

/**
 * @page: TaxReportModal
 * @description: 증여세 신고 기간 알림 팝업. 확인 버튼으로 닫기.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { X } from 'lucide-react';
import { CardModal } from '@/components/ui/CardModal';

interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaxReportModal({ isOpen, onClose }: TaxReportModalProps) {
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
            증여세 신고 기간이에요 🧾
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          이번 증여 건에 대한
          <br />
          <span className="font-hana-bold text-black">증여세 신고 기한</span>이
          다가오고 있어요.
          <br />
          필요한 서류와 작성 방법을
          <br />
          아이앞으로가 정리해두었어요.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-hana-main py-4 font-hana-medium text-lg text-white"
        >
          확인
        </button>
      </div>
    </CardModal>
  );
}
