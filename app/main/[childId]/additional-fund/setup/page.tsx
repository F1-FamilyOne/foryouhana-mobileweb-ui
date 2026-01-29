import { redirect } from 'next/navigation';
import { SetupForm } from '@/components/additional-fund/SetupForm';
import Header from '@/components/cmm/Header';
import { prisma } from '@/lib/prisma';

/**
 * @page: 추가 펀드 가입 - 납입 설정
 * @description: 납입 금액 및 기간 설정 페이지. 정기적립식/자유적립식 선택.
 * @author: 권순범
 * @date: 2026-01-27
 */

type Props = {
  params: Promise<{ childId: string }>;
  searchParams: Promise<{ fundId?: string }>;
};

export default async function AdditionalFundSetupPage({
  params,
  searchParams,
}: Props) {
  const { childId } = await params;
  const { fundId } = await searchParams;

  // fundId 유효성 검사
  if (!fundId || Number.isNaN(Number(fundId))) {
    redirect(`/main/${childId}/home`);
  }

  // 서버에서 직접 데이터 조회
  const [fund, depositAccount] = await Promise.all([
    prisma.fund.findUnique({
      where: { id: Number(fundId) },
      select: { id: true, saving_type: true },
    }),
    prisma.account.findFirst({
      where: {
        user_id: Number(childId),
        acc_type: 'DEPOSIT',
      },
      select: { id: true },
    }),
  ]);

  // 데이터 유효성 검사
  if (!fund || !depositAccount) {
    redirect(`/main/${childId}/home`);
  }

  return (
    <div className="h-full bg-white">
      <Header content="납입 금액 및 기간 설정하기" />

      <SetupForm
        childId={Number(childId)}
        fundId={fund.id}
        fundSavingType={fund.saving_type}
        depositAccountId={depositAccount.id}
      />
    </div>
  );
}
