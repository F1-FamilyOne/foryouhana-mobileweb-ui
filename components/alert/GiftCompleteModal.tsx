'use client';

/**
 * @page: GiftCompleteModal
 * @description: 증여 완료 알림 팝업. 메모하기 버튼으로 타임라인 화면 이동.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { X } from 'lucide-react';
import { CardModal } from '@/components/ui/CardModal';
import { formatAmount } from '@/lib/utils/numberFormat';

interface GiftCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  amount: number;
}

export function GiftCompleteModal({
  isOpen,
  onClose,
  onAction,
  amount,
}: GiftCompleteModalProps) {
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
            이번 달 증여가 완료됐어요 🎁
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          아이 계좌로{' '}
          <span className="font-hana-bold text-black">
            {formatAmount(amount)}
          </span>
          원이 입금되었어요.
          <br />
          오늘의 마음을 메모로 남겨두면,
          <br />
          나중에 아이에게 소중한 기록이 됩니다.
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
