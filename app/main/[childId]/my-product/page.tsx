import Header from '@/components/cmm/Header';
import { BottomNavBar } from '@/components/cmm/NavBar';
import { MyProductUi } from './my-product-ui';

/**
 * @page: my-fund-list 페이지
 * @description: 내 펀드 목록을 볼 수 있습니다(운용 중, 해지). ui, route, hook 분리
 * @author: typeYu
 * @date: 2026-01-28
 */

type Props = {
  params: Promise<{ childId: string }>;
};

export default async function MyProductPage({ params }: Props) {
  const { childId } = await params;

  const childIdNum = Number(childId);
  const parsedChildId =
    Number.isFinite(childIdNum) && childIdNum > 0 ? childIdNum : 1;

  return (
    <div className="relative h-full w-full bg-white">
      <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
        <Header content="현재 가입 상품" />

        <main
          className="overflow-y-auto pb-24 [::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <MyProductUi childId={parsedChildId} />
        </main>

        <BottomNavBar />
      </div>
    </div>
  );
}
