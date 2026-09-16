import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { Label, Mono } from '@/desktop/typography/Text';

const featured = projects.filter((p) => p.featured).slice(0, 4);

/**
 * Work on the desktop itself, so the first thing on screen is what he built
 * rather than seven films other people made.
 */
export function FeaturedWork() {
  const dispatch = useDesktopDispatch();

  return (
    <div className="w-[320px] p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <Label className="text-muted-foreground/70">Selected work</Label>
        <button
          type="button"
          onClick={() => dispatch({ type: 'open', id: 'work' })}
          onPointerDown={(e) => e.stopPropagation()}
          className="type-label text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          All {projects.length}
        </button>
      </div>

      <ul className="space-y-1.5">
        {featured.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'open', id: 'work', arg: p.id })}
              onPointerDown={(e) => e.stopPropagation()}
              className="group flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition-colors hover:bg-white/5"
            >
              <ImageSlot
                className="w-16 shrink-0"
                ratio="16 / 11"
                src={p.image}
                alt=""
                sizes="64px"
              />
              <span className="min-w-0 flex-1">
                <span className="type-small block truncate text-foreground group-hover:text-primary">
                  {p.title}
                </span>
                <Mono className="block truncate text-muted-foreground/60">
                  {p.year} · {p.category}
                </Mono>
              </span>
              {p.link && (
                <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
