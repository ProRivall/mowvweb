import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import GlassSurface from '../common/GlassSurface.jsx';

const logoFull = '/assets/branding/Asset 31.png';
const logoCompact = '/assets/branding/Asset 50.png';

const leftNavItems = ['Home', 'About'];
const rightNavItems = ['Stories', 'Gallery', 'Join'];

export default function Header({ colors, isMobile }) {
  const accentColor = colors?.accent ?? '#FF0420';
  const [isCompressed, setIsCompressed] = useState(false);
  const [logoMorphProgress, setLogoMorphProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const closingTimelineRef = useRef(null);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const compressionThreshold = 48;
      const morphTransitionRange = 60;

      setIsCompressed(scrollY > compressionThreshold);

      const morphProgress = Math.min(
        Math.max((scrollY - compressionThreshold) / morphTransitionRange, 0),
        1,
      );
      setLogoMorphProgress(morphProgress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) {
      closeMenu(false);
    }
  }, [isMobile, menuOpen]);

  useEffect(() => () => closingTimelineRef.current?.kill(), []);

  useEffect(() => {
    if (isMobile) {
      document.body.classList.toggle('no-scroll', menuOpen);
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [menuOpen, isMobile]);

  const animateMobileMenu = (direction) => {
    if (!mobileNavRef.current) {
      return null;
    }

    closingTimelineRef.current?.kill();

    const links = mobileNavRef.current.querySelectorAll('a');
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    if (direction === 'in') {
      tl.fromTo(
        mobileNavRef.current,
        { y: '-100%', autoAlpha: 0 },
        { y: '0%', autoAlpha: 1, duration: 0.45 },
      ).fromTo(
        links,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
        '-=0.15',
      );
    } else {
      tl.to(links, { y: -20, opacity: 0, stagger: 0.05, duration: 0.3 }).to(
        mobileNavRef.current,
        { y: '-100%', autoAlpha: 0, duration: 0.4 },
        '-=0.12',
      );
    }

    closingTimelineRef.current = tl;
    return tl;
  };

  const openMenu = () => {
    if (!isMobile) {
      return;
    }
    setMenuOpen(true);
    requestAnimationFrame(() => {
      animateMobileMenu('in');
    });
  };

  const closeMenu = (withAnimation = true) => {
    if (!isMobile) {
      setMenuOpen(false);
      return;
    }
    if (!menuOpen) {
      return;
    }
    if (withAnimation) {
      const tl = animateMobileMenu('out');
      if (tl) {
        tl.eventCallback('onComplete', () => {
          setMenuOpen(false);
          closingTimelineRef.current = null;
        });
      } else {
        setMenuOpen(false);
      }
    } else {
      closingTimelineRef.current?.kill();
      if (mobileNavRef.current) {
        gsap.set(mobileNavRef.current, { clearProps: 'all' });
      }
      setMenuOpen(false);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeMenu(true);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeMenu(true);
    }
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu(true);
    } else {
      openMenu();
    }
  };

  const baseHeight = isMobile ? 64 : 80;
  const compressedHeight = isMobile ? 56 : 64;
  const glassHeight = isCompressed ? compressedHeight : baseHeight;

  const horizontalPadding = isMobile
    ? '0 18px'
    : isCompressed
    ? '0 clamp(36px, 5vw, 80px)'
    : '0 clamp(48px, 6vw, 120px)';

  const wrapperPadding = !isMobile && isCompressed ? '0 clamp(24px, 6vw, 64px)' : '0';
  const glassMaxWidth = !isMobile && isCompressed ? 'min(980px, 88vw)' : '100%';

  const fullLogoHeight = isMobile ? 30 : 38;
  const compactLogoHeight = isMobile ? 26 : 32;
  const currentLogoHeight =
    fullLogoHeight - logoMorphProgress * (fullLogoHeight - compactLogoHeight);

  const showCompactLogo = logoMorphProgress > 0.5;
  const currentLogo = showCompactLogo ? logoCompact : logoFull;

  const fadeOutStart = 0.4;
  const fadeOutEnd = 0.5;
  const fadeInStart = 0.5;
  const fadeInEnd = 0.6;

  let logoOpacity = 1;
  if (logoMorphProgress >= fadeOutStart && logoMorphProgress <= fadeOutEnd) {
    logoOpacity =
      1 - (logoMorphProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  } else if (logoMorphProgress >= fadeInStart && logoMorphProgress <= fadeInEnd) {
    logoOpacity = (logoMorphProgress - fadeInStart) / (fadeInEnd - fadeInStart);
  }

  return (
    <>
      <style>{`
        .logo-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .logo-wrapper:hover {
          transform: scale(1.04);
        }

        .logo-container {
          position: relative;
          height: ${currentLogoHeight}px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .logo-image {
          height: ${currentLogoHeight}px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.25));
          transition: opacity 0.15s ease-out,
                      filter 0.3s ease,
                      height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .logo-wrapper:hover .logo-image {
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35)) 
                  drop-shadow(0 0 16px rgba(214, 40, 40, 0.3));
        }

        .nav-link {
          position: relative;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.8125rem;
          transition: all 0.25s ease;
          white-space: nowrap;
          opacity: 0.9;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #D62828, #FF6B35);
          transition: width 0.25s ease;
        }

        .nav-link:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .nav-link:hover::before {
          width: 100%;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: clamp(18px, 3vw, 32px);
        }

        .nav-section--left {
          justify-content: flex-end;
        }

        .nav-section--right {
          justify-content: flex-start;
        }

        .header-content {
          display: flex;
          align-items: center;
          width: 100%;
          gap: clamp(28px, 6vw, 72px);
        }

        .nav-slot {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .nav-slot--left {
          justify-content: flex-end;
          gap: clamp(18px, 3vw, 32px);
        }

        .nav-slot--right {
          justify-content: flex-start;
          gap: clamp(18px, 3vw, 32px);
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 18px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 3001;
        }

        .menu-toggle span {
          display: block;
          height: 2px;
          width: 100%;
          background: ${accentColor};
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .menu-toggle.active span:nth-child(1) {
          transform: rotate(45deg) translateY(7px);
        }

        .menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle.active span:nth-child(3) {
          transform: rotate(-45deg) translateY(-7px);
        }

        .mobile-nav {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          padding: clamp(40px, 10vw, 60px) clamp(24px, 6vw, 40px);
          background: rgba(4, 6, 10, 0.96);
          pointer-events: none;
          transform: translateY(-100%);
          opacity: 0;
          z-index: 3000;
        }

        .mobile-nav.open {
          pointer-events: auto;
        }

        .mobile-nav__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(18px, 5vw, 32px);
        }

        .mobile-nav a {
          font-size: clamp(1.1rem, 6vw, 1.8rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: ${accentColor};
          text-decoration: none;
          font-weight: 700;
        }

        .mobile-nav__close {
          margin-top: clamp(18px, 6vw, 28px);
          padding: 12px 28px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(8, 10, 14, 0.7);
          color: ${accentColor};
          font-size: 0.78rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
        }

        .mobile-nav__close:focus-visible {
          outline: 2px solid ${accentColor};
          outline-offset: 4px;
        }

        @media (max-width: 768px) {
          .header-content {
            gap: clamp(16px, 4vw, 28px);
          }

          .header-glass::before,
          .header-glass::after {
            display: none;
          }

          .nav-slot {
            flex: 1;
            gap: 18px;
          }

          .nav-slot--left {
            visibility: hidden;
          }

          .nav-section {
            display: none;
          }

          .nav-slot--right {
            justify-content: flex-end;
          }

          .logo-wrapper {
            margin: 0 auto;
          }

          .menu-toggle {
            display: flex;
          }
        }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          background: 'transparent',
          pointerEvents: 'none',
          transform: !isMobile && isCompressed ? 'translateY(18px)' : 'translateY(0)',
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: wrapperPadding,
            transition: 'padding 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none',
          }}
        >
          <GlassSurface
            width="100%"
            height={glassHeight}
            borderRadius={0}
            borderWidth={0.05}
            brightness={isMobile ? 62 : 58}
            opacity={0.65}
            blur={14}
            displace={0.45}
            backgroundOpacity={0}
            saturation={1.25}
            distortionScale={-120}
            redOffset={0}
            greenOffset={6}
            blueOffset={16}
            mixBlendMode="screen"
            overlayOpacity={0}
            className="header-glass"
            style={{
              pointerEvents: 'auto',
              borderRadius: isCompressed && !isMobile ? 18 : 0,
              width: '100%',
              maxWidth: glassMaxWidth,
              padding: 0,
              transition:
                'border-radius 0.6s cubic-bezier(0.22, 1, 0.36, 1), max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), height 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <div
              className="header-content"
              style={{
                padding: horizontalPadding,
                minHeight: glassHeight,
                position: 'relative',
              }}
            >
              <div className="nav-slot nav-slot--left">
                <nav className="nav-section nav-section--left">
                  {leftNavItems.map((item) => (
                    <a
                      key={item}
                      href={'#' + item.toLowerCase()}
                      className="nav-link"
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>

              <a href="#home" className="logo-wrapper">
                <div className="logo-container">
                  <img
                    key={currentLogo}
                    src={currentLogo}
                    alt="MOWV logo"
                    className="logo-image"
                    style={{
                      opacity: logoOpacity,
                    }}
                  />
                </div>
              </a>

              <div className="nav-slot nav-slot--right">
                <nav className="nav-section nav-section--right">
                  {rightNavItems.map((item) => (
                    <a
                      key={item}
                      href={'#' + item.toLowerCase()}
                      className="nav-link"
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
                <button
                  type="button"
                  className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                  onClick={toggleMenu}
                  aria-label="Toggle navigation"
                  aria-expanded={menuOpen}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </div>
          </GlassSurface>
        </div>
      </header>

      <div
        ref={mobileNavRef}
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
        onClick={handleOverlayClick}
      >
        <div className="mobile-nav__inner">
          {[...leftNavItems, ...rightNavItems].map((item) => (
            <a key={item} href={'#' + item.toLowerCase()} onClick={handleNavClick}>
              {item}
            </a>
          ))}
          <button type="button" className="mobile-nav__close" onClick={() => closeMenu(true)}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
