/**
 * Contact form endpoint.
 *
 * Takes the four fields, validates them, and emails them to CONTACT_EMAIL via
 * Resend. Three things about the previous version are worth recording, because
 * each of them was a real fault rather than a style preference:
 *
 * 1. It sent `from: noreply@ambersystems.dev`, a domain not verified with
 *    Resend — which rejects any send from an unverified sender. Every
 *    submission failed, whatever else was configured. The sender now comes from
 *    CONTACT_FROM so it can be pointed at a domain that is actually verified,
 *    and falls back to Resend's own onboarding address, which works with no
 *    domain setup at all (it can only deliver to the account owner's address,
 *    which is exactly this use case).
 *
 * 2. It interpolated the sender's name, subject and message straight into an
 *    HTML email. Anyone could have put markup — including links — into the mail
 *    landing in the inbox. Every field is escaped now.
 *
 * 3. On any Resend failure it silently retried through SendGrid, so the error
 *    that surfaced was SendGrid's missing key rather than the real cause. One
 *    provider, and the actual reason is logged.
 *
 * Environment:
 *   RESEND_API_KEY   required — https://resend.com/api-keys
 *   CONTACT_EMAIL    where mail lands (default: isaiahamber5@gmail.com)
 *   CONTACT_FROM     verified sender (default: Resend's onboarding address)
 */

import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(5).max(200),
  message: z.string().trim().min(10).max(5000),
  /* Honeypot: a real person never fills a field they cannot see. */
  company: z.string().max(0).optional(),
});

type ContactData = z.infer<typeof schema>;

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resets: number }>();

/**
 * Per-IP throttle. In-memory, so it is per-instance rather than global — good
 * enough to blunt a script, not a substitute for a real limiter.
 */
function withinRate(ip: string): { ok: boolean; resets?: number } {
  const now = Date.now();
  const seen = hits.get(ip);

  if (!seen || now > seen.resets) {
    hits.set(ip, { count: 1, resets: now + WINDOW_MS });
    return { ok: true };
  }
  if (seen.count >= MAX_PER_WINDOW) return { ok: false, resets: seen.resets };

  seen.count++;
  return { ok: true };
}

/** Anything a sender controls is escaped before it goes anywhere near HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

async function send(data: ContactData): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');

  const to = process.env.CONTACT_EMAIL || 'isaiahamber5@gmail.com';
  const from = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
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
    // The body carries Resend's actual reason — an unverified sender domain
    // reads as "domain is not verified", which is the failure worth seeing.
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405);

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const rate = withinRate(ip);
  if (!rate.ok) {
    return json(
      { error: 'RATE_LIMIT', message: 'Too many messages. Try again in a little while.' },
      429,
      { 'Retry-After': '3600' },
    );
  }

  let data: ContactData;
  try {
    data = schema.parse(await req.json());
  } catch {
    return json({ error: 'VALIDATION', message: 'Check the fields and try again.' }, 400);
  }

  /* Honeypot filled: accept it so the bot stops retrying, and drop it. */
  if (data.company) return json({ success: true }, 200);

  try {
    await send(data);
    return json({ success: true }, 200);
  } catch (err) {
    console.error('contact:', err instanceof Error ? err.message : err);
    return json(
      { error: 'SEND_FAILED', message: 'The message did not send. Email me directly instead.' },
      502,
    );
  }
}

export const config = { runtime: 'edge' };
