export default function ProgressBar({ progress, colors }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        width: progress + '%',
        background: 'linear-gradient(90deg, ' + colors.accentLight + ', ' + colors.accent + ')',
        zIndex: 9999,
        boxShadow: '0 0 10px rgba(255,59,59,0.9)',
        transition: 'width 0.05s linear',
        willChange: 'width',
      }}
    />
  );
}
