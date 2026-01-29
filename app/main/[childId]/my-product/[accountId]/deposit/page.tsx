/**
 * @page: DepositPage
 * @description: 입금하기 페이지 (서버 컴포넌트 - 데이터 fetching)
 * @author: 권순범
 * @date: 2026-01-27
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { serializeAccount, serializeAccountWithFund } from '@/lib/serializers';
import DepositClient from './DepositClient';

type Props = {
  params: Promise<{
    childId: string;
    accountId: string;
  }>;
};

export default async function DepositPage({ params }: Props) {
  const { childId, accountId } = await params;
  const childIdNum = Number(childId);
  const accountIdNum = Number(accountId);

  // 1. 대상 계좌 조회 (URL params에서 고정, 변경 불가)
  const targetAccount = await prisma.account.findUnique({
    where: { id: accountIdNum },
    include: { fund: true },
  });

  if (!targetAccount) {
    notFound();
  }

  // 입금 대상은 FUND 또는 PENSION 계좌만 허용
  if (targetAccount.acc_type === 'DEPOSIT' || targetAccount.acc_type === 'GIFT_DEPOSIT') {
    notFound();
  }

  // target 계좌가 해당 child 소유인지 확인
  if (targetAccount.user_id !== childIdNum) {
    notFound();
  }

  // 2. read_auth로 부모 조회
  const auth = await prisma.read_auth.findFirst({
    where: { provider_id: childIdNum },
  });

  if (!auth) {
    notFound();
  }

  const parentUserId = auth.reader_id;

  // 3. 출금 가능한 계좌 조회: 부모 DEPOSIT + 자녀 GIFT_DEPOSIT
  const sourceAccounts = await prisma.account.findMany({
    where: {
      OR: [
        { user_id: parentUserId, acc_type: 'DEPOSIT', status: 'ACTIVE' },
        { user_id: childIdNum, acc_type: 'GIFT_DEPOSIT', status: 'ACTIVE' },
      ],
      id: { not: accountIdNum },
    },
  });

  // BigInt/Decimal을 직렬화 가능한 형태로 변환
  const serializedTargetAccount = serializeAccountWithFund(targetAccount);
  const serializedSourceAccounts = sourceAccounts.map(serializeAccount);

  return (
    <DepositClient
      targetAccount={serializedTargetAccount}
      sourceAccounts={serializedSourceAccounts}
      childId={childIdNum}
      accountId={accountIdNum}
    />
  );
}
