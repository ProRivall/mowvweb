import { useEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

export function useSwipeCarousel(target) {
  useEffect(() => {
    gsap.registerPlugin(Draggable);

    const element =
      typeof target === "string"
        ? document.querySelector(target)
        : target?.current || target;

    if (!element) {
      return undefined;
    }

    const [draggable] = Draggable.create(element, {
      type: "x",
      bounds: {
        minX: Math.min(-element.scrollWidth + element.offsetWidth, 0),
        maxX: 0,
      },
      inertia: true,
      edgeResistance: 0.85,
    });

    return () => {
      if (draggable) {
        draggable.kill();
      }
    };
  }, [typeof target === "string" ? target : target?.current]);
}
