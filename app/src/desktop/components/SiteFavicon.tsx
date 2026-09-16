import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * A site's own favicon, with a lettermark underneath it.
 *
 * The icons are served from this site rather than hot-linked from each domain:
 * a portfolio whose Legal window promises no third-party requests cannot then
 * fetch its marks from other people's servers. If a file is missing the
 * lettermark stands in — its hue is derived from the name, so a site always
 * looks like itself rather than changing on reload.
 */
export function SiteFavicon({
  src,
  label,
  className,
}: {
  src?: string;
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const letter = label.trim().charAt(0).toUpperCase() || '?';
  const hue = [...label].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 360, 7);

  if (failed || !src) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'grid place-items-center rounded-lg border border-border font-medium text-white',
          className,
        )}
        style={{
          background: `linear-gradient(145deg, hsl(${hue} 52% 36%), hsl(${(hue + 40) % 360} 52% 22%))`,
        }}
      >
        {letter}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('rounded-lg border border-border bg-foreground/5 object-contain', className)}
    />
  );
}
