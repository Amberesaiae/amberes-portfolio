import { projects as staticProjects, type ProjectData } from '@/data/projects';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { Eyebrow } from '@/desktop/typography/Eyebrow';

/**
 * The live websites — marks only.
 *
 * A site is not a case study. If it is running, the honest thing to show is the
 * door: the favicon, the domain under it, and a link straight out. No summary,
 * no screenshot, no detail view to click through first — the site itself is the
 * argument, and anything we write here just delays it.
 *
 * A project with a link and a favicon belongs here and nowhere else; everything
 * without them is local software and lives in the card grid below.
 */
export function SiteFaviconGrid({ sites = staticProjects }: { sites?: ProjectData[] }) {
  const live = sites.filter((p) => p.link && p.favicon);
  if (live.length === 0) return null;

  return (
    <section aria-label="Live websites" className="mb-8">
      <Eyebrow>Live</Eyebrow>
      <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-5">
        {live.map((site) => (
          <li key={site.id}>
            <a
              href={site.link}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex flex-col items-center gap-2 outline-none"
            >
              <SiteFavicon
                src={site.favicon}
                label={site.title}
                className="size-12 border-0 bg-transparent text-lg transition-transform duration-200 group-hover:-translate-y-0.5"
              />
              <span className="type-label text-subtle-foreground transition-colors group-hover:text-primary">
                {site.url ?? site.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
