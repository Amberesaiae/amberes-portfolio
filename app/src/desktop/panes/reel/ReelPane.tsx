import { useRef, useState } from 'react';
import { ImageIcon, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { REEL } from '@/desktop/data/reel';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { Label, Title } from '@/desktop/typography/Text';
import type { PaneProps } from '@/desktop/config/panes';
import { CardGrid } from '@/desktop/panes/CardGrid';
import { ReelCard } from './ReelCard';
import { ReelListItem } from './ReelListItem';

/**
 * A player with a list under it.
 *
 * It used to put the chosen film on the desktop wallpaper, behind everything.
 * That read well as an idea and badly as a thing to use: the film played
 * somewhere other than where you tapped, the window you were looking at was now
 * in the way of it, getting back needed a Restore button in two places, and on
 * a phone — where the wallpaper is almost entirely covered by the sheet you
 * just opened — it did nothing you could see at all.
 *
 * So the film plays here, in the frame you picked it from, with the browser's
 * own controls. One behaviour, identical on a phone and a desktop.
 *
 * Putting it on the desktop is still possible — it is the nicest thing this
 * site does — but it is now a button that says so, under the film it applies
 * to, with the same button turning it off again. Nothing happens to the
 * background unless someone asks for it by name.
 */
export default function ReelPane({ arg, view = 'list' }: PaneProps) {
  const first = REEL.find((c) => c.id === arg) ?? REEL[0];
  const [current, setCurrent] = useState(first);
  const video = useRef<HTMLVideoElement>(null);
  const { wallpaper } = useDesktop();
  const dispatch = useDesktopDispatch();
  const isWallpaper = wallpaper === current.preview;

  const pick = (id: string) => {
    const clip = REEL.find((c) => c.id === id);
    if (!clip) return;
    setCurrent(clip);
    // Autoplay muted is allowed everywhere; the controls let them unmute.
    requestAnimationFrame(() => void video.current?.play().catch(() => undefined));
  };

  return (
    <PaneBody className="flex h-full flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="shrink-0 overflow-hidden rounded-lg border border-border bg-black">
        <video
          ref={video}
          key={current.id}
          src={current.preview}
          poster={`/vids/loops/${current.id}.webm`}
          className="aspect-video w-full bg-black"
          controls
          playsInline
          preload="metadata"
        />
      </div>

      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <Title className="truncate text-[0.9rem]">{current.title}</Title>
          <Label className="mt-1 block truncate text-subtle-foreground">
            {current.credit}
            {current.role ? ` · ${current.role}` : ''}
          </Label>
        </div>

        <Button
          variant={isWallpaper ? 'secondary' : 'outline'}
          size="sm"
          className="h-8 shrink-0 px-3 text-[0.75rem]"
          onClick={() =>
            dispatch({ type: 'setWallpaper', src: isWallpaper ? null : current.preview })
          }
        >
          {isWallpaper ? <Undo2 /> : <ImageIcon />}
          {isWallpaper ? 'Remove from desktop' : 'Set as wallpaper'}
        </Button>
      </div>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
        {view === 'grid' ? (
          <CardGrid>
            {REEL.map((clip) => (
              <ReelCard
                key={clip.id}
                clip={clip}
                playing={current.id === clip.id}
                onPlay={() => pick(clip.id)}
              />
            ))}
          </CardGrid>
        ) : (
          <ul className="space-y-0.5">
            {REEL.map((clip) => (
              <ReelListItem
                key={clip.id}
                clip={clip}
                playing={current.id === clip.id}
                onPlay={() => pick(clip.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="shrink-0 border-t border-border pt-3">
        <Label className="text-subtle-foreground">
          {REEL.length} films · credits belong to the filmmakers named
        </Label>
      </footer>
    </PaneBody>
  );
}
