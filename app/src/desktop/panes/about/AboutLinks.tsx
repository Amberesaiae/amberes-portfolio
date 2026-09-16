import { ArrowUpRight, AtSign, Camera, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';

const EXTERNAL = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: Camera },
  { href: 'https://x.com', label: 'X', Icon: AtSign },
];

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

      {EXTERNAL.map(({ href, label, Icon }) => (
        <Button key={label} asChild variant="ghost" size="sm" className="type-label">
          <a href={href} target="_blank" rel="noreferrer noopener">
            <Icon />
            {label}
            <ArrowUpRight />
          </a>
        </Button>
      ))}
    </div>
  );
}
