export default function MotionToggle({ motionEnabled, onToggle, colors }) {
  const borderColor = motionEnabled ? colors.line : colors.accent;

  return (
    <button
      onClick={onToggle}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1500,
        background: motionEnabled ? colors.card : colors.accent,
        border: '1px solid ' + borderColor,
        padding: '12px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 700,
        color: motionEnabled ? colors.text : colors.bg,
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        if (motionEnabled) {
          e.currentTarget.style.background = colors.accentDeep;
          e.currentTarget.style.borderColor = colors.accent;
        }
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(170,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = motionEnabled ? colors.card : colors.accent;
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      }}
    >
      Motion: {motionEnabled ? 'On' : 'Off'}
    </button>
  );
}
