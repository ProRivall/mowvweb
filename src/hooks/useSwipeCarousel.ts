import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

type SwipeTarget = string | HTMLElement | RefObject<HTMLElement | null> | null | undefined;

type SwipeCarouselOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  onPress?: () => void;
  onRelease?: () => void;
};

const resolveElement = (target: SwipeTarget): HTMLElement | null => {
  if (!target) {
    return null;
  }

  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target);
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  return target.current ?? null;
};

export function useSwipeCarousel(
  target: SwipeTarget,
  { onSwipeLeft, onSwipeRight, threshold = 60, onPress, onRelease }: SwipeCarouselOptions = {},
) {
  const leftHandlerRef = useRef(onSwipeLeft);
  const rightHandlerRef = useRef(onSwipeRight);
  const pressHandlerRef = useRef(onPress);
  const releaseHandlerRef = useRef(onRelease);

  useEffect(() => {
    leftHandlerRef.current = onSwipeLeft;
  }, [onSwipeLeft]);

  useEffect(() => {
    rightHandlerRef.current = onSwipeRight;
  }, [onSwipeRight]);

  useEffect(() => {
    pressHandlerRef.current = onPress;
  }, [onPress]);

  useEffect(() => {
    releaseHandlerRef.current = onRelease;
  }, [onRelease]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const isCoarsePointer =
      window.matchMedia?.('(pointer: coarse)').matches ?? 'ontouchstart' in window;

    if (!isCoarsePointer) {
      return undefined;
    }

    gsap.registerPlugin(Draggable);
    const element = resolveElement(target);
    if (!element) {
      return undefined;
    }

    let startPointerX = 0;
    let startPointerY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const draggable = Draggable.create(element, {
      type: 'x',
      inertia: true,
      dragResistance: 0.5,
      edgeResistance: 0.85,
      onPress() {
        gsap.killTweensOf(element);
        pressHandlerRef.current?.();
        startPointerX = this.pointerX ?? 0;
        startPointerY = this.pointerY ?? 0;
        lastPointerX = startPointerX;
        lastPointerY = startPointerY;
      },
      onDrag() {
        lastPointerX = this.pointerX ?? lastPointerX;
        lastPointerY = this.pointerY ?? lastPointerY;
      },
      onRelease: function handleRelease() {
        const pointerX = this.pointerX ?? lastPointerX;
        const pointerY = this.pointerY ?? lastPointerY;
        const deltaX = pointerX - startPointerX;
        const deltaY = pointerY - startPointerY;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX >= threshold && absX > absY * 1.5) {
          if (deltaX < 0) {
            leftHandlerRef.current?.();
          } else {
            rightHandlerRef.current?.();
          }
        }

        gsap.to(element, { x: 0, duration: 0.4, ease: 'power3.out' });
        releaseHandlerRef.current?.();
      },
      onThrowComplete() {
        gsap.to(element, { x: 0, duration: 0.4, ease: 'power3.out' });
      },
    })[0];

    return () => {
      draggable?.kill();
      gsap.set(element, { clearProps: 'transform' });
    };
  }, [target, threshold]);
}
