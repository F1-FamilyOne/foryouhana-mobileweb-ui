/**
 * @component: AccountInfoCard
 * @description: 계좌 개설 정보 및 상품 가입 상세 내역을 보여주는 요약 카드 컴포넌트
 * @details:
 * - 상품명, 정기입금일, 출금계좌 정보 등 핵심 정보를 Label-Value 쌍으로 렌더링합니다.
 * - 배열 형태의 데이터를 props로 받아 유연하게 리스트를 구성합니다.
 * - 주로 가입 완료(Complete) 단계나 정보 확인(Verification) 단계에서 요약 UI로 활용됩니다.
 * @author: minyoung
 * @date: 2026-01-27
 */

interface SummaryItem {
  label: string;
  value: string;
}

interface CardSummaryProps {
  items: SummaryItem[];
}

export default function CardSummary({ items }: CardSummaryProps) {
  return (
    <div className="mx-3 rounded-2xl border border-hana-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-y-5">
        {items.map((item) => (
          <div key={item.label} className="flex items-start justify-between">
            <span className="font-hana-cm text-[15px] text-base text-hana-gray-500">
              {item.label}
            </span>
            <span className="text-right font-hana-cm text-[15px] text-base text-hana-black">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
