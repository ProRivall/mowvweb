import { motion } from 'framer-motion';
import Hyperspeed from '../Hyperspeed.jsx';
import './HeroSection.css';

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

export default function HeroSection({ colors, heroVisible, mousePosition, headerOffset = 0 }) {
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
        <Hyperspeed />
        <div className="hero-scanlines" />
        <div className="hero-vignette" />
      </div>

      <div
        className="hero-content"
        data-parallax-content
        data-parallax-depth="1.25"
        style={{
          transform: contentTransform,
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