import BeforeJoinFund from '@/components/beforeJoin/BeforeJoinFund';

export default async function Page({
  params,
}: {
  params: Promise<{ childId: string }>; // Promise 타입 명시
}) {
  const { childId } = await params; // await로 해제
  return <BeforeJoinFund initialChildId={Number(childId)} />;
}
