import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { IconWell } from '@/desktop/components/IconWell';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { Label, Mono } from '@/desktop/typography/Text';

/**
 * Everything he has made, on the desktop, in one scrolling card.
 *
 * It used to show four featured projects, with the live sites repeated again on
 * a separate Live sites plate — two plates saying overlapping things. This is
 * the one list: sites first because they can be judged immediately, then the
 * software. Scroll the card and you reach all of it without opening a window.
 *
 * What a row does depends on what it is. A live site opens the site, because
 * there is nothing to read here that beats using it. A piece of software opens
 * its own page in the Work window, because there is no site to send you to and
 * the writing is the only way in.
 */
export function FeaturedWork() {
  const dispatch = useDesktopDispatch();
  const mobile = useIsMobile();
  const live = projects.filter((p) => p.link && p.favicon);
  const software = projects.filter((p) => !(p.link && p.favicon));

  return (
    <div
      className="flex w-full flex-col p-4 sm:w-[320px]"
      /* Three rows on a phone — the height it had before it grew. Everything
         else is still in there, reached by scrolling the list inside. */
      style={{ maxHeight: mobile ? 164 : 360 }}
    >
      <div className="mb-3 flex shrink-0 items-baseline justify-between">
        <Label className="text-subtle-foreground">Selected work</Label>
        <button
          type="button"
          onClick={() => dispatch({ type: 'open', id: 'work' })}
          onPointerDown={(e) => e.stopPropagation()}
          className="type-label -mr-1.5 flex h-6 items-center rounded px-1.5 text-subtle-foreground transition-colors hover:text-foreground"
        >
          Open
        </button>
      </div>

      {/* The card scrolls; the desktop underneath does not. */}
      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
        <ul className="space-y-1.5">
          {live.map((p) => (
            <li key={p.id}>
              <Row
                title={p.title}
                meta={p.url ?? ''}
                external
                mark={
                  <SiteFavicon
                    src={p.favicon}
                    label={p.title}
                    className="size-10 shrink-0 border-0 bg-transparent text-base"
                  />
                }
                onOpen={() => window.open(p.link, '_blank', 'noopener,noreferrer')}
              />
            </li>
          ))}

          <li className="px-1.5 pb-1 pt-3">
            <Label className="text-subtle-foreground">Software</Label>
          </li>

          {software.map((p) => (
            <li key={p.id}>
              <Row
                title={p.title}
                meta={`${p.year} · ${p.category}`}
                mark={
                  p.cardIcon ? (
                    <span className="size-10 shrink-0 overflow-hidden rounded-lg">
                      <IconWell src={p.cardIcon} className="p-1.5" />
                    </span>
                  ) : (
                    <ImageSlot className="w-10 shrink-0" ratio="1 / 1" src={p.image} alt="" sizes="40px" />
                  )
                }
                onOpen={() => dispatch({ type: 'open', id: 'work', arg: p.id })}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({
  title,
  meta,
  mark,
  external,
  onOpen,
}: {
  title: string;
  meta: string;
  mark: React.ReactNode;
  external?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerDown={(e) => e.stopPropagation()}
      className="group flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition-colors hover:bg-white/5"
    >
      {mark}
      <span className="min-w-0 flex-1">
        <span className="type-small block truncate text-foreground group-hover:text-primary">
          {title}
        </span>
        <Mono className="block truncate text-subtle-foreground">{meta}</Mono>
      </span>
      {external ? (
        <ArrowUpRight className="size-3.5 shrink-0 text-subtle-foreground transition-colors group-hover:text-primary" />
      ) : (
        <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground transition-colors group-hover:text-primary" />
      )}
    </button>
  );
}
