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
  metrics?: string[];
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
    metrics: ['7+ pages shipped', 'Mobile-first architecture', 'Donation flow integrated'],
    image: '/images/project-needbe-1.png',
    gallery: ['/images/project-needbe-1.png', '/images/project-needbe-2.png', '/images/project-needbe-3.png'],
    link: 'https://needbefoundation.online',
    url: 'needbefoundation.online',
    favicon: '/icons/sites/needbe.webp',
    status: 'shipped',
    featured: true,
    imageFit: 'cover',
    spec: {
      architecture: 'React + Vite',
      deployment: 'Vercel Edge',
      performance: '99 Lighthouse Score',
      role: 'Lead Engineer',
    },
    omitImage: false,
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
    metrics: ['11-section cover flow', 'Profiles + voices + video', 'Editorial design system'],
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
    metrics: ['Direct reservation flow', 'Sarpomaa Cottage live', 'Monthly-stay support'],
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
    metrics: ['ISO 6346 validation', 'Human-approved phone tasks', 'Reported → Resolved status model'],
    image: '/images/software/containerclear.png',
    status: 'shipped',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'Vite UI + CALL-E adapter',
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
    metrics: ['50-table production schema', 'Role-based access', 'Edge-native verification'],
    image: '/images/software/glean-512.png',
    status: 'in-progress',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'TanStack Start + Cloudflare edge',
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
    metrics: ['Advert moderation lifecycle', 'Staging/production isolation', 'Canonical pilot catalogue'],
    image: '/images/software/jingo.webp',
    status: 'in-progress',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'Cloudflare Workers + D1',
      deployment: 'Cloudflare Workers',
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
    metrics: ['Feed + search + chat', 'Bookmark persistence', 'AI-enriched listings'],
    image: '/images/software/noragami.png',
    status: 'in-progress',
    featured: false,
    imageFit: 'contain',
    spec: {
      architecture: 'Expo + Supabase edge functions',
      role: 'Lead Engineer',
    },
  },
];

export const services = [
  { title: 'Web Development', count: 3 },
  { title: 'UI/UX & Product Design', count: 4 },
  { title: 'Full-Stack Systems', count: 2 },
  { title: 'Technical Consulting', count: 1 },
];
