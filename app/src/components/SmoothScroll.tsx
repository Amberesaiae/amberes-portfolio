import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTouchDevice } from '../hooks/useTouchDevice';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { useNativeScroll } = useTouchDevice();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip Lenis on touch devices or reduced motion preference
    if (useNativeScroll || prefersReducedMotion) {
      // Ensure native scroll behavior
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Configure ScrollTrigger to work with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Set up scroller proxy for better integration
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      ScrollTrigger.scrollerProxy(document.body, {}); // Clear proxy
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [useNativeScroll, prefersReducedMotion]);

  return <>{children}</>;
}
