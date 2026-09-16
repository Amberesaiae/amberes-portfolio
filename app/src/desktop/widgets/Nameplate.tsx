import { MapPin } from 'lucide-react';
import { projects } from '@/data/projects';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { REEL } from '@/desktop/data/reel';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { Label, Mono, Small, Title } from '@/desktop/typography/Text';

const shipped = projects.filter((p) => p.status === 'shipped').length;

/**
 * The claim, with a face on it.
 *
 * A visitor should know who this is and what he does before clicking anything.
 * The portrait does most of that work — it is the one thing on the desktop that
 * is unmistakably a person rather than an interface.
 *
 * The counts sit in a full-width footer rather than beside the portrait: in the
 * narrow right-hand column they either wrapped awkwardly or ran past the edge.
 */
export function Nameplate() {
  const dispatch = useDesktopDispatch();

  return (
    <div className="w-[342px] p-4">
      <div className="flex gap-4">
        <ImageSlot
          className="w-[92px] shrink-0"
          ratio="3 / 4"
          src="/images/amber-portrait.jpg"
          alt="Lamptey Odartei Isaiah"
          hint="Portrait"
          sizes="92px"
        />

        <div className="flex min-w-0 flex-col">
          <Title className="text-[0.95rem] leading-snug">Lamptey Odartei Isaiah</Title>
          <Label className="mt-1 block text-muted-foreground/70">amber</Label>

          <Small className="mt-2.5 text-[0.75rem] leading-relaxed text-foreground/75">
            Marine engineer. Welder. I build the software too.
          </Small>

          <div className="mt-auto flex items-center gap-3 pt-3">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3 text-muted-foreground/60" />
              <Mono className="text-muted-foreground/70">Accra</Mono>
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'open', id: 'contact' })}
              onPointerDown={(e) => e.stopPropagation()}
              className="type-label ml-auto text-primary transition-opacity hover:opacity-75"
            >
              Hire me
            </button>
          </div>
        </div>
      </div>

      <Label className="mt-3.5 block border-t border-border pt-3 tracking-[0.12em] text-muted-foreground/45">
        {shipped} shipped &middot; {projects.length - shipped} in flight &middot; {REEL.length} films
      </Label>
    </div>
  );
}
