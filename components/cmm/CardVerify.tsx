'use client';
import { Check, type LucideIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

/**
 * @page: CardVerify
 * @description: 가입 절차에 인증 카드 컴포넌트를 구현하였습니다.
 * 버튼을 누르면 인증 완료 상태로 전환됩니다.
 * @author: 이정수
 * @date: 2026-01-24
 */

type CardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  buttonLabel: string;
  checkedLabel: string;
  onSuccess?: () => void;
  checked: boolean;
};

export default function CardVerify({
  icon,
  title,
  description,
  buttonLabel,
  checkedLabel,
  checked,
  onSuccess,
}: CardProps) {
  const Icon = icon;
  return (
    <div>
      {checked ? (
        <div className="flex h-31.75 w-85.5 flex-col rounded-3xl border-2 border-hana-gray-300 bg-hana-white-mint px-5.5 pt-5.5 pb-3.75">
          <div className="flex flex-1 gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-hana-complete">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="grid grid-rows-2 gap-px">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base">{title}</h2>
                <Badge className="h-5 w-9.5 bg-hana-complete text-white">
                  완료
                </Badge>
              </div>
              <h4 className="text-hana-gray-600 text-sm">{description}</h4>
            </div>
          </div>
          <div className="flex h-7.25 w-full items-center rounded-[10px] text-hana-complete text-sm">
            <Check />
            {checkedLabel}
          </div>
        </div>
      ) : (
        <div className="flex h-31.75 w-85.5 flex-col rounded-3xl border-2 border-hana-gray-300 px-5.5 pt-5.5 pb-3.75">
          <div className="flex flex-1 gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-hana-gray-300">
              <Icon className="h-6 w-6 text-hana-gray-500" />
            </div>
            <div className="grid grid-rows-2 gap-px">
              <div className="flex items-center">
                <h2 className="font-semibold text-base">{title}</h2>
              </div>
              <h4 className="text-hana-gray-600 text-sm">{description}</h4>
            </div>
          </div>
          <button
            type="button"
            className="h-7.25 w-full rounded-[10px] bg-hana-gray-400 text-sm text-white hover:bg-hana-gray-400/80"
            onClick={() => {
              if (onSuccess) onSuccess();
            }}
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
