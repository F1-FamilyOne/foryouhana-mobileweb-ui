'use client';
import Image from 'next/image';

/**
 * @page: 챗봇카드
 * @description:
 * title과 section 내용을 입력받습니다.
 * isScenario로 버튼을 나타냅니다.
 * section 은 title과 description으로 구성되어 있습니다.AI 오픈소스에 따라 통합해도 되겠습니다.
 * @author: 승빈
 * @date: 2026-01-23
 */

type HelpSection = {
  title: string;
  descriptions: string[];
};

type CardChatbotProps = {
  mainTitle: string;
  sections: HelpSection[];
  isScenario?: boolean;
};

export default function CardChatbot({
  mainTitle,
  sections,
  isScenario = false,
}: CardChatbotProps) {
  const ICON_PATH = '/chatbot/icon/starbot.svg';

  return (
    <div className="relative pt-[20px]">
      <div className="pointer-events-none absolute top-0 left-0 z-20">
        <Image
          src={ICON_PATH}
          alt="starbot icon"
          width={46.02}
          height={38.6}
          className="object-contain"
          priority
        />
      </div>
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg bg-[var(--color-hana-light-green)] p-7 font-hana-cm text-hana-black shadow-sm">
        <div className="relative z-10 flex h-full flex-1 flex-col">
          <h2 className="mb-8 font-hana-medium text-[15px] tracking-tight">
            {mainTitle}
          </h2>

          <div className="flex-1 space-y-8 rounded-lg bg-white p-6">
            {sections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="font-hana-bold text-base text-hana-main tracking-tight">
                  {section.title}
                </h3>
                <ul className="list-disc pl-4 font-hana-light text-[14px] text-hana-gray-600 leading-relaxed">
                  {section.descriptions.map((desc) => (
                    <li key={desc}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {!isScenario && (
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="cursor-pointer rounded-md border bg-white px-6 py-2.5 font-hana-bold text-hana-main text-sm shadow-sm transition-colors hover:bg-hana-gray-50"
              >
                자산 갱신
              </button>

              <button
                type="button"
                className="cursor-pointer rounded-md bg-hana-main px-6 py-2.5 font-hana-bold text-sm text-white shadow-sm transition-colors hover:bg-hana-main/70"
              >
                정밀 분석
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
