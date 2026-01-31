'use server';

import { prisma } from '@/lib/prisma';

export async function getLinkedChildren(parentId: number) {
  try {
    const relations = await prisma.read_auth.findMany({
      where: {
        reader_id: parentId,
      },
      include: {
        provider: {
          // 자녀 정보(provider)를 조인해서 가져옴
          select: {
            id: true,
            name: true,
            profile_pic: true,
          },
        },
      },
    });

    // 컴포넌트에서 쓰기 편하게 데이터 가공
    return relations.map((rel) => ({
      id: rel.provider.id,
      name: rel.provider.name,
      avatarUrl: rel.provider.profile_pic || '/file/default.png',
    }));
  } catch (error) {
    console.error('자녀 목록 불러오기 실패:', error);
    return [];
  }
}
