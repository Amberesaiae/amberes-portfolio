import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/PortfolioAccordion";
import { ExternalLink } from "lucide-react";
import { projects } from "../data/projects";
import SectionLabel from "../components/ui/SectionLabel";
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from "../styles/layoutTokens";

// Projects that should show their live URL in the services list
const SHOW_LINK_IDS = new Set(["needbe"]);

const servicesData = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Architecting high-performance web applications with a focus on technical precision and cinematic user experiences.",
    projects: projects.filter(p => ["needbe", "scoutbridge"].includes(p.id)),
  },
  {
    id: "systems",
    title: "Full-Stack Systems",
    description: "Mission-critical dashboard systems, real-time signal monitoring, and distributed node orchestration.",
    projects: projects.filter(p => ["agritech-01"].includes(p.id)),
  },
  {
    id: "technical-consulting",
    title: "Technical Consulting",
    description: "Bridging the gap between physical engineering blueprints and digital system architecture.",
    projects: projects.filter(p => ["cad-01"].includes(p.id)),
  },
];

export default function ServicesSection() {
  return (
    <section className={`bg-[#0a0a0a] ${PADX.page} ${PADY.large} border-t ${BORDER_SUBTLE}`}>
      <div className={`${CONTAINER.content} ${CENTER}`}>
        <SectionLabel number={3}>Capabilities & Projects</SectionLabel>

        <Accordion type="single" collapsible className="w-full">
          {servicesData.map((service, index) => (
            <AccordionItem key={service.id} value={service.id}>
              <AccordionTrigger>
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex items-center gap-3 shrink-0 pt-2 w-[52px] md:w-[72px]">
                    <span className="font-mono text-[10px] text-white/20">
                      ({String(index + 1).padStart(2, '0')})
                    </span>
                    <div className="hidden md:block h-[1px] w-6 bg-white/5" />
                  </div>
                  <h3 className="font-serif text-white text-2xl sm:text-3xl md:text-5xl tracking-tight group-hover:text-[#FFB000] transition-colors duration-500 uppercase pt-1">
                    {service.title}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-0 md:pl-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mt-4">
                  {/* Description */}
                  <div className="max-w-md">
                    <p className="text-[#888] text-base md:text-lg leading-relaxed italic font-serif">
                      "{service.description}"
                    </p>
                  </div>

                  {/* Project list — minimal, no images */}
                  <div className="space-y-0">
                    <p className="text-[#444] text-[9px] uppercase tracking-[0.4em] mb-6">
                      Projects // {service.projects.length} total
                    </p>
                    {service.projects.map(project => (
                      <div
                        key={project.id}
                        className="group/item flex items-center justify-between py-4 border-b border-white/5"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white text-sm font-medium uppercase tracking-wide">
                            {project.title}
                          </span>
                          <span className="text-[#444] text-[9px] font-mono uppercase tracking-[0.2em]">
                            {project.year} · {project.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          {SHOW_LINK_IDS.has(project.id) && project.url ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-[#FFB000] text-[9px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-mono hover:text-white transition-colors duration-300"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              {project.url}
                            </a>
                          ) : (
                            <span className="text-[#333] text-[9px] font-mono uppercase tracking-[0.2em]">
                              {project.status === 'in-progress' ? 'INCOMING' : project.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
