import { MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';
import { IDENTITY } from '@/desktop/config/identity';
import { MetalRing } from '@/desktop/effects/MetalRing';
import { REEL } from '@/desktop/data/reel';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { Label, Mono, Small, Title } from '@/desktop/typography/Text';

const shipped = projects.filter((p) => p.status === 'shipped').length;

/**
 * Who this is, in the panel rather than on the wallpaper.
 *
 * A system panel puts the account at one end; this does the same, which keeps
 * the desktop clear for the work and the film playing behind it. The portrait
 * is the trigger, so identity is visible at a glance and only expands when
 * someone asks.
 */
export function IdentityMenu() {
  const dispatch = useDesktopDispatch();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${IDENTITY.name} — ${IDENTITY.title}`}
          className="flex shrink-0 items-center gap-2.5 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-foreground/10"
        >
          {/*
            The lamp: his own photograph of a caged bulkhead fitting, which is a
            ship's light. It needs no theme variant — it carries its own night
            with it, so it sits on the dark menubar and the light one alike.
          */}
          <MetalRing className="rounded-[7px]">
            <img
              src="/logo-lamp.webp"
              alt=""
              width={26}
              height={26}
              draggable={false}
              className="size-[26px] select-none rounded-[5px] object-cover"
            />
          </MetalRing>
          <span className="type-label tracking-[0.3em] text-foreground">{IDENTITY.handle}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="w-[300px] p-4">
        <div className="flex gap-3.5">
          {/*
            The portrait moved in here when the lamp took the menubar: a logo
            identifies the site, a face identifies the person, and they are not
            the same job.
          */}
          <img
            src={IDENTITY.portrait}
            srcSet="/images/optimized/amber-portrait-320.webp 320w, /images/optimized/amber-portrait-640.webp 640w"
            sizes="76px"
            alt={IDENTITY.name}
            width={76}
            height={101}
            className="h-[101px] w-[76px] shrink-0 rounded-md object-cover"
          />

          <div className="flex min-w-0 flex-col">
            <Title className="text-[0.9rem] leading-snug">{IDENTITY.name}</Title>
            <Small className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {IDENTITY.titleShort}
            </Small>
            <span className="mt-auto flex items-center gap-1.5 pt-2">
              <MapPin className="size-3 text-subtle-foreground" />
              <Mono className="text-subtle-foreground">{IDENTITY.locationShort}</Mono>
            </span>
          </div>
        </div>

        <Label className="mt-3.5 block border-t border-border pt-3 tracking-[0.12em] text-subtle-foreground">
          {shipped} shipped &middot; {projects.length - shipped} in flight &middot; {REEL.length} films
        </Label>

        {/*
          'Hire me' asks for something and casts the reader as an employer.
          'Let's work together' is an invitation between equals, which is the
          truer description of what the button does — it opens a conversation,
          not an application form. Sized to its words rather than stretched to
          half the panel, which made two small actions look like the point of
          the whole card.
        */}
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 px-3.5 text-[0.8125rem] font-medium"
            onClick={() => dispatch({ type: 'open', id: 'contact' })}
          >
            Let&rsquo;s work together
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="type-label h-8 px-2 text-subtle-foreground"
            onClick={() => dispatch({ type: 'open', id: 'about' })}
          >
            About
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
