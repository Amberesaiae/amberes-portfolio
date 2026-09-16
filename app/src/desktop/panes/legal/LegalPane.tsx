import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { Body, Display } from '@/desktop/typography/Text';
import { LEGAL } from './legalCopy';

/** Three short documents, one window. */
export default function LegalPane() {
  return (
    <PaneBody>
      <Tabs defaultValue="privacy" className="gap-6">
        <TabsList className="bg-white/[0.06]">
          {LEGAL.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="type-label">
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LEGAL.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-4">
            <Display className="text-[1.375rem]">{section.heading}</Display>
            {section.body.map((paragraph) => (
              <Body key={paragraph.slice(0, 32)}>{paragraph}</Body>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </PaneBody>
  );
}
