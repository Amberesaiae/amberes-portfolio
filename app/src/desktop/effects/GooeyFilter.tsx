import { useEffectsEnabled } from './useEffectsEnabled';

export const GOOEY_FILTER_ID = 'desktop-gooey';

/**
 * The SVG filter behind the folder-merge effect: blur hard, then crush the
 * alpha ramp so neighbouring shapes fuse at the edges instead of overlapping.
 *
 * Mounted once at the root; the icon layer references it only while a folder is
 * being dragged, because a filter over the whole desktop is not something to
 * leave running.
 */
export function GooeyFilterDefs() {
  const { heavy } = useEffectsEnabled();
  if (!heavy) return null;

  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0">
      <defs>
        <filter id={GOOEY_FILTER_ID}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
