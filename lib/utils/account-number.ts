/**
 * @page: 계좌번호 생성 유틸리티
 * @description: 하나은행 형식의 계좌번호를 생성합니다. 형식: 123-456789-12345
 * @author: 권순범
 * @date: 2026-01-26
 */

/**
 * 하나은행 형식 계좌번호 생성
 * 형식: 123-456789-12345 (3자리-6자리-5자리)
 */
export function generateAccountNumber(): string {
  const part1 = Math.floor(100 + Math.random() * 900).toString();
  const part2 = Math.floor(100000 + Math.random() * 900000).toString();
  const part3 = Math.floor(10000 + Math.random() * 90000).toString();

  return `${part1}-${part2}-${part3}`;
}
