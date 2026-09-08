import { useSyncExternalStore } from 'react';

/**
 * Hook to detect user's motion preference for accessibility.
 * Returns true if user prefers reduced motion (prefers-reduced-motion: reduce).
 * Uses useSyncExternalStore for proper external store subscription.
 * 
 * Usage:
 *   const prefersReducedMotion = useReducedMotion();
 *   
 *   <motion.div
 *     variants={prefersReducedMotion ? reducedMotionVariants : normalVariants}
 *     initial="hidden"
 *     animate="visible"
 *   />
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false // Server snapshot - default to false for SSR
  );
}
