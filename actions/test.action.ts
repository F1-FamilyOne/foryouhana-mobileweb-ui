'use server';

import { invest_type } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

export async function setRandomInvestTypeForChild(childId: number) {
  // 1. Enum에서 랜덤하게 하나 선택
  const types = Object.values(invest_type);
  const randomType = types[Math.floor(Math.random() * types.length)];

  // 2. Prisma를 통해 DB 저장
  const updatedChild = await prisma.user.update({
    where: { id: childId },
    data: {
      invest_type: randomType,
    },
  });

  // 3. 화면에 보여줄 결과 반환
  return updatedChild.invest_type;
}

export async function getChild(childId: number) {
  return await prisma.user.findUnique({ where: { id: childId } });
}
