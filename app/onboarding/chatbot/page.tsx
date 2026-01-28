'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getNextChildId } from '@/actions/chatbot.action';
import CardChatbot from '@/components/cmm/CardChatbot';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import InputChat from '@/components/cmm/InputChat';
import { IMAGES_PATH } from '@/constants/images';
import type { DraftPlanPayload } from '../result/page';

/**
 * @page: 가입 중 챗봇
 * @description: 가입 중 챗봇입니다. openAi api를 활용하여 증여 도우미 챗벗을 제작했습니다.
 * @author: 승빈
 * @date: 2026-01-28
 */

type Message = {
  id: number;
  role: 'user' | 'ai';
  content: string;
  mainTitle?: string;
  isScenario?: boolean;
};

export default function chatbotSignProcess() {
  const route = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentChildId, setCurrentChildId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      mainTitle: '안녕하세요! 자녀 증여 플래너 별벗입니다',
      content:
        "자녀분의 나이와 부모님의 재정 상황을 고려해 최적의 증여 플랜을 짜드릴게요.\n\n예) '다음 달 승진해서 월급 300 오르는데 증여 얼마 할까?' 처럼 편하게 물어보세요!",
      isScenario: false,
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initId() {
      const uniqueId = await getNextChildId();
      setCurrentChildId(uniqueId);
    }
    initId();
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (messages || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (loading || !currentChildId) return;

    // 1. 유저 메시지 추가
    const userMsgId = Date.now();
    setMessages((prev: Message[]) => [
      ...prev,
      { id: userMsgId, role: 'user', content: text },
    ]);

    setLoading(true);

    try {
      // 2. API 호출
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: currentChildId,
          userInput: text,
          parentIncome: 60000000,
          parentAssets: 300000000,
          childAge: 5,
        }),
      });

      const data = await res.json();
      console.log(data);

      // 3. AI 응답 처리
      if (data.error) {
        setMessages((prev: Message[]) => [
          ...prev,
          {
            id: Date.now(),
            role: 'ai',
            mainTitle: '앗, 답변하기 어려워요 😅',
            content: data.error,
            isScenario: false,
          },
        ]);
      } else {
        if (data.dbData) {
          const raw = sessionStorage.getItem('giftPlan');
          const prevData: DraftPlanPayload = raw
            ? JSON.parse(raw)
            : {
                updated_at: new Date().toISOString(),
                plan: {},
              };

          const sessionData = {
            child_id: currentChildId,
            isSigned: false,
            updated_at: new Date().toISOString(),
            plan: { ...prevData.plan, ...data.dbData },
          };

          sessionStorage.setItem('giftPlan', JSON.stringify(sessionData));
        }

        const summaryText = `
${data.explanation}

──────────────────

✅ 추천 증여기간: ${data.periodYears}년
💰 월 증여액: ${data.monthlyGift.toLocaleString()}원
🎁 총 증여액: ${data.totalGift.toLocaleString()}원
${data.useYugi ? '📝 유기정기금 신고: 추천' : ''}
${data.usePensionFund ? '💸 연금저축펀드: 추천' : ''}
`.trim();

        setMessages((prev: Message[]) => [
          ...prev,
          {
            id: Date.now(),
            role: 'ai',
            mainTitle: '✨ 별벗 맞춤 증여 플랜 도착!',
            content: summaryText,
            isScenario: false,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          mainTitle: '시스템 오류가 발생했어요 😭',
          content: '잠시 후 다시 시도해 주세요.',
          isScenario: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header content="AI 맞춤 증여 플랜" />

      <div className="scrollbar-hide -p-3 w-full flex-1 overflow-y-auto pb-24">
        <div className="flex w-full flex-col p-4">
          <div className="my-6 flex animate-fade-in-down flex-col items-center justify-center">
            <Image
              src={IMAGES_PATH.STARBOT3D}
              alt="starbot3D"
              width={90}
              height={70}
              className="mb-2 object-contain"
              priority
            />
            <div className="text-center font-hana-medium text-[13px] text-gray-600 leading-relaxed">
              예정된 자금 흐름에 맞는
              <br />
              <span className="font-bold text-hana-main">최적의 플랜</span>을
              세워보아요
            </div>
          </div>

          <div className="w-full space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="w-full animate-fade-in-up">
                {msg.role === 'ai' ? (
                  <div className="w-full">
                    <CardChatbot
                      mainTitle={msg.mainTitle || ''}
                      content={msg.content}
                      isScenario={msg.isScenario || false}
                    />
                  </div>
                ) : (
                  <div className="flex w-full justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-[18px] rounded-br-none bg-hana-main px-5 py-3 text-[14px] text-white leading-relaxed shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start pl-2">
                <span className="animate-pulse text-gray-400 text-xs">
                  별벗이가 열심히 계산 중... 🤔
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!loading && (
            <div className="mt-6 flex w-full justify-center">
              <CustomButton
                preset="maingreenshort"
                onClick={() => route.push('/onboarding/loading')}
              >
                채팅 완료하기
              </CustomButton>
            </div>
          )}
        </div>
      </div>

      <InputChat
        placeholder={
          loading ? '잠시만 기다려주세요...' : '궁금한 점을 물어보세요'
        }
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
