import Image from 'next/image';

/**
 * @page: SlideAi
 * @description: 인트로 슬라이드 3번째 페이지입니다.
 * @author: seonukim
 * @date: 2026-01-27
 */

export default function SlideAi() {
  return (
    <div className="relative h-full font-hana-medium">
      <div className="mt-8 mb-3.75 ml-6 items-center space-y-3 whitespace-nowrap rounded-md bg-white p-3 text-[16px] shadow-md">
        <h1>
          “이 상황에 증여가 얼마 가능할까요?
          <br />
          AI 별벗이 찾아낸{' '}
          <span className="text-hana-main">나만의 맞춤 증여액!</span>”
        </h1>
        <h1>
          "복잡한 증여 신고와 세금 공부,
          <br />
          이제 별벗이{' '}
          <span className="text-hana-main">알아서 다 해드려요.</span>"
        </h1>
        <h1>
          "벌써 12,482명의 부모님이 58억 원의
          <br />
          세금을{' '}
          <span className="text-hana-main">
            지우고 아이의 미래를 세웠습니다.
          </span>
          "
        </h1>
      </div>
      <Image
        src="/ai/hanabot.svg"
        alt="hana-bot"
        width={250}
        height={200}
        className="mr-20 mb-8"
      />
      <h1 className="font-hana-bold text-[25px]">
        "내 아이를 위한 세금 0원 플랜,
        <br />
        <span className="text-hana-main">1분 만에 진단해 볼까요?</span>"
      </h1>
      <h1 className="absolute right-0 bottom-0 font-hana-light text-[12px] text-hana-gray-400">
        3/3
      </h1>
    </div>
  );
}
