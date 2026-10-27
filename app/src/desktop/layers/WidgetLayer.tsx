import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { DraggablePlate } from '@/desktop/widgets/DraggablePlate';
import { FlipClock } from '@/desktop/widgets/FlipClock';
import { ReelStrip } from '@/desktop/widgets/ReelStrip';
import { TalkShortcut } from '@/desktop/widgets/TalkShortcut';
import { WorkCards } from '@/desktop/widgets/WorkCards';
import type { useWidgetPositions } from '@/desktop/widgets/useWidgetPositions';

type Widgets = ReturnType<typeof useWidgetPositions>;

/**
 * The plates that live on the desktop.
 *
 * The phone keeps the countdown and the way in, then gives the rest of the
 * screen to the work. A picture plate and a second copy of the list used to
 * split that space; one scrolling set of cards fills it, and the window is
 * still there when a build needs its own page.
 */
export function WidgetLayer({ widgets }: { widgets: Widgets }) {
  const mobile = useIsMobile();
  const dispatch = useDesktopDispatch();
  const { positions, setPosition } = widgets;
  const openSoftware = (id: string) => dispatch({ type: 'open', id: 'work', arg: id });

  if (mobile) {
    return (
      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 px-4">
        <div className="flex shrink-0 items-center justify-between gap-2.5">
          <TalkShortcut />

          <DraggablePlate
            label="Countdown"
            position={positions.clock}
            draggable={false}
            onDragEnd={() => undefined}
            className="!w-auto"
          >
            <FlipClock />
          </DraggablePlate>
        </div>

        <DraggablePlate
          label="Work"
          position={positions.work}
          draggable={false}
          onDragEnd={() => undefined}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <WorkCards variant="plate" columns={1} onOpenSoftware={openSoftware} />
        </DraggablePlate>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 [&>*]:pointer-events-auto">
      <DraggablePlate
        label="Countdown"
        position={positions.clock}
        draggable
        onDragEnd={(x, y) => setPosition('clock', x, y)}
      >
        <FlipClock />
      </DraggablePlate>

      <DraggablePlate
        label="Start a conversation"
        position={positions.talk}
        draggable
        onDragEnd={(x, y) => setPosition('talk', x, y)}
      >
        <TalkShortcut />
      </DraggablePlate>

      <DraggablePlate
        label="Films — open the reel"
        position={positions.films}
        draggable
        onDragEnd={(x, y) => setPosition('films', x, y)}
      >
        <ReelStrip />
      </DraggablePlate>

      <DraggablePlate
        label="Work"
        position={positions.work}
        draggable
        onDragEnd={(x, y) => setPosition('work', x, y)}
      >
        <WorkCards variant="plate" columns={2} onOpenSoftware={openSoftware} />
      </DraggablePlate>
    </div>
  );
}
