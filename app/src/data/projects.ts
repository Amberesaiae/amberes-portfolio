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
    id: 'scoutbridge',
    title: 'SCOUTBRIDGE',
    client: 'Internal Tool',
    year: '2026',
    category: 'system',
    description: 'Military-grade asset intelligence dashboard for ingesting, classifying, and relaying icon packs and design assets across distributed nodes. Real-time signal monitoring with industrial UI.',
    challenge: 'Building a system that handles high-volume asset ingestion with real-time status tracking, while maintaining sub-50ms latency across relay clusters and zero data loss on failed transfers.',
    solution: 'Designed a mission-critical dashboard architecture with modular intelligence modules, relay queue management, and live signal waveform monitoring. The industrial UI language communicates system health at a glance.',
    stack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'REST API', 'GSAP'],
    metrics: ['42ms signal latency', '94% signal integrity', 'Real-time relay monitoring'],
    image: '/images/project-scoutbridge-1.jpg',
    imageFit: 'contain',
    gallery: ['/images/project-scoutbridge-1.jpg', '/images/project-scoutbridge-2.jpg'],
    link: 'https://scoutbridge.com',
    url: 'scoutbridge.com',
    status: 'shipped',
    featured: true,
    spec: {
      architecture: 'Real-time Node.js + Socket.io',
      deployment: 'AWS EC2 Cluster',
      performance: '<50ms Latency',
      role: 'System Architect',
    },
    omitImage: false,
  },
  {
    id: 'ecommerce-01',
    title: 'E-COMMERCE PLATFORM',
    client: 'Incoming',
    year: '2026',
    category: 'contract',
    description: 'A high-performance storefront and backend system built for conversion. Product catalogue management, checkout flows, inventory sync, and analytics dashboards designed for scale.',
    stack: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'PostgreSQL', 'Vercel'],
    image: '/images/ecommerce.jpg',
    status: 'in-progress',
    featured: true,
    imageFit: 'cover',
    spec: {
      architecture: 'Next.js + Headless Commerce',
      deployment: 'Vercel Edge',
      role: 'Lead Engineer',
    },
  },
  {
    id: 'lampfarms',
    title: 'LAMPFARMS',
    client: 'AgriTech',
    year: '2025 – 2026',
    category: 'system',
    description: 'Integrated farm management system powered by FastAPI Python state machine and LP optimization engine. Delivers professional-grade feed formulation, real-time monitoring of feed stock, water quality, health metrics, vaccination schedules, and comprehensive financial tracking. Monitors expenses, ROI, losses, and profitability—the complete solution every modern farmer needs.',
    challenge: 'Poultry farmers struggle with fragmented tools for feed management, health monitoring, and financial tracking. Manual calculations lead to suboptimal feed formulations, missed vaccinations, and poor visibility into farm profitability.',
    solution: 'Built an all-in-one platform with a linear programming optimizer for feed formulation, real-time IoT sensor integration for monitoring, automated vaccination reminders, and financial dashboards that track every expense and revenue stream. The FastAPI backend ensures sub-second response times for critical farm decisions.',
    stack: ['FastAPI', 'Python', 'LP Optimizer', 'PostgreSQL', 'React', 'IoT Sensors', 'WebSockets'],
    metrics: ['30% feed cost reduction', 'Real-time health alerts', '95% vaccination compliance'],
    image: '/images/agritech.jpg',
    status: 'in-progress',
    featured: true,
    imageFit: 'cover',
    spec: {
      architecture: 'FastAPI + State Machine',
      deployment: 'AWS + Edge Computing',
      performance: '<500ms optimization',
      role: 'System Architect',
    },
  },
  {
    id: 'cad-01',
    title: 'MECHANICAL_BLUEPRINT',
    client: 'Industrial Design',
    year: '2025',
    category: 'creative',
    description: 'Precision CAD modeling and structural fabrication blueprints for marine engine components. Bridging mechanical engineering precision with digital architectural workflows.',
    stack: ['AutoCAD', 'SolidWorks', 'Fusion 360', 'Naval Architecture'],
    metrics: ['0.01mm Tolerance', 'ISO 9001 Standards', 'Marine Certified'],
    image: '/images/tech-macro-blueprint.jpg',
    status: 'shipped',
    featured: false,
    imageFit: 'cover',
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
];

export const services = [
  { title: 'Web Development', count: 3 },
  { title: 'UI/UX & Product Design', count: 4 },
  { title: 'Full-Stack Systems', count: 2 },
  { title: 'Technical Consulting', count: 1 },
];
