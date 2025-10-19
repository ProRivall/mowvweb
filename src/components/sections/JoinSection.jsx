import SectionReveal from '../common/SectionReveal.jsx';

export default function JoinSection({ colors }) {
  return (
    <SectionReveal
      id="join"
      style={{
        padding: '140px 0 160px',
        background: 'linear-gradient(180deg, ' + colors.bg + ' 0%, #050505 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      disableBottomFade
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558882268-a5c7-4f02-a28e-6c4d0d48643e?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.03,
          filter: 'grayscale(100%)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(170,0,0,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <div
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
              marginBottom: '1.5rem',
              color: colors.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            You feel it.
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, ' + colors.accent + ', ' + colors.accentLight + ')',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              That pull.
            </span>
          </div>
          <p
            style={{
              color: colors.muted,
              margin: '0 auto 1rem',
              fontSize: '1.3rem',
              maxWidth: '700px',
              lineHeight: 1.8,
              fontWeight: 400,
            }}
          >
            When everyone's standing still, you're already three steps ahead. The streets raised you. The rhythm chose you. The motion never stopped.
          </p>
          <p
            style={{
              color: colors.text,
              margin: '0 auto 0',
              fontSize: '1.15rem',
              maxWidth: '650px',
              lineHeight: 1.7,
              fontStyle: 'italic',
              opacity: 0.9,
            }}
          >
            This isn't another brand. It's a frequency. And if you're reading this, you're already tuned in.
          </p>
        </div>

        <div
          style={{
            marginBottom: '3.5rem',
            display: 'inline-block',
            padding: '16px 32px',
            background: 'rgba(170,0,0,0.08)',
            border: '1px solid rgba(170,0,0,0.3)',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: colors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '8px',
              fontWeight: 600,
            }}
          >
            MOVEMENT STATUS
          </div>
          <div
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '2.8rem',
              fontWeight: 900,
              color: colors.accentLight,
              lineHeight: 1,
            }}
          >
            5,847
          </div>
          <div style={{ fontSize: '0.85rem', color: colors.text, marginTop: '4px' }}>
            already moving with us
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          <button
            style={{
              background: colors.accent,
              color: colors.text,
              border: 'none',
              padding: '1.3rem 3.5rem',
              borderRadius: '2px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(170,0,0,0.3)',
              position: 'relative',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 50px rgba(170,0,0,0.6)';
              e.currentTarget.style.letterSpacing = '0.15em';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(170,0,0,0.3)';
              e.currentTarget.style.letterSpacing = '0.1em';
            }}
          >
            I'm in
          </button>
          <button
            style={{
              background: 'transparent',
              color: colors.text,
              border: '1px solid ' + colors.line,
              padding: '1.3rem 3.5rem',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.color = colors.accent;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(170,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.line;
              e.currentTarget.style.color = colors.text;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Show me more
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: colors.muted, maxWidth: '600px', margin: '0 auto' }}>
          No spam. No noise. Just the signal.
          <br />
          <span style={{ color: colors.accent }}>Drop your email, stay ahead.</span>
        </div>
      </div>
    </SectionReveal>
  );
}
