import Image from 'next/image';
import { InfoCard } from './InfoCard';
import { IntroStatCard } from './IntroStatCard';

/**
 * @page: SlideBenefit
 * @description: 인트로 화면의 두번째 페이지입니다.
 * @author: seonukim
 * @date: 2026-01-27
 */

export default function SlideBenefit() {
  return (
    <div className="flex w-full flex-col gap-2 font-hana-cm">
      <div className="relative">
        <InfoCard badge="아시나요?">
          <span className="text-hana-light-mint">미리 증여세를 신고</span>
          하면
          <br />
          증여세를 줄일 수 있어요.
        </InfoCard>

        <Image
          src="/intro/introCharacter.svg"
          alt="mascot"
          width={48}
          height={48}
          className="-top-3 absolute right-3"
          priority
        />
      </div>

      <InfoCard badge="세금 차이">
        같은 상품도
        <br />
        수익금의 <span className="text-hana-light-mint">15.4%</span> →
        <span className="text-hana-light-mint"> 3.3%</span>까지
        <br />
        세금을 아낄 수 있어요.
        <br />
        <span className="text-hana-light-mint">
          아낀 세금만큼 시드머니가 늘어나요.
        </span>
      </InfoCard>

      <InfoCard badge="복리 효과">
        만기 시 세금을 내는 기존 상품과 달리,
        <br />
        연금저축펀드는 연금 수령 시에 한 번에 내요.
        <br />
        <span className="text-hana-main">
          따라서 더 강력한 복리를 누릴 수 있어요.
        </span>
      </InfoCard>

      <InfoCard badge="안심 설계">원금은 언제든지 인출 가능해요.</InfoCard>

      <div className="grid grid-cols-2 gap-3 pb-4">
        <IntroStatCard badge="💰 세금 절감" title="15.4% → 3.3%" />
        <IntroStatCard badge="✨ 최저 가입한도" title="10,000원" />
        <IntroStatCard badge="📝 증여 신고" title="필수 첨부자료 제공" />
        <IntroStatCard badge="📈 장기 투자" title="복리 마법" />
      </div>
      <div className="relative w-full">
        <h1 className="absolute right-0 bottom-0.5 font-hana-light text-[12px] text-hana-gray-400">
          2/3
        </h1>
      </div>
    </div>
  );
}
