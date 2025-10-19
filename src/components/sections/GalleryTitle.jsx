import { useEffect, useMemo, useRef } from 'react';

import './gallery-title.css';

export default function GalleryTitle({ text, colors, isGlitching = false, motionEnabled = true }) {
  const titleRef = useRef(null);
  const displayText = useMemo(() => text?.toUpperCase?.() ?? '', [text]);

  useEffect(() => {
    if (!motionEnabled) {
      return undefined;
    }

    const element = titleRef.current;
    if (!element) {
      return undefined;
    }

    element.classList.remove('is-animating');
    void element.offsetWidth;
    element.classList.add('is-animating');

    return () => {
      element.classList.remove('is-animating');
    };
  }, [displayText, motionEnabled]);

  const style = {
    '--gallery-title-color': colors.text,
    '--gallery-title-accent': colors.accentLight,
    '--gallery-title-accent-soft': colors.accent,
  };

  const titleClass = ['gallery-title__text'];
  if (isGlitching && motionEnabled) {
    titleClass.push('is-glitching');
  }
  if (!motionEnabled) {
    titleClass.push('is-static');
  }

  return (
    <div className="gallery-title" style={style}>
      <span
        ref={titleRef}
        className={titleClass.join(' ')}
        data-text={displayText}
      >
        {displayText}
      </span>
    </div>
  );
}
