import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

import SectionReveal from '../common/SectionReveal.jsx';
import GalleryTitle from './GalleryTitle.jsx';
import { useSwipeCarousel } from '../../hooks/useSwipeCarousel.js';

const GAP = 24;

export default function GallerySection({
  colors,
  galleryItems,
  currentSlide,
  onSelectSlide,
  onPrev,
  onNext,
  isMobile,
  morphWords,
  currentMorphIndex,
  isTitleGlitch,
  onHoverStart,
  onHoverEnd,
  motionEnabled = true,
}) {
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
      const gapValue = Number.parseFloat(
        getComputedStyle(container).columnGap || `${GAP}`,
      );
      widthRef.current = firstCard.getBoundingClientRect().width + gapValue;
    };

    computeCardWidth();
    instance.applyBounds({
      minX: Math.min(-container.scrollWidth + container.offsetWidth, 0),
      maxX: 0,
    });

    const handleSnap = () => {
      if (!widthRef.current) {
        return;
      }
      const offset = Math.abs(instance.x);
      const nextIndex = Math.min(
        galleryItems.length - 1,
        Math.round(offset / widthRef.current),
      );
      onSelectSlide(nextIndex);
    };

    instance.vars.onDragEnd = handleSnap;
    instance.vars.onThrowComplete = handleSnap;

    const handleResize = () => {
      computeCardWidth();
      instance.applyBounds({
        minX: Math.min(-container.scrollWidth + container.offsetWidth, 0),
        maxX: 0,
      });
      const target = -currentSlide * widthRef.current;
      gsap.set(instance, { x: target });
      instance.update();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [currentSlide, galleryItems.length, onSelectSlide]);

  useEffect(() => {
    const container = containerRef.current;
    const instance = container ? Draggable.get(container) : null;
    if (!container || !instance || !widthRef.current) {
      return;
    }

    const target = -currentSlide * widthRef.current;
    gsap.to(instance, {
      x: target,
      duration: 0.6,
      ease: 'power3.inOut',
      onUpdate: () => instance.update(),
    });
  }, [currentSlide]);

  return (
    <SectionReveal
      id="gallery"
      style={{
        padding: '100px 20px',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(48px, 8vw, 80px)',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 50% 50%, rgba(170,0,0,0.18) 0%, transparent 55%), #080808',
      }}
      disableTopFade
    >
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <GalleryTitle
          key={`${morphWords[currentMorphIndex]}-${currentMorphIndex}`}
          text={morphWords[currentMorphIndex]}
          colors={colors}
          isGlitching={isTitleGlitch}
          motionEnabled={motionEnabled}
        />
        <p
          style={{
            marginTop: '18px',
            fontSize: '1rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: colors.muted,
          }}
        >
          Captured Motion Street Narratives
        </p>
      </div>

      <div
        className="gallery-shell"
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <div
          className="gallery-container"
          ref={containerRef}
          style={{
            cursor: 'grab',
          }}
        >
          {galleryItems.map((item, index) => {
            const isActive = index === currentSlide;
            return (
              <article
                key={item.id}
                className={`gallery-card ${isActive ? 'is-active' : ''}`}
                style={{
                  width: isMobile ? 'min(72vw, 320px)' : 'clamp(280px, 26vw, 360px)',
                  border: `1px solid ${colors.line}`,
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #131519, #050507)',
                  position: 'relative',
                  boxShadow: isActive
                    ? '0 24px 80px rgba(255, 26, 54, 0.38)'
                    : '0 10px 30px rgba(0,0,0,0.35)',
                  transition: 'box-shadow 0.4s ease',
                }}
              >
                <div style={{ position: 'relative', height: isMobile ? '320px' : '400px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isActive ? 'contrast(1)' : 'grayscale(0.9)',
                      transition: 'filter 0.4s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '32px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Raleway, sans-serif',
                        fontWeight: 900,
                        color: colors.accent,
                        opacity: 0.36,
                        fontSize: '3.2rem',
                        lineHeight: 1,
                      }}
                    >
                      {String(item.id).padStart(2, '0')}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'Raleway, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        margin: '12px 0 6px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: colors.muted,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <button
          onClick={onPrev}
          className="gallery-cta"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '60px',
            height: '46px',
            padding: '0 20px',
            border: `1px solid ${colors.line}`,
            background: 'rgba(20, 23, 25, 0.6)',
            color: colors.accent,
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 900,
            fontSize: '1.8rem',
            cursor: 'pointer',
            transition: 'all 0.4s',
            borderRadius: '50px',
          }}
          aria-label="Previous gallery slide"
        >
          {'<'}
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {galleryItems.map((item, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSlide(index)}
                style={{
                  width: isActive ? '36px' : '12px',
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
                aria-label={`View gallery item ${index + 1}`}
              />
            );
          })}
        </div>
        <button
          onClick={onNext}
          className="gallery-cta"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '60px',
            height: '46px',
            padding: '0 20px',
            border: `1px solid ${colors.line}`,
            background: 'rgba(20, 23, 25, 0.6)',
            color: colors.accent,
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 900,
            fontSize: '1.8rem',
            cursor: 'pointer',
            transition: 'all 0.4s',
            borderRadius: '50px',
          }}
          aria-label="Next gallery slide"
        >
          {'>'}
        </button>
      </div>
    </SectionReveal>
  );
}
