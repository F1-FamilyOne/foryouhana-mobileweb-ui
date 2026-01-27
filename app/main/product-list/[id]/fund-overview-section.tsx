/**
 * @page: 상품 개요 컴포넌트
 * @description: 설명 따로 뺀 컴포넌트
 * @author: typeYu
 * @date: 2026-01-27
 */

export function FundOverviewSection() {
  return (
    <div>
      <div className="pt-2 font-hana-bold text-[16px] text-black">
        상품 개요
      </div>

      <div className="mb-10 pt-2 font-hana-cm text-[14px] text-hana-gray-600">
        <div>
          하나 글로벌 성장 펀드는 미국, 유럽, 아시아의 우량 대형주에 분산
          투자하여 안정적인 자산 성장을 목표로 합니다.
        </div>
        <div className="pt-[10px]">
          전문 펀드매니저가 시장 상황을 지속적으로 모니터링하며, 리스크를
          최소화하면서도 꾸준한 수익을 추구합니다.
        </div>
      </div>
    </div>
  );
}
