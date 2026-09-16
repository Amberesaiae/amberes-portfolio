import { disciplines } from '@/components/about/aboutData';
import { Mono, Small, Title } from '@/desktop/typography/Text';

export function DisciplineList() {
  return (
    <ul className="space-y-5">
      {disciplines.map((d) => (
        <li key={d.number} className="flex gap-4">
          <Mono className="shrink-0 pt-0.5 text-subtle-foreground">{d.number}</Mono>
          <div className="space-y-1">
            <Title className="text-[0.95rem]">{d.title}</Title>
            <Small>{d.desc}</Small>
          </div>
        </li>
      ))}
    </ul>
  );
}
