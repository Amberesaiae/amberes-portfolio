import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { DraggablePlate } from '@/desktop/widgets/DraggablePlate';
import { FeaturedWork } from '@/desktop/widgets/FeaturedWork';
import { FlipClock } from '@/desktop/widgets/FlipClock';
import { Gallery } from '@/desktop/widgets/Gallery';
import { SiteGrid } from '@/desktop/widgets/SiteGrid';
import { TalkShortcut } from '@/desktop/widgets/TalkShortcut';
import type { useWidgetPositions } from '@/desktop/widgets/useWidgetPositions';

type Widgets = ReturnType<typeof useWidgetPositions>;

/**
 * The plates that live on the desktop. On mobile they stop being draggable and
 * stack above the dock, where they are the first thing read.
 */
export function WidgetLayer({ widgets }: { widgets: Widgets }) {
  const mobile = useIsMobile();
  const { positions, setPosition } = widgets;

  const plates = (
    <>
      <DraggablePlate
        label="Countdown"
        position={positions.clock}
        draggable={!mobile}
        onDragEnd={(x, y) => setPosition('clock', x, y)}
      >
        <FlipClock />
      </DraggablePlate>

      <DraggablePlate
        label="Live sites"
        position={positions.sites}
        draggable={!mobile}
        onDragEnd={(x, y) => setPosition('sites', x, y)}
      >
        <SiteGrid />
      </DraggablePlate>

      <DraggablePlate
        label="Start a conversation"
        position={positions.talk}
        draggable={!mobile}
        onDragEnd={(x, y) => setPosition('talk', x, y)}
      >
        <TalkShortcut />
      </DraggablePlate>

      <DraggablePlate
        label="Pictures"
        position={positions.gallery}
        draggable={!mobile}
        onDragEnd={(x, y) => setPosition('gallery', x, y)}
      >
        <Gallery />
      </DraggablePlate>

      <DraggablePlate
        label="Selected work"
        position={positions.featured}
        draggable={!mobile}
        onDragEnd={(x, y) => setPosition('featured', x, y)}
      >
        <FeaturedWork />
      </DraggablePlate>
    </>
  );

  if (mobile) {
    return <div className="relative z-10 flex flex-col items-center gap-3 px-4 pt-20">{plates}</div>;
  }

  return <div className="pointer-events-none absolute inset-0 z-10 [&>*]:pointer-events-auto">{plates}</div>;
}
