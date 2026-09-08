import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';
import { useTouchDevice } from './useTouchDevice';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// SCROLL ANIMATION HOOK
// Consistent, accessible scroll-triggered animations
// ============================================================================

export interface ScrollAnimationOptions {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  duration?: number;
  ease?: string | gsap.EaseFunction;
  once?: boolean;
  disableOnTouch?: boolean;
  disabled?: boolean;
}

export interface ScrollAnimationResult {
  ref: RefObject<HTMLElement | null>;
  refresh: () => void;
  kill: () => void;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
): ScrollAnimationResult {
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  
  const prefersReducedMotion = useReducedMotion();
  const { isTouchOptimized } = useTouchDevice();

  const {
    from = { opacity: 0, y: 30 },
    to = { opacity: 1, y: 0 },
    start = 'top 85%',
    end = 'bottom 15%',
    scrub = false,
    toggleActions = 'play none none none',
    duration = 0.8,
    ease = 'power2.out',
    once = true,
    disableOnTouch = false,
    disabled = false,
  } = options;

  const shouldDisable = disabled || prefersReducedMotion || (disableOnTouch && isTouchOptimized);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldDisable) {
      if (prefersReducedMotion && element) {
        gsap.set(element, { opacity: 1, y: 0, clearProps: '' });
      }
      return;
    }

    const ctx = gsap.context(() => {
      animationRef.current = gsap.fromTo(
        element,
        from,
        {
          ...to,
          duration,
          ease,
          scrollTrigger: {
            trigger: options.trigger || element,
            start,
            end,
            scrub,
            toggleActions,
            once,
          },
        }
      );
    }, element);

    return () => {
      ctx.revert();
      animationRef.current = null;
      triggerRef.current = null;
    };
  }, [shouldDisable, prefersReducedMotion, options.trigger, from, to, start, end, scrub, toggleActions, duration, ease, once]);

  const refresh = () => {
    ScrollTrigger.refresh();
  };

  const kill = () => {
    if (animationRef.current) {
      animationRef.current.kill();
    }
    if (triggerRef.current) {
      triggerRef.current.kill();
    }
  };

  return { ref: elementRef, refresh, kill };
}

export interface StaggerScrollOptions extends ScrollAnimationOptions {
  childSelector: string;
  stagger?: number;
}

export function useStaggerScrollAnimation(
  options: StaggerScrollOptions
): ScrollAnimationResult {
  const containerRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  
  const prefersReducedMotion = useReducedMotion();
  const { isTouchOptimized } = useTouchDevice();

  const {
    childSelector,
    from = { opacity: 0, y: 20 },
    to = { opacity: 1, y: 0 },
    start = 'top 80%',
    toggleActions = 'play none none none',
    duration = 0.6,
    ease = 'power2.out',
    stagger = 0.08,
    once = true,
    disableOnTouch = false,
    disabled = false,
  } = options;

  const shouldDisable = disabled || prefersReducedMotion || (disableOnTouch && isTouchOptimized);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    if (shouldDisable) {
      const children = container.querySelectorAll(childSelector);
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }

    ctxRef.current = gsap.context(() => {
      const children = container.querySelectorAll(childSelector);
      if (children.length === 0) return;

      gsap.fromTo(
        children,
        from,
        {
          ...to,
          duration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions,
            once,
          },
        }
      );
    }, container);

    return () => {
      ctxRef.current?.revert();
    };
  }, [shouldDisable, prefersReducedMotion, childSelector, from, to, start, toggleActions, duration, ease, stagger, once]);

  return {
    ref: containerRef,
    refresh: () => ScrollTrigger.refresh(),
    kill: () => ctxRef.current?.revert(),
  };
}

export interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  start?: string;
  end?: string;
  disabled?: boolean;
}

export function useParallax(options: ParallaxOptions = {}): RefObject<HTMLElement | null> {
  const elementRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isTouchOptimized } = useTouchDevice();

  const {
    speed = 0.5,
    direction = 'vertical',
    start = 'top bottom',
    end = 'bottom top',
    disabled = false,
  } = options;

  const shouldDisable = disabled || prefersReducedMotion || isTouchOptimized;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldDisable) return;

    const ctx = gsap.context(() => {
      const distance = 100 * speed;
      const axis = direction === 'vertical' ? 'y' : 'x';

      gsap.fromTo(
        element,
        { [axis]: -distance },
        {
          [axis]: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start,
            end,
            scrub: true,
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [shouldDisable, speed, direction, start, end]);

  return elementRef;
}

function useScrollState(initialValue: number): [number, (value: number) => void] {
  const [state, setState] = useState(initialValue);
  const setProgress = useCallback((value: number) => {
    setState(value);
  }, []);
  return [state, setProgress];
}

export function useScrollProgress(
  options: { start?: string; end?: string; disabled?: boolean } = {}
): [RefObject<HTMLElement | null>, number] {
  const elementRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useScrollState(0);
  const prefersReducedMotion = useReducedMotion();

  const { start = 'top bottom', end = 'bottom top', disabled = false } = options;
  const shouldDisable = disabled || prefersReducedMotion;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldDisable) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start,
        end,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, element);

    return () => ctx.revert();
  }, [shouldDisable, start, end, setProgress]);

  return [elementRef, progress];
}
