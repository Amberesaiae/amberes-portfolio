import { Suspense, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaneProps } from '@/desktop/config/panes';
import { PaneLoader } from '@/desktop/effects/PaneLoader';
import { GAMES } from './gameList';
import { GameLauncher } from './GameLauncher';

/**
 * A launcher and a game, one level deep — the same master/detail shape the rest
 * of the site uses, rather than a third navigation idea.
 *
 * Neither game is downloaded until it is picked, so the folder costs nothing to
 * anyone who never opens it.
 */
export default function GamesPane({ arg, view = 'list' }: PaneProps) {
  const [playing, setPlaying] = useState<string | null>(arg ?? null);
  const game = GAMES.find((g) => g.id === playing);

  if (!game) return <GameLauncher games={GAMES} view={view} onPick={setPlaying} />;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-2 py-1.5">
        <Button variant="ghost" size="sm" className="type-label" onClick={() => setPlaying(null)}>
          <ChevronLeft />
          Games
        </Button>
      </div>

      {/* The games bring their own black background and their own palette, and
          were built to fill a page — so the window lets them scroll rather than
          clipping their controls. */}
      <div className="min-h-0 flex-1 overflow-auto">
        <Suspense fallback={<PaneLoader />}>
          <game.Component />
        </Suspense>
      </div>
    </div>
  );
}
