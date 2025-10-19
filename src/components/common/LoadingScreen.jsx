export default function LoadingScreen({ colors, loadingProgress }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <div
        style={{
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          color: colors.accent,
          letterSpacing: '-0.02em',
          marginBottom: '40px',
        }}
      >
        MOWV
      </div>
      <div
        style={{
          width: '300px',
          height: '4px',
          background: 'rgba(170,0,0,0.2)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: loadingProgress + '%',
            background: 'linear-gradient(90deg, ' + colors.accent + ', ' + colors.accentLight + ')',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px ' + colors.accentLight,
          }}
        />
      </div>
      <div
        style={{
          marginTop: '20px',
          fontFamily: 'Raleway, sans-serif',
          fontSize: '0.9rem',
          color: colors.muted,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Loading... {Math.floor(loadingProgress)}%
      </div>
    </div>
  );
}
