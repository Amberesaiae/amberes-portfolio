import { education, experience } from '@/components/about/aboutData';
import { Eyebrow } from '@/desktop/typography/Eyebrow';
import { TimelineList } from './TimelineList';

/** How he got here: what he has done, and where he was taught. */
export function AboutFormation() {
  return (
    <div className="space-y-8">
      <section>
        <Eyebrow>Experience</Eyebrow>
        <TimelineList
          entries={experience.map((e) => ({
            period: e.period,
            heading: e.role,
            meta: e.company,
            description: e.description,
          }))}
        />
      </section>

      <section>
        <Eyebrow>Education</Eyebrow>
        <TimelineList
          entries={education.map((e) => ({
            period: e.period,
            heading: e.degree,
            meta: e.school,
          }))}
        />
      </section>
    </div>
  );
}
