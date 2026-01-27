/**
 * @description: 숫자 포맷 유틸리티 함수
 * @author: 권순범
 * @date: 2025-01-27
 */

/**
 * 숫자를 천 단위 콤마 포맷으로 변환
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR');
}
