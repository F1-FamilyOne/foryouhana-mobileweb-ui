// components/timeline/TimelineFooter.tsx
import { ChevronDown } from 'lucide-react';

// 'export default' 키워드가 반드시 붙어 있어야 합니다.
export default function TimelineFooter() {
  return (
    <footer className="mt-4 mb-10 flex flex-col items-center font-hana-regular">
      <button
        type="button"
        className="flex items-center gap-1 py-4 text-gray-400 text-sm"
      >
        이전 기록 더 보기 <ChevronDown size={16} />
      </button>

      <div className="mt-10 w-full rounded-3xl bg-gray-50 p-8 text-center text-[13px] text-gray-500 leading-relaxed">
        <p>처음 시작했을 때를 기억하세요.</p>
        <p>지금 이 순간을 나중에 아이에게 선물하세요.</p>
      </div>
    </footer>
  );
}
