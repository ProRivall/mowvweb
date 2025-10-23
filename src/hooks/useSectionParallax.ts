import { useEffect } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SectionParallaxOptions = {
  enabled?: boolean;
  selector?: string;
  baseOffset?: number;
};

const DEFAULT_SELECTOR = '[data-parallax-section]';
const DEFAULT_OFFSET = 7.5;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function useSectionParallax({
  enabled = true,
  selector = DEFAULT_SELECTOR,
  baseOffset = DEFAULT_OFFSET,
}: SectionParallaxOptions = {}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || prefersReducedMotion()) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(selector);

      const applyParallax = (section: HTMLElement, target: HTMLElement, depth: number) => {
        const intensity = baseOffset * depth;

        gsap.set(target, { willChange: 'transform' });

        gsap.fromTo(
          target,
          { yPercent: -intensity },
          {
            yPercent: intensity,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              anticipatePin: 0.5,
              invalidateOnRefresh: true,
            },
          },
        );
      };

      sections.forEach((section) => {
        const baseDepth = Number.parseFloat(section.dataset.parallaxDepth ?? '1') || 1;
        const strength = Number.parseFloat(section.dataset.parallaxStrength ?? '1') || 1;
        const parallaxChildren = section.querySelectorAll<HTMLElement>('[data-parallax-content]');

        if (parallaxChildren.length) {
          parallaxChildren.forEach((child) => {
            const childDepth = Number.parseFloat(child.dataset.parallaxDepth ?? String(baseDepth)) || baseDepth;
            applyParallax(section, child, childDepth * strength);
          });
        } else {
          const fallback = (section.firstElementChild as HTMLElement | null) ?? section;
          applyParallax(section, fallback, baseDepth * strength);
        }
      });
    });

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [enabled, selector, baseOffset]);
}
