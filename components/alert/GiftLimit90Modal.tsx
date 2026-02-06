'use client';

/**
 * @page: GiftLimit90Modal
 * @description: 증여세 한도 90% 도달 경고 팝업. X 버튼 또는 확인 버튼으로 닫기.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { X } from 'lucide-react';
import { CardModal } from '@/components/ui/CardModal';

interface GiftLimit90ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GiftLimit90Modal({ isOpen, onClose }: GiftLimit90ModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header with X Button */}
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
            증여 한도 거의 도달했어요 ⚠️
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          현재 누적 증여액이
          <br />
          <span className="font-hana-bold text-hana-main">공제 한도의 90%</span>
          에 도달했습니다.
          <br />
          이후 금액부터는{' '}
          <span className="font-hana-bold text-black">
            증여세가 발생할 수 있어요
          </span>
          .
          <br />
          미리 확인하고, 절세 방법을 준비해보세요.
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
