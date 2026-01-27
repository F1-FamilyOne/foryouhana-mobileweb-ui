import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWon(num: number) {
  return num.toLocaleString('ko-KR');
}

type GiftPlanResult = {
  totalGift: number; // 총 증여 원금
  totalWithAnnuity: number; // 유기정기금 사용 시 총액
  benefit: number; // 추가로 얻는 이득
};

export function calculateGiftBenefit({
  monthlyMoney,
  inMonth,
  annualRate,
}: {
  monthlyMoney: number;
  inMonth: number;
  annualRate: number; // 예: 0.03 (3%)
}): GiftPlanResult {
  const totalGift = monthlyMoney * inMonth;

  const monthlyRate = annualRate / 12;

  const totalWithAnnuity =
    monthlyRate === 0
      ? totalGift
      : monthlyMoney * (((1 + monthlyRate) ** inMonth - 1) / monthlyRate);

  const benefit = totalWithAnnuity - totalGift;

  return {
    totalGift,
    totalWithAnnuity,
    benefit,
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
