'use client';

/**
 * @page: LivingTrustModal
 * @description: 자산 누적 시 리빙 트러스트 서비스 연결 안내 팝업.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { X } from 'lucide-react';
import { CardModal } from '@/components/ui/CardModal';

interface LivingTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

export function LivingTrustModal({
  isOpen,
  onClose,
  onAction,
}: LivingTrustModalProps) {
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
            자산이 많이 모였어요 🏛️
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          지금까지 모은 자산을
          <br />
          상속·증여까지 이어서 관리해보세요.
          <br />
          기존 펀드는 그대로 유지한 채
          <br />
          <span className="font-hana-bold text-black">리빙 트러스트</span>로
          연결할 수 있어요.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onAction}
          className="w-full rounded-full bg-hana-main py-4 font-hana-medium text-lg text-white"
        >
          리빙 트러스트 이동하기
        </button>
      </div>
    </CardModal>
  );
}
