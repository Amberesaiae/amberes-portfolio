import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { DraggablePlate } from '@/desktop/widgets/DraggablePlate';
import { FeaturedWork } from '@/desktop/widgets/FeaturedWork';
import { FlipClock } from '@/desktop/widgets/FlipClock';
import { Gallery } from '@/desktop/widgets/Gallery';
import { ReelStrip } from '@/desktop/widgets/ReelStrip';
import { TalkShortcut } from '@/desktop/widgets/TalkShortcut';
import type { useWidgetPositions } from '@/desktop/widgets/useWidgetPositions';

type Widgets = ReturnType<typeof useWidgetPositions>;

/**
 * The plates that live on the desktop.
 *
 * The phone carries three things, not five. The reel and the work list both
 * have a folder in the dock that does the same job better on a small screen —
 * a full scrolling window rather than a squeezed card — so putting them on the
 * home screen as well only made everything else smaller. What is left is a
 * countdown, a way to say something, and the pictures, which now get the whole
 * height instead of a strip of it.
 */
export function WidgetLayer({ widgets }: { widgets: Widgets }) {
  const mobile = useIsMobile();
  const { positions, setPosition } = widgets;

  if (mobile) {
    return (
      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 px-4">
        {/* One short row: the way in on the left, the days on the right. */}
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
          label="Pictures"
          position={positions.gallery}
          draggable={false}
          onDragEnd={() => undefined}
          className="!w-[62%] !max-w-[248px] h-[300px] shrink-0 self-start overflow-hidden"
        >
          <Gallery />
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
        label="Pictures"
        position={positions.gallery}
        draggable
        onDragEnd={(x, y) => setPosition('gallery', x, y)}
      >
        <Gallery />
      </DraggablePlate>

      <DraggablePlate
        label="Selected work"
        position={positions.featured}
        draggable
        onDragEnd={(x, y) => setPosition('featured', x, y)}
      >
        <FeaturedWork />
      </DraggablePlate>
    </div>
  );
}
