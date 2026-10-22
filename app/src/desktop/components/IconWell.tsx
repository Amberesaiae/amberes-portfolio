import { cn } from '@/lib/utils';
import { ICON_INTRINSIC } from './iconMetrics';

/**
 * The tile a product icon sits on.
 *
 * Every software icon in this project is line art on a transparent background,
 * and three of the four are drawn in near-black — the Noragami cat is pure
 * #000. Dropped straight onto the dark card they were invisible, which is why
 * those tiles read as empty. A logo cannot be asked to work on any background;
 * it is drawn for one. So the well supplies that background: a light, neutral,
 * theme-independent plate, the same idea as the rounded tile an OS puts behind
 * an app icon.
 *
 * It stays light in dark mode on purpose. Matching the card would put us back
 * where we started.
 */
export function IconWell({ src, className }: { src: string; className?: string }) {
  const dim = ICON_INTRINSIC[src];

  return (
    <span
      className={cn(
        'flex size-full items-center justify-center bg-gradient-to-b from-white to-zinc-200 p-5',
        className,
      )}
    >
      {/*
        The box is the well, and the bitmap fits inside it. max-width alone
        left the 5:1 wordmark at its intrinsic width, and the square overflow
        clipped it to a fragment of the name.
      */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={dim?.width}
        height={dim?.height}
        loading="lazy"
        decoding="async"
        className="h-full max-h-full w-full min-h-0 min-w-0 object-contain object-center"
      />
    </span>
  );
}
