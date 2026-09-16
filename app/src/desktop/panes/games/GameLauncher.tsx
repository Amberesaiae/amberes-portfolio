import { Gamepad2, Play } from 'lucide-react';
import type { ViewMode } from '@/desktop/config/views';
import { CardGrid } from '@/desktop/panes/CardGrid';
import { Body, Label, Title } from '@/desktop/typography/Text';
import { GameCard } from './GameCard';
import type { GameDef } from './gameList';

interface Props {
  games: GameDef[];
  view: ViewMode;
  onPick: (id: string) => void;
}

export function GameLauncher({ games, view, onPick }: Props) {
  return (
    <div className="space-y-3 p-5">
      <div className="mb-5 flex items-center gap-2.5">
        <Gamepad2 className="size-4 text-muted-foreground" />
        <Label className="text-muted-foreground/70">Pick one</Label>
      </div>

      {view === 'grid' ? (
        <CardGrid>
          {games.map((game) => (
            <GameCard key={game.id} game={game} onPick={() => onPick(game.id)} />
          ))}
        </CardGrid>
      ) : (
        games.map((game) => (
        <button
          key={game.id}
          type="button"
          onClick={() => onPick(game.id)}
          className="group flex w-full items-start gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-foreground/5"
        >
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
            <Play className="size-3.5 translate-x-px" />
          </span>
          <span className="min-w-0 space-y-1.5">
            <Title className="text-[0.95rem]">{game.title}</Title>
            <Body className="text-[0.8125rem] text-muted-foreground">{game.blurb}</Body>
            <Label className="block text-muted-foreground/55">{game.keys}</Label>
          </span>
          </button>
        ))
      )}
    </div>
  );
}
