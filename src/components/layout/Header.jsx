import GlassSurface from '../common/GlassSurface.jsx';

const navItems = ['Home', 'About', 'Stories', 'Gallery', 'Join'];

export default function Header({ colors, isMobile }) {
  const glassHeight = isMobile ? 64 : 80;
  const horizontalPadding = isMobile ? '0 18px' : '0 clamp(48px, 6vw, 120px)';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <GlassSurface
        width="100%"
        height={glassHeight}
        borderRadius={0}
        borderWidth={0.05}
        brightness={isMobile ? 62 : 58}
        opacity={0.9}
        blur={18}
        displace={0.6}
        backgroundOpacity={0.16}
        saturation={1.55}
        distortionScale={-120}
        redOffset={0}
        greenOffset={6}
        blueOffset={16}
        mixBlendMode="screen"
        className="header-glass"
        style={{
          pointerEvents: 'auto',
          borderRadius: 0,
          width: '100%',
          padding: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            width: '100%',
            padding: horizontalPadding,
            minHeight: glassHeight,
            gap: isMobile ? '20px' : 'clamp(32px, 12vw, 180px)',
          }}
        >
          <div
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 900,
              fontSize: isMobile ? '1.4rem' : '1.9rem',
              color: colors.accent,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            MOWV
          </div>
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'flex-end' : 'flex-end',
              flex: 1,
              gap: isMobile ? '18px' : 'clamp(28px, 4vw, 72px)',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={'#' + item.toLowerCase()}
                className="nav-link"
                style={{
                  color: 'inherit',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.85rem' : '1rem',
                  textDecoration: 'none',
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </GlassSurface>
    </header>
  );
}
