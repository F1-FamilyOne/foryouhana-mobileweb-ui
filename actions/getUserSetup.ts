'use server';

import { prisma } from '@/lib/prisma';
import { account_acc_type } from '../lib/generated/prisma/enums';

/**
 * @page: UserSetup server action
 * @description: 루트 홈에서 유저를 식별하고 인덱스 1번 자녀를 기준으로 보내는 라우팅확인용 서버액션입니다.
 * @author: seonukim
 * @date: 2026-01-27
 *
 * 유저 id를 받습니다.
 *
 */

type UserSetupReturn =
  | { exists: false }
  | { exists: true; hasChild: false }
  | {
      exists: true;
      hasChild: true;
      firstChildId: number;
      hasFundAccount: boolean;
    };

export async function getUserSetup(parentId: number): Promise<UserSetupReturn> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      child: {
        orderBy: { id: 'asc' },
        take: 1,
        select: {
          id: true,
          account: {
            where: {
              acc_type: account_acc_type.FUND,
            },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!parent) {
    return { exists: false };
  }

  if (parent.child.length === 0) {
    return { exists: true, hasChild: false };
  }

  const firstChild = parent.child[0];

  return {
    exists: true,
    hasChild: true,
    firstChildId: firstChild.id,
    hasFundAccount: firstChild.account.length > 0,
  };
}
