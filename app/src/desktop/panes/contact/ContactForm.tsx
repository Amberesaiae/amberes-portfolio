import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactField } from './ContactField';
import type { useContactForm } from './useContactForm';

type Form = ReturnType<typeof useContactForm>;

export function ContactForm({ form }: { form: Form }) {
  const { values, set, submit, sending, error } = form;

  return (
    <form
      noValidate={false}
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-5"
    >
      <ContactField id="name" label="Name" value={values.name} onChange={set('name')} minLength={2} autoComplete="name" />
      <ContactField id="email" label="Email" type="email" value={values.email} onChange={set('email')} autoComplete="email" />
      <ContactField id="subject" label="Subject" value={values.subject} onChange={set('subject')} minLength={5} />
      <ContactField id="message" label="Message" value={values.message} onChange={set('message')} minLength={10} rows={5} />

      {error && (
        <p role="alert" className="type-small text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={sending} className="type-label w-full">
        {sending ? 'Sending…' : 'Send'}
        {!sending && <Send />}
      </Button>
    </form>
  );
}
