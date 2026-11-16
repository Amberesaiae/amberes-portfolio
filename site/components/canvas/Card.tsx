"use client";

import Link from "next/link";
import { useState } from "react";
import { FRAME, type CanvasCard } from "@/lib/canvas";
import { cn } from "@/lib/utils";

/**
 * Eight handles, at the corners and the edge midpoints.
 *
 * This is the detail that does the most work on the page: it says the board is
 * a file somebody still has open, not a finished marketing page. It is also
 * what lets the board be sparse without looking unfinished — an unselected
 * frame is just a frame, but a selected one reads as something being worked on.
 */
function Handles() {
  const spots = [
    "-top-1 -left-1",
    "-top-1 left-1/2 -translate-x-1/2",
    "-top-1 -right-1",
    "top-1/2 -left-1 -translate-y-1/2",
    "top-1/2 -right-1 -translate-y-1/2",
    "-bottom-1 -left-1",
    "-bottom-1 left-1/2 -translate-x-1/2",
    "-bottom-1 -right-1",
  ];
  return (
    <>
      <span className="pointer-events-none absolute -inset-px border border-[var(--amber-blue)]" />
      {spots.map((s) => (
        <span
          key={s}
          className={cn(
            "pointer-events-none absolute size-[7px] border border-[var(--amber-blue)] bg-white",
            s,
          )}
        />
      ))}
    </>
  );
}

export function Card({ card, stacked = false }: { card: CanvasCard; stacked?: boolean }) {
  const [hover, setHover] = useState(false);
  /*
   * Most `media` paths will point at nothing until the real set is generated,
   * so a miss has to fall back to the pending plate. `onError` alone does not
   * cover it: the image is server-rendered and a 404 lands before React has
   * hydrated and attached the handler, leaving a broken icon forever. The ref
   * catches the ones that failed while nobody was listening.
   */
  const [missing, setMissing] = useState(false);
  const selected = !stacked && (card.pinned || hover);
  const art = card.media && !missing ? card.media : null;

  const body = (
    <>
      <span className="absolute -top-5 left-0 font-mono text-[9px] tracking-[0.14em] text-black/45 uppercase">
        {card.label}
      </span>

      <span
        className="relative block w-full overflow-hidden bg-white shadow-[0_2px_10px_rgb(0_0_0/0.14)]"
        style={{
          aspectRatio: card.h ? `${card.w} / ${card.h}` : String(FRAME.RATIO),
          borderRadius: 2,
        }}
      >
        {card.swatch ? (
          <span className="flex size-full">
            {card.swatch.map((c) => (
              <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
            ))}
          </span>
        ) : art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={art}
            alt=""
            draggable={false}
            onError={() => setMissing(true)}
            ref={(el) => {
              if (el?.complete && el.naturalWidth === 0) setMissing(true);
            }}
            className="size-full select-none object-cover"
          />
        ) : (
          <span className="flex size-full flex-col justify-end gap-1 bg-[var(--amber-surface)] p-4">
            {card.title ? (
              <span className="text-sm leading-tight font-medium text-black/70">{card.title}</span>
            ) : null}
            <span className="font-mono text-[9px] tracking-[0.12em] text-black/35 uppercase">
              asset pending
            </span>
          </span>
        )}
      </span>

      {selected ? <Handles /> : null}
    </>
  );

  const shared = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  /* Stacked is the phone: full width, in flow, no absolute placement. */
  const style = stacked
    ? undefined
    : ({ left: `${card.x}%`, top: card.y, width: card.w } as const);
  const className = stacked ? "relative block w-full select-none" : "absolute block select-none";

  return card.href ? (
    <Link
      href={card.href}
      style={style}
      className={className}
      aria-label={card.title ?? card.label}
      {...shared}
    >
      {body}
    </Link>
  ) : (
    <div style={style} className={className} {...shared}>
      {body}
    </div>
  );
}
