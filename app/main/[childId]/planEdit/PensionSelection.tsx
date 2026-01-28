'use client';
import { BinaryToggle } from '@/components/cmm/BinaryToggle';
import { CustomButton } from '@/components/cmm/CustomButton';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';

export default function PensionSelection({
  prev,
  now,
  onChange,
}: {
  prev: boolean;
  now: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <div>
      <TitlePlanSelect title="연금 저축 펀드" />
      <div>
        {prev === true ? (
          <CustomButton disabled preset="lightgraylong">
            운용 중
          </CustomButton>
        ) : (
          <BinaryToggle
            trueLabel="신청"
            falseLabel="신청 안함"
            value={now}
            onChange={onChange}
          />
        )}
      </div>
      <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
        ※ 연금저축펀드는 세액공제 혜택이 있는 대신, 연금 수령 요건을 충족하지
        못하고 중도 해지할 경우 기타소득세 등 불이익이 발생할 수 있습니다.
      </h4>
    </div>
  );
}
