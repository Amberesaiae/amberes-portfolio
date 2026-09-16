import { Ghost, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';
import { ContactField } from './ContactField';
import type { useContactForm } from './useContactForm';

type Form = ReturnType<typeof useContactForm>;

export function ContactForm({ form }: { form: Form }) {
  const { values, set, submit, sending, error } = form;
  const anonymous = values.anonymous;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-5"
      aria-busy={sending || undefined}
    >
      <button
        type="button"
        role="switch"
        aria-checked={anonymous}
        onClick={() => set('anonymous')(!anonymous)}
        className="flex w-full items-center gap-3 rounded-lg border border-border bg-foreground/[0.03] px-3 py-2.5 text-left transition-colors hover:border-primary/40"
      >
        <Ghost className={cn('size-4 shrink-0', anonymous ? 'text-primary' : 'text-muted-foreground')} />
        <span className="min-w-0">
          <span className="type-label block">Send anonymously</span>
          <Label className="block text-subtle-foreground">
            {anonymous
              ? 'No name, no address — he cannot reply, only read.'
              : 'Skip the name and address — he can read it but not reply.'}
          </Label>
        </span>
      </button>

      {!anonymous && (
        <>
          <ContactField id="name" label="Name" value={values.name} onChange={set('name')} minLength={2} autoComplete="name" disabled={sending} />
          <ContactField id="email" label="Email" type="email" value={values.email} onChange={set('email')} autoComplete="email" disabled={sending} />
        </>
      )}
      <ContactField id="subject" label="Subject" value={values.subject} onChange={set('subject')} minLength={5} disabled={sending} />
      <ContactField id="message" label="Message" value={values.message} onChange={set('message')} minLength={10} rows={5} disabled={sending} />

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
