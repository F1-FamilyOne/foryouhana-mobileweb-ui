'use client';

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
  params: { childId: string };
};

export default function MyProductPage({ params }: Props) {
  const childIdNum = Number(params.childId);
  const childId = Number.isNaN(childIdNum) ? 1 : childIdNum;

  return (
    <div className="relative min-h-full bg-white">
      <Header content={'현재 가입 상품'} />
      <MyProductUi childId={childId} />
      <BottomNavBar />
    </div>
  );
}
