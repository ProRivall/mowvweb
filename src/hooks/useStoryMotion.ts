import { MutableRefObject, useEffect } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type MotionRefs = {
  containerRef: MutableRefObject<HTMLElement | null>;
  surfaceRef?: MutableRefObject<HTMLElement | null>;
  kickerRef: MutableRefObject<HTMLElement | null>;
  hookRef?: MutableRefObject<HTMLElement | null>;
  titleRef: MutableRefObject<HTMLElement | null>;
  paragraphRefs: MutableRefObject<(HTMLElement | null)[]>;
  metaRef?: MutableRefObject<HTMLElement | null>;
  mediaRef: MutableRefObject<HTMLElement | null>;
  enabled?: boolean;
};

const debounce = (fn: () => void, wait = 200) => {
  let timeout: number | undefined;
  return () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(fn, wait);
  };
};

export const useStoryMotion = ({
  containerRef,
  surfaceRef,
  kickerRef,
  hookRef,
  titleRef,
  paragraphRefs,
  metaRef,
  mediaRef,
  enabled = true,
}: MotionRefs) => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!enabled) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    const surface = surfaceRef?.current ?? null;
    const kicker = kickerRef.current;
    const hook = hookRef?.current ?? null;
    const title = titleRef.current;
    const paragraphs = paragraphRefs.current?.filter(Boolean) as HTMLElement[];
    const meta = metaRef?.current ?? null;
    const media = mediaRef.current;

    if (!container || !kicker || !title || !media || prefersReducedMotion) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ markers: false });
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      const introTimeline = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.85 },
        scrollTrigger: {
          trigger: container,
          start: 'top 72%',
          once: true,
        },
      });

      if (surface) {
        introTimeline.from(surface, { y: 42, opacity: 0, filter: 'blur(16px)' });
      }

      introTimeline.from(kicker, { y: 28, opacity: 0, filter: 'blur(8px)' }, surface ? '-=0.55' : 0);

      if (hook) {
        introTimeline.from(hook, { y: 24, opacity: 0, filter: 'blur(10px)' }, '-=0.4');
      }

      introTimeline.from(title, { y: 46, opacity: 0, filter: 'blur(14px)' }, '-=0.45');

      if (paragraphs.length) {
        introTimeline.from(
          paragraphs,
          {
            y: 28,
            opacity: 0,
            filter: 'blur(10px)',
            stagger: 0.14,
          },
          '-=0.35',
        );
      }

      if (meta) {
        introTimeline.from(meta, { y: 24, opacity: 0, filter: 'blur(12px)' }, '-=0.28');
      }

      const scrollTriggerConfig = {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      } as const;

      if (surface) {
        gsap.to(surface, {
          y: -14,
          rotateX: 2.2,
          scale: 0.995,
          ease: 'none',
          scrollTrigger: scrollTriggerConfig,
        });
      }

      gsap.set(media, { transformPerspective: 900 });
      const mediaOverlay = media.querySelector('.our-story__media-overlay') as HTMLElement | null;
      const mediaChrome = media.querySelector('.our-story__media-chrome') as HTMLElement | null;

      gsap.to(media, {
        y: 26,
        rotateX: -3,
        rotateY: 2,
        ease: 'none',
        scrollTrigger: scrollTriggerConfig,
      });

      if (mediaOverlay) {
        gsap.to(mediaOverlay, {
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            ...scrollTriggerConfig,
            start: 'top 85%',
          },
        });
      }

      if (mediaChrome) {
        gsap.to(mediaChrome, {
          opacity: 0.18,
          ease: 'none',
          scrollTrigger: {
            ...scrollTriggerConfig,
            start: 'top 90%',
          },
        });
      }
    }, container);

    const refresh = debounce(() => {
      ScrollTrigger.refresh();
    }, 220);

    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('resize', refresh);
      ctx.revert();
    };
  }, [
    containerRef,
    surfaceRef,
    kickerRef,
    hookRef,
    titleRef,
    paragraphRefs,
    metaRef,
    mediaRef,
    enabled,
  ]);
};

export default useStoryMotion;