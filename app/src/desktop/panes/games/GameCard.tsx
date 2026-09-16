import { Play } from 'lucide-react';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { MediaCard } from '@/desktop/panes/MediaCard';
import type { GameDef } from './gameList';

/** The card form of a game, using a screenshot of the game itself. */
export function GameCard({ game, onPick }: { game: GameDef; onPick: () => void }) {
  return (
    <MediaCard
      title={game.title}
      meta={game.keys}
      onOpen={onPick}
      trailing={
        <Play className="size-3.5 translate-x-px text-muted-foreground/40 transition-colors group-hover:text-primary" />
      }
      media={
        <ImageSlot
          className="size-full rounded-none border-0"
          ratio="16 / 10"
          src={game.cover}
          alt={game.title}
          hint={game.title}
          sizes="(max-width: 768px) 90vw, 300px"
          widths={[320, 640, 768, 1024]}
        />
      }
    />
  );
}
