import { notFound } from 'next/navigation';
import { getAllChildWithIsHaveFundByChild } from '@/actions/getUserSetup';
import BeforeJoinFund from '@/components/beforeJoin/BeforeJoinFund';

export default async function Page({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const result = await getAllChildWithIsHaveFundByChild(Number(childId));

  if (!result.exists) {
    notFound();
  }

  return (
    <BeforeJoinFund
      initialChildId={Number(childId)}
      childList={result.children}
    />
  );
}
