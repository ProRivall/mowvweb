export default function Footer({ colors, motionEnabled }) {
  return (
    <footer
      style={{
        background: colors.bg,
        color: colors.muted,
        padding: '80px 0 40px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '1px',
          width: '100vw',
          background: 'linear-gradient(90deg, rgba(0,0,0,0), #AA0000 15%, #FF3B3B 50%, #AA0000 85%, rgba(0,0,0,0))',
          backgroundSize: '200% 100%',
          animation: motionEnabled ? 'footerGlow 7s linear infinite' : 'none',
          opacity: 0.95,
          filter: 'drop-shadow(0 0 8px rgba(255,59,59,0.35))',
        }}
      />
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <h4
            style={{
              color: colors.accent,
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              fontSize: '1.5rem',
              marginBottom: '16px',
            }}
          >
            MOWV
          </h4>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: colors.muted }}>
            Streetwear engineered for movement. Built for creators who refuse to stand still.
          </p>
        </div>
        <div>
          <h4
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 800,
              color: colors.text,
              marginBottom: '16px',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
            }}
          >
            Explore
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['About', 'Stories', 'Gallery'].map((link) => (
              <a
                key={link}
                href={'#' + link.toLowerCase()}
                style={{
                  fontSize: '0.95rem',
                  color: colors.muted,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent;
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.muted;
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 800,
              color: colors.text,
              marginBottom: '16px',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
            }}
          >
            Connect
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Instagram', 'TikTok', 'YouTube'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: '0.95rem',
                  color: colors.muted,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent;
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.muted;
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 800,
              color: colors.text,
              marginBottom: '16px',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
            }}
          >
            Support
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Contact', 'Shipping', 'Returns'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: '0.95rem',
                  color: colors.muted,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent;
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.muted;
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '60px',
          paddingTop: '18px',
          fontSize: '0.85rem',
          color: '#808080',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {new Date().getFullYear()} MOWV. The Motion Never Stops.
      </div>
    </footer>
  );
}
