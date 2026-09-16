import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { Label, Mono } from '@/desktop/typography/Text';

/**
 * The shortest path out of the portfolio and into the work.
 *
 * The live sites as their own marks: one click, new tab, no detour through a
 * case study. Someone who wants to judge the work by using it should not have
 * to read about it first. The same list drives the grid at the top of the Work
 * window, so there is one source of truth — a project with a link and a
 * favicon is a live site, everywhere.
 */
const SITES = projects.filter((p) => p.link && p.favicon);

export function SiteGrid() {
  if (SITES.length === 0) return null;

  return (
    <div className="w-[268px] p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <Label className="text-muted-foreground/70">Live sites</Label>
        <Mono className="text-muted-foreground/50">{SITES.length}</Mono>
      </div>

      <ul className="grid grid-cols-4 gap-2">
        {SITES.map((site) => (
          <li key={site.id}>
            <a
              href={site.link}
              target="_blank"
              rel="noreferrer noopener"
              title={`${site.title} — ${site.url ?? site.link}`}
              onPointerDown={(e) => e.stopPropagation()}
              className="group relative grid place-items-center rounded-lg p-1.5 transition-colors hover:bg-foreground/10"
            >
              <SiteFavicon src={site.favicon} label={site.title} className="size-9 text-[13px]" />
              <ArrowUpRight
                className="absolute right-0 top-0 size-3 text-transparent transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <span className="sr-only">
                {site.title} — {site.url ?? site.link}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <Label className="mt-3 block border-t border-border pt-2.5 text-muted-foreground/45">
        Straight to the real thing
      </Label>
    </div>
  );
}
