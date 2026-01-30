'use client';

import { saveTimelineMessage } from '@/actions/timeline';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  const [currentMessage, setCurrentMessage] = useState('');

  // 성인 체크 로직
  useEffect(() => {
    if (!bornDate) return;
    const today = new Date();
    const birth = new Date(bornDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age >= 19) {
      const timer = setTimeout(() => setIsAdultModalOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [bornDate]);

  const handleOpenMsgModal = (id: string) => {
    // 클릭한 아이템 찾기
    const targetItem = items.find((item) => item.id === id);

    setSelectedItemId(id);
    setCurrentMessage(targetItem?.message || '');
    setIsMsgModalOpen(true);
  };

  const handleSaveMessage = async (text: string) => {
    if (!selectedItemId) return;
    try {
      const result = await saveTimelineMessage(childId, selectedItemId, text);
      if (result.success) {
        setIsMsgModalOpen(false);
        // 페이지 새로고침 (데이터 반영)
        window.location.reload();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* 1. 타임라인 리스트 */}
      <section className="flex flex-col">
        {items.map((item, index) => (
          <TimelineRow
            key={item.id}
            icon={item.icon}
            variant={item.variant}
            cardData={{
              date: item.date,
              title: item.title,
              fundName: item.fundName,
              movedMoney: item.movedMoney || 0,
              isMessage: item.isMessage,
              message: item.message,
            }}
            // 클릭 시 핸들러 호출
            onMessageClick={() => handleOpenMsgModal(item.id)}
            isLast={index === items.length - 1}
          />
        ))}
      </section>

      {/* 2. 메시지 모달 */}
      <TimelineMsg
        isOpen={isMsgModalOpen}
        onClose={() => setIsMsgModalOpen(false)}
        onSave={handleSaveMessage}
        existingMessage={currentMessage}
      />

      <FinancialHistoryGiftModal
        isOpen={isAdultModalOpen}
        onClose={() => setIsAdultModalOpen(false)}
        childName={childName}
        onShare={() => alert('~카카오톡 공유 해드렸습니다~')}
        onNext={() => setIsAdultModalOpen(false)}
      />
    </>
  );
}
