export const disciplines = [
  {
    number: '01',
    title: 'Marine Engineering',
    desc: 'Propulsion systems, engine room operations, auxiliary machinery, and vessel maintenance across international waters.',
  },
  {
    number: '02',
    title: 'Welding & Fabrication',
    desc: 'Structural and industrial welding — joining metal with precision, heat, and an understanding of material behaviour under stress.',
  },
  {
    number: '03',
    title: 'Web Development',
    desc: 'Designing and building digital experiences that are clean, functional, and built to last — the same standard I hold for everything I make.',
  },
  {
    number: '04',
    title: 'Arts & Letters',
    desc: 'Where the heart leads. Literature, music, and the belief that every technical system is ultimately a human story.',
  },
] as const;

export const environmentItems = [
  { key: 'FRONTEND', value: 'React · TypeScript · Next.js · UI/UX Design' },
  { key: 'BACKEND', value: 'Node.js · REST APIs · PostgreSQL · Prisma' },
  { key: 'DEVOPS', value: 'Docker · Kubernetes · CI/CD pipelines' },
  { key: 'SYSTEMS', value: 'Bash scripting · Arch Linux · Shell automation' },
  { key: 'DATA', value: 'Data analysis · Python scripting · Querying' },
  { key: 'CRAFT', value: 'Git workflows · documentation · Agile' },
] as const;

export const mantisTraits = [
  { stat: '3,000 N', label: 'Strike Force', desc: 'Power is about precision and timing.' },
  { stat: '16', label: 'Colour Receptors', desc: 'Perceives dimensions of reality invisible to others.' },
  { stat: '∞', label: 'Self-Reliance', desc: 'Independence is not isolation — it is capability.' },
  { stat: '400M', label: 'Years of Refinement', desc: 'Longevity comes from getting the fundamentals right.' },
] as const;

export const education = [
  {
    period: '2016 – 2019',
    school: "St. Peter's SHS, Kwahu Nkwatia",
    degree: 'General Science',
  },
  {
    period: '2019 – 2023',
    school: 'Kwame Nkrumah University of Science & Technology (KNUST)',
    degree: 'B.Sc. Marine Engineering',
  },
  {
    period: '2026',
    school: 'Regional Maritime University',
    degree: 'Bridging Course & STCW Mandatory Certificates',
  },
] as const;

export const experience = [
  {
    period: '2022 – 2023',
    role: 'MARINE ENGINEERING INTERN',
    company: 'PSC Tema Shipyard',
    description:
      'Worked on 4 vessels — Kota Dahlia, Busy Gator, MV Duke, and an Offshore Support Vessel. Engine overhauls, propulsion system maintenance, and auxiliary machinery repairs.',
  },
  {
    period: '2023 – 2024',
    role: 'PHYSICS TUTOR',
    company: 'National Service Posting',
    description:
      'Taught physics at the senior high school level. Developed lesson plans, conducted practical demonstrations, and prepared students for examinations.',
  },
  {
    period: '2026',
    role: 'WELDING & FABRICATION INTERN',
    company: 'Precision Quality',
    description:
      'Hands-on training in structural welding and metal fabrication. Focus on precision joints, material behaviour under heat, and industrial safety standards.',
  },
] as const;
