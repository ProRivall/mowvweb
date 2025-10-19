import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

import SectionReveal from '../common/SectionReveal.jsx';
import { useSwipeCarousel } from '../../hooks/useSwipeCarousel.js';

const GAP = 24;

export default function StoriesSection({ colors, stories, currentStory, onStoryChange }) {
  const containerRef = useRef(null);
  const widthRef = useRef(0);

  useSwipeCarousel(containerRef);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const instance = Draggable.get(container);
    if (!instance) {
      return undefined;
    }

    const computeCardWidth = () => {
      const firstCard = container.firstElementChild;
      if (!firstCard) {
        widthRef.current = 0;
        return;
      }
      const computedGap = Number.parseFloat(
        getComputedStyle(container).columnGap || `${GAP}`,
      );
      widthRef.current = firstCard.getBoundingClientRect().width + computedGap;
    };

    computeCardWidth();
    instance.applyBounds({
      minX: Math.min(-container.scrollWidth + container.offsetWidth, 0),
      maxX: 0,
    });

    const snapToNearest = () => {
      if (!widthRef.current) {
        return;
      }
      const offset = Math.abs(instance.x);
      const nextIndex = Math.min(
        stories.length - 1,
        Math.max(0, Math.round(offset / widthRef.current)),
      );
      onStoryChange(nextIndex);
    };

    instance.vars.onDragEnd = snapToNearest;
    instance.vars.onThrowComplete = snapToNearest;

    const handleResize = () => {
      computeCardWidth();
      instance.applyBounds({
        minX: Math.min(-container.scrollWidth + container.offsetWidth, 0),
        maxX: 0,
      });
      const target = -currentStory * widthRef.current;
      gsap.set(instance, { x: target });
      instance.update();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [currentStory, stories.length, onStoryChange]);

  useEffect(() => {
    const container = containerRef.current;
    const instance = container ? Draggable.get(container) : null;
    if (!container || !instance) {
      return;
    }

    const target = -currentStory * widthRef.current;
    gsap.to(instance, {
      x: target,
      duration: 0.6,
      ease: 'power3.inOut',
      onUpdate: () => instance.update(),
    });
  }, [currentStory]);

  return (
    <SectionReveal
      id="stories"
      style={{
        minHeight: '100dvh',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(40px, 8vw, 64px)',
        justifyContent: 'center',
      }}
      disableTopFade
    >
      <div style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: colors.accent }}>
        Street Stories
      </div>
      <div className="stories-shell">
        <div className="stories-container" ref={containerRef} style={{ cursor: 'grab' }}>
          {stories.map((story, index) => {
            const isActive = index === currentStory;
            return (
              <article
                key={story.title}
                className={`story-card ${isActive ? 'is-active' : ''}`}
                style={{
                  width: 'clamp(260px, 72vw, 400px)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#050507',
                  boxShadow: isActive
                    ? '0 24px 60px rgba(0,0,0,0.55)'
                    : '0 10px 30px rgba(0,0,0,0.4)',
                }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  style={{
                    width: '100%',
                    height: '320px',
                    objectFit: 'cover',
                    filter: isActive ? 'contrast(1.1)' : 'grayscale(0.9)',
                    transition: 'filter 0.3s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px' }}>
                  <h3
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '12px',
                    }}
                  >
                    {story.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: colors.text }}>
                    “{story.quote}”
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '18px',
                      color: colors.muted,
                      fontSize: '0.85rem',
                      letterSpacing: '0.2em',
                    }}
                  >
                    <span
                      style={{
                        width: '40px',
                        height: '2px',
                        background: colors.accent,
                      }}
                    />
                    {story.location}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {stories.map((_, index) => {
          const isActive = index === currentStory;
          return (
            <button
              key={index}
              onClick={() => onStoryChange(index)}
              style={{
                width: isActive ? '50px' : '12px',
                height: '12px',
                borderRadius: '50px',
                background: isActive
                  ? `linear-gradient(90deg, ${colors.accent}, ${colors.accentLight})`
                  : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isActive ? `0 0 16px ${colors.accent}40` : 'none',
              }}
              aria-label={`View story ${index + 1}`}
            />
          );
        })}
      </div>
    </SectionReveal>
  );
}
