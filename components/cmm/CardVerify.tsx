'use client';
import { Check, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';

type CardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  buttonLabel: string;
};

export default function CardVerify({
  icon,
  title,
  description,
  buttonLabel,
}: CardProps) {
  const [verified, setVerified] = useState(false);
  const Icon = icon;
  return (
    <div>
      {verified ? (
        <div className="flex h-31.75 w-85.5 flex-col rounded-3xl border-2 border-hana-complete px-5.5 pt-5.5 pb-3.75">
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
            인증이 완료되었습니다.
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
            onClick={() => setVerified(true)}
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
