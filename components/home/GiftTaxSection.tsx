'use client';

import { Info } from 'lucide-react';
import { CustomButton } from '../cmm/CustomButton';

type ReportItem = {
  label: string;
  value: string;
  isHighlight?: boolean;
};

type GiftTaxSectionProps = {
  childInfo: {
    is_promise_fixed: boolean;
    monthly_money: number | null;
    goal_money: number | null;
    start_date: Date | null;
    end_date: Date | null;
    born_date: Date;
    in_money_sum: number | null;
  };
};

const formatCleanDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

export default function GiftTaxSection({ childInfo }: GiftTaxSectionProps) {
  if (!childInfo) return null;

  const {
    is_promise_fixed,
    monthly_money,
    goal_money,
    start_date,
    end_date,
    born_date,
    in_money_sum,
  } = childInfo;

  const today = new Date();
  const birth = new Date(born_date);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  const isMinor = age < 19;

  let items: ReportItem[] = [];
  let title = '';

  if (is_promise_fixed && start_date && end_date && monthly_money) {
    title = '유기정기금 신고 정보';
    const start = new Date(start_date);
    const end = new Date(end_date);

    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const remainingTotalMonths = Math.max(
      0,
      (end.getFullYear() - today.getFullYear()) * 12 +
        (end.getMonth() - today.getMonth()),
    );

    const years = Math.floor(remainingTotalMonths / 12);
    const months = remainingTotalMonths % 12;

    let remainingText = '';
    if (years > 0 && months > 0) {
      remainingText = `${years}년 ${months}개월`;
    } else if (years > 0) {
      remainingText = `${years}년`;
    } else {
      remainingText = `${months}개월`;
    }

    const r = 0.03 / 12;
    const pv = Math.floor(
      Number(monthly_money) * ((1 - (1 + r) ** -totalMonths) / r),
    );
    const deduction = isMinor ? 20000000 : 50000000;
    const giftTax = Math.floor(Math.max(0, pv - deduction) * 0.1);

    items = [
      {
        label: '증여 기간',
        value: `${formatCleanDate(start)} ~ ${formatCleanDate(end)}`,
      },
      { label: '잔여 기간', value: remainingText },
      {
        label: '월 납입 예정금',
        value: `${Number(monthly_money).toLocaleString()}원`,
      },
      {
        label: '총 증여 금액',
        value: `${Number(goal_money).toLocaleString()}원`,
        isHighlight: true,
      },
      {
        label: '3% 할인 후 평가액',
        value: `${pv.toLocaleString()}원`,
      },
      {
        label: '증여세',
        value: `${giftTax.toLocaleString()}원`,
        isHighlight: true,
      },
    ];
  } else {
    title = '증여세 신고 정보';
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    threeMonthsAgo.setDate(1);
    items = [
      {
        label: '조회 기간',
        value: `${formatCleanDate(threeMonthsAgo)} ~ ${formatCleanDate(now)}`,
      },
      {
        label: '총 증여 금액',
        value: `${(in_money_sum ?? 0).toLocaleString()}원`,
      },
    ];
  }

  return (
    <div className="w-full rounded-3xl border border-hana-gray-150 bg-white p-6 font-hana-cm shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <h3 className="font-hana-light-bold text-gray-800 text-lg">{title}</h3>
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-hana-black/20">
          <Info size={12} className="text-hana-black" /> {/**맨 왼쪽에 두기 */}
        </div>
      </div>

      {/* 구분선이 포함된 항목 리스트 */}
      <div className="mb-4 flex flex-col">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between py-4 text-[15px]">
              <span className="text-hana-gray-600">{item.label}</span>
              <span
                className={`font-medium ${item.isHighlight ? 'text-hana-main' : 'text-hana-black'}`}
              >
                {item.value}
              </span>
            </div>
            {<div className="h-px w-full bg-gray-100" />}
          </div>
        ))}
      </div>

      {!is_promise_fixed && (
        <div className="mt-2 flex flex-col items-center gap-1 text-center text-[10px] text-gray-400 leading-relaxed">
          <p>*신고세액공제, 무신고, 납부 지연 가산세는 무시한 결과입니다.</p>
          <p>*최근 3개월 동안의 증여를 반영했습니다.</p>
          <p>
            *증여세 신고서를 증여일이 속하는 달의 말일부터 3월 이내에
            관할세무서에 제출해야 합니다.
          </p>
        </div>
      )}
      {/* 버튼 영역: 크기 축소 및 중앙 정렬 */}
      <div className="flex flex-col items-center gap-3">
        <CustomButton
          className="h-auto w-fit min-w-40 bg-hana-carousel-bg-green px-6 py-2.5 text-hana-dark-navy transition-all hover:bg-hana-carousel-bg-green active:scale-95"
          onClick={() => alert('서류 준비 중입니다.')}
        >
          증빙 서류 다운로드
        </CustomButton>
        <p className="text-center text-[11px] text-hana-gray-400">
          홈택스 신고 시 필요한 증빙 서류를 다운로드할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
