import { useState } from 'react';
import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import { GOOEY_FILTER_ID } from '@/desktop/effects/GooeyFilter';
import { useEffectsEnabled } from '@/desktop/effects/useEffectsEnabled';
import { FolderIcon } from '@/desktop/icons/FolderIcon';
import type { Positions } from '@/desktop/icons/useIconPositions';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';
import type { WindowId } from '@/desktop/types';

interface Props {
  positions: Positions;
  setPosition: (id: WindowId, x: number, y: number) => void;
}

/**
 * The navigation. Six folders, dragged anywhere on a pointer device, laid out
 * in a fixed grid on touch where dragging only fights the scroll.
 *
 * While a folder is in hand the whole layer goes through the gooey filter, so
 * folders passing close to one another fuse and separate. The filter is only
 * mounted for the duration of the gesture — it is a full-layer SVG filter, not
 * something to leave running behind an idle desktop.
 */
export function IconLayer({ positions, setPosition }: Props) {
  const { windows, selectedIcon } = useDesktop();
  const dispatch = useDesktopDispatch();
  const mobile = useIsMobile();
  const { heavy } = useEffectsEnabled();
  const [dragging, setDragging] = useState(false);

  const icons = WINDOW_ORDER.map((id) => (
    <FolderIcon
      key={id}
      def={WINDOW_DEFS[id]}
      position={positions[id]}
      draggable={!mobile}
      openOnSingleClick={mobile}
      selected={selectedIcon === id}
      active={windows[id].open}
      onSelect={() => dispatch({ type: 'selectIcon', id })}
      onOpen={() => dispatch({ type: 'open', id })}
      onDragStateChange={setDragging}
      onDragEnd={(x, y) => setPosition(id, x, y)}
    />
  ));

  if (mobile) {
    return (
      <div className="relative z-10 grid grid-cols-3 justify-items-center gap-y-5 px-4 pb-40 pt-6">
        {icons}
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-10"
      style={heavy && dragging ? { filter: `url(#${GOOEY_FILTER_ID})` } : undefined}
    >
      {icons}
    </div>
  );
}
