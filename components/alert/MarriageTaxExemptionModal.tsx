'use client';

/**
 * @page: MarriageTaxExemptionModal
 * @description: 결혼·출산·창업 시 증여세 면제 혜택 안내 팝업.
 * @author: 권순범
 * @date: 2025-01-27
 */

import { CardModal } from '@/components/ui/CardModal';

interface MarriageTaxExemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarriageTaxExemptionModal({
  isOpen,
  onClose,
}: MarriageTaxExemptionModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[340px] rounded-[30px] bg-white px-6 py-8">
        {/* Header - No X Button */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="font-hana-bold text-black text-lg">
            이건 몰랐을 수도 있어요 💡
          </h2>
        </div>

        {/* Description */}
        <p className="mb-8 text-center font-hana-regular text-base text-hana-gray-600 leading-relaxed">
          결혼·출산 시 1억,
          <br />
          창업 시 5억원까지
          <br />
          <span className="font-hana-bold text-black">증여세 면제</span> 받을 수
          있어요.
          <br />
          놓치지 않도록 알려드릴게요.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-hana-main py-4 font-hana-medium text-lg text-white"
        >
          알겠어!
        </button>
      </div>
    </CardModal>
  );
}
