'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { saveTimelineMessage } from '@/app/actions/timeline';
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

  // ✨ 성인(만 19세, 한국나이 20세) 체크 로직
  useEffect(() => {
    if (!bornDate) return;

    console.log('넘겨받은 생일:', bornDate);

    const today = new Date();
    const birth = new Date(bornDate);

    // 👇👇 이 로그를 추가해주세요! 👇👇
    console.log('=== 성인 체크 디버깅 ===');
    console.log('오늘 날짜:', today);
    console.log('받아온 생일:', bornDate);
    console.log('변환된 생일:', birth);
    // 만 나이 계산
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // 만 19세 이상(성인)이면 1.5초 뒤 축하 팝업 등장
    if (age >= 19) {
      const timer = setTimeout(() => setIsAdultModalOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [bornDate]);

  // 💌 메시지 모달 열기
  const handleOpenMsgModal = (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    setSelectedItemId(id);
    setCurrentMessage(targetItem?.message || '');
    setIsMsgModalOpen(true);
  };

  // 💾 메시지 저장 로직
  const handleSaveMessage = async (text: string) => {
    if (!selectedItemId) return;
    try {
      const result = await saveTimelineMessage(childId, selectedItemId, text);
      if (result.success) {
        setIsMsgModalOpen(false);
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

      <TimelineMsg
        isOpen={isMsgModalOpen}
        onClose={() => setIsMsgModalOpen(false)}
        onSave={handleSaveMessage}
      />

      <FinancialHistoryGiftModal
        isOpen={isAdultModalOpen}
        onClose={() => setIsAdultModalOpen(false)}
        childName={childName}
        onShare={() => alert('카카오톡 공유 기능은 준비 중입니다! 📤')}
        onNext={() => setIsAdultModalOpen(false)}
      />
    </>
  );
}
