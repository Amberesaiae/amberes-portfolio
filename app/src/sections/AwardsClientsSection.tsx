import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/ui/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const awards = [
  { year: '25', org: 'Spotlight', category: 'People Choice - Social Impact' },
  { year: '25', org: 'ADC', category: 'Shortlist - Cinema' },
  { year: '24', org: 'ADC Deutschland', category: 'Silver - Brilliant Filmmaking' },
  { year: '24', org: 'Clio Awards', category: 'Bronze - Film Craft (Animation)' },
  { year: '23', org: 'D&AD', category: 'Shortlist - Animation: Characters & Creatures' },
  { year: '23', org: 'ADC Deutschland', category: 'Silver - Animation for TV/Cinema' },
  { year: '22', org: 'Webby Awards', category: 'Honoree - Animation/Motion Graphics' },
  { year: '22', org: 'Epica Awards', category: 'Shortlist' },
  { year: '21', org: 'Eurobest', category: 'Bronze - Film' },
  { year: '21', org: 'DIE KLAPPE', category: 'Shortlist - Visual Effects' },
];

const clients = ['Netto', 'DocMorris', 'Adidas', 'Flaschenpost', 'NIVEA', 'Deutsche Bahn'];

export default function AwardsClientsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Awards rows stagger
      const rows = awardsRef.current?.querySelectorAll('.award-row');
      if (rows) {
        gsap.fromTo(
          rows,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: awardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Clients
      const logos = clientsRef.current?.querySelectorAll('.client-logo');
      if (logos) {
        gsap.fromTo(
          logos,
          { y: 20, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: clientsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-10 py-20">
      {/* Awards */}
      <div ref={awardsRef} className="max-w-5xl mx-auto mb-24">
        <SectionLabel number={5}>Accolades</SectionLabel>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-white" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            AWARDS
          </h2>
          <span className="font-serif text-white text-2xl md:text-4xl">(34+)</span>
        </div>

        <div className="border-t border-[#333]">
          {awards.map((award, i) => (
            <div
              key={i}
              className="award-row grid grid-cols-12 gap-4 py-4 border-b border-[#333] text-sm"
            >
              <span className="col-span-2 text-[#888] font-semibold">{award.year}</span>
              <span className="col-span-3 text-white font-semibold">{award.org}</span>
              <span className="col-span-7 text-[#E8E6E3]">{award.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div ref={clientsRef} className="max-w-5xl mx-auto">
        <SectionLabel number={6}>Partners</SectionLabel>
        <h2
          className="font-serif text-white text-center mb-12"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          CLIENTS
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {clients.map((client) => (
            <span
              key={client}
              className="client-logo text-[#888] text-lg md:text-xl uppercase tracking-wider font-semibold hover:text-white transition-colors cursor-default"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
