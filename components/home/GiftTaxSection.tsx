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

const downloadDummyFile = () => {
  const content = `증빙 서류 예시 파일입니다.

- 실제 파일은 추후 제공될 예정입니다.
- 본 파일은 테스트용입니다.
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = '증여세신고서.txt';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

  /* 나이 계산 */
  const today = new Date();
  const birth = new Date(born_date);
  let age = today.getFullYear() - birth.getFullYear();
  const diffMonth = today.getMonth() - birth.getMonth();
  if (diffMonth < 0 || (diffMonth === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  const isMinor = age < 19;

  let title = '';
  let items: ReportItem[] = [];

  /* 유기정기금 */
  if (is_promise_fixed && start_date && end_date && monthly_money) {
    title = '유기정기금 신고 정보';

    const start = new Date(start_date);
    const end = new Date(end_date);

    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const remainingMonths = Math.max(
      0,
      (end.getFullYear() - today.getFullYear()) * 12 +
        (end.getMonth() - today.getMonth()),
    );

    const years = Math.floor(remainingMonths / 12);
    const months = remainingMonths % 12;

    const remainingText =
      years && months
        ? `${years}년 ${months}개월`
        : years
          ? `${years}년`
          : `${months}개월`;

    const r = 0.03 / 12;
    const pv = Math.floor(
      Number(monthly_money) * ((1 - (1 + r) ** -totalMonths) / r),
    );

    const deduction = isMinor ? 20_000_000 : 50_000_000;
    const giftTax = Math.floor(Math.max(0, pv - deduction) * 0.1);

    items = [
      {
        label: '증여 기간',
        value: `${formatCleanDate(start)} ~ ${formatCleanDate(end)}`,
      },
      { label: '잔여 기간', value: remainingText },
      {
        label: '월 납입 예정금',
        value: `${monthly_money.toLocaleString()}원`,
      },
      {
        label: '총 증여 금액',
        value: `${goal_money?.toLocaleString()}원`,
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
    /* 일반 증여 */
    title = '증여세 신고 정보';

    const now = new Date();
    const threeMonthsAgo = new Date(now);
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
      {/* 타이틀 */}
      <div className="mb-6 flex items-center gap-2">
        <h3 className="font-hana-light-bold text-gray-800 text-lg">{title}</h3>
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-hana-black/20">
          <Info size={12} className="text-hana-black" />
        </div>
      </div>

      {/* 항목 리스트 */}
      <div className="mb-4 divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-4 text-[15px]"
          >
            <span className="text-hana-gray-600">{item.label}</span>
            <span
              className={`font-medium ${
                item.isHighlight ? 'text-hana-main' : 'text-hana-black'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* 안내 문구 */}
      {!is_promise_fixed && (
        <div className="mb-6 text-center text-[10px] text-gray-400 leading-relaxed">
          <p>*신고세액공제, 무신고, 납부 지연 가산세는 무시한 결과입니다.</p>
          <p>*최근 3개월 동안의 증여를 반영했습니다.</p>
          <p>
            *증여세 신고서는 증여일이 속하는 달의 말일부터 3개월 이내
            관할세무서에 제출해야 합니다.
          </p>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <CustomButton
            preset="lightgreenshort"
            // className="min-w-40 bg-hana-carousel-bg-green px-6 py-2.5 text-hana-dark-navy transition active:scale-95"
            onClick={downloadDummyFile}
          >
            증빙 서류 다운로드
          </CustomButton>

          <CustomButton
            preset="lightgreenshort"
            onClick={() =>
              window.open(
                'https://www.hometax.go.kr',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            홈택스 신고하기
          </CustomButton>
        </div>

        <p className="text-center text-[11px] text-hana-gray-400">
          홈택스 신고 시 필요한 증빙 서류를 다운로드할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
