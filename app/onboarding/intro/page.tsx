import Link from 'next/link';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import IntroCardCarousel from '@/components/intro/IntroCardCarousel';
import SlideAi from '@/components/intro/SlideAi';
import SlideBenefit from '@/components/intro/SlideBenefit';
import SlideIntro from '@/components/intro/SlideIntro';

/**
 * @page: /onboarding/intro/
 * @description: 서비스 인트로 소개 화면입니다
 * @author: seonukim
 * @date: 2026-01-27
 *
 * 3종류의 카드가 자동으로 이동하게 설정되어있습니다.
 */

export default function ServiceInfo() {
  const cardlist = [
    { id: 'intro', node: <SlideIntro /> },
    { id: 'benefit', node: <SlideBenefit /> },
    { id: 'ai', node: <SlideAi /> },
  ];
  return (
    <div className="w-full text-center">
      <Header content="아이앞으로" />
      <IntroCardCarousel cardlist={cardlist} />
      <div className="pt-3.25 pb-9">
        <Link href={'/onboarding/child-info'}>
          <CustomButton preset="greenlong" className="font-hana-cm">
            내 증여 가능 금액 찾아보기
          </CustomButton>
        </Link>
      </div>
    </div>
  );
}
