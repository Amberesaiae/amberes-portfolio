import { useSyncExternalStore, useMemo } from 'react';

// ============================================================================
// VIEWPORT BREAKPOINTS
// Standard breakpoints matching Tailwind defaults
// ============================================================================
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================================================
// MEDIA QUERY STORE
// Subscribe to viewport changes with useSyncExternalStore
// ============================================================================

function createViewportStore() {
  let width = typeof window !== 'undefined' ? window.innerWidth : 0;
  let height = typeof window !== 'undefined' ? window.innerHeight : 0;
  const listeners = new Set<() => void>();

  const update = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    listeners.forEach((cb) => cb());
  };

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    if (listeners.size === 1) {
      window.addEventListener('resize', update, { passive: true });
    }
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        window.removeEventListener('resize', update);
      }
    };
  };

  const getSnapshot = () => `${width},${height}`;
  const getServerSnapshot = () => '0,0';

  return { subscribe, getSnapshot, getServerSnapshot, getWidth: () => width, getHeight: () => height };
}

// Single store instance
let viewportStore: ReturnType<typeof createViewportStore> | null = null;

function getViewportStore() {
  if (!viewportStore && typeof window !== 'undefined') {
    viewportStore = createViewportStore();
  }
  return viewportStore;
}

// ============================================================================
// HOOK: useViewport
// Returns current viewport dimensions and derived state
// ============================================================================

export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  breakpoint: Breakpoint | null;
  orientation: 'portrait' | 'landscape';
}

export function useViewport(): ViewportState {
  const store = getViewportStore();
  
  const viewportString = useSyncExternalStore(
    (cb) => store?.subscribe(cb) ?? (() => {}),
    () => store?.getSnapshot() ?? '0,0',
    () => '0,0'
  );

  return useMemo(() => {
    const [widthStr, heightStr] = viewportString.split(',');
    const width = parseInt(widthStr, 10) || 0;
    const height = parseInt(heightStr, 10) || 0;

    const isMobile = width < BREAKPOINTS.md;
    const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
    const isDesktop = width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
    const isWide = width >= BREAKPOINTS.xl;

    let breakpoint: Breakpoint | null = null;
    if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl';
    else if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
    else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
    else if (width >= BREAKPOINTS.md) breakpoint = 'md';
    else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';

    const orientation = width > height ? 'landscape' : 'portrait';

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isWide,
      breakpoint,
      orientation,
    };
  }, [viewportString]);
}

// ============================================================================
// HOOK: useMediaQuery
// Check if a media query matches
// ============================================================================

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  };

  const getSnapshot = () => {
    const mediaQuery = window.matchMedia(query);
    return mediaQuery.matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ============================================================================
// HOOK: useBreakpoint
// Check if viewport is at or above a specific breakpoint
// ============================================================================

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const query = useMemo(() => `(min-width: ${BREAKPOINTS[breakpoint]}px)`, [breakpoint]);
  return useMediaQuery(query);
}

// ============================================================================
// HOOK: useBelowBreakpoint
// Check if viewport is below a specific breakpoint
// ============================================================================

export function useBelowBreakpoint(breakpoint: Breakpoint): boolean {
  const query = useMemo(() => `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`, [breakpoint]);
  return useMediaQuery(query);
}
