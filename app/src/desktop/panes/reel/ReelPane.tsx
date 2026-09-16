import { useEffect } from 'react';
import { ImageIcon, MonitorPlay, Undo2 } from 'lucide-react';
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
 * A list of films. Nothing plays here.
 *
 * Picking a film puts it on the desktop wallpaper, behind everything — the
 * desktop is the player. The window itself never holds a video element: one
 * surface plays, so there is nothing to keep in sync and no second decoder
 * running behind the list. Tapping the active film again, or Remove below,
 * puts the still back.
 */
export default function ReelPane({ arg, view = 'list' }: PaneProps) {
  const { wallpaper } = useDesktop();
  const dispatch = useDesktopDispatch();
  const active = REEL.find((c) => c.preview === wallpaper) ?? null;

  // Deep link (dock, shortcut, film id) selects that film's wallpaper.
  useEffect(() => {
    if (!arg) return;
    const clip = REEL.find((c) => c.id === arg);
    if (clip && clip.preview !== wallpaper) {
      dispatch({ type: 'setWallpaper', src: clip.preview });
    }
    // Once on mount: the wallpaper is state, not a prop to chase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (id: string) => {
    const clip = REEL.find((c) => c.id === id);
    if (!clip) return;
    dispatch({ type: 'setWallpaper', src: active?.id === id ? null : clip.preview });
  };

  const restore = () => dispatch({ type: 'setWallpaper', src: null });

  return (
    <PaneBody className="flex h-full flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <Title className="truncate text-[0.9rem]">
            {active ? active.title : 'No film on the desktop'}
          </Title>
          <Label className="mt-1 block truncate text-subtle-foreground">
            {active
              ? `${active.credit}${active.role ? ` · ${active.role}` : ''}`
              : 'Pick a film — it plays behind everything.'}
          </Label>
        </div>

        {active ? (
          <Button
            variant="secondary"
            size="sm"
            className="h-8 shrink-0 px-3 text-[0.75rem]"
            onClick={restore}
          >
            <Undo2 />
            Still back
          </Button>
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-subtle-foreground">
            <MonitorPlay className="size-4" />
          </span>
        )}
      </div>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
        {view === 'grid' ? (
          <CardGrid>
            {REEL.map((clip) => (
              <ReelCard
                key={clip.id}
                clip={clip}
                active={active?.id === clip.id}
                onSelect={() => select(clip.id)}
              />
            ))}
          </CardGrid>
        ) : (
          <ul className="space-y-0.5">
            {REEL.map((clip) => (
              <ReelListItem
                key={clip.id}
                clip={clip}
                active={active?.id === clip.id}
                onSelect={() => select(clip.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-border pt-3 text-subtle-foreground">
        <ImageIcon className="size-3.5" />
        <Label className="text-subtle-foreground">
          {REEL.length} films · credits belong to the filmmakers named
        </Label>
      </footer>
    </PaneBody>
  );
}
