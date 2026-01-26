'use server'; // 👈 이 줄이 제일 중요합니다! (서버에서 실행된다는 뜻)

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function saveTimelineMessage(
  childId: string,
  timelineId: string,
  message: string,
) {
  try {
    // 1. DB 업데이트 (timeline 테이블의 memo 컬럼 수정)
    await prisma.timeline.update({
      where: {
        id: Number(timelineId), // DB ID가 Int라면 Number로 변환
      },
      data: {
        memo: message, // 메시지 저장
      },
    });

    // 2. 화면 새로고침 (저장하자마자 화면에 반영되도록)
    revalidatePath(`/main/${childId}/timeline`);

    return { success: true };
  } catch (error) {
    console.error('메시지 저장 실패:', error);
    return { success: false, error };
  }
}
