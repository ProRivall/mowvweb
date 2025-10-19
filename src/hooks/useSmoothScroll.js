import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useSmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,
      gestureDirection: "vertical",
      smoothTouch: true,
      touchMultiplier: 1.5,
    });

    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

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
      lenis.destroy();
      // Kill triggers only (NU timelines)
      gsap.utils.toArray(ScrollTrigger.getAll()).forEach((t) => t.kill(false));
    };
  }, []);
}
