'use client';

import { ChevronRight, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @page: 공통 컴포넌트 - 약관 동의
 * @description: label로 약관 동의의 제목을 설정하고 항목을 추가할 수 있습니다.
 * @author: typeYu
 * @date: 2026-01-23
 */

type AgreeItem = {
  content: string;
  checked: boolean;
  onCheckedChange: (nextChecked: boolean) => void;
};

type Props = {
  label: string;
  items?: AgreeItem[];
  className?: string;
};

export function AgreeTerms({ label, items = [], className }: Props) {
  const hasItems = items.length > 0;
  const allChecked = hasItems ? items.every((item) => item.checked) : false;

  const getCheckColorClass = (checked: boolean) => {
    return checked ? 'text-hana-main' : 'text-hana-gray-300';
  };

  const handleToggleAll = () => {
    if (!hasItems) {
      return;
    }

    const next = !allChecked;

    for (const item of items) {
      item.onCheckedChange(next);
    }
  };

  return (
    <section
      className={cn(
        'rounded-[10px] border-2 border-hana-gray-200 bg-white font-hana-cm',
        className,
      )}
      aria-label="약관 동의"
    >
      {/* Title */}
      <div className="flex w-full items-center px-5 py-3.5">
        {/* 체크박스만 클릭 */}
        <button
          type="button"
          onClick={handleToggleAll}
          className="shrink-0"
          aria-label={`${label} ${allChecked ? '해제' : '선택'}`}
        >
          <CircleCheck className={getCheckColorClass(allChecked)} />
        </button>

        <span className="hana-gray-400 ml-3 text-sm">{label}</span>

        <span className="hana-gray-400 ml-auto shrink-0" aria-hidden="true">
          <ChevronRight />
        </span>
      </div>

      {/* Items */}
      {hasItems ? (
        <div className="border-hana-gray-200 border-t">
          <ul className="px-6 pt-3 pb-4">
            {items.map((item) => {
              const handleToggleItem = () => {
                item.onCheckedChange(!item.checked);
              };

              return (
                <li key={item.content} className="flex items-center py-2">
                  {/* 항목 체크 아이콘 */}
                  <button
                    type="button"
                    onClick={handleToggleItem}
                    className="flex items-center text-left"
                    aria-label={`${item.content} ${item.checked ? '해제' : '선택'}`}
                  >
                    <CircleCheck
                      className={[
                        'shrink-0',
                        getCheckColorClass(item.checked),
                      ].join(' ')}
                    />
                    <span className="ml-3 text-[13px] text-hana-gray-400">
                      {item.content}
                    </span>
                  </button>

                  {/* > 아이콘. 동작 없음 */}
                  <span
                    className="ml-auto shrink-0 text-hana-gray-400"
                    aria-hidden="true"
                  >
                    <ChevronRight />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
