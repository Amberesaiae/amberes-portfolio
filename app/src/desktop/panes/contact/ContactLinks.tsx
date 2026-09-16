import { AtSign, Camera, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LINKS = [
  { href: 'mailto:isaiahamber5@gmail.com', label: 'Email', Icon: Mail, external: false },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Camera, external: true },
  { href: 'https://x.com', label: 'X', Icon: AtSign, external: true },
];

export function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-1">
      {LINKS.map(({ href, label, Icon, external }) => (
        <Button key={label} asChild variant="ghost" size="sm" className="type-label">
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            <Icon />
            {label}
          </a>
        </Button>
      ))}
    </div>
  );
}
