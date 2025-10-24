import SectionReveal from '../common/SectionReveal.jsx';
import GalleryTitle from './GalleryTitle.jsx';
import { useSwipeCarousel } from '../../hooks/useSwipeCarousel';

const FALLBACK_SIZES = '(max-width: 768px) 90vw, 600px';

const resolveImageProps = (image) => {
  if (!image) {
    return { src: '', srcSet: undefined };
  }

  if (typeof image === 'string') {
    return { src: image, srcSet: undefined };
  }

  return { src: image.src ?? '', srcSet: image.srcSet };
};

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
  galleryRef,
  onHoverStart,
  onHoverEnd,
  motionEnabled = true,
}) {
  useSwipeCarousel(galleryRef, {
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    onPress: onHoverStart,
    onRelease: onHoverEnd,
  });

  const getItemClass = (index) => {
    let diff = index - currentSlide;
    if (diff > 2) diff -= galleryItems.length;
    if (diff < -2) diff += galleryItems.length;
    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === -1) return 'prev';
    if (diff === 2) return 'far-next';
    if (diff === -2) return 'far-prev';
    return 'hidden';
  };

  return (
    <SectionReveal
      id="gallery"
      data-parallax-section
      data-parallax-depth="1.1"
      style={{
        padding: '100px 20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(170,0,0,0.22) 0%, transparent 55%), #0E0E0E',
      }}
      disableTopFade
    >
      <div data-parallax-content data-parallax-depth="1.1">
        <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 2 }}>
          <GalleryTitle
            key={`${morphWords[currentMorphIndex]}-${currentMorphIndex}`}
            text={morphWords[currentMorphIndex]}
            colors={colors}
            isGlitching={isTitleGlitch}
            motionEnabled={motionEnabled}
          />
          <div
            style={{
              fontSize: '1.1rem',
              color: colors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginTop: '18px',
            }}
          >
            Captured Motion Street Narratives
          </div>
        </div>

        <div
          className="gallery-container"
          ref={galleryRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            height: isMobile ? '480px' : '600px',
            perspective: '1200px',
            margin: '0 auto',
            zIndex: 2,
            overflow: 'visible',
          }}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
            {galleryItems.map((item, index) => {
              const itemClass = getItemClass(index);
              let transform = '';
              let opacity = 0;
              let zIndex = 0;

              if (itemClass === 'active') {
                transform = 'translateZ(0) scale(1)';
                opacity = 1;
                zIndex = 5;
              } else if (itemClass === 'prev') {
                transform = isMobile
                  ? 'translateZ(-150px) scale(0.75)'
                  : 'translateX(-500px) translateZ(-300px) rotateY(35deg)';
                opacity = isMobile ? 0.4 : 0.6;
                zIndex = 3;
              } else if (itemClass === 'next') {
                transform = isMobile
                  ? 'translateZ(-150px) scale(0.75)'
                  : 'translateX(500px) translateZ(-300px) rotateY(-35deg)';
                opacity = isMobile ? 0.4 : 0.6;
                zIndex = 3;
              } else if (itemClass === 'far-prev') {
                transform = isMobile
                  ? 'translateZ(-300px) scale(0.5)'
                  : 'translateX(-800px) translateZ(-500px) rotateY(45deg)';
                opacity = 0;
                zIndex = 1;
              } else if (itemClass === 'far-next') {
                transform = isMobile
                  ? 'translateZ(-300px) scale(0.5)'
                  : 'translateX(800px) translateZ(-500px) rotateY(-45deg)';
                opacity = 0;
                zIndex = 1;
              }

              const { src, srcSet } = resolveImageProps(item.image);
              const isActive = itemClass === 'active';

              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    width: isMobile ? '320px' : '450px',
                    height: isMobile ? '420px' : '550px',
                    left: '50%',
                    top: '50%',
                    marginLeft: isMobile ? '-160px' : '-225px',
                    marginTop: isMobile ? '-210px' : '-275px',
                    transform,
                    opacity,
                    zIndex,
                    cursor: 'grab',
                    userSelect: 'none',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <picture
                    style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      border: '1px solid ' + colors.line,
                      background: 'linear-gradient(135deg, #0F1215, ' + colors.bg + ')',
                      position: 'relative',
                      display: 'block',
                      boxShadow: isActive ? '0 20px 60px ' + colors.accent + '30' : 'none',
                    }}
                  >
                    {srcSet ? <source srcSet={srcSet} sizes={FALLBACK_SIZES} /> : null}
                    <img
                      src={src}
                      alt={item.title}
                      loading={isActive ? 'eager' : 'lazy'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isActive ? 'grayscale(0%) contrast(1.08)' : 'grayscale(100%) contrast(1.2)',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'radial-gradient(circle at 30% 20%, rgba(255, 70, 90, 0.2), transparent 60%), radial-gradient(circle at 70% 80%, rgba(32, 46, 60, 0.16), transparent 65%)',
                        mixBlendMode: 'screen',
                        pointerEvents: 'none',
                      }}
                    />
                  </picture>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: isMobile ? '18px 20px' : '24px 28px',
                      background: 'linear-gradient(180deg, rgba(4,4,5,0) 0%, rgba(4,4,5,0.95) 85%)',
                      color: colors.text,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: colors.accent,
                        opacity: 0.8,
                      }}
                    >
                      {String(item.id).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Raleway, sans-serif',
                        fontWeight: 900,
                        fontSize: '1.9rem',
                        textTransform: 'uppercase',
                        margin: '8px 0',
                        color: colors.text,
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ color: colors.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
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
            marginTop: '64px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            onClick={onPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px',
              height: '46px',
              padding: '0 20px',
              border: '1px solid ' + colors.line,
              background: 'rgba(20, 23, 25, 0.6)',
              color: colors.accent,
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 900,
              fontSize: '1.8rem',
              cursor: 'pointer',
              transition: 'all 0.4s',
              borderRadius: '50px',
              backdropFilter: 'blur(8px)',
            }}
            aria-label="Previous slide"
          >
            {'<'}
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: 'rgba(20, 23, 25, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '50px',
              border: '1px solid ' + colors.line,
              minHeight: '46px',
            }}
          >
            {galleryItems.map((_, index) => {
              const isActive = currentSlide === index;
              return (
                <button
                  key={index}
                  onClick={() => onSelectSlide(index)}
                  style={{
                    width: isActive ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '50px',
                    background: isActive
                      ? 'linear-gradient(90deg, ' + colors.accent + ', ' + colors.accentLight + ')'
                      : 'rgba(39, 44, 49, 0.8)',
                    border: isActive ? 'none' : '1px solid ' + colors.line,
                    cursor: 'pointer',
                    transition: 'all 0.4s',
                    boxShadow: isActive ? '0 0 16px ' + colors.accent + '60' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                  aria-label={'Go to slide ' + (index + 1)}
                />
              );
            })}
          </div>
          <button
            onClick={onNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px',
              height: '46px',
              padding: '0 20px',
              border: '1px solid ' + colors.line,
              background: 'rgba(20, 23, 25, 0.6)',
              color: colors.accent,
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 900,
              fontSize: '1.8rem',
              cursor: 'pointer',
              transition: 'all 0.4s',
              borderRadius: '50px',
              backdropFilter: 'blur(8px)',
            }}
            aria-label="Next slide"
          >
            {'>'}
          </button>
        </div>
      </div>
    </SectionReveal>
  );
}
