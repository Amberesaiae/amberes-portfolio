import { type Variants, type Transition } from 'framer-motion';

// ============================================================================
// ANIMATION TIMING TOKENS
// Consistent timing scale across the entire application
// ============================================================================

export const TIMING = {
  // Instant feedback
  instant: 0.05,
  // Micro interactions (hovers, small state changes)
  micro: 0.15,
  // Standard transitions
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  // Page/section transitions
  pageIn: 0.6,
  pageOut: 0.4,
  // Stagger delays
  staggerFast: 0.03,
  staggerNormal: 0.05,
  staggerSlow: 0.08,
} as const;

// ============================================================================
// EASING CURVES
// Consistent easing functions for smooth, professional motion
// ============================================================================

export const EASING = {
  // Smooth deceleration (elements coming to rest)
  smoothOut: [0.33, 1, 0.68, 1] as const,
  // Smooth acceleration (elements starting motion)
  smoothIn: [0.32, 0, 0.67, 0] as const,
  // Symmetric ease for reversible animations
  easeInOut: [0.65, 0, 0.35, 1] as const,
  // Bouncy but controlled (for playful elements)
  springLike: [0.34, 1.56, 0.64, 1] as const,
  // Sharp, technical feel
  technical: [0.6, 0.05, 0.01, 0.9] as const,
  // Exit animations (faster, snappier)
  exit: [0.4, 0, 0.2, 1] as const,
} as const;

// ============================================================================
// SPRING CONFIGURATIONS
// For physics-based animations
// ============================================================================

export const SPRING = {
  // Gentle, subtle movement
  gentle: { stiffness: 100, damping: 20, mass: 1 },
  // Responsive UI feedback
  responsive: { stiffness: 400, damping: 30, mass: 0.8 },
  // Bouncy for emphasis
  bouncy: { stiffness: 300, damping: 15, mass: 0.8 },
  // Snappy for quick interactions
  snappy: { stiffness: 500, damping: 35, mass: 0.5 },
  // Magnetic/pull effect
  magnetic: { stiffness: 150, damping: 15, mass: 0.1 },
} as const;

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

export const pageTransition: Transition = {
  duration: TIMING.pageIn,
  ease: EASING.smoothOut,
};

export const pageExitTransition: Transition = {
  duration: TIMING.pageOut,
  ease: EASING.exit,
};

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: pageTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: pageExitTransition,
  },
};

// For full-page wrapper (PageWrapper.tsx)
export const fullPageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: TIMING.pageIn,
      ease: EASING.technical,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.pageOut,
      ease: EASING.easeInOut,
    },
  },
};

// ============================================================================
// FADE VARIANTS
// ============================================================================

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: TIMING.fast,
      ease: EASING.smoothOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.micro,
      ease: EASING.exit,
    },
  },
};

// ============================================================================
// SLIDE VARIANTS
// ============================================================================

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.normal,
      ease: EASING.smoothOut,
    },
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.normal,
      ease: EASING.smoothOut,
    },
  },
};

// ============================================================================
// STAGGER CONTAINER VARIANTS
// ============================================================================

export const staggerContainer = (staggerChildren = TIMING.staggerNormal, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// ============================================================================
// TEXT REVEAL VARIANTS
// ============================================================================

export const textRevealContainer = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TIMING.staggerFast,
      delayChildren: delay,
    },
  },
});

export const textRevealChild: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      ...SPRING.gentle,
    },
  },
};

// ============================================================================
// SCALE VARIANTS
// ============================================================================

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TIMING.fast,
      ease: EASING.smoothOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: TIMING.micro,
      ease: EASING.exit,
    },
  },
};

// ============================================================================
// REDUCED MOTION VARIANTS
// For accessibility - minimal or no motion
// ============================================================================

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.01 },
  },
};

// Helper to get appropriate variants based on reduced motion preference
export const getAccessibleVariants = (variants: Variants, prefersReducedMotion: boolean): Variants => {
  if (prefersReducedMotion) {
    return reducedMotionVariants;
  }
  return variants;
};

// Helper to get accessible transition
export const getAccessibleTransition = (transition: Transition, prefersReducedMotion: boolean): Transition => {
  if (prefersReducedMotion) {
    return { duration: 0.01 };
  }
  return transition;
};
