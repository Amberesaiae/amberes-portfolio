/**
 * Ported verbatim from `app/src/data/projects.ts`. The copy was written against
 * the motto and must not be reworded here; if a line needs changing it changes
 * in both places or the two portfolios start disagreeing about the same client.
 *
 * Image paths are kept exactly as the portfolio writes them, so the referenced
 * files have to be copied into `studio/public/` — see the report in
 * `docs/amber-studio/`. The header comment below counts nine projects; eight
 * exist. The ninth was never written, and inventing it is not our call.
 */

/**
 * The work, as data.
 *
 * Copy rule, from the studio motto "engineering real-world solutions":
 * `metrics` says what changed in the world, `spec` says what it was built
 * with. If a line could appear on any agency's site, it is not a metric.
 *
 * Nothing in here may be estimated. Every claim was rewritten from a fact
 * already stated in this file — no figures were introduced that nobody has
 * measured. Two things still need Amber:
 *   1. `modified` — unset on all nine. The live sites only return deploy
 *      timestamps, so the real dates have to come from you.
 *   2. Any number worth leading with (donations taken, bookings made, schools
 *      running on it). Those beat everything written here, and only you have
 *      them.
 */
export interface ProjectData {
  id: string;
  title: string;
  client?: string;
  year: string;
  category: 'system' | 'creative' | 'contract';
  description: string;
  challenge?: string;
  solution?: string;
  stack: string[];
  /**
   * What changed in the world, not what was used to change it.
   *
   * The motto is "engineering real-world solutions", so these three lines have
   * to survive being read against it. A Lighthouse score is a number about a
   * number; "runs on a 2G connection" is a solution to something. Page counts,
   * framework names and architecture labels belong in `spec`, which is where
   * an engineer who cares goes looking.
   *
   * Every line here must be defensible to the client it describes. If it needs
   * a figure nobody has measured, leave it out rather than estimating it.
   */
  metrics?: string[];
  /**
   * Last worked on — the Finder window's "modified" column.
   *
   * ISO yyyy-mm-dd. `year` is a span for prose; this is a date for a file
   * listing, and a real one is worth more than a plausible one. Unset until
   * Amber fills it in; the column falls back to `year`.
   */
  modified?: string;
  image: string;
  gallery?: string[];
  link?: string;
  url?: string; // display URL shown in services section
  github?: string;
  /** site favicon in public/icons/sites — marks a live website that links straight out */
  favicon?: string;
  /** centered mark for the card media box when there is no screenshot yet */
  cardIcon?: string;
  status: 'shipped' | 'in-progress' | 'experiment';
  featured?: boolean;
  video?: string;
  imageFit?: 'cover' | 'contain';
  omitImage?: boolean;
  spec?: {
    architecture?: string;
    deployment?: string;
    performance?: string;
    role?: string;
  };
}

