import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Globe, Briefcase, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '../components/Footer';
import { projects, type ProjectData } from '../data/projects';
import ImageModal from '../components/ui/ImageModal';
import Meta from '../components/Meta';
import PageWrapper from '../components/PageWrapper';
import ProjectCard from '../components/portfolio/ProjectCard';
import ProjectDetailModal from '../components/portfolio/ProjectDetailModal';
import ScrollIndicator from '../components/ui/ScrollIndicator';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>('system');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [modalData, setModalData] = useState<{ isOpen: boolean, imgSrc: string, title: string }>({
    isOpen: false,
    imgSrc: '',
    title: ''
  });
  const tabContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'system', icon: <Database size={16} />, label: 'SYSTEM ARCHITECTURES', mobileLabel: 'SYSTEMS', color: '#FFB000' },
    { id: 'creative', icon: <Globe size={16} />, label: 'VISUAL EXPERIENCES', mobileLabel: 'VISUAL', color: '#0066FF' },
    { id: 'contract', icon: <Briefcase size={16} />, label: 'COMMERCIAL WORKS', mobileLabel: 'COMMERCIAL', color: '#00FF99' },
  ];

  const filteredProjects = projects.filter(p => p.category === activeTab);
  return (
    <PageWrapper bgImage="/images/blueprint-bg.jpg">
      <main className={`relative ${PADY.header} min-h-screen`}>
        <Meta 
          title="Terminal Archive // Projects" 
          description="Comprehensive archive of technical records, marine engineering blueprints, and creative system designs."
        />

        <div className={`${CONTAINER.wide} ${CENTER} ${PADX.page}`}>
          {/* Header Area */}
          <div className={`relative mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b ${BORDER_SUBTLE} pb-6`}>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[#FFB000]/50">
                <div className="w-1.5 h-1.5 bg-[#FFB000] rounded-full" />
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] md:tracking-[0.6em] font-mono font-black">Authorized_Access // Node_04</p>
              </div>
              
              <h1 className="space-y-1" aria-label="Project Archive">
                <span className="block font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[0.8] tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  PROJECT
                </span>
                <span className="block font-serif text-2xl sm:text-3xl md:text-4xl text-[#FFCC00] italic leading-[0.8] tracking-tighter uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
                  ARCHIVE.
                </span>
              </h1>
            </div>

            <div className="w-full lg:w-80 space-y-4 bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#FFB000]/40" />
              <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-[#FFB000]/40" />
              
              <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.3em] text-[#ccc]">
                <span>INDEX_CAPACITY_LOAD</span>
                <span className="text-[#FFB000]">65.0%</span>
              </div>

              <div className="flex gap-1 h-2.5">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 h-full transition-colors duration-1000",
                      i < 13 ? "bg-[#FFB000]" : "bg-white/5"
                    )} 
                  />
                ))}
              </div>

              <div className="flex justify-between items-start gap-6 md:gap-12 text-white/55 font-mono text-[8px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
                <div className="space-y-1">
                  <p className="text-[#ccc]">Records</p>
                  <p className="text-white font-bold">{projects.length}_FILES_LOGGED</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[#ccc]">Kernel</p>
                  <p className="text-white font-bold">V4.2.1_STABLE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Tab Navigation */}
          <div className="relative mb-8">
            <div ref={tabContainerRef} className="overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 min-w-max pb-4" role="tablist" aria-label="Project categories">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    id={`project-tab-${section.id}`}
                    onClick={() => setActiveTab(section.id)}
                    role="tab"
                    aria-selected={activeTab === section.id}
                    aria-controls={`project-panel-${section.id}`}
                    className={cn(
                      "relative flex min-h-11 items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-4 transition-all duration-500",
                      activeTab === section.id 
                        ? "text-[#FFB000]" 
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {activeTab === section.id && (
                      <motion.div 
                        layoutId="tabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFB000] shadow-[0_0_10px_#FFB000]"
                        transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">{section.icon}</div>
                    <span className="relative z-10 text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.4em] font-mono font-black whitespace-nowrap">
                      <span className="hidden sm:inline">{section.label}</span>
                      <span className="sm:hidden">{section.mobileLabel}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <ScrollIndicator containerRef={tabContainerRef} />
          </div>

          {/* Projects Grid */}
          <div className="mb-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                id={`project-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`project-tab-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <ProjectCard 
                          project={project} 
                          onClick={() => setSelectedProject(project)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center space-y-8 border border-white/5">
                    <div className="relative">
                      <Activity className="text-[#FFB000]/10 w-20 h-20" />
                      <div className="absolute inset-0 border border-dashed border-[#FFB000]/20 rounded-full" />
                    </div>
                    <p className="text-white/55 font-mono text-xs tracking-[0.8em] uppercase">No_Access_Granted</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={`pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t ${BORDER_SUBTLE}`}>
            <div className="space-y-3">
              <p className="text-[#FFB000] text-[9px] uppercase tracking-[0.35em] md:tracking-[0.6em] font-mono font-black">END_OF_MANIFESTO</p>
              <p className="text-white/45 text-[8px] font-mono max-w-xs uppercase leading-relaxed">All records contained herein are property of Amber Systems. Distribution without clearance is strictly prohibited.</p>
            </div>
          </div>
        </div>

        <Footer showFull={false} />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Technical Detail Lightbox */}
        <ImageModal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ ...modalData, isOpen: false })}
          src={modalData.imgSrc}
          alt={modalData.title}
          title={modalData.title}
        />
      </main>
    </PageWrapper>
  );
}
