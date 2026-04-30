import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTAINER, CENTER, PADX, PADY } from '../styles/layoutTokens';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'THE SPARK',
    description: 'Every project starts with an insight — a moment of "this could be something big." Understanding culture, behavior, and what makes people stop and feel.',
  },
  {
    number: '02',
    title: 'CONCEPT DEVELOPMENT',
    description: 'Ideas need structure. Refining the narrative, building tension, and shaping concepts that demand attention.',
  },
  {
    number: '03',
    title: 'ART DIRECTION & VISUAL STRATEGY',
    description: "Crafting the soul of the campaign — mood boards, 360° campaigns, AI-generated frames, and immersive visuals. AI accelerates the cycle, pushing boundaries in execution.",
  },
  {
    number: '04',
    title: 'EXECUTION',
    description: "From blueprint to production, precision is the standard. The last 10% makes all the difference — refining until it's unforgettable.",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = sectionRef.current?.querySelectorAll('.header-animate');
      if (headerEls) {
        gsap.fromTo(
          headerEls,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      stepsRef.current.forEach((step, i) => {
        if (step) {
          gsap.fromTo(
            step,
            { x: -40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              delay: i * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`${PADX.page} ${PADY.large} bg-[#111]`}>
      <div className={`${CONTAINER.content} ${CENTER}`}>
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex-1">
            <p className="header-animate text-[#FFB000] text-[10px] uppercase tracking-[0.4em] font-mono mb-6">
              Bringing Ideas to Life //
            </p>
            <h2 className="header-animate font-serif text-white leading-[0.95]" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
              THE <span className="italic text-[#FFB000]">PROCESS.</span>
            </h2>
          </div>
          <div className="flex-1 md:max-w-md">
            <p className="header-animate text-[#888] text-sm leading-relaxed border-l border-[#FFB000]/30 pl-6">
              A quick look into my creative process — because a great idea is just the beginning. The execution is where the soul is forged.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border-t border-b border-white/5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => { stepsRef.current[i] = el; }}
              className="group relative bg-[#111] p-10 md:p-16 hover:bg-[#161616] transition-colors duration-500 overflow-hidden"
            >
              {/* Massive background number */}
              <div className="absolute -right-4 -bottom-8 md:-right-8 md:-bottom-12 font-serif text-[120px] md:text-[180px] leading-none text-white/[0.02] group-hover:text-[#FFB000]/[0.05] group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 italic select-none">
                {step.number}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-[#FFB000] text-xs tracking-widest uppercase">
                    Phase // {step.number}
                  </span>
                  <div className="h-px w-12 bg-[#FFB000]/30" />
                </div>
                
                <h3 className="font-serif text-white text-2xl md:text-3xl mb-6 leading-tight group-hover:text-[#FFB000] transition-colors duration-500">
                  {step.title}
                </h3>
                
                <p className="text-[#888] text-sm md:text-base leading-relaxed max-w-sm group-hover:text-white/80 transition-colors duration-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
