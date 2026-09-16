import { overBudget, rateLimitedResponse } from './ratelimit';
import type { Env } from './index';

/**
 * The contact form, as a Worker route.
 *
 * This exists because the form could not have worked. `api/contact.ts` is a
 * Vercel edge function, and this site is served by the Worker in index.ts —
 * which had no /api/contact route at all, so every submission fell through to
 * the 404 at the bottom of the fetch handler. Nothing about the key or the
 * email provider mattered until this was here.
 *
 * Secrets, set with `wrangler secret put`:
 *   RESEND_API_KEY   required
 *   CONTACT_EMAIL    optional, defaults below
 *   CONTACT_FROM     optional, defaults to Resend's onboarding sender
 */

interface ContactBody {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
}

interface Clean {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Anything a sender controls is escaped before it goes near HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validate(body: ContactBody): Clean | null {
  const name = str(body.name);
  const email = str(body.email);
  const subject = str(body.subject);
  const message = str(body.message);

  if (name.length < 2 || name.length > 100) return null;
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (subject.length < 5 || subject.length > 200) return null;
  if (message.length < 10 || message.length > 5000) return null;

  return { name, email, subject, message };
}

export async function handleContact(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (url.pathname !== '/api/contact') return null;
  if (request.method !== 'POST') {
    return Response.json({ error: 'method_not_allowed' }, { status: 405 });
  }

  // Five an hour per address is generous for a person and useless for a script.
  if (overBudget(request, 'contact', 5, 3600)) return rateLimitedResponse();

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return Response.json({ message: 'Check the fields and try again.' }, { status: 400 });
  }

  /* Honeypot filled: accept it so the bot stops retrying, and drop it. */
  if (str(body.company)) return Response.json({ success: true });

  const data = validate(body);
  if (!data) {
    return Response.json({ message: 'Check the fields and try again.' }, { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return Response.json(
      { message: 'The message did not send. Email me directly instead.' },
      { status: 503 },
    );
  }

  const to = env.CONTACT_EMAIL ?? 'isaiahamber5@gmail.com';
  const from = env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      /* A text part alongside the HTML — mail without one scores as spam. */
      text: `${data.name} <${data.email}>\n${data.subject}\n\n${data.message}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:600px">
  <p style="margin:0 0 4px"><strong>${esc(data.name)}</strong>
     &lt;${esc(data.email)}&gt;</p>
  <p style="margin:0 0 16px;color:#666">${esc(data.subject)}</p>
  <div style="white-space:pre-wrap;line-height:1.6;padding:16px;
              background:#f6f6f6;border-left:3px solid #d64f00">${esc(data.message)}</div>
  <p style="margin-top:16px;font-size:12px;color:#888">
    Reply to this email to answer ${esc(data.name)} directly.</p>
</div>`,
    }),
  });

  if (!res.ok) {
    // Resend's body carries the real reason — an unverified sender domain
    // reads as "domain is not verified", which is the one worth seeing.
    console.error('contact: resend', res.status, await res.text());
    return Response.json(
      { message: 'The message did not send. Email me directly instead.' },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
