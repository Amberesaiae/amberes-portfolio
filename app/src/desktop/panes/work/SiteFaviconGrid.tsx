import { ArrowUpRight } from 'lucide-react';
import { projects as staticProjects, type ProjectData } from '@/data/projects';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { Eyebrow } from '@/desktop/typography/Eyebrow';
import { Mono, Title } from '@/desktop/typography/Text';

/**
 * The live websites — the mark, the address, and the way out.
 *
 * Rows, not a centred grid. The grid put each favicon above its own domain and
 * asked a 90px column to hold "continuum-rust-eta.vercel.app": the names either
 * collided or wrapped into three lines of shouting monospace. A row gives the
 * address the full width it needs, and it matches the software list directly
 * below — same shape, same target size, one window that reads as one thing.
 *
 * A site is still one tap from here to there. That was always the point.
 */
export function SiteFaviconGrid({ sites = staticProjects }: { sites?: ProjectData[] }) {
  const live = sites.filter((p) => p.link && p.favicon);
  if (live.length === 0) return null;

  return (
    <section aria-label="Live websites" className="mb-7">
      <Eyebrow>Live · {live.length}</Eyebrow>

      <ul className="mt-2 divide-y divide-border">
        {live.map((site) => (
          <li key={site.id}>
            <a
              href={site.link}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex w-full items-center gap-3.5 py-3 outline-none"
            >
              <SiteFavicon
                src={site.favicon}
                label={site.title}
                className="size-9 shrink-0 text-[15px]"
              />

              <span className="min-w-0 flex-1">
                <Title className="truncate text-[0.9rem] transition-colors group-hover:text-primary">
                  {site.title}
                </Title>
                <Mono className="mt-0.5 block truncate text-subtle-foreground">
                  {site.url ?? site.link}
                </Mono>
              </span>

              <ArrowUpRight className="size-4 shrink-0 text-subtle-foreground transition-colors group-hover:text-primary" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
