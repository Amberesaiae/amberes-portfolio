/**
 * Assistant endpoint.
 *
 * The browser never sees a key: it posts a conversation here, this function
 * calls the model with the key from the environment, and returns the reply.
 *
 * Environment variables:
 *   OPENROUTER_API_KEY   required — https://openrouter.ai/keys
 *   OPENROUTER_MODEL     optional — defaults to a cheap, fast model
 *   SITE_URL             optional — sent to OpenRouter for attribution
 *
 * Two rules this file exists to enforce, both of which matter more than the
 * model choice:
 *
 *  1. It is GROUNDED. The system prompt is built from this repo's own data and
 *     the model is told to refuse anything not in it. A general chatbot asked
 *     "has amber worked with Kubernetes?" will happily say yes.
 *  2. It is CAPPED. Per-IP rate limit, a bounded history and a low token
 *     ceiling, because an endpoint that spends money is an endpoint someone
 *     will point a script at.
 */

import { projects } from '../src/data/projects';
import { disciplines, education, environmentItems, experience } from '../src/components/about/aboutData';
import { REEL } from '../src/desktop/data/reel';
import { IDENTITY } from '../src/desktop/config/identity';

/* ----------------------------------------------------------------- limits */

const MAX_TURNS = 12; // messages of history accepted from the client
const MAX_CHARS = 1200; // per message
const MAX_TOKENS = 500; // per reply
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 30;

/** In-memory, like api/contact.ts. Fine for one region; use KV if it grows. */
const hits = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= MAX_PER_WINDOW) return { allowed: false, reset: entry.reset };

  entry.count += 1;
  return { allowed: true };
}

/* ------------------------------------------------------------- grounding */

/** Everything the assistant is allowed to know, built from the repo itself. */
function buildKnowledge(): string {
  const work = projects
    .map((p) =>
      [
        `### ${p.title} (${p.id})`,
        `Year: ${p.year} · Category: ${p.category} · Status: ${p.status}`,
        p.client ? `Client: ${p.client}` : '',
        `Stack: ${p.stack.join(', ')}`,
        p.link ? `Live: ${p.link}` : '',
        p.description,
        p.challenge ? `Problem: ${p.challenge}` : '',
        p.solution ? `Solution: ${p.solution}` : '',
        p.metrics?.length ? `Outcomes: ${p.metrics.join('; ')}` : '',
        p.spec ? `Spec: ${Object.entries(p.spec).map(([k, v]) => `${k}=${v}`).join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n\n');

  const jobs = experience
    .map((e) => `- ${e.period} · ${e.role} at ${e.company}. ${e.description}`)
    .join('\n');

  const school = education.map((e) => `- ${e.period} · ${e.degree}, ${e.school}`).join('\n');

  const skills = disciplines.map((d) => `- ${d.title}: ${d.desc}`).join('\n');

  const stack = environmentItems.map((i) => `- ${i.key}: ${i.value}`).join('\n');

  const films = REEL.map((c) => `- ${c.title} (${c.id}) — credit: ${c.credit}`).join('\n');

  return `## Who
${IDENTITY.name}, known as ${IDENTITY.handle}. ${IDENTITY.title}. Based in ${IDENTITY.location}.
Email: ${IDENTITY.email}

## Disciplines
${skills}

## Tools he works with
${stack}

## Experience
${jobs}

## Education
${school}

## Projects
${work}

## Films in the reel
These are other people's films, credited to the filmmakers named. Do not claim he directed them.
${films}`;
}

const SYSTEM = `You are the assistant on ${IDENTITY.name}'s portfolio site.

You speak ABOUT him in the third person. You are not him and must never write as
him or in his voice.

Tone: plain, direct, concrete. No marketing language, no exclamation marks, no
"I'd be happy to". Short answers — two or three sentences unless asked for more.

Absolute rule: everything you say about him must come from the FACTS below. If
someone asks about a skill, a tool, a job, a rate or an availability that is not
in the facts, say you do not have that on the site and suggest they ask him
directly at ${IDENTITY.email}. Never guess, never infer a capability from a
related one, never invent a number.

If someone describes work they want done, help them shape it into a clear brief
— what they need, roughly when, roughly what scale — and then point them at the
contact form in the Talk window.

Off-topic questions: decline briefly and steer back to his work.

FACTS
${buildKnowledge()}`;

/* ------------------------------------------------------------------ types */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VercelRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

/* --------------------------------------------------------------- handler */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return res.status(503).json({
      message: 'The assistant is not configured yet. Use the contact form and it will reach him.',
    });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ?? 'unknown';

  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return res.status(429).json({
      message: 'That is enough questions for now. Try again later, or use the contact form.',
    });
  }

  const body = (req.body ?? {}) as { messages?: unknown };
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ message: 'No messages sent.' });
  }

  // Trust nothing from the client: shape, role, length and count are all capped.
  const messages: ChatMessage[] = body.messages
    .slice(-MAX_TURNS)
    .filter(
      (m): m is ChatMessage =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as ChatMessage).content === 'string' &&
        ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant'),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0) {
    return res.status(400).json({ message: 'No usable messages sent.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL ?? 'https://amber.dev',
        'X-Title': `${IDENTITY.handle} portfolio`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? 'google/gemini-2.0-flash-001',
        max_tokens: MAX_TOKENS,
        temperature: 0.4,
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('openrouter', response.status, detail.slice(0, 400));
      return res.status(502).json({ message: 'The assistant could not answer just now.' });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) return res.status(502).json({ message: 'The assistant returned nothing.' });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('chat', error);
    return res.status(500).json({ message: 'Something went wrong reaching the assistant.' });
  }
}
