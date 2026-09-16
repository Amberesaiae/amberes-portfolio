import { cn } from '@/lib/utils';

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
  return (
    <span
      className={cn(
        'flex size-full items-center justify-center bg-gradient-to-b from-white to-zinc-200 p-5',
        className,
      )}
    >
      {/*
        Contained rather than sized to a square: containerclear is a 3:1
        wordmark, and a square box shrank it to something unreadable.
      */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
