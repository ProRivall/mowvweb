import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSwipeCarousel } from '../../hooks/useSwipeCarousel';

const sectionVariants = {
  hidden: { opacity: 0, y: 120, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const MotionSection = motion.section;

export default function StoriesSection({ colors, stories, currentStory, onStoryChange }) {
  const story = stories[currentStory];
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    amount: 0.3,
    margin: '-15% 0px -15% 0px',
    once: true,
  });
  const totalStories = stories.length;

  useSwipeCarousel(sectionRef, {
    onSwipeLeft: () => onStoryChange((currentStory + 1) % totalStories),
    onSwipeRight: () => onStoryChange((currentStory - 1 + totalStories) % totalStories),
  });

  return (
    <MotionSection
      className="stories-container"
      id="stories"
      ref={sectionRef}
      data-parallax-section
      data-parallax-depth="1.05"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={sectionVariants}
      style={{
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        data-parallax-content
        data-parallax-depth="0.35"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${story.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.32) contrast(1.08)',
          transition: 'all 1s ease',
          zIndex: 0,
        }}
      />
      <div
        data-parallax-content
        data-parallax-depth="0.55"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(8, 10, 14, 0.92) 0%, rgba(10, 12, 16, 0.7) 50%, rgba(10, 10, 12, 0.28) 100%)',
          zIndex: 1,
        }}
      />
      <div
        data-parallax-content
        data-parallax-depth="1.25"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 80px',
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }}
      >
        <div
          style={{
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: colors.accent,
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}
        >
          STREET STORIES
        </div>
        <div style={{ maxWidth: '800px' }}>
          <h2
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              lineHeight: 1.1,
              color: colors.text,
            }}
          >
            {story.title}
          </h2>
          <h3
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              color: colors.muted,
              marginBottom: '2rem',
              letterSpacing: '0.02em',
            }}
          >
            {story.subtitle}
          </h3>
          <blockquote
            style={{
              fontSize: '1.3rem',
              lineHeight: 1.6,
              color: colors.text,
              borderLeft: '4px solid ' + colors.accent,
              paddingLeft: '2rem',
              marginBottom: '2rem',
              fontStyle: 'italic',
              maxWidth: '600px',
            }}
          >
            {story.quote}
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
            <div style={{ width: '40px', height: '2px', background: colors.accent }} />
            <span
              style={{
                fontSize: '0.9rem',
                color: colors.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              {story.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {stories.map((_, index) => {
              const isActive = currentStory === index;
              return (
                <button
                  key={index}
                  onClick={() => onStoryChange(index)}
                  style={{
                    width: isActive ? '50px' : '12px',
                    height: '12px',
                    borderRadius: '50px',
                    background: isActive
                      ? 'linear-gradient(90deg, ' + colors.accent + ', ' + colors.accentLight + ')'
                      : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: isActive ? '0 0 16px ' + colors.accent + '40' : 'none',
                  }}
                  aria-label={'View story ' + (index + 1)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div
        data-parallax-content
        data-parallax-depth="0.9"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '36px',
          transform: 'translateX(-50%)',
          width: 'min(92vw, 920px)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            padding: '16px 28px',
            borderRadius: '999px',
            border: '1px solid rgba(224, 232, 248, 0.16)',
            background: 'rgba(10, 12, 18, 0.55)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontSize: '0.78rem',
            color: 'rgba(226, 232, 244, 0.78)',
          }}
        >
          <span>Each avenue keeps telling new stories</span>
          <span style={{ color: colors.accent }}>/// Shift</span>
        </div>
      </div>
    </MotionSection>
  );
}
