/**
 * Centralized layout tokens for consistent alignment across all pages.
 * Use these instead of arbitrary values to maintain visual rhythm.
 */

// ============================================================================
// CONTAINER WIDTHS
// ============================================================================

/** Standard container widths using Tailwind classes */
export const CONTAINER = {
  /** Full-width layout (1400px) - use sparingly for immersive sections */
  full: 'max-w-[1400px]',
  /** Wide content (1280px) - primary page container */
  wide: 'max-w-7xl',
  /** Standard content (1152px) - most content sections */
  content: 'max-w-6xl',
  /** Narrow content (896px) - reading-heavy pages */
  narrow: 'max-w-4xl',
  /** Text optimal (672px) - long-form typography */
  text: 'max-w-2xl',
} as const;

/** Container centering - always use with CONTAINER values */
export const CENTER = 'mx-auto';

// ============================================================================
// PADDING SCALE
// ============================================================================

/** Horizontal page padding - consistent across all pages */
export const PADX = {
  /** Standard page padding: 16px mobile → 24px tablet → 40px desktop → 64px wide */
  page: 'px-4 sm:px-6 md:px-10 lg:px-16',
  /** Reduced padding: 16px mobile → 24px tablet → 40px desktop */
  reduced: 'px-4 sm:px-6 md:px-10',
  /** Minimal padding: 16px mobile → 24px tablet */
  minimal: 'px-4 sm:px-6',
} as const;

/** Vertical section padding - for section spacing rhythm */
export const PADY = {
  /** Large sections: 80px mobile → 128px desktop */
  large: 'py-20 md:py-32',
  /** Medium sections: 64px mobile → 96px desktop */
  medium: 'py-16 md:py-24',
  /** Small sections: 48px mobile → 64px desktop */
  small: 'py-12 md:py-16',
  /** Page header spacing: 144px mobile → 192px desktop */
  header: 'pt-36 md:pt-48',
  /** Page footer spacing: 96px mobile → 160px desktop */
  footer: 'pb-24 md:pb-40',
} as const;

// ============================================================================
// GRID SYSTEM (12-Column)
// ============================================================================

/** Standard 12-column grid wrapper */
export const GRID = {
  /** 12-column responsive grid */
  cols12: 'grid grid-cols-1 md:grid-cols-12',
  /** 2-column layout */
  cols2: 'grid grid-cols-1 md:grid-cols-2',
  /** 4-column layout */
  cols4: 'grid grid-cols-2 md:grid-cols-4',
} as const;

/** Grid column spans for 12-column layout */
export const SPAN = {
  /** 7 columns (content-primary layouts) */
  '7': 'md:col-span-7',
  /** 5 columns (sidebar layouts) */
  '5': 'md:col-span-5',
  /** 8 columns (wide content) */
  '8': 'md:col-span-8',
  /** 4 columns (narrow sidebar) */
  '4': 'md:col-span-4',
  /** 6 columns (half-width) */
  '6': 'md:col-span-6',
  /** Full width */
  full: 'md:col-span-12',
} as const;

/** Grid gaps */
export const GAP = {
  /** Large gap: 64px mobile → 96px desktop */
  large: 'gap-16 md:gap-24',
  /** Medium gap: 32px mobile → 48px desktop */
  medium: 'gap-8 md:gap-12',
  /** Small gap: 16px mobile → 24px desktop */
  small: 'gap-4 md:gap-6',
} as const;

// ============================================================================
// COMPOSITE LAYOUT CLASSES
// ============================================================================

/** Standard page container - use for main content wrappers */
export const PAGE_CONTAINER = `${CONTAINER.content} ${CENTER} ${PADX.page}`;

/** Wide page container - for immersive/hero sections */
export const PAGE_CONTAINER_WIDE = `${CONTAINER.wide} ${CENTER} ${PADX.page}`;

/** Narrow page container - for legal/reading pages */
export const PAGE_CONTAINER_NARROW = `${CONTAINER.narrow} ${CENTER} ${PADX.page}`;

/** Section wrapper with standard vertical spacing */
export const SECTION = `${PADY.large}`;

/** Standard 7+5 content grid (content + sidebar) */
export const CONTENT_GRID = `${GRID.cols12} ${GAP.large}`;

// ============================================================================
// BORDER & DIVIDER
// ============================================================================

/** Standard border color - subtle separator */
export const BORDER_SUBTLE = 'border-white/5';

/** Medium border color - section dividers */
export const BORDER_MEDIUM = 'border-white/10';

/** Accent border color - highlighted dividers */
export const BORDER_ACCENT = 'border-[#FFB000]/20';

// ============================================================================
// PRE-BUILT UTILITY EXPORTS
// ============================================================================

/** Complete page wrapper for standard content pages */
export const layoutPage = (options?: {
  width?: 'full' | 'wide' | 'content' | 'narrow';
  padding?: 'page' | 'reduced' | 'minimal';
}) => {
  const width = options?.width ?? 'content';
  const padding = options?.padding ?? 'page';
  return `${CONTAINER[width]} ${CENTER} ${PADX[padding]}`;
};

/** Complete section wrapper */
export const layoutSection = (options?: {
  size?: 'large' | 'medium' | 'small';
  border?: 'top' | 'bottom' | 'both' | 'none';
}) => {
  const size = options?.size ?? 'large';
  const border = options?.border ?? 'none';
  const borders = {
    top: 'border-t ' + BORDER_SUBTLE,
    bottom: 'border-b ' + BORDER_SUBTLE,
    both: 'border-y ' + BORDER_SUBTLE,
    none: '',
  };
  return `${PADY[size]} ${borders[border]}`.trim();
};
