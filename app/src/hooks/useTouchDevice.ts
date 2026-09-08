import { useSyncExternalStore, useMemo } from 'react';

// ============================================================================
// TOUCH DEVICE DETECTION
// ============================================================================

/**
 * Check if device supports touch events (coarse pointer)
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for coarse pointer (touch)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  
  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return hasCoarsePointer || hasTouch;
}

/**
 * Check if device is a mobile device (iOS/Android)
 */
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

// ============================================================================
// STORE: Touch Device State
// ============================================================================

interface TouchDeviceState {
  isTouchDevice: boolean;
  isMobileDevice: boolean;
  hasHover: boolean;
  hasPointer: boolean;
  pointerType: 'fine' | 'coarse' | 'none';
}

function createTouchDeviceStore(): TouchDeviceState {
  return {
    isTouchDevice: isTouchDevice(),
    isMobileDevice: isMobileDevice(),
    hasHover: typeof window !== 'undefined' ? !window.matchMedia('(hover: none)').matches : true,
    hasPointer: typeof window !== 'undefined' ? !window.matchMedia('(pointer: none)').matches : true,
    pointerType: typeof window !== 'undefined' 
      ? window.matchMedia('(pointer: coarse)').matches ? 'coarse' 
      : window.matchMedia('(pointer: fine)').matches ? 'fine' 
      : 'none'
      : 'none',
  };
}

// ============================================================================
// HOOK: useTouchDevice
// Returns comprehensive touch/pointer device information
// ============================================================================

export interface TouchDeviceInfo extends TouchDeviceState {
  /** Device supports hover interactions */
  supportsHover: boolean;
  /** Device supports click interactions (not just touch) */
  supportsClick: boolean;
  /** Should use touch-optimized UI */
  isTouchOptimized: boolean;
  /** Should disable custom cursor */
  shouldHideCursor: boolean;
  /** Use native scrolling instead of smooth scroll */
  useNativeScroll: boolean;
}

export function useTouchDevice(): TouchDeviceInfo {
  // Subscribe to pointer media query changes
  const coarsePointer = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia('(pointer: coarse)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia('(pointer: coarse)').matches,
    () => false
  );

  const hoverNone = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia('(hover: none)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia('(hover: none)').matches,
    () => false
  );

  return useMemo(() => {
    const state = createTouchDeviceStore();
    
    return {
      ...state,
      supportsHover: !hoverNone,
      supportsClick: state.hasPointer,
      isTouchOptimized: coarsePointer || state.isMobileDevice,
      shouldHideCursor: coarsePointer || !state.hasPointer,
      useNativeScroll: coarsePointer || state.isMobileDevice,
    };
  }, [coarsePointer, hoverNone]);
}

// ============================================================================
// HOOK: useIsTouchDevice (simple boolean)
// ============================================================================

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia('(pointer: coarse)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia('(pointer: coarse)').matches,
    () => false
  );
}

// ============================================================================
// HOOK: usePrimaryInput
// Detect if primary input is touch or mouse
// ============================================================================

export type PrimaryInput = 'touch' | 'mouse' | 'unknown';

export function usePrimaryInput(): PrimaryInput {
  return useSyncExternalStore(
    (callback) => {
      const coarseMql = window.matchMedia('(pointer: coarse)');
      const fineMql = window.matchMedia('(pointer: fine)');
      
      const handler = () => callback();
      coarseMql.addEventListener('change', handler);
      fineMql.addEventListener('change', handler);
      
      return () => {
        coarseMql.removeEventListener('change', handler);
        fineMql.removeEventListener('change', handler);
      };
    },
    () => {
      if (window.matchMedia('(pointer: coarse)').matches) return 'touch';
      if (window.matchMedia('(pointer: fine)').matches) return 'mouse';
      return 'unknown';
    },
    () => 'unknown'
  );
}
