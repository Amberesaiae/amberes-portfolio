import { mantisTraits } from '@/components/about/aboutData';
import { Display, Label, Small } from '@/desktop/typography/Text';

/**
 * The mantis shrimp. It is the one piece of this site that is pure character,
 * so it gets a grid of its own rather than being buried in a paragraph.
 */
export function MantisTraits() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-5">
      {mantisTraits.map((trait) => (
        <li key={trait.label} className="space-y-1">
          <Display as="p" className="text-[1.375rem] text-primary">
            {trait.stat}
          </Display>
          <Label className="block text-muted-foreground/80">{trait.label}</Label>
          <Small className="text-[0.75rem] leading-relaxed text-subtle-foreground">
            {trait.desc}
          </Small>
        </li>
      ))}
    </ul>
  );
}
