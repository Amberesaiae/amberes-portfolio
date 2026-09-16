import { projects } from '@/data/projects';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { Label } from '@/desktop/typography/Text';

/**
 * The shortest path out of the portfolio and into the work.
 *
 * Marks only — one click, new tab, nothing to read first. The same filter that
 * drives the Live row in the Work window: a link plus a favicon means it is a
 * running site, so it gets a door rather than a description.
 */
const SITES = projects.filter((p) => p.link && p.favicon);

export function SiteGrid() {
  if (SITES.length === 0) return null;

  return (
    <div className="w-[236px] p-4">
      <Label className="mb-3 block text-subtle-foreground">Live sites</Label>

      <ul className="flex flex-wrap gap-3">
        {SITES.map((site) => (
          <li key={site.id}>
            <a
              href={site.link}
              target="_blank"
              rel="noreferrer noopener"
              title={site.url ?? site.title}
              onPointerDown={(e) => e.stopPropagation()}
              className="block rounded-lg p-1 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <SiteFavicon
                src={site.favicon}
                label={site.title}
                className="size-10 border-0 bg-transparent text-base"
              />
              <span className="sr-only">{site.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
