'use client';

/**
 * @page: ChildTenYearsModal
 * @description: 자녀 10살 증여 한도 전환 시점 안내 팝업. 확인 버튼으로 닫기.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { CardModal } from '@/components/ui/CardModal';

interface ChildTenYearsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChildTenYearsModal({
  isOpen,
  onClose,
}: ChildTenYearsModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header - No X Button */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="font-hana-bold text-black text-lg">
            자녀가 이제 10살이 되는군요 👶
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          곧 자녀가 증여 한도 전환 시점에 도달해요.
          <br />
          <span className="font-hana-bold text-black">최대 2천만 원</span>을
          세금 없이 증여할 수 있어요.
          <br />
          늦으면 늦을수록{' '}
          <span className="font-hana-bold text-black">증여 기회가 적어</span>
          져요.
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
