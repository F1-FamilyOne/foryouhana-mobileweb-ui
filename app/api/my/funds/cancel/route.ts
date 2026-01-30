import { NextResponse } from 'next/server';
import { account_status } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const accountId = Number(body.accountId);

  if (!Number.isFinite(accountId)) {
    return NextResponse.json({ message: 'invalid accountId' }, { status: 400 });
  }

  await prisma.account.update({
    where: { id: accountId },
    data: {
      status: account_status.MATURITY_TERMINATED,
      closed_at: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
