import { projects as staticProjects, type ProjectData } from '@/data/projects';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { Eyebrow } from '@/desktop/typography/Eyebrow';

/**
 * The live websites, as favicons.
 *
 * A grid of site marks that goes straight to the site — no detail view in
 * between. Only projects with both a link and a favicon appear here; the local
 * softwares below have neither and live in the card grid instead. The same
 * filter drives the Live sites plate on the desktop.
 */
export function SiteFaviconGrid({ projects = staticProjects }: { projects?: ProjectData[] }) {
  const sites = projects.filter((p) => p.link && p.favicon);
  if (sites.length === 0) return null;

  return (
    <section aria-label="Live websites" className="mb-6">
      <Eyebrow>Live — go straight there</Eyebrow>
      <ul className="mt-3 grid grid-cols-3 gap-3">
        {sites.map((site) => (
          <li key={site.id}>
            <a
              href={site.link}
              target="_blank"
              rel="noreferrer noopener"
              title={`${site.title} — ${site.url ?? site.link}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border px-2 py-4 transition-colors hover:border-primary/50 hover:bg-foreground/5"
            >
              <SiteFavicon src={site.favicon} label={site.title} className="size-10 text-base" />
              <span className="type-label text-center text-muted-foreground/75 transition-colors group-hover:text-primary">
                {site.url ?? site.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
