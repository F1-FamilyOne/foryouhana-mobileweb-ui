import { NextResponse } from 'next/server';
import { account_acc_type } from '@/lib/generated/prisma/client';
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
      child_id: childId,
      acc_type: { in: [account_acc_type.FUND, account_acc_type.PENSION] },
      fund_id: { not: null },
    },
    include: {
      fund: true,
      auto_transfer_target: true,
    },
    orderBy: [{ opened_at: 'desc' }],
  });

  const cards = accounts.map((a) => {
    const isCanceled = a.closed_at !== null;
    const monthly = a.auto_transfer_target[0]?.amount;

    const tags: [string?, string?, string?] = [
      fundTypeTag(a.fund?.type),
      a.in_type ? '자유 적립' : '정기 적립',
      isCanceled ? '해지' : '운용중',
    ];

    return {
      id: String(a.id),
      variant: isCanceled ? 'canceled' : 'active',
      title: a.fund?.name ?? '상품명 없음',
      tags,
      totalAmountWonText: formatWon(a.deposit),
      profitRateText: a.plus_rate.toString(),
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
