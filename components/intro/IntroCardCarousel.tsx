'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

/**
 * @page: IntroCardCarousel
 * @description: 온보딩 인트로 화면에 들어가는 움직이는 캐러셀 화면 컴포넌트입니다.
 * @author: seonukim
 * @date: 2026-01-27
 *
 * 현재 오토 플레이는 5초 간격으로 움직이도록 설정되어있습니다.
 */

type CarouselCard = {
  id: string;
  node: React.ReactNode;
};

type Props = {
  cardlist: CarouselCard[];
};

export default function IntroCardCarousel({ cardlist }: Props) {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[autoplay.current]}
      className="mt-0 flex flex-col items-center justify-start pt-1"
    >
      <CarouselContent className="h-165 w-92.5">
        {cardlist.map((card) => (
          <CarouselItem key={card.id} className="h-full w-full">
            <div className="h-full w-full">
              <Card className="h-full w-full bg-hana-carousel-bg-green">
                <CardContent className="flex h-full w-full items-center justify-center">
                  {card.node}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
