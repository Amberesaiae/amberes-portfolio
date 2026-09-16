import { projects } from '../src/data/projects';
import {
  disciplines,
  education,
  environmentItems,
  experience,
} from '../src/components/about/aboutData';
import { REEL } from '../src/desktop/data/reel';
import { IDENTITY } from '../src/desktop/config/identity';
import type { Env } from './index';
import { overBudget, rateLimitedResponse } from './ratelimit';

/**
 * Assistant endpoint, as a Worker route.
 *
 * Same story as contact.ts: the frontend posts here, but `api/chat.ts` is a
 * Vercel edge function that never runs on this site — every question fell
 * through to the Worker's 404, and the UI printed its hardcoded fallback
 * ("That did not go through..."). This is the same handler, ported: same
 * grounding, same caps, rate limit via the shared overBudget helper.
 *
 * Secrets/env, set with `wrangler secret put` / [vars]:
 *   OPENROUTER_API_KEY   required
 *   OPENROUTER_MODEL     optional — defaults to a cheap, fast model
 *   SITE_URL             optional — sent to OpenRouter for attribution
 */

const MAX_TURNS = 12; // messages of history accepted from the client
const MAX_CHARS = 1200; // per message
const MAX_TOKENS = 500; // per reply

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

function systemPrompt(): string {
  return `You are the assistant on ${IDENTITY.name}'s portfolio site.

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
}

export async function handleChat(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (url.pathname !== '/api/chat') return null;
  if (request.method !== 'POST') {
    return Response.json({ message: 'Method not allowed' }, { status: 405 });
  }

  // Thirty an hour per address is generous for a person and useless for a script.
  if (overBudget(request, 'chat', 30, 3600)) return rateLimitedResponse();

  const key = env.OPENROUTER_API_KEY;
  if (!key) {
    return Response.json(
      { message: 'The assistant is not configured yet. Use the contact form and it will reach him.' },
      { status: 503 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = (await request.json()) as { messages?: unknown };
  } catch {
    return Response.json({ message: 'No messages sent.' }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ message: 'No messages sent.' }, { status: 400 });
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
    return Response.json({ message: 'No usable messages sent.' }, { status: 400 });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.SITE_URL ?? 'https://amberesaiae.space',
        'X-Title': `${IDENTITY.handle} portfolio`,
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL ?? 'google/gemini-2.0-flash-001',
        max_tokens: MAX_TOKENS,
        temperature: 0.4,
        messages: [{ role: 'system', content: systemPrompt() }, ...messages],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('openrouter', response.status, detail.slice(0, 400));
      return Response.json({ message: 'The assistant could not answer just now.' }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) return Response.json({ message: 'The assistant returned nothing.' }, { status: 502 });

    return Response.json({ reply });
  } catch (error) {
    console.error('chat', error);
    return Response.json({ message: 'Something went wrong reaching the assistant.' }, { status: 500 });
  }
}
