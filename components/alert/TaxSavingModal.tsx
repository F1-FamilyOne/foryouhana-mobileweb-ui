'use client';

/**
 * @page: TaxSavingModal
 * @description: 이번 달 절세 혜택 알림 팝업. 증여세 절감 금액을 표시.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { CardModal } from '@/components/ui/CardModal';
import { formatAmount } from '@/lib/utils/numberFormat';

interface TaxSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAmount?: number;
}

export function TaxSavingModal({
  isOpen,
  onClose,
  savedAmount = 20000,
}: TaxSavingModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header - No X Button */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="font-hana-bold text-lg text-black">
            이번 달도 세금을 아꼈어요 💰
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base leading-relaxed text-hana-gray-600">
          아이앞으로를 이용해
          <br />
          이번 달{' '}
          <span className="font-hana-bold text-black">
            ₩{formatAmount(savedAmount)}
          </span>
          의 증여세를 아꼈어요.
          <br />
          모두 아이의 자산으로 남습니다.
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
