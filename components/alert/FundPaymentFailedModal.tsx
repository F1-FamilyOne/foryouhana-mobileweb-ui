'use client';

/**
 * @page: FundPaymentFailedModal
 * @description: 펀드 납입 실패 알림 팝업. 잔액 부족으로 펀드 납입 불가 시 표시.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { CardModal } from '@/components/ui/CardModal';

interface FundPaymentFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FundPaymentFailedModal({
  isOpen,
  onClose,
}: FundPaymentFailedModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header - No X Button */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="font-hana-bold text-black text-lg">
            펀드 납입 실패했어요 😞
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          자녀 계좌에{' '}
          <span className="font-hana-bold text-black">잔액이 부족</span>해,
          <br />
          펀드에 납입하지 못했어요.
          <br />
          계좌를 확인해주세요.
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
