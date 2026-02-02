import { InfoIcon } from 'lucide-react';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import { BinaryToggle } from '../../../components/cmm/BinaryToggle';

/**
 * @page: PensionSection
 * @description: PensionSection은 온보딩 내의 플랜 수정 페이지에서 연금 저축 펀드 선택 부분을 나타내는 컴포넌트입니다.
 * 연금 저축 펀드 사용 여부를 받습니다.
 *
 * @author: 이정수
 * @date: 2026-01-26
 */

export default function PensionSection({
  select,
  onSelect,
}: {
  select: boolean;
  onSelect: (isSelected: boolean) => void;
}) {
  return (
    <div>
      <TitlePlanSelect
        title="연금저축펀드"
        description="연금저축펀드는 매년 세액공제를 받으면서 투자하고, 은퇴 후에는 낮은 세율로 연금을 받을 수 있어요."
      />{' '}
      <div className="flex flex-row justify-between">
        <BinaryToggle
          value={select}
          onChange={(v) => onSelect(v)}
          trueLabel="신청"
          falseLabel="신청 안함"
        />
      </div>
      <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
        ※ 연금저축펀드는 세액공제 혜택이 있는 대신, 연금 수령 요건을 충족하지
        못하고 중도 해지할 경우 기타소득세 등 불이익이 발생할 수 있습니다.
      </h4>
    </div>
  );
}
