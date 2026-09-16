import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { Body, Display } from '@/desktop/typography/Text';
import { ContactAvailability } from './ContactAvailability';
import { ContactForm } from './ContactForm';
import { ContactLinks } from './ContactLinks';
import { useContactForm } from './useContactForm';

export default function ContactPane() {
  const form = useContactForm();

  if (form.sent) {
    return (
      <PaneBody className="flex h-full flex-col items-start justify-center gap-4">
        <Display>Sent.</Display>
        <Body>Got it. I answer everything, usually within a day or two.</Body>
        <Button variant="outline" size="sm" className="type-label" onClick={form.reset}>
          Write another
        </Button>
      </PaneBody>
    );
  }

  return (
    <PaneBody className="space-y-7">
      <Body>
        Work, collaboration, or a question about something on this site — all of it lands in the
        same inbox.
      </Body>

      <ContactAvailability />

      <ContactForm form={form} />

      <Separator />

      <ContactLinks />
    </PaneBody>
  );
}
