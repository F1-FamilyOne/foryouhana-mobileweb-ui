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
          _count: {
            select: {
              account: {
                where: {
                  acc_type: account_acc_type.FUND,
                },
              },
            },
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
    hasFundAccount: firstChild._count.account > 0,
  };
}

export type ChildListItem = {
  childId: number;
  profile: string | null;
  hasFundAccount: boolean;
};

type AllChildWithIsHaveFundReturn =
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
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      child: {
        orderBy: { id: 'asc' },
        select: {
          id: true,
          profile_pic: true,
          _count: {
            select: {
              account: {
                where: {
                  acc_type: account_acc_type.FUND,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!parent) {
    return { exists: false };
  }

  return {
    exists: true,
    children: parent.child.map((c) => ({
      childId: c.id,
      profile: c.profile_pic,
      hasFundAccount: c._count.account > 0,
    })),
  };
}

export async function getAllChildWithIsHaveFundByChild(
  childId: number,
): Promise<AllChildWithIsHaveFundReturn> {
  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: {
      parent_id: true,
    },
  });

  if (!child) return { exists: false };

  return getAllChildWithIsHaveFund(child.parent_id);
}
