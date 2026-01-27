import { type NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma'; // 로그 저장용

// ✅ Enum 정의
enum AccountAccType {
  DEPOSIT = 'DEPOSIT', // 예금
  FUND = 'FUND', // 펀드
  PENSION = 'PENSION', // 연저펀
}

export async function POST(req: NextRequest) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const body = await req.json();
    const { childId, userInput, parentIncome, parentAssets, childAge } = body;

    // 🛡️ [안전장치 1] 사용자 질문 로그 저장 (실패 시 무시)
    if (childId) {
      try {
        await prisma.chatlog.create({
          data: {
            child_id: childId,
            log: userInput.slice(0, 500),
            is_sent: false,
          },
        });
      } catch (logError) {
        console.warn('⚠️ 채팅 로그 저장 실패 (무시):', logError);
      }
    }

    const isAdult = childAge >= 19;
    const giftLimit = isAdult ? 50000000 : 20000000;

    const systemPrompt = `
# Role
당신은 하나은행의 '자녀 증여 전문 AI 플래너'입니다. 
당신의 목표는 부모님(사용자)의 재정 상황과 자녀의 나이를 고려하여, **가장 현실적이고 세금 효율적인 증여 플랜**을 설계해주는 것입니다.
어려운 세무 용어 대신, 따뜻하고 친근한 말투(이모티콘 사용)로 옆에서 조언해주듯 설명해주세요.

# 🚫 STRICT Guardrails (매우 중요)
사용자의 입력이 아래 주제와 관련이 없다면, 반드시 거절 메시지(JSON의 error 필드)를 반환하십시오.
- 허용 주제: 자녀 증여, 절세, 예금/적금/펀드 추천(증여 목적), 유기정기금, 연금저축펀드, 부모님의 소득/지출 변동에 따른 자금 여력 상담.
- **거절 주제**: 주식 종목 추천(삼성전자 살까요?), 부동산 시세 전망, 오늘 날씨, 맛집 추천, 단순 잡담, 정치/사회 이슈 등.
- 거절 시 답변 예시: {"error": "앗, 저는 자녀 증여와 절세 상담만 도와드릴 수 있어요 😅 아이를 위한 자금 계획에 대해 궁금한 점이 있으신가요?"}

# 📜 2026년 기준 증여세법 및 계산 로직 (반드시 준수)
1. **증여재산 공제 한도 (10년 누적)**
   - 미성년자 (만 19세 미만): **2,000만 원**
   - 성년 (만 19세 이상): **5,000만 원**

2. **유기정기금 평가 (3% 할인율)**
   - 정기적으로 일정 금액을 증여하기로 약정(계약)하고 신고하는 방식.
   - 미래의 돈을 현재가치(연 3% 할인)로 환산하므로 더 많은 금액 비과세 가능.
   - **중요**: 유기정기금 신고를 추천한다면, 적립 방식은 반드시 **'정기적립식(Regular)'**이어야 합니다.

3. **적립 방식 추천 (정기 vs 자유)**
   - **정기적립식(Regular)**: 매월 고정된 날짜에 고정된 금액을 자동이체 (유기정기금 필수 조건).
   - **자유적립식(Free)**: 여유 자금이 생길 때마다 자유롭게 입금 (수입이 불규칙하거나 보너스 활용 시 유리).

4. **연금저축펀드 활용**
   - 증여 후 운용 수익 과세 이연, 연금 수령 시 저율 과세.

# 🧠 추론 및 분석 가이드
1. **지출/소득 변동 분석**: "승진", "수술비" 등 키워드로 실질적 월 여유 자금 추산.
2. **최적 월 납입액 계산**: 공제 한도 및 유기정기금 할인율 고려하여 최대 절세 금액 제안.

# 📤 Output Format (JSON Only)
\`\`\`json
{
  "periodYears": number,
  "monthlyGift": number,
  "totalGift": number,
  "useYugi": boolean,
  "isRegular": boolean,   // true: 정기적립식, false: 자유적립식
  "usePensionFund": boolean,
  "explanation": string   // 상세 분석 및 제안 내용 (최대 500자)
}
\`\`\`

# 🗣️ Explanation 작성 가이드 (가독성 필수!)
- **줄바꿈(개행)을 적극적으로 사용하십시오.**
- 한 문단은 2~3문장을 넘기지 말고, **핵심 내용마다 엔터(\n)를 두 번 입력**하여 단락을 나누십시오.
- 중요한 키워드에는 적절한 이모티콘을 붙여주십시오.
- 적립 방식(정기/자유)을 추천한 이유도 간단히 언급해주세요.
- 예시:
  "승진 축하드려요! 🎉 월급이 오르셨다니 다행이네요.
  
  유기정기금 신고를 통해 절세 효과를 극대화하기 위해 **정기적립식**을 추천드려요! 매월 꾸준히 모으는 게 중요하거든요. 😊"
`;

    const userPrompt = `
[고객 정보]
- 부모 연소득: ${parentIncome.toLocaleString()}원
- 부모 자산: ${parentAssets.toLocaleString()}원
- 자녀 나이: ${childAge}세 (${isAdult ? '성년' : '미성년'})
- 10년 비과세 한도: ${giftLimit.toLocaleString()}원

[고객 질문]
${userInput}
`;

    // 3. AI 호출
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    const data = JSON.parse(raw);

    // 4. 에러 처리
    if (data.error) {
      const errorMsg = data.error.slice(0, 500);

      // 🛡️ [안전장치 2] 에러 로그 저장 (실패 시 무시)s
      if (childId) {
        try {
          await prisma.chatlog.create({
            data: {
              child_id: childId,
              log: errorMsg,
              is_sent: true,
            },
          });
        } catch (logError) {
          console.warn('⚠️ 에러 로그 저장 실패 (무시):', logError);
        }
      }

      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const explanation = data.explanation.slice(0, 500);

    // 5. 데이터 가공
    const inMonth = data.periodYears * 12;
    const accType = data.usePensionFund
      ? AccountAccType.PENSION
      : AccountAccType.DEPOSIT;

    // 🔥 정기/자유 적립 로직 (유기정기금이면 무조건 정기적립식이어야 함)
    // AI가 실수로 useYugi: true인데 isRegular: false를 줬을 경우를 대비한 방어 코드
    const inType = data.useYugi ? true : data.isRegular;

    // 🛡️ [안전장치 3] AI 답변 로그 저장 (실패 시 무시)
    try {
      if (childId) {
        await prisma.chatlog.create({
          data: {
            child_id: childId,
            log: explanation,
            is_sent: true,
          },
        });
      }
    } catch (logError) {
      console.warn('⚠️ 답변 로그 저장 실패 (무시):', logError);
    }

    // ✅ 7. 프론트로 결과 반환
    return NextResponse.json({
      ...data,
      explanation,
      // 👇 DB 스키마랑 똑같은 키 이름으로 정리한 데이터 (세션 스토리지용)
      dbData: {
        goal_money: data.totalGift,
        monthly_money: data.monthlyGift,
        is_promise_fixed: data.useYugi,
        in_month: inMonth,
        acc_type: accType,
        in_type: inType, // ✅ 추가된 필드 (true: 정기, false: 자유)
      },
    });
  } catch (e) {
    console.error('Gift Plan Error:', e);
    // 상세 에러 내용을 반환해서 디버깅 돕기
    return NextResponse.json(
      {
        error:
          '죄송해요, 계산 중 오류가 발생했어요 😭 잠시 후 다시 시도해 주세요.',
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
