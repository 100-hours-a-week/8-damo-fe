'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { hasSeenTutorial, markTutorialAsSeen } from '@/src/lib/tutorial/storage';

const TUTORIAL_IMAGES = [
  {
    src: `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/tutorial/tutorial-1-onboarding.png`,
    alt: '취향 정보를 등록하는 튜토리얼',
  },
  {
    src: `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/tutorial/tutorial-2-ai-streaming.png`,
    alt: 'AI 추천 과정을 확인하는 튜토리얼',
  },
  {
    src: `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/tutorial/tutorial-3-vote.png`,
    alt: '후보 식당 투표를 진행하는 튜토리얼',
  },
  {
    src: `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/tutorial/tutorial-4-receipt.png`,
    alt: '영수증을 등록하는 튜토리얼',
  },
  {
    src: `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/tutorial/tutorial-5-chat.png`,
    alt: '모임 채팅을 사용하는 튜토리얼',
  },
] as const;

export function TutorialPageContent() {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const closeTutorial = () => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    markTutorialAsSeen();
    router.replace('/');
  };

  const closeTutorialFromEffect = useEffectEvent(() => {
    closeTutorial();
  });

  useEffect(() => {
    if (hasSeenTutorial()) {
      router.replace('/');
      return;
    }

    window.history.replaceState(window.history.state, '', '/');
    window.history.pushState({ tutorial: true }, '', '/tutorial');

    const handlePopState = () => {
      closeTutorialFromEffect();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const updateIndex = () => {
      const width = viewport.clientWidth || 1;
      const nextIndex = Math.round(viewport.scrollLeft / width);
      setActiveIndex(Math.max(0, Math.min(TUTORIAL_IMAGES.length - 1, nextIndex)));
    };

    updateIndex();
    viewport.addEventListener('scroll', updateIndex, { passive: true });
    window.addEventListener('resize', updateIndex);

    return () => {
      viewport.removeEventListener('scroll', updateIndex);
      window.removeEventListener('resize', updateIndex);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      left: viewport.clientWidth * index,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative flex h-[100dvh] flex-col overflow-hidden bg-white">
      <div className="absolute right-4 top-4 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="튜토리얼 닫기"
          className="rounded-md bg-white/90 text-foreground shadow-sm"
          onClick={closeTutorial}
        >
          <X className="size-5" />
        </Button>
      </div>

      <div
        ref={viewportRef}
        className="min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar"
      >
        <div className="flex h-full">
          {TUTORIAL_IMAGES.map((image, index) => (
            <div key={image.src} className="relative h-full w-full shrink-0 snap-center">
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-contain"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-5 px-5 pb-6 pt-4">
        <div className="flex items-center justify-center gap-2">
          {TUTORIAL_IMAGES.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`${index + 1}번째 튜토리얼 보기`}
              aria-current={activeIndex === index ? 'step' : undefined}
              className={cn(
                'h-2 rounded-full transition-all',
                activeIndex === index ? 'w-6 bg-primary' : 'w-2 bg-black/20'
              )}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>

        <Button type="button" size="lg" className="h-12 w-full" onClick={closeTutorial}>
          시작하기
        </Button>
      </div>
    </section>
  );
}
