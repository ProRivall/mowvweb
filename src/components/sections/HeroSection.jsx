import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Hyperspeed from '../Hyperspeed.jsx';
import './HeroSection.css';

const HERO_BACKDROP = {
  alt: 'Abstract neon cityscape with motion blur',
  width: 1600,
  height: 900,
  sources: [
    {
      media: '(min-width: 1024px)',
      sizes: '100vw',
      srcSet:
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=70&w=1600 1600w,' +
        ' https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=65&w=2048 2048w',
    },
    {
      media: '(min-width: 768px)',
      sizes: '100vw',
      srcSet:
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=70&w=1200 1200w,' +
        ' https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=65&w=1400 1400w',
    },
  ],
  mobileSrc:
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=60&w=800',
  placeholder:
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=20&w=32&blur=50',
};

const titleVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
  },
};

const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionDiv = motion.div;

const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const useMediaMatch = (query, defaultValue) => {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (!hasMatchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const update = (event) => setMatches(event.matches);
    setMatches(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }
    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(update);
      return () => mediaQuery.removeListener(update);
    }
    return undefined;
  }, [query]);

  return matches;
};

export default function HeroSection({
  colors,
  heroVisible,
  mousePosition,
  headerOffset = 0,
  motionEnabled = true,
  isMobile = false,
}) {
  const hasFinePointer = useMediaMatch('(pointer: fine)', !isMobile);
  const prefersReducedMotion = useMediaMatch('(prefers-reduced-motion: reduce)', false);

  const shouldRenderHyperspeed = useMemo(
    () => motionEnabled && hasFinePointer && !prefersReducedMotion && !isMobile,
    [hasFinePointer, isMobile, motionEnabled, prefersReducedMotion],
  );

  const allowContentParallax = shouldRenderHyperspeed && hasFinePointer && !prefersReducedMotion;
  const contentTransform = `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)`;

  const sectionStyle = headerOffset
    ? {
        color: colors.text,
        marginTop: `calc(-1 * ${headerOffset}px)`,
        paddingTop: `calc(${headerOffset}px + var(--safe-top))`,
        paddingBottom: `max(${Math.round(headerOffset * 0.35)}px, var(--safe-bottom))`,
      }
    : { color: colors.text };

  return (
    <section
      id="home"
      className="hero-section"
      style={sectionStyle}
      data-parallax-section
      data-parallax-depth="1.1"
    >
      <div className="hero-background" data-parallax-content data-parallax-depth="0.55">
        {shouldRenderHyperspeed ? (
          <>
            <Hyperspeed />
            <div className="hero-scanlines" />
            <div className="hero-vignette" />
          </>
        ) : (
          <div className="hero-fallback">
            <div
              className="hero-fallback__backdrop"
              style={{
                backgroundImage: HERO_BACKDROP.placeholder
                  ? `url(${HERO_BACKDROP.placeholder})`
                  : undefined,
              }}
            />
            <picture>
              {HERO_BACKDROP.sources.map((source) => (
                <source
                  key={source.media}
                  media={source.media}
                  srcSet={source.srcSet}
                  sizes={source.sizes}
                />
              ))}
              <img
                src={HERO_BACKDROP.mobileSrc}
                alt={HERO_BACKDROP.alt}
                width={HERO_BACKDROP.width}
                height={HERO_BACKDROP.height}
                loading="eager"
                decoding="async"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.35) contrast(1.08)',
                }}
              />
            </picture>
            <div className="hero-fallback__overlay" />
          </div>
        )}
      </div>

      <div
        className="hero-content"
        data-parallax-content
        data-parallax-depth="1.25"
        style={{
          transform: allowContentParallax ? contentTransform : undefined,
          paddingTop: headerOffset ? `${Math.round(headerOffset * 0.25)}px` : undefined,
        }}
      >
        <MotionH1
          className="hero-title"
          variants={titleVariants}
          initial="hidden"
          animate={heroVisible.title ? 'visible' : 'hidden'}
        >
          <span>MOVE</span>
          <span className="hero-title-accent">DIFFERENT</span>
        </MotionH1>

        <MotionP
          className="hero-subtitle"
          style={{ color: colors.muted }}
          variants={subtitleVariants}
          initial="hidden"
          animate={heroVisible.subtitle ? 'visible' : 'hidden'}
        >
          Urban energy materialized.
        </MotionP>

        <MotionDiv
          className="hero-cta"
          variants={ctaVariants}
          initial="hidden"
          animate={heroVisible.manifest ? 'visible' : 'hidden'}
        >
          <a href="#about" className="cta-button cta-primary">
            Enter the Movement
          </a>
          <a href="#gallery" className="cta-button cta-secondary">
            Explore
          </a>
        </MotionDiv>
      </div>
    </section>
  );
}
