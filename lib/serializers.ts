/**
 * @description: Prisma 모델 직렬화 헬퍼 함수 - BigInt/Decimal을 number로 변환
 * @author: 권순범
 * @date: 2026-01-28
 */

import type { accountModel, fundModel } from '@/lib/generated/prisma/models';

/** Decimal/BigInt 값을 number로 변환 (null-safe, 0으로 폴백) */
export function toNumber(value: unknown): number {
  if (value == null) return 0;
  return Number(value);
}

/** Decimal/BigInt 값을 number | null로 변환 */
export function toNumberOrNull(value: unknown): number | null {
  if (value == null) return null;
  return Number(value);
}

/** account 모델 직렬화 - BigInt/Decimal 필드를 number로 변환 */
export function serializeAccount(acc: accountModel) {
  return {
    ...acc,
    deposit: toNumber(acc.deposit),
    plus_money: toNumber(acc.plus_money),
    plus_rate: toNumber(acc.plus_rate),
  };
}

/** fund 모델 직렬화 - BigInt/Decimal 필드를 number로 변환 */
export function serializeFund(f: fundModel) {
  return {
    ...f,
    total_money: toNumber(f.total_money),
    total_fee: toNumber(f.total_fee),
    sell_fee: toNumber(f.sell_fee),
    plus_1: toNumberOrNull(f.plus_1),
    plus_5: toNumberOrNull(f.plus_5),
    plus_10: toNumberOrNull(f.plus_10),
  };
}

/** account + fund 관계 포함 직렬화 */
export function serializeAccountWithFund(
  acc: accountModel & { fund: fundModel | null },
) {
  return {
    ...serializeAccount(acc),
    fund: acc.fund ? serializeFund(acc.fund) : null,
  };
}
