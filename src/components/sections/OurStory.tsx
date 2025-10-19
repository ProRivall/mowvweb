import { useMemo, useRef } from 'react';

import useStoryMotion from '../../hooks/useStoryMotion';
import MarqueeStrip from '../common/MarqueeStrip.jsx';

import './mowv-story.css';

type ColorPalette = {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  accentLight: string;
  accentDeep: string;
  line: string;
  card: string;
};

type OurStoryProps = {
  colors: ColorPalette;
  isMobile: boolean;
  motionEnabled: boolean;
};

const STORY_PARAGRAPHS = [
  'MOWV came up in the backstreets where rhythm and resilience share the same pulse.',
  'We engineer layers that can survive the night drive—stitched for speed, cut for comfort, ready for the moment the beat drops.',
  'Movement over marketing. Truth over trends. Every release is a new route mapped for the ones who refuse to stall.',
];

const STORY_MEDIA = {
  image:
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop',
  alt: 'Motion blurred city lights at night symbolising urban speed',
};

export default function OurStory({ colors, isMobile, motionEnabled }: OurStoryProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const kickerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  const marqueeSettings = useMemo(
    () => ({ repeat: isMobile ? 8 : 6, duration: isMobile ? 28 : 34 }),
    [isMobile],
  );

  useStoryMotion({
    containerRef,
    kickerRef,
    titleRef,
    paragraphRefs: paragraphsRef,
    mediaRef,
    enabled: motionEnabled,
  });

  return (
    <section id="about" ref={containerRef} className="our-story" style={{ backgroundColor: colors.bg }}>
      <div className="our-story__inner">
        <div className="our-story__text">
          <div
            ref={kickerRef}
            className="our-story__kicker"
            style={{ color: colors.accent, letterSpacing: '0.24em' }}
          >
            OUR STORY
          </div>
          <h2 ref={titleRef} className="our-story__title" style={{ color: colors.text }}>
            <span className="our-story__title-glow" aria-hidden="true" />
            Engineered for motion, born in the street.
          </h2>
          <div className="our-story__body">
            {STORY_PARAGRAPHS.map((copy, index) => (
              <p
                key={copy}
                ref={(element) => {
                  paragraphsRef.current[index] = element;
                }}
                className="our-story__paragraph"
                style={{ color: colors.muted }}
              >
                {copy}
              </p>
            ))}
          </div>
        </div>

        <div className="our-story__divider" aria-hidden style={{ background: colors.accent }} />

        <div ref={mediaRef} className="our-story__media" style={{ borderColor: colors.line }}>
          <div className="our-story__media-inner">
            <img className="our-story__media-image" src={STORY_MEDIA.image} alt={STORY_MEDIA.alt} />
            <div className="our-story__media-overlay" />
          </div>
        </div>
      </div>

      <div className="our-story__marquee">
        <MarqueeStrip
          text="BUILT IN MOTION"
          colors={colors}
          motionEnabled={motionEnabled}
          repeatCount={marqueeSettings.repeat}
          duration={marqueeSettings.duration}
          trackOpacity={0.18}
        />
      </div>
    </section>
  );
}
