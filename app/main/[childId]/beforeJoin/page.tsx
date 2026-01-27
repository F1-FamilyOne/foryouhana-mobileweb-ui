import BeforeJoinFund from '@/components/beforeJoin/BeforeJoinFund';

export default async function Page({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  return <BeforeJoinFund initialChildId={Number(childId)} />;
}
