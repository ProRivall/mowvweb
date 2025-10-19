import { motion } from 'framer-motion';

import Hyperspeed from '../Hyperspeed.jsx';

import './HeroSection.css';

const heroTitle = 'WE MOVE DIFFERENT';
const manifestLines = [
  'Motion-built silhouettes tuned for the night drive.',
  'Fabric engineered to keep pace with every shift.',
  'Details sharpened by neon, calibrated for velocity.',
];

const titleVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.92, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

const manifestVariants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(18px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.18,
      delayChildren: 0.25,
    },
  },
};

const manifestItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionUl = motion.ul;
const MotionLi = motion.li;

export default function HeroSection({ colors, heroVisible, mousePosition, headerOffset = 0 }) {
  const contentTransform = `translate(${mousePosition.x * -3}px, ${mousePosition.y * -3}px)`;
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
    >
      <div className="hero-background">
        <Hyperspeed />
        <div className="hero-gradient-glow" />
        <div className="hero-scanlines" />
      </div>

      <div
        className="hero-content"
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
          {heroTitle.split(' ').map((word, index) => (
            <span key={word} className={index === 1 ? 'hero-title-accent' : undefined}>
              {word}
            </span>
          ))}
        </MotionH1>

        <MotionP
          className="hero-subtitle"
          style={{ color: colors.muted }}
          variants={subtitleVariants}
          initial="hidden"
          animate={heroVisible.subtitle ? 'visible' : 'hidden'}
        >
          Not fashion. Not hype. Motion turned into fabric.
        </MotionP>

        <MotionUl
          className="hero-manifest"
          variants={manifestVariants}
          initial="hidden"
          animate={heroVisible.manifest ? 'visible' : 'hidden'}
        >
          {manifestLines.map((line) => (
            <MotionLi key={line} variants={manifestItemVariants}>
              <span className="hero-manifest-dot" />
              {line}
            </MotionLi>
          ))}
        </MotionUl>
      </div>
    </section>
  );
}
