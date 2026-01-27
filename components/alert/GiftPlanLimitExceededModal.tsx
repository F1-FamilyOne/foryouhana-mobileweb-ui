'use client';

/**
 * @page: GiftPlanLimitExceededModal
 * @description: 증여 계획 한도 초과 경고 팝업. 3달 이내 인출 안내.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { CardModal } from '@/components/ui/CardModal';

interface GiftPlanLimitExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GiftPlanLimitExceededModal({
  isOpen,
  onClose,
}: GiftPlanLimitExceededModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header - No X Button */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="font-hana-bold text-lg text-black">
            증여 계획 한도를 초과했어요 ⛔
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base leading-relaxed text-hana-gray-600">
          한도를 초과하게 되면
          <br />
          증여세를 추가로 내게 됩니다.
          <br />
          <span className="font-hana-bold text-black">초과 액수만큼 3달 이내</span>
          에
          <br />
          다시 인출해주세요.
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
