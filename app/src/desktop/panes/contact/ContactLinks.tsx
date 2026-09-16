import { AtSign, Camera, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IDENTITY, PHONES, SOCIALS } from '@/desktop/config/identity';

const ICONS = { instagram: Camera, x: AtSign } as const;

/**
 * Every way to reach him, in the order he would rather be reached.
 *
 * The phone numbers are `tel:` links, so on a phone they dial and on a desktop
 * they are still selectable text — which is what someone copying a number into
 * WhatsApp actually needs.
 */
export function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-1">
      <Button asChild variant="ghost" size="sm" className="type-label">
        <a href={`mailto:${IDENTITY.email}`}>
          <Mail />
          Email
        </a>
      </Button>

      {PHONES.map(({ href, label }) => (
        <Button key={href} asChild variant="ghost" size="sm" className="type-label">
          <a href={href}>
            <Phone />
            {label}
          </a>
        </Button>
      ))}

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
