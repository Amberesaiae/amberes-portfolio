import { AtSign, Camera, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IDENTITY, SOCIALS } from '@/desktop/config/identity';

const ICONS = { instagram: Camera, x: AtSign } as const;

export function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-1">
      <Button asChild variant="ghost" size="sm" className="type-label">
        <a href={`mailto:${IDENTITY.email}`}>
          <Mail />
          Email
        </a>
      </Button>

      {SOCIALS.map(({ id, href, label, handle }) => {
        const Icon = ICONS[id];
        return (
          <Button key={id} asChild variant="ghost" size="sm" className="type-label">
            <a href={href} target="_blank" rel="noreferrer noopener">
              <Icon />
              {label}
              <span className="text-subtle-foreground">{handle}</span>
            </a>
          </Button>
        );
      })}
    </div>
  );
}
