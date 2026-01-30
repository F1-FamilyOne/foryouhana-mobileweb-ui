'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getChildAge } from '@/actions/chatbot.action';
import CardChatbot from '@/components/cmm/CardChatbot';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import InputChat from '@/components/cmm/InputChat';
import { IMAGES_PATH } from '@/constants/images';

type Message = {
  id: number;
  role: 'user' | 'ai';
  content: string;
  mainTitle?: string;
  isScenario?: boolean;
};

export default function ChatbotSignProcess() {
  const route = useRouter();
  const params = useParams();
  const childId = Number(params.childId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasPlan, setHasPlan] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [dbChildAge, setDbChildAge] = useState<number>(0);

  // 1. 자산/수입 상태를 추적하기 위한 State 추가 (기본값 설정)
  const [parentFinance, setParentFinance] = useState({
    income: 60000000,
    assets: 300000000,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      mainTitle: '아래와 같이 도와드려요',
      content: `
**데이터 갱신**
• 마이데이터에 연동된 고객님의 금융자산과 비금융 자산을 최근 정보로 불러와요.

**플랜 작성**
• 고객님의 미래 계획을 상세히 적어주세요
• 고객님의 계획을 반영하여 더욱 정밀하게 적정 증여액을 분석해 드려요.
• <span class="text-red-500 font-bold">자산 변동이 있다면, 데이터 갱신한 후에 하시는 것을 추천드려요!</span>
`.trim(),
      isScenario: true,
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChildInfo = async () => {
      if (!childId) return;
      try {
        const childDataAge = await getChildAge(childId);
        setDbChildAge(childDataAge);
      } catch (error) {
        console.error('자녀 정보 로드 실패:', error);
      }
    };
    fetchChildInfo();
  }, [childId]);

  useEffect(() => {
    if (messages || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          mainTitle: '마이데이터 불러오기가 완료되었어요!',
          content:
            '금융 자산, 비금융 자산 정보 갱신 완료! ✅\n\n이제 정밀 분석을 통해 맞춤형 플랜을 받아보세요.',
          isScenario: true,
        },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleStartAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          mainTitle: '향후 예상 수입과 지출 계획을 자세히 적어주세요!',
          content: `
💡 **가이드라인 (예시 항목)**
• 성과급, 연봉상승률, 경조사비 입금내역과 같이 고정적인 수입 외에 추가적인 수입
• 가족 여행 경비, 자녀 독립 자금과 같이 고정적인 지출 외에 추가적인 지출

💡 **주의 사항**
• 되도록 확실한 정보만 입력해 주세요.
• 분석 결과는 참고용으로 사용해 주세요.
`.trim(),
          isScenario: false,
        },
      ]);
      setLoading(false);
      setShowInput(true);
    }, 500);
  };

  const handleSendMessage = async (text: string) => {
    if (loading) return;

    const userMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: text },
    ]);

    setLoading(true);

    try {
      // 2.  API 호출 시 고정값 대신 parentFinance 상태값을 전달
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId,
          userInput: text,
          parentIncome: parentFinance.income,
          parentAssets: parentFinance.assets,
          childAge: dbChildAge,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
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
          // 3. AI가 계산해준 새로운 자산/수입 정보를 상태에 업데이트
          setParentFinance({
            income: data.dbData.updatedIncome,
            assets: data.dbData.updatedAssets,
          });

          let prevPlan = {};
          const rawData = sessionStorage.getItem('giftPlan');

          if (rawData) {
            try {
              const parsed = JSON.parse(rawData);
              prevPlan = parsed.plan || {};
            } catch (e) {
              console.error('Session storage parse error:', e);
            }
          }

          const sessionData = {
            child_id: childId,
            isSigned: true,
            isChatbot: true,
            updated_at: new Date().toISOString(),
            plan: { ...prevPlan, ...data.dbData },
          };
          sessionStorage.setItem('giftPlan', JSON.stringify(sessionData));
          setHasPlan(true);
          console.log('✅ 플랜 데이터 및 자산 정보 갱신 완료:', sessionData);
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

        setMessages((prev) => [
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
      setMessages((prev) => [
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
      <div className="scrollbar-hide w-full flex-1 overflow-y-auto pb-24">
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
              무엇을 도와드릴까요?
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
                      onRefresh={handleRefreshData}
                      onAnalyze={handleStartAnalysis}
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
        </div>
        {/* 플랜 값이 저장되어야 버튼 나옴 */}
        {hasPlan && !loading && (
          <div className="mt-6 flex w-full justify-center">
            <CustomButton
              preset="maingreenshort"
              onClick={() => route.push(`/main/${childId}/planEdit`)}
            >
              채팅 완료하기
            </CustomButton>
          </div>
        )}
      </div>
      {showInput && (
        <InputChat
          placeholder={
            loading ? '잠시만 기다려주세요...' : '궁금한 점을 물어보세요'
          }
          onSubmit={handleSendMessage}
        />
      )}
    </div>
  );
}
