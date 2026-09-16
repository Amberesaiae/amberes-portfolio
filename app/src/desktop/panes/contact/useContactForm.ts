import { useCallback, useState } from 'react';

export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — always empty when a person sends the form. */
  company: string;
  /** Anonymous relay: name and email are neither asked nor sent. */
  anonymous: boolean;
}

const EMPTY: ContactValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
  anonymous: false,
};

/**
 * Submission state for the contact form. The endpoint and its JSON shape are
 * unchanged from the old site; native constraint validation replaces the
 * zod + react-hook-form pair, which was three dependencies for four fields.
 */
export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = useCallback(
    (key: keyof ContactValues) => (value: string | boolean) =>
      setValues((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const submit = useCallback(async () => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        // The endpoint sends a sentence fit to read; only fall back if it did
        // not, which usually means the request never reached it at all.
        throw new Error(result.message || 'The message did not send.');
      }

      setSent(true);
      setValues(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The message did not send.');
    } finally {
      setSending(false);
    }
  }, [values]);

  const reset = useCallback(() => setSent(false), []);

  return { values, set, submit, reset, sending, sent, error };
}
