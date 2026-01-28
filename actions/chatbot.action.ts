'use server';

export async function getNextChildId() {
  try {
    const uniqueId = crypto.randomUUID();
    return uniqueId;
  } catch (error) {
    console.error('childId 생성 중 오류 발생:', error);
    return null;
  }
}
