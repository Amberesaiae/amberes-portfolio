import { useIsMobile } from '@/desktop/providers/useIsMobile';
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
  const mobile = useIsMobile();

  if (mobile) {
    return (
      <button
        type="button"
        onClick={() => dispatch({ type: 'open', id: 'contact' })}
        aria-label="Tell me something — share an idea"
        className="grid place-items-center rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* No plate behind it. The icon is already a drawn object with its own
            edges; a card around it just made it look like a button someone
            forgot to finish. The shadow is what lifts it off the wallpaper. */}
        <img
          src="/icons/talk.svg"
          alt=""
          width={44}
          height={44}
          draggable={false}
          className="size-11 select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)]"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'open', id: 'contact' })}
      onPointerDown={(e) => e.stopPropagation()}
      className="group flex w-full items-center gap-3 p-3 text-left sm:w-[248px]"
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
        <Label className="mt-1 block text-subtle-foreground">Share an idea</Label>
      </span>
    </button>
  );
}
