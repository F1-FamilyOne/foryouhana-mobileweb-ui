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
  const parent = await prisma.user.findUnique({
    where: { id: parentId },
    select: {
      reading_list: {
        orderBy: { id: 'asc' },
        take: 1,
        select: {
          provider_id: true,
        },
      },
    },
  });

  if (!parent) {
    return { exists: false };
  }

  if (parent.reading_list.length === 0) {
    return { exists: true, hasChild: false };
  }

  const firstChild = parent.reading_list[0].provider_id;

  const fundAccount = await prisma.account.findFirst({
    where: {
      user_id: firstChild,
      acc_type: account_acc_type.FUND,
    },
    select: {
      id: true,
    },
  });

  return {
    exists: true,
    hasChild: true,
    firstChildId: firstChild,
    hasFundAccount: !!fundAccount,
  };
}

/**
 * @page: getAllChildWithIsHaveFund
 * @description: beforeJoin 첫번째 화면 자녀 토글 분기 로직
 * @author: seonukim
 * @date: 2026-01-29
 */

export type ChildListItem = {
  childId: number;
  profile: string | null;
  hasFundAccount: boolean;
};

export type AllChildWithIsHaveFundReturn =
  | {
      exists: false;
    }
  | {
      exists: true;
      children: ChildListItem[];
    };

export async function getAllChildWithIsHaveFund(
  parentId: number,
): Promise<AllChildWithIsHaveFundReturn> {
  const parent = await prisma.user.findUnique({
    where: { id: parentId },
    select: {
      reading_list: {
        select: {
          provider_id: true,
        },
      },
    },
  });

  if (!parent) {
    return { exists: false };
  }

  const childIds = parent.reading_list.map((r) => r.provider_id);

  const children = await prisma.user.findMany({
    where: { id: { in: childIds } },
    select: {
      id: true,
      profile_pic: true,
    },
  });

  const fundAccounts = await prisma.account.findMany({
    where: {
      user_id: { in: childIds },
      acc_type: account_acc_type.FUND,
    },
    select: {
      user_id: true,
    },
  });

  const fundUserSet = new Set(fundAccounts.map((a) => a.user_id));

  return {
    exists: true,
    children: children.map((c) => ({
      childId: c.id,
      profile: c.profile_pic,
      hasFundAccount: fundUserSet.has(c.id),
    })),
  };
}
