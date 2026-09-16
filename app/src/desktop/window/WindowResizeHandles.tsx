import type { PointerEvent } from 'react';

export type ResizeEdge = 'se' | 'e' | 's';

interface Props {
  onStart: (e: PointerEvent, edge: ResizeEdge) => void;
}

/** Three invisible grips. Corner resizes both axes, edges resize one. */
export function WindowResizeHandles({ onStart }: Props) {
  return (
    <>
      <span
        onPointerDown={(e) => onStart(e, 'se')}
        className="absolute bottom-0 right-0 size-4 cursor-nwse-resize"
        aria-hidden="true"
      />
      <span
        onPointerDown={(e) => onStart(e, 'e')}
        className="absolute bottom-4 right-0 top-10 w-1.5 cursor-ew-resize"
        aria-hidden="true"
      />
      <span
        onPointerDown={(e) => onStart(e, 's')}
        className="absolute bottom-0 left-0 right-4 h-1.5 cursor-ns-resize"
        aria-hidden="true"
      />
    </>
  );
}
