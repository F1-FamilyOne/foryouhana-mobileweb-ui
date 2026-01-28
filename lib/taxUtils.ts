/** 만나이 계산 */
export const getManAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/** 유기정기금 현재가치 할인 계산 (연 3%) */
export const calculatePresentValue = (
  monthlyMoney: number,
  months: number,
): number => {
  const r = 0.03 / 12; // 월 이자율
  // 등비수열의 합 공식: A * [(1 - (1+r)^-n) / r]
  const pv = monthlyMoney * ((1 - (1 + r) ** -months) / r);
  return Math.floor(pv);
};

/** 증여세 계산 (간이 로직: 가산세 제외) */
export const calculateGiftTax = (evalAmount: number, isMinor: boolean) => {
  const deduction = isMinor ? 20000000 : 50000000;
  const taxBase = Math.max(0, evalAmount - deduction);

  // 1억 이하 10% (현 예제에서는 대부분 10% 구간)
  const tax = taxBase * 0.1;

  return {
    deduction,
    taxBase,
    tax: Math.floor(tax),
  };
};
