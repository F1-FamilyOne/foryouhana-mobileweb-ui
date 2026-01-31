import { NextResponse } from 'next/server';
import {
  account_acc_type,
  account_status,
} from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * @page: 내 펀드 리스트 페이지가 prisma와 연결하는 부분입니다
 * @description: 너무 길어져서 로직 분리함
 * @author: typeYu
 * @date: 2026-01-28
 */

function formatWon(n: bigint) {
  const s = n.toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fundTypeTag(t?: string) {
  const typeMap: Record<string, string> = {
    BOND: '채권',
    ETF: 'ETF',
    STOCK: '주식',
    MIXED: '혼합',
    TRUST: '신탁',
  };
  return (t && typeMap[t]) || '상품';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childIdRaw = searchParams.get('childId');

  const childId = Number(childIdRaw);
  if (!childIdRaw || Number.isNaN(childId)) {
    return NextResponse.json(
      { message: 'childId query param is required' },
      { status: 400 },
    );
  }

  const accounts = await prisma.account.findMany({
    where: {
      user_id: childId,
      acc_type: { in: [account_acc_type.FUND, account_acc_type.PENSION] },
      fund_id: { not: null },
    },
    include: {
      fund: true,
    },
    orderBy: [{ opened_at: 'desc' }],
  });

  const accountIds = accounts.map((a) => a.id);

  const transfers = accountIds.length
    ? await prisma.auto_transfer.findMany({
        where: { target_account_id: { in: accountIds } },
        orderBy: [{ id: 'asc' }],
      })
    : [];

  const transferByTargetId = new Map<number, bigint>();
  for (const t of transfers) {
    if (!transferByTargetId.has(t.target_account_id)) {
      transferByTargetId.set(t.target_account_id, t.amount);
    }
  }

  const cards = accounts.map((a) => {
    const isCanceled =
      a.closed_at !== null || a.status === account_status.MATURITY_TERMINATED;

    const monthly = transferByTargetId.get(a.id);

    const tags: [string?, string?, string?] = [
      fundTypeTag(a.fund?.type),
      a.in_type ? '자유 적립' : '정기 적립',
      isCanceled ? '해지' : '운용중',
    ];

    const plusMoney = a.plus_money ?? 0n;
    const evaluated = a.deposit + plusMoney;

    return {
      id: String(a.id),
      fundId: a.fund ? String(a.fund.id) : String(a.fund_id ?? ''),
      variant: isCanceled ? 'canceled' : 'active',
      title: a.fund?.name ?? '상품명 없음',
      tags,

      totalAmountWonText: formatWon(evaluated),

      profitRateText: (a.plus_rate ?? 0).toString(),
      monthlyPayWonText: monthly ? formatWon(monthly) : undefined,
      inType: a.in_type,
    };
  });

  const { activeCards, canceledCards } = cards.reduce(
    (acc, card) => {
      if (card.variant === 'active') {
        acc.activeCards.push(card);
      } else {
        acc.canceledCards.push(card);
      }
      return acc;
    },
    { activeCards: [], canceledCards: [] } as {
      activeCards: typeof cards;
      canceledCards: typeof cards;
    },
  );

  return NextResponse.json({ activeCards, canceledCards });
}
