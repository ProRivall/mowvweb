import { useRef } from 'react';

import useStoryMotion from '../../hooks/useStoryMotion';
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

const SPLIT_TAGS = [
  'Urban motion crew',
  'Analog grit // Digital precision',
  'Midnight spirit',
];

const TIMELINE_EVENTS = [
  {
    id: '2019',
    year: '2019',
    label: 'Blueprint Nights',
    shortLabel: 'Blueprint',
    copy: 'Prototype tees and custom LEDs debuted inside warehouse cyphers.',
  },
  {
    id: '2021',
    year: '2021',
    label: 'Midnight Run / 001',
    shortLabel: 'Run 001',
    copy: 'First capsule drop. Lenis-powered runway, sold out in 48 hours.',
  },
  {
    id: '2024',
    year: '2024',
    label: 'Grid-Lock Residency',
    shortLabel: 'Residency',
    copy: 'Immersive performance hub unlocked beneath the East Connector.',
  },
];

const PROOF_POINTS = [
  { id: 'tempo', label: '128 BPM' },
  { id: 'drops', label: '04 Drops' },
  { id: 'cities', label: '12 Cities' },
];

const STORY_MEDIA = {
  image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=2000&auto=format&fit=crop',
  alt: 'Motion blurred runner cutting through neon city lights at night',
};

export default function OurStory({ colors, isMobile, motionEnabled }: OurStoryProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLDivElement | null>(null);
  const hookRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const timelineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const proofRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useStoryMotion({
    containerRef,
    surfaceRef,
    kickerRef,
    hookRef,
    titleRef,
    paragraphRefs: timelineRefs,
    metaRef: proofRef,
    mediaRef,
    enabled: motionEnabled,
  });

  return (
    <section
      id="about"
      ref={containerRef}
      className="our-story"
      data-parallax-section
      data-parallax-depth="0.9"
      data-layout={isMobile ? 'compact' : 'spread'}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="our-story__ambient" aria-hidden />

      <div className="our-story__split">
        <div ref={mediaRef} className="our-story__split-media" style={{ borderColor: colors.line }}>
          <img src={STORY_MEDIA.image} alt={STORY_MEDIA.alt} loading="lazy" />
          <div className="our-story__split-media-overlay" />
          <div className="our-story__split-media-noise" aria-hidden />
          <span className="our-story__split-media-tag">/// live route : central grid</span>
        </div>

        <div ref={surfaceRef} className="our-story__split-copy">
          <div
            ref={kickerRef}
            className="our-story__split-kicker"
            style={{ color: colors.accent }}
          >
            ABOUT MOWV
          </div>
          <h2 ref={titleRef} className="our-story__split-title" style={{ color: colors.text }}>
            Movement is our <span>Bleeding</span> Manifesto.
          </h2>
          <p ref={hookRef} className="our-story__split-mission" style={{ color: colors.muted }}>
            We are an urban motion collective crafting cinematic streetwear for the crews who move after dark. Every
            layer is tuned so a midnight sprint and a sunrise set hit the same flow.
          </p>

          <div className="our-story__split-tags">
            {SPLIT_TAGS.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="our-story__timeline-wrap">
        <div className="our-story__origin-bar">
          <span className="our-story__origin-title">Origins</span>
          <div className="our-story__origin-track">
            {TIMELINE_EVENTS.map((event, index) => (
              <div key={event.id} className="our-story__origin-node">
                <span className="our-story__origin-year">{event.year}</span>
                <span className="our-story__origin-dot" aria-hidden />
                <span className="our-story__origin-label">{event.shortLabel}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="our-story__timeline-details">
          {TIMELINE_EVENTS.map((event, index) => (
            <div key={event.id} className="our-story__timeline-detail">
              <h3>{event.label}</h3>
              <p
                ref={(element) => {
                  timelineRefs.current[index] = element;
                }}
                style={{ color: colors.muted }}
              >
                {event.copy}
              </p>
            </div>
          ))}
        </div>

        <div ref={proofRef} className="our-story__metrics">
          {PROOF_POINTS.map((proof) => (
            <div key={proof.id} className="our-story__metric">
              <span className="our-story__metric-value">{proof.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
