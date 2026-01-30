'use server';
import { prisma } from '@/lib/prisma';

export async function getChildAge(childId: number) {
  try {
    const child = await prisma.user.findUnique({
      where: { id: childId },
      select: { born_date: true }, // 날짜만 쏙 가져오기
    });

    if (!child || !child.born_date) {
      return 0; // 데이터가 없으면 기본값 0
    }

    const birthDate = new Date(child.born_date);
    const today = new Date();

    // 1. 연도 차이 계산
    let age = today.getFullYear() - birthDate.getFullYear();

    // 2. 월/일 비교해서 생일 안 지났으면 -1 (만 나이 핵심)
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age < 0 ? 0 : age; // 0세 미만 방어
  } catch (error) {
    console.error('나이 계산 중 서버 에러:', error);
    return 0;
  }
}
