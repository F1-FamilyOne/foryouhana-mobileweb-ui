/**
 * @page: DepositPage
 * @description: 입금하기 페이지 (서버 컴포넌트 - 데이터 fetching)
 * @author: 권순범
 * @date: 2026-01-27
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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
  if (targetAccount.acc_type === 'DEPOSIT') {
    notFound();
  }

  // 2. 자녀 정보 조회 (gift_account_id 확인용)
  const child = await prisma.child.findUnique({
    where: { id: childIdNum },
  });

  if (!child) {
    notFound();
  }

  // 3. 출금 가능한 계좌 조회
  // 증여 수신 계좌(gift_account)를 제외한 DEPOSIT 계좌들
  const allAccounts = await prisma.account.findMany({
    where: { child_id: childIdNum },
  });

  const sourceAccounts = allAccounts.filter(
    (acc) =>
      acc.acc_type === 'DEPOSIT' &&
      acc.id !== child.gift_account_id &&
      acc.id !== accountIdNum,
  );

  // BigInt를 직렬화 가능한 형태로 변환
  const serializedTargetAccount = {
    ...targetAccount,
    deposit: Number(targetAccount.deposit),
    plus_money: Number(targetAccount.plus_money),
    plus_rate: Number(targetAccount.plus_rate),
    fund: targetAccount.fund
      ? {
          ...targetAccount.fund,
          total_money: Number(targetAccount.fund.total_money),
          total_fee: Number(targetAccount.fund.total_fee),
          sell_fee: Number(targetAccount.fund.sell_fee),
          plus_1: targetAccount.fund.plus_1
            ? Number(targetAccount.fund.plus_1)
            : null,
          plus_5: targetAccount.fund.plus_5
            ? Number(targetAccount.fund.plus_5)
            : null,
          plus_10: targetAccount.fund.plus_10
            ? Number(targetAccount.fund.plus_10)
            : null,
        }
      : null,
  };

  const serializedSourceAccounts = sourceAccounts.map((acc) => ({
    ...acc,
    deposit: Number(acc.deposit),
    plus_money: Number(acc.plus_money),
    plus_rate: Number(acc.plus_rate),
  }));

  return (
    <DepositClient
      targetAccount={serializedTargetAccount}
      sourceAccounts={serializedSourceAccounts}
      childId={childIdNum}
      accountId={accountIdNum}
    />
  );
}
