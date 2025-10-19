import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

const MotionSpan = motion.span;

const useAnimationFrame = (callback) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let frameId;
    const loop = () => {
      callbackRef.current?.();
      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, []);
};

const useMousePositionRef = (containerRef) => {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x, y) => {
      const container = containerRef?.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (event) => updatePosition(event.clientX, event.clientY);
    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) {
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
};

const parseFontSettings = (settingsString) => {
  return new Map(
    settingsString
      .split(',')
      .map((setting) => setting.trim())
      .filter(Boolean)
      .map((setting) => {
        const [axis, rawValue] = setting.split(' ');
        return [axis.replace(/['"]/g, ''), Number.parseFloat(rawValue)];
      }),
  );
};

const interpolateFontSettings = (parsedSettings, falloffValue) => {
  return parsedSettings
    .map(({ axis, fromValue, toValue }) => {
      const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
      return `'${axis}' ${interpolatedValue}`;
    })
    .join(', ');
};

const VariableProximity = forwardRef(function VariableProximity(
  {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 120,
    falloff = 'gaussian',
    className = '',
    onClick,
    style,
    ...rest
  },
  ref,
) {
  const letterRefs = useRef([]);
  const interpolatedSettingsRef = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const fromSettings = parseFontSettings(fromFontVariationSettings);
    const toSettings = parseFontSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateFalloff = (distance, effectiveRadius) => {
    const norm = Math.min(Math.max(1 - distance / effectiveRadius, 0), 1);
    if (falloff === 'exponential') {
      return norm ** 2;
    }
    if (falloff === 'gaussian') {
      const sigma = effectiveRadius / 2;
      return Math.exp(-((distance / sigma) ** 2) / 2);
    }
    return norm;
  };

  useAnimationFrame(() => {
    const container = containerRef?.current;
    if (!container || !letterRefs.current.length) {
      return;
    }

    if (radius <= 0) {
      letterRefs.current.forEach((letterRef) => {
        if (!letterRef) return;
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        letterRef.style.transform = 'scale(1)';
        letterRef.style.opacity = '1';
        letterRef.style.filter = 'none';
      });
      return;
    }

    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }

    lastPositionRef.current = { x, y };
    const containerRect = container.getBoundingClientRect();

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterX = rect.left + rect.width / 2 - containerRect.left;
      const letterY = rect.top + rect.height / 2 - containerRect.top;
      const deltaX = mousePositionRef.current.x - letterX;
      const deltaY = mousePositionRef.current.y - letterY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        letterRef.style.transform = 'scale(1)';
        letterRef.style.opacity = '1';
        letterRef.style.filter = 'none';
        return;
      }

      const falloffValue = calculateFalloff(distance, radius);
      const newSettings = interpolateFontSettings(parsedSettings, falloffValue);

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
      const scale = 1 + falloffValue * 0.35;
      letterRef.style.transform = `scale(${scale})`;
      letterRef.style.opacity = String(0.75 + falloffValue * 0.25);
      letterRef.style.filter = `drop-shadow(0 0 ${falloffValue * 18}px rgba(255, 45, 72, ${0.35 + falloffValue * 0.4}))`;
    });
  });

  const words = useMemo(() => label.split(' '), [label]);
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      onClick={onClick}
      style={{
        display: 'inline-block',
        fontFamily: 'Raleway, "Roboto Flex", sans-serif',
        ...style,
      }}
      className={className}
      {...rest}
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
          {word.split('').map((letter) => {
            const currentIndex = letterIndex++;
            const content = letter === '\u00A0' ? '\u00A0' : letter;
            return (
              <MotionSpan
                key={`letter-${currentIndex}-${letter}`}
                ref={(el) => {
                  letterRefs.current[currentIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentIndex] || fromFontVariationSettings,
                  transform: 'scale(1)',
                  transition: 'transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease',
                }}
                aria-hidden="true"
              >
                {content}
              </MotionSpan>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

export default VariableProximity;
