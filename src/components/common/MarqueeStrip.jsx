import { useMemo, useRef } from 'react';

import './MarqueeStrip.css';

import VariableProximity from './VariableProximity.jsx';

const FALLBACK_REPEAT = 8;
const FALLBACK_DURATION = 22; // seconds for one full cycle

const hexToRgba = (hex, alpha) => {
  if (!hex) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const sanitized = hex.replace('#', '');
  const full = sanitized.length === 3
    ? sanitized
        .split('')
        .map((char) => char + char)
        .join('')
    : sanitized;
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function MarqueeStrip({
  text,
  colors,
  motionEnabled,
  repeatCount = FALLBACK_REPEAT,
  duration = FALLBACK_DURATION,
  trackOpacity = 1,
}) {
  const segment = useMemo(() => `${text} • `, [text]);
  const segments = useMemo(() => {
    const base = Array.from({ length: Math.max(4, repeatCount) }, () => segment);
    return [...base, ...base];
  }, [repeatCount, segment]);

  const maskRef = useRef(null);

  const trackStyle = {
    color: colors.text,
    '--marquee-duration': `${duration}s`,
    animationPlayState: motionEnabled ? 'running' : 'paused',
    opacity: trackOpacity,
  };

  const backgroundStyle = useMemo(() => {
    const accentDeep = colors.accentDeep || colors.accent || '#7A0000';
    const accentLight = colors.accentLight || colors.accent || '#FF3B3B';
    const base = 'rgba(10, 10, 10, 0.42)';
    const overlay = motionEnabled
      ? `linear-gradient(90deg, ${accentDeep}26 0%, ${base} 45%, ${base} 55%, ${accentLight}26 100%)`
      : `linear-gradient(90deg, rgba(35, 35, 35, 0.6) 0%, rgba(20, 20, 20, 0.6) 50%, rgba(35, 35, 35, 0.6) 100%)`;
    const glowAlpha = motionEnabled ? Math.min(0.1 + trackOpacity, 0.28) : 0;

    return {
      '--marquee-background': overlay,
      '--marquee-glow': hexToRgba(accentLight, glowAlpha),
    };
  }, [colors, motionEnabled, trackOpacity]);

  return (
    <div className="marquee-strip" style={backgroundStyle}>
      <div className="marquee-strip__mask" ref={maskRef}>
        <div className="marquee-strip__track" style={trackStyle}>
          {segments.map((content, index) => (
            <VariableProximity
              key={`marquee-segment-${index}`}
              label={content}
              containerRef={maskRef}
              fromFontVariationSettings="'wght' 580, 'wdth' 96"
              toFontVariationSettings="'wght' 820, 'wdth' 105"
              radius={motionEnabled ? 220 : 0}
              falloff="gaussian"
              className="marquee-strip__text marquee-strip__text--variable"
              aria-hidden={index !== 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