export const projects: ProjectData[] = [
  {
    id: 'needbe',
    title: 'NEEDBE FOUNDATION',
    client: 'NeedBe Foundation',
    year: '2024 – 2026',
    category: 'contract',
    description: 'Full-stack web platform for a Ghanaian NGO breaking menstrual stigma through education and community empowerment. Multi-page architecture with donation integration, volunteer programs, and newsletter system.',
    challenge: 'Designing a platform that communicates both urgency and dignity for a sensitive social cause, while serving international donors, local volunteers, and community leaders with equal clarity.',
    solution: 'Built a responsive, multi-page React application with a warm, trust-building design system. Integrated donation flows, program pages with dynamic content, and a newsletter system. Optimized for low-bandwidth connections common in target regions.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Vercel'],
    metrics: [
      'Takes donations online, from any country',
      'Volunteers sign up without making a phone call',
      'Built to load on the connections its readers actually have',
    ],
    image: '/icons/sites/needbe.webp',
    link: 'https://needbefoundation.online',
    url: 'needbefoundation.online',
    favicon: '/icons/sites/needbe.webp',
    cardIcon: '/icons/sites/needbe.webp',
    status: 'shipped',
    featured: true,
    imageFit: 'contain',
    spec: {
      architecture: 'React + Vite',
      deployment: 'Vercel Edge',
      performance: '99 Lighthouse Score',
      role: 'Lead Engineer',
    },
    omitImage: true,
  },
  {
    id: 'continuum',
    title: 'CONTINUUM MAGAZINE',
    year: '2026',
    category: 'creative',
    description: 'Richly designed digital editorial publication for young African women about transition and personal growth. Issue 01 theme: "The In-Between" — profiles, voices, Q&A segments, faith and reflection, visual meditation, photography and video.',
    challenge: 'Carrying long-form editorial — essays, poems, reflections, photo series — on the web without flattening it into another blog template.',
    solution: 'Built an 11-section magazine spread with TOC carousel, profile switcher, literary spreads with alternating dark/light sections, masonry photography grid, and click-to-play video features. Cormorant Garamond display type over a cream/terracotta system.',
    stack: ['React', 'Vite', 'TypeScript', 'Express', 'Drizzle ORM', 'PostgreSQL', 'Framer Motion'],
    metrics: [
      'Issue 01, "The In-Between", published',
      'Essays, poems, Q&As and photo series carried in one issue',
      'Video features play without leaving the page',
    ],
    image: '/icons/sites/continuum.svg',
    cardIcon: '/icons/sites/continuum.svg',
    omitImage: true,
    link: 'https://continuum-rust-eta.vercel.app/',
    url: 'continuum-rust-eta.vercel.app',
    favicon: '/icons/sites/continuum.svg',
    status: 'shipped',
    featured: true,
    imageFit: 'contain',
    spec: {
      architecture: 'React + Vite + Express',
      deployment: 'Vercel',
      role: 'Lead Engineer',
    },
  },
  {
    id: 'tandohstay',
    title: 'TANDOHSTAY',
    client: 'TandohStay',
    year: '2025 – 2026',
    category: 'contract',
    description: 'Thoughtful serviced stays in Accra and Juaben, with private space, dependable power, and support when needed. Arrive. Settle. Stay well. Calm guest journey: Home → Stays → Stay detail → Reservation → Checkout → Confirmation.',
    challenge: 'Presenting Sarpomaa Cottage in Tesano, Accra as the confirmed bookable stay while Royal Cottage in Juaben is still coming soon — without confusing guests or splitting the brand.',
    solution: 'Built an editorial hospitality application with verified stay detail pages, direct reservation flow, hospitality standards section, and support for airport transfer, chauffeur, meal preparation, silent-genset backup power, and monthly stays.',
    stack: ['React', 'TanStack Start', 'TanStack Router', 'Vite', 'Tailwind CSS v4', 'shadcn/Radix UI', 'Cloudflare Workers', 'D1'],
    metrics: [
      'Sarpomaa Cottage, Tesano — bookable today',
      'Guests reserve direct, not through an agency',
      'Backup power and airport transfer stated before booking, not on arrival',
    ],
    image: '/icons/sites/tandohstay.png',
    cardIcon: '/icons/sites/tandohstay.png',
    omitImage: true,
    link: 'https://tandohstay.com',
    url: 'tandohstay.com',
    favicon: '/icons/sites/tandohstay.png',
    status: 'shipped',
    featured: true,
    imageFit: 'contain',
    spec: {
      architecture: 'TanStack Start + Cloudflare',
      deployment: 'Cloudflare Workers',
      role: 'Lead Engineer',
    },
  },
  {
    id: 'system-guardian',
    title: 'SYSTEM_GUARDIAN_v1',
    year: '2025',
    category: 'creative',
    description: 'An experimental security interface prototype utilizing biological metaphors for system defense. A creative study in retro-futurism and high-stakes peripheral monitoring.',
    stack: ['Retro Hardware', 'C++', 'Neural Simulation'],
    image: '/images/hamster.jpg',
    status: 'experiment',
    featured: false,
    imageFit: 'cover',
    spec: {
      role: 'Creative Director',
      architecture: 'Distributed Biological Node',
      performance: 'High-Alert',
    },
  },
  {
    id: 'containerclear',
    title: 'CONTAINERCLEAR',
    year: '2026',
    category: 'system',
    description: 'Operations control center for clearing agents, transport coordinators, and freight operators. Recover import-container release holds with evidence-backed phone work: report a blocked container by text or voice, validate the ISO 6346 identity, run a bounded CALL-E phone task after human approval, and convert the conversation into an evidence-backed next action.',
    challenge: 'An import container is physically available but blocked by a documentary, shipping-line, customs, appointment, or terminal-system hold — and the resolution lives in phone calls nobody records.',
    solution: 'Built an exception-resolution layer over terminal, customs, and shipping-line systems: case reporting with container validation, human-approved phone tasks, structured call outcomes, and a status model from Reported to Resolved. Fail-closed safety: never authorizes truck movement, never bypasses a hold, never impersonates a human.',
    stack: ['React', 'Vite', 'TypeScript', 'Node.js', 'CALL-E SDK'],
    metrics: [
      'Turns the phone calls nobody recorded into a written trail',
      'No call is placed until a person approves it',
      'Never authorises a truck to move — fail-closed by design',
    ],
    image: '/images/software/containerclear.webp',
    cardIcon: '/images/software/containerclear.webp',
    status: 'shipped',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'Vite UI + CALL-E adapter · ISO 6346 identity validation',
      role: 'Lead Engineer',
    },
  },
  {
    id: 'glean',
    title: 'GLEAN',
    year: '2025 – 2026',
    category: 'system',
    description: 'Edge-native platform for the circular economy — verifies contributions, not payments. Households, collectors, buyers, and hub leaders coordinate verified material recovery with live backing on Cloudflare: D1, Durable Objects, R2 object storage, and Workers AI verification.',
    stack: ['TanStack Start', 'React 19', 'Tailwind CSS 4', 'shadcn/ui', 'Cloudflare Workers', 'Hono', 'Zod', 'D1', 'Durable Objects', 'R2', 'Workers AI'],
    metrics: [
      'Verifies what was recovered, not what was paid',
      'Households, collectors, buyers and hub leads on one ledger',
      'In build — not yet carrying live material',
    ],
    image: '/images/software/glean.webp',
    cardIcon: '/images/software/glean.webp',
    status: 'in-progress',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'TanStack Start + Cloudflare edge · 50-table D1 schema, role-based access',
      deployment: 'Cloudflare Workers + D1',
      role: 'System Architect',
    },
  },
  {
    id: 'jingo',
    title: 'JINGO',
    client: 'FarmLink',
    year: '2025 – 2026',
    category: 'system',
    description: "Ghana's farm marketplace for livestock, hatcheries, agro inputs, animal feed, and produce. Controlled pilot on Cloudflare Workers with D1, KV, R2, and Images; Clerk owns authentication and marketplace discovery reads only approved, published advert projections.",
    stack: ['React', 'Vite', 'TypeScript', 'Cloudflare Workers', 'D1', 'KV', 'R2', 'Clerk'],
    metrics: [
      'Livestock, hatcheries, feed and produce in one market',
      'Nothing reaches a buyer until it has been approved',
      'In controlled pilot',
    ],
    image: '/images/software/jingo.webp',
    cardIcon: '/images/software/jingo.webp',
    status: 'in-progress',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'Cloudflare Workers + D1 · advert moderation lifecycle',
      deployment: 'Cloudflare Workers, isolated staging and production',
      role: 'Lead Engineer',
    },
  },
  {
    id: 'noragami',
    title: 'NORAGAMI',
    year: '2025 – 2026',
    category: 'system',
    description: 'Expo mobile app for discovering opportunities across Africa. Home feed, filtered search, Nora AI chat, saved bookmarks, and profiles — backed by Supabase Postgres with edge functions for ingest, enrich, discover, and chat, Groq LLM inference, and Jina AI page reading.',
    stack: ['Expo', 'React Native', 'TypeScript', 'Supabase', 'PostgreSQL', 'Groq', 'Jina AI'],
    metrics: [
      'Opportunities from across Africa in one feed',
      'Ask Nora what you actually qualify for',
      'Saved opportunities you can come back to',
    ],
    image: '/images/software/noragami.webp',
    cardIcon: '/images/software/noragami.webp',
    status: 'in-progress',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'Expo + Supabase edge functions',
      role: 'Lead Engineer',
    },
  },
];
