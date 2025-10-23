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
  const segment = useMemo(() => `${text} \u2022 `, [text]);
  const segments = useMemo(() => {
    const base = Array.from({ length: Math.max(4, repeatCount) }, () => segment);
    return [...base, ...base];
  }, [repeatCount, segment]);

  const maskRef = useRef(null);
  const accent = colors?.accentLight || colors?.accent || '#FF3B3B';
  const neutralText = colors?.text || '#DEE0E2';

  const trackStyle = {
    '--marquee-duration': `${duration}s`,
    animationPlayState: motionEnabled ? 'running' : 'paused',
    opacity: trackOpacity,
    color: neutralText,
  };

  const backgroundStyle = useMemo(() => {
    const overlay = motionEnabled
      ? `linear-gradient(90deg, ${hexToRgba(accent, 0.16)} 0%, rgba(14, 16, 22, 0.96) 45%, rgba(18, 20, 29, 0.9) 55%, ${hexToRgba(accent, 0.16)} 100%)`
      : 'linear-gradient(90deg, rgba(16, 18, 26, 0.9) 0%, rgba(10, 11, 17, 0.94) 50%, rgba(16, 18, 26, 0.9) 100%)';
    const glowAlpha = motionEnabled ? Math.min(0.08 + trackOpacity * 1.4, 0.22) : 0.08;
    const accentGlow = hexToRgba(accent, motionEnabled ? 0.42 : 0.28);

    return {
      '--marquee-background': overlay,
      '--marquee-glow': hexToRgba(accent, glowAlpha),
      '--marquee-accent': accent,
      '--marquee-neutral': hexToRgba(neutralText, 0.92),
      '--marquee-accent-glow': accentGlow,
    };
  }, [accent, neutralText, motionEnabled, trackOpacity]);

  return (
    <div className="marquee-strip" style={backgroundStyle}>
      <div className="marquee-strip__mask" ref={maskRef}>
        <div className="marquee-strip__track" style={trackStyle}>
          {segments.map((content, index) => (
            <VariableProximity
              key={`marquee-segment-${index}`}
              label={content}
              containerRef={maskRef}
              fromFontVariationSettings="'wght' 560, 'wdth' 94"
              toFontVariationSettings="'wght' 820, 'wdth' 104"
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
