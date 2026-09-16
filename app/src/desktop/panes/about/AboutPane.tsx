import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { AboutCraft } from './AboutCraft';
import { AboutFormation } from './AboutFormation';
import { AboutProfile } from './AboutProfile';

const TABS = [
  { id: 'profile', label: 'Profile', Content: AboutProfile },
  { id: 'craft', label: 'Craft', Content: AboutCraft },
  { id: 'formation', label: 'Formation', Content: AboutFormation },
];

/**
 * Three short sections rather than one long scroll. The old About page ran to
 * six stacked sections; the same material in tabs is read, not skimmed past.
 */
export default function AboutPane() {
  return (
    <PaneBody>
      <Tabs defaultValue="profile" className="gap-7">
        <TabsList className="bg-white/[0.06]">
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="type-label">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ id, Content }) => (
          <TabsContent key={id} value={id}>
            <Content />
          </TabsContent>
        ))}
      </Tabs>
    </PaneBody>
  );
}
