import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactField } from './ContactField';
import type { useContactForm } from './useContactForm';

type Form = ReturnType<typeof useContactForm>;

export function ContactForm({ form }: { form: Form }) {
  const { values, set, submit, sending, error } = form;

  return (
    <form
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

      {/*
        Honeypot. Hidden from sight and from screen readers, and skipped by the
        tab key, so no person can reach it — a bot filling every input gives
        itself away. aria-hidden + tabIndex rather than display:none, because
        some bots skip fields that are not rendered at all.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => set('company')(e.target.value)}
        />
      </div>

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
