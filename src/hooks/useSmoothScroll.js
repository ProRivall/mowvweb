import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const hasMatchMedia = typeof window !== "undefined" && typeof window.matchMedia === "function";

export default function useSmoothScroll({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const hasFinePointer = hasMatchMedia
      ? window.matchMedia("(pointer: fine)").matches
      : true;
    const prefersReducedMotion = hasMatchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    if (!hasFinePointer || prefersReducedMotion) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,
      gestureDirection: "vertical",
      smoothTouch: true,
      touchMultiplier: 1.5,
    });

    let frameId = null;
    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    const handleLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleLenisScroll);

    ScrollTrigger.defaults({
      fastScrollEnd: true,
      preventOverlaps: true,
      anticipatePin: 1,
    });
    ScrollTrigger.config({
      autoRefreshEvents:
        "visibilitychange,DOMContentLoaded,load,resize,orientationchange",
    });

    setTimeout(() => ScrollTrigger.refresh(), 0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("resize", onResize);
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      lenis.off("scroll", handleLenisScroll);
      lenis.destroy();
      gsap.utils.toArray(ScrollTrigger.getAll()).forEach((t) => t.kill(false));
    };
  }, [enabled]);
}
