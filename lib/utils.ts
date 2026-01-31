import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWon(num: number) {
  return num.toLocaleString('ko-KR');
}

type GiftTaxResult = {
  totalGift: number; // 실제 납입 총액
  assessedValue: number; // 세법상 평가액 (현재가치)
  taxableAmount: number; // 과세표준
  tax: number;
};

type ComparisonResult = {
  yugi: GiftTaxResult;
  lumpSum: GiftTaxResult;
  taxDifference: number;
};

export function compareGiftTaxByMonthWithPV({
  monthlyAmount,
  months,
  isMinor,
  taxRate = 0.1, // 비교용 단일 세율
}: {
  monthlyAmount: number;
  months: number;
  isMinor: boolean;
  taxRate?: number;
}): ComparisonResult {
  const exemption = isMinor ? 20_000_000 : 50_000_000;
  const discountRate = 0.03;

  const years = Math.floor(months / 12);
  const annualAmount = monthlyAmount * 12;
  const totalGift = monthlyAmount * months;

  /**
   * 1️⃣ 유기정기금 현재가치 평가
   */
  let presentValue = 0;

  for (let n = 1; n <= years; n++) {
    presentValue += annualAmount / (1 + discountRate) ** n;
  }

  // 👉 세법상 보완 규정: 1년분 × 20 중 작은 금액
  const assessedYugiValue = Math.min(presentValue, annualAmount * 20);

  // 👉 공제 적용
  const yugiTaxableAmount = Math.max(assessedYugiValue - exemption, 0);
  const yugiTax = yugiTaxableAmount === 0 ? 0 : yugiTaxableAmount * taxRate;

  /**
   * 2️⃣ 일시금 증여
   */
  const lumpTaxableAmount = Math.max(totalGift - exemption, 0);
  const lumpTax = lumpTaxableAmount === 0 ? 0 : lumpTaxableAmount * taxRate;

  return {
    yugi: {
      totalGift,
      assessedValue: assessedYugiValue,
      taxableAmount: yugiTaxableAmount,
      tax: yugiTax,
    },
    lumpSum: {
      totalGift,
      assessedValue: totalGift,
      taxableAmount: lumpTaxableAmount,
      tax: lumpTax,
    },
    taxDifference: lumpTax - yugiTax,
  };
}

export function formatWonDetail(amount: number): string {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) {
    return `${eok}억 ${man.toLocaleString()}만 원`;
  }

  if (eok > 0) {
    return `${eok}억 원`;
  }

  if (man > 0) {
    return `${man.toLocaleString()}만 원`;
  }

  return `${amount.toLocaleString()}원`;
}

export function formatWonNumbers(amount: number): number {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) {
    return man;
  }

  if (eok > 0) {
    return eok;
  }

  if (man > 0) {
    return man;
  }

  return amount;
}

export type WonUnit = '원' | '만원' | '억';
export function getWonUnit(amount: number): WonUnit {
  if (amount >= 100_000_000) {
    return '억';
  }

  if (amount >= 10_000) {
    return '만원';
  }

  return '원';
}

export type MonthUnit = '개월' | '년';
export function getMonthUnit(months: number): MonthUnit {
  if (months >= 12) {
    return '년';
  }

  return '개월';
}

export function formatMonthToYearMonth(months: number): string {
  if (months < 12) {
    return `${months}개월`;
  }

  const years = Math.floor(months / 12);
  const remainMonths = months % 12;

  if (remainMonths === 0) {
    return `${years}년`;
  }

  return `${years}년 ${remainMonths}개월`;
}
export function formatWonNatural(amount: number | bigint): string {
  if (amount <= 0) return '0원';

  // ✅ bigint 분기
  if (typeof amount === 'bigint') {
    const EOK = 100_000_000n;
    const MAN = 10_000n;

    const eok = amount / EOK;
    const man = (amount % EOK) / MAN;

    const parts: string[] = [];

    if (eok > 0n) {
      parts.push(`${eok.toString()}억`);
    }

    if (man > 0n) {
      parts.push(`${man.toString()}만`);
    }

    if (eok === 0n && man === 0n) {
      return `${amount.toString()}원`;
    }

    return `${parts.join(' ')}원`;
  }

  // ✅ number 분기
  const EOK = 100_000_000;
  const MAN = 10_000;

  const eok = Math.floor(amount / EOK);
  const man = Math.floor((amount % EOK) / MAN);

  const parts: string[] = [];

  if (eok > 0) {
    parts.push(`${eok}억`);
  }

  if (man > 0) {
    parts.push(`${man.toLocaleString()}만`);
  }

  if (eok === 0 && man === 0) {
    return `${amount.toLocaleString()}원`;
  }

  return `${parts.join(' ')}원`;
}

export function getGiftPeriodMonths(
  startDate?: Date | null,
  endDate?: Date | null,
): number | null {
  if (!startDate || !endDate) return null;

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth(); // 0-based
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

export const getMonthDiff = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  // 종료일의 "일"이 시작일보다 작으면 아직 한 달이 안 찼다고 판단
  if (endDate.getDate() < startDate.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
};

export function yearMonthToDateWithTodayDay(
  yearMonth: string,
  today = new Date(),
) {
  const [year, month] = yearMonth.split('-').map(Number);

  const day = today.getDate();

  // 해당 월의 마지막 날
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  const safeDay = Math.min(day, lastDayOfMonth);

  return new Date(year, month - 1, safeDay);
}

export function addMonthsToYearMonth(
  yearMonth: string,
  addMonths: number,
): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr); // 1 ~ 12

  const totalMonths = year * 12 + (month - 1) + addMonths;

  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;

  return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}
