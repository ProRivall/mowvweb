import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import './SectionReveal.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 120, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const MotionSection = motion.section;

export default function SectionReveal({
  id,
  className = '',
  style,
  children,
  once = true,
  viewAmount = 0.35,
  rootMargin = '-15% 0px -15% 0px',
  disableTopFade = false,
  disableBottomFade = false,
  ...rest
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once,
    amount: viewAmount,
    margin: rootMargin,
  });

  return (
    <MotionSection
      id={id}
      ref={sectionRef}
      className={`section-reveal ${className}`.trim()}
      style={style}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={sectionVariants}
      {...rest}
    >
      {!disableTopFade && <div className="section-reveal__fade section-reveal__fade--top" aria-hidden />}
      <div className="section-reveal__content">{children}</div>
      {!disableBottomFade && (
        <div className="section-reveal__fade section-reveal__fade--bottom" aria-hidden />
      )}
    </MotionSection>
  );
}

