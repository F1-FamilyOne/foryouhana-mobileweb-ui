'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { saveTimelineMessage } from '@/app/components/timeline';
// 🆕 새로 만든 성인 축하 모달 Import
import { FinancialHistoryGiftModal } from './FinancialHistoryGiftModal';
import TimelineMsg from './TimelineMsg';
import TimelineRow from './TimelineRow';

type TimelineItemData = {
  id: string;
  date: Date;
  title?: string;
  fundName?: string;
  movedMoney?: number;
  icon: 'bell' | 'business' | 'trending' | 'gift';
  variant: 'purple' | 'pastelGreen' | 'lightGreen';
  isMessage: boolean;
  message?: string;
  isLast?: boolean;
};

export default function TimelineList({
  items,
  childName,
  bornDate,
}: {
  items: TimelineItemData[];
  childName: string;
  bornDate: Date;
}) {
  const params = useParams();
  const childId = params.childId as string;

  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [isAdultModalOpen, setIsAdultModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // ✨ 성인 여부 체크 (만 19세 기준)
  useEffect(() => {
    const today = new Date();
    const birth = new Date(bornDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    // 생일이 안 지났으면 한 살 뺌 (만 나이 계산)
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // 만 19세 이상이면 팝업 띄우기 (UX를 위해 1.5초 뒤 등장)
    if (age >= 19) {
      const timer = setTimeout(() => setIsAdultModalOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [bornDate]);

  // 메시지 모달 열기
  const handleOpenMsgModal = (id: string) => {
    setSelectedItemId(id);
    setIsMsgModalOpen(true);
  };

  // 메시지 저장 로직
  const handleSaveMessage = async (text: string) => {
    if (!selectedItemId) return;
    try {
      const result = await saveTimelineMessage(childId, selectedItemId, text);
      if (result.success) setIsMsgModalOpen(false);
      else alert('저장 실패');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* 1. 타임라인 리스트 영역 */}
      <section className="flex flex-col">
        {items.map((item) => (
          <TimelineRow
            key={item.id}
            icon={item.icon}
            variant={item.variant}
            isLast={item.isLast}
            cardData={{
              date: item.date,
              title: item.title,
              fundName: item.fundName,
              movedMoney: item.movedMoney || 0,
              isMessage: item.isMessage,
              message: item.message,
            }}
            onMessageClick={() => handleOpenMsgModal(item.id)}
          />
        ))}
      </section>

      {/* 2. 💌 메시지 작성 모달 */}
      <TimelineMsg
        isOpen={isMsgModalOpen}
        onClose={() => setIsMsgModalOpen(false)}
        onSave={handleSaveMessage}
      />

      {/* 3. 🎉 성인 축하 및 금융 이력 선물 모달 (교체 완료!) */}
      <FinancialHistoryGiftModal
        isOpen={isAdultModalOpen}
        onClose={() => setIsAdultModalOpen(false)}
        childName={childName}
        onShare={() => alert('공유하기 기능은 준비 중입니다! 📤')}
        onNext={() => setIsAdultModalOpen(false)} // '다음에 하기' 클릭 시 닫기
      />
    </>
  );
}
