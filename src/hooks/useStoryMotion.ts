import { MutableRefObject, useEffect } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type MotionRefs = {
  containerRef: MutableRefObject<HTMLElement | null>;
  kickerRef: MutableRefObject<HTMLElement | null>;
  titleRef: MutableRefObject<HTMLElement | null>;
  paragraphRefs: MutableRefObject<(HTMLElement | null)[]>;
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
  kickerRef,
  titleRef,
  paragraphRefs,
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
    const kicker = kickerRef.current;
    const title = titleRef.current;
    const paragraphs = paragraphRefs.current?.filter(Boolean) as HTMLElement[];
    const media = mediaRef.current;

    if (!container || !kicker || !title || !media || prefersReducedMotion) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ markers: false });
    ScrollTrigger.config({ limitCallbacks: true });

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.85 } });

      timeline
        .from(kicker, { y: 28, opacity: 0, filter: 'blur(8px)' })
        .from(title, { y: 48, opacity: 0, filter: 'blur(14px)' }, '-=0.45');

      if (paragraphs.length) {
        timeline.from(
          paragraphs,
          {
            y: 28,
            opacity: 0,
            filter: 'blur(10px)',
            stagger: 0.16,
          },
          '-=0.35',
        );
      }

      gsap.to(media, {
        y: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    const refresh = debounce(() => {
      ScrollTrigger.refresh();
    }, 220);

    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('resize', refresh);
      ctx.revert();
    };
  }, [containerRef, kickerRef, titleRef, paragraphRefs, mediaRef, enabled]);
};

export default useStoryMotion;
