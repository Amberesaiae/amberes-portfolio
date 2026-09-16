import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { REEL } from '@/desktop/data/reel';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { Body, Label } from '@/desktop/typography/Text';
import type { PaneProps } from '@/desktop/config/panes';
import { CardGrid } from '@/desktop/panes/CardGrid';
import { ReelCard } from './ReelCard';
import { ReelListItem } from './ReelListItem';
import { useWallpaperFilm } from './useWallpaperFilm';

/**
 * A chooser, not a player.
 *
 * Picking a film puts it on the wallpaper behind everything, which is the one
 * screen this site has and by far the best surface to watch it on. That keeps
 * this window small: a scrollable list, and a way back to the original plate.
 */
export default function ReelPane({ arg, view = 'list' }: PaneProps) {
  const { playingId, play, restore } = useWallpaperFilm();
  const current = playingId ?? arg ?? null;

  return (
    <PaneBody className="flex h-full flex-col gap-4 px-4 py-4 sm:px-5">
      <header className="flex items-start justify-between gap-3">
        <Body className="text-[0.8125rem] text-muted-foreground">
          Pick one and it plays as the wallpaper, behind everything.
        </Body>
        {playingId && (
          <Button variant="ghost" size="sm" className="type-label shrink-0" onClick={restore}>
            <Undo2 />
            Restore
          </Button>
        )}
      </header>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
        {view === 'grid' ? (
          <CardGrid>
            {REEL.map((clip) => (
              <ReelCard
                key={clip.id}
                clip={clip}
                playing={current === clip.id}
                onPlay={() => play(clip.id)}
              />
            ))}
          </CardGrid>
        ) : (
          <ul className="space-y-0.5">
            {REEL.map((clip) => (
              <ReelListItem
                key={clip.id}
                clip={clip}
                playing={current === clip.id}
                onPlay={() => play(clip.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="border-t border-border pt-3">
        <Label className="text-subtle-foreground">
          {REEL.length} films · credits belong to the filmmakers named
        </Label>
      </footer>
    </PaneBody>
  );
}
