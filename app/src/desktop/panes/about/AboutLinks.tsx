import { ArrowUpRight, AtSign, Camera, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOCIALS } from '@/desktop/config/identity';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';

const ICONS = { instagram: Camera, x: AtSign } as const;

export function AboutLinks() {
  const dispatch = useDesktopDispatch();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        className="type-label"
        onClick={() => dispatch({ type: 'open', id: 'contact' })}
      >
        <Mail />
        Get in touch
      </Button>

      {SOCIALS.map(({ id, href, label, handle }) => {
        const Icon = ICONS[id];
        return (
          <Button key={id} asChild variant="ghost" size="sm" className="type-label">
            <a href={href} target="_blank" rel="noreferrer noopener">
              <Icon />
              {label}
              {/* The handle, not just the platform — it is the thing worth
                  knowing, and it makes the link checkable at a glance. */}
              <span className="text-subtle-foreground">{handle}</span>
              <ArrowUpRight />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
