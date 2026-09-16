import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * One split-flap card.
 *
 * `previous` is kept so the fold can show the digit that is leaving while the
 * unfold brings in the one arriving — a single value would flip to itself.
 */
export function FlipDigit({ value, compact = false }: { value: string; compact?: boolean }) {
  const [previous, setPrevious] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const last = useRef(value);

  useEffect(() => {
    if (value === last.current) return;
    setPrevious(last.current);
    last.current = value;
    setFlipping(true);
    const t = setTimeout(() => setFlipping(false), 660);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span
      className={cn(
        'flap relative block overflow-hidden rounded bg-foreground/[0.07] font-medium tabular-nums text-foreground',
        'shadow-[inset_0_1px_0_hsl(var(--foreground)/0.08)]',
        compact ? 'h-7 w-5 rounded-[3px] text-[1rem]' : 'h-14 w-10 rounded-md text-[2rem]',
      )}
      aria-hidden="true"
    >
      {/* Resting state: top already shows the new digit, bottom the old one. */}
      <span className="flap-half flap-top">
        <span>{value}</span>
      </span>
      <span className="flap-half flap-bottom">
        <span>{flipping ? previous : value}</span>
      </span>

      {flipping && (
        <>
          <span key={`t${previous}`} className="flap-half flap-top flap-anim-top bg-foreground/[0.07]">
            <span>{previous}</span>
          </span>
          <span key={`b${value}`} className="flap-half flap-bottom flap-anim-bottom bg-foreground/[0.07]">
            <span>{value}</span>
          </span>
        </>
      )}
    </span>
  );
}
