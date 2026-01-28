import { CustomButton } from '@/components/cmm/CustomButton';

/**
 * @page: BinaryToggle
 * @description: 플랜 수정 페이지에 사용되는 두가지 버튼입니다.
 * onChange 이벤트 리스너로 버튼선택 여부에 따라 토글 상태를 변경할 수 있습니다.
 * @author: 이정수
 * @date: 2026-01-26
 */

type BinaryToggleProps = {
  value: boolean;
  onChange: (v: boolean) => void;
  trueLabel: string;
  falseLabel: string;
  disabled?: boolean;
};

export function BinaryToggle({
  value,
  onChange,
  trueLabel,
  falseLabel,
  disabled = false,
}: BinaryToggleProps) {
  return (
    <div className="flex w-full justify-between">
      <CustomButton
        disabled={disabled}
        preset={value ? 'lightgreenshort' : 'lightgrayshort'}
        onClick={() => onChange(true)}
      >
        {trueLabel}
      </CustomButton>
      <CustomButton
        disabled={disabled}
        preset={!value ? 'lightgreenshort' : 'lightgrayshort'}
        onClick={() => onChange(false)}
      >
        {falseLabel}
      </CustomButton>
    </div>
  );
}
