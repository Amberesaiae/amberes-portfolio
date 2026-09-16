import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { Label, Small } from '@/desktop/typography/Text';

/**
 * A way to start a conversation without first working out that the blob in the
 * dock is a button.
 *
 * The dock blob is the clever affordance; this is the obvious one, and a
 * portfolio can afford exactly one obvious call to action on the wallpaper.
 */
export function TalkShortcut() {
  const dispatch = useDesktopDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'open', id: 'contact' })}
      onPointerDown={(e) => e.stopPropagation()}
      className="group flex w-[248px] items-center gap-3 p-3 text-left"
    >
      <img
        src="/icons/talk.svg"
        alt=""
        width={38}
        height={38}
        draggable={false}
        className="size-[38px] shrink-0 select-none transition-transform duration-200 group-hover:-translate-y-0.5"
      />
      <span className="min-w-0">
        <Small className="block text-[0.8125rem] font-medium text-foreground">
          Tell me something
        </Small>
        <Label className="mt-1 block text-muted-foreground/70">Share an idea</Label>
      </span>
    </button>
  );
}
