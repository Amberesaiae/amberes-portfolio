import { Eyebrow } from '@/desktop/typography/Eyebrow';
import { DisciplineList } from './DisciplineList';
import { EnvironmentTable } from './EnvironmentTable';

/**
 * The four things he does, and the tools he does them with.
 *
 * No photographs here any more. Three decorative squares of shipyard and engine
 * room sat above the disciplines and pushed the actual answer below the fold,
 * which is the opposite of what this tab is for.
 */
export function AboutCraft() {
  return (
    <div className="space-y-8">
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
