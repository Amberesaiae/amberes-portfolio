import { ImageSlot } from '@/desktop/components/ImageSlot';
import { Eyebrow } from '@/desktop/typography/Eyebrow';
import { DisciplineList } from './DisciplineList';
import { EnvironmentTable } from './EnvironmentTable';

/** The four things he does, and the tools he does them with. */
export function AboutCraft() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-2.5">
        <ImageSlot src="/images/shipyard-welder.jpg" alt="Welding at the shipyard" ratio="1 / 1" hint="Shipyard" sizes="150px" />
        <ImageSlot src="/images/ship-piston.jpg" alt="Engine room" ratio="1 / 1" hint="Engine room" sizes="150px" />
        <ImageSlot src="/images/industrial-glow.jpg" alt="Industrial" ratio="1 / 1" hint="Industrial" sizes="150px" />
      </div>

      <section>
        <Eyebrow>Disciplines</Eyebrow>
        <DisciplineList />
      </section>

      <section>
        <Eyebrow>Environment</Eyebrow>
        <EnvironmentTable />
      </section>
    </div>
  );
}
