import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/ui/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

interface ArtProject {
  title: string;
  description: string;
  role: string;
  images: { src: string; position: string; width: string; parallaxSpeed: number }[];
}

const artProjects: ArtProject[] = [
  {
    title: 'NIGHT RUSH',
    description: 'A high-speed dive into the night where AI-driven visuals meet raw horsepower.',
    role: 'ART DIRECTION',
    images: [
      { src: '/images/nightrush-1.jpg', position: 'left-0 top-0', width: 'w-[40%]', parallaxSpeed: 0.3 },
      { src: '/images/nightrush-2.jpg', position: 'right-[5%] top-[20%]', width: 'w-[30%]', parallaxSpeed: 0.5 },
    ],
  },
  {
    title: '911:REDLINE',
    description: 'A visual exploration of 911 velocity, emotion, and raw mechanical art, captured through AI-driven visuals.',
    role: 'ART DIRECTION',
    images: [
      { src: '/images/redline-1.jpg', position: 'left-[5%] top-[10%]', width: 'w-[25%]', parallaxSpeed: 0.4 },
      { src: '/images/redline-2.jpg', position: 'right-[10%] top-0', width: 'w-[45%]', parallaxSpeed: 0.6 },
    ],
  },
];

function ArtProjectCard({ project }: { project: ArtProject }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text
      const textEls = cardRef.current?.querySelectorAll('.animate-in');
      if (textEls) {
        gsap.fromTo(
          textEls,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Parallax images
      imageRefs.current.forEach((imgWrap, i) => {
        if (imgWrap) {
          const img = imgWrap.querySelector('img');
          if (img) {
            gsap.fromTo(
              imgWrap,
              { y: 80, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: cardRef.current,
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                },
              }
            );

            gsap.to(img, {
              y: -60 * project.images[i].parallaxSpeed,
              ease: 'none',
              scrollTrigger: {
                trigger: cardRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            });
          }
        }
      });
    }, cardRef);

    return () => ctx.revert();
  }, [project.images]);

  return (
    <div ref={cardRef} className="relative min-h-[70vh] md:min-h-[90vh] mb-16">
      {/* Scattered Images */}
      {project.images.map((img, i) => (
        <div
          key={i}
          ref={(el) => { imageRefs.current[i] = el; }}
          className={`absolute ${img.position} ${img.width} z-10`}
        >
          <img
            src={img.src}
            alt={project.title}
            className="w-full h-auto object-cover"
          />
        </div>
      ))}

      {/* Text Content */}
      <div className="relative z-20 pt-[40%] md:pt-[35%] px-6 md:px-10">
        <h3
          className="animate-in font-serif text-white mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          {project.title}
        </h3>
        <p className="animate-in text-[#E8E6E3] text-sm md:text-base max-w-md mb-3">
          {project.description}
        </p>
        <p className="animate-in text-[#888] text-xs uppercase tracking-wider">
          ({project.role})
        </p>
      </div>
    </div>
  );
}

export default function ArtDirectionSection() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20">
      <div ref={headerRef} className="px-6 md:px-10 mb-12">
        <SectionLabel number={2}>Art Directed AI</SectionLabel>
      </div>

      {artProjects.map((project) => (
        <ArtProjectCard key={project.title} project={project} />
      ))}
    </section>
  );
}
