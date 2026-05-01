import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { ProjectData } from '../../data/projects';
import { cn } from '@/lib/utils';

interface ProjectDetailModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const gallery = project?.gallery ?? [];

  // Detect if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0); // Reset to first image when modal opens
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Preload gallery images
  useEffect(() => {
    if (!project?.gallery || project.gallery.length <= 1) return;
    
    project.gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [project?.gallery]);

  // Auto-swipe for gallery images
  useEffect(() => {
    if (gallery.length <= 1 || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === gallery.length - 1 ? 0 : prev + 1
      );
    }, 6000); // Change image every 6 seconds (slower)

    return () => clearInterval(interval);
  }, [gallery.length, prefersReducedMotion]);

  // Keyboard navigation for images
  useEffect(() => {
    if (!isOpen || gallery.length <= 1) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImageIndex((prev) => 
          prev === 0 ? gallery.length - 1 : prev - 1
        );
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImageIndex((prev) => 
          prev === gallery.length - 1 ? 0 : prev + 1
        );
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setCurrentImageIndex(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        setCurrentImageIndex(gallery.length - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gallery.length]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    
    const modal = modalRef.current;
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    modal.addEventListener('keydown', handleTab);
    firstElement?.focus();
    
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Early return AFTER all hooks
  if (!project) return null;

  const hasMultipleImages = gallery.length > 1;
  const currentImage = hasMultipleImages 
    ? gallery[currentImageIndex] 
    : project.image;

  const nextImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => 
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl md:max-w-4xl bg-[#0a0a0a] border border-white/10 shadow-2xl max-h-[85vh] overflow-hidden rounded-sm"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[110] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-white/20 bg-black/80 backdrop-blur-sm hover:border-[#FFB000] hover:text-[#FFB000] transition-all group focus-visible:outline-2 focus-visible:outline-[#FFB000] focus-visible:outline-offset-2 rounded-sm"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Screen reader announcement for image changes */}
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                  {hasMultipleImages && `Image ${currentImageIndex + 1} of ${gallery.length}: ${project.title}`}
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
                  {/* Hero Image with Swipe */}
                  {!project.omitImage && (
                    <div className="relative w-full bg-[#050505] overflow-hidden flex items-center justify-center group/image" style={{ maxHeight: '40vh' }}>
                      <AnimatePresence initial={false}>
                        <motion.img
                          key={currentImageIndex}
                          src={currentImage}
                          alt={project.title}
                          className="w-full h-auto object-contain absolute inset-0"
                          style={{ maxHeight: '40vh' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-40 pointer-events-none z-10" />

                      {/* Navigation Arrows */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black/60 border border-white/20 hover:border-[#FFB000] hover:bg-[#FFB000]/20 transition-all md:opacity-0 md:group-hover/image:opacity-100 opacity-100 focus-visible:outline-2 focus-visible:outline-[#FFB000] focus-visible:outline-offset-2"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5 text-white" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black/60 border border-white/20 hover:border-[#FFB000] hover:bg-[#FFB000]/20 transition-all md:opacity-0 md:group-hover/image:opacity-100 opacity-100 focus-visible:outline-2 focus-visible:outline-[#FFB000] focus-visible:outline-offset-2"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </button>

                          {/* Image Indicators */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {gallery.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={cn(
                                  "h-2 md:h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FFB000] focus-visible:outline-offset-2",
                                  index === currentImageIndex 
                                    ? "bg-[#FFB000] w-7 md:w-6" 
                                    : "bg-white/30 w-2 md:w-1.5 hover:bg-white/50"
                                )}
                                aria-label={`Go to image ${index + 1}`}
                                aria-current={index === currentImageIndex ? 'true' : 'false'}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="px-5 pt-8 pb-5 md:p-7 space-y-6">
                    {/* Header */}
                    <div className="space-y-3 pr-8 sm:pr-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h2 id="modal-title" className="font-serif text-2xl md:text-3xl text-white uppercase tracking-tight leading-tight">
                            {project.title}
                          </h2>
                          <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                            <span>{project.year}</span>
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            <span>{project.category}</span>
                            {project.client && (
                              <>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <span>{project.client}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 border flex-shrink-0",
                          project.status === 'shipped' 
                            ? "border-[#00FF99]/30 text-[#00FF99] bg-[#00FF99]/5" 
                            : "border-[#FFB000]/30 text-[#FFB000] bg-[#FFB000]/5"
                        )}>
                          {project.status === 'shipped' ? 'SHIPPED' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 border-l-2 border-[#FFB000]/30 pl-4">
                      <p className="text-white/80 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Challenge & Solution */}
                    {(project.challenge || project.solution) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {project.challenge && (
                          <div className="space-y-2">
                            <h3 className="text-[#FFB000]/70 text-[9px] uppercase tracking-[0.3em] font-mono font-bold">Challenge</h3>
                            <p className="text-white/60 text-xs leading-relaxed">
                              {project.challenge}
                            </p>
                          </div>
                        )}
                        {project.solution && (
                          <div className="space-y-2">
                            <h3 className="text-[#00FF99]/70 text-[9px] uppercase tracking-[0.3em] font-mono font-bold">Solution</h3>
                            <p className="text-white/60 text-xs leading-relaxed">
                              {project.solution}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Specs */}
                    {project.spec && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/10">
                        {Object.entries(project.spec).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-[#FFB000]/60 text-[8px] uppercase tracking-[0.25em] font-mono font-bold">{key}</p>
                            <p className="text-white/90 text-[10px] uppercase tracking-wide font-mono font-bold">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="space-y-3">
                      <h3 className="text-white/50 text-[9px] uppercase tracking-[0.3em] font-mono font-bold">Tech Stack</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <span 
                            key={tech} 
                            className="text-white/60 text-[8px] font-mono uppercase tracking-wider border border-white/10 px-2 py-1 hover:border-[#FFB000]/40 hover:text-[#FFB000] transition-all"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-white/50 text-[9px] uppercase tracking-[0.3em] font-mono font-bold">Key Metrics</h3>
                        <div className="grid md:grid-cols-3 gap-3">
                          {project.metrics.map((metric, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-3">
                              <p className="text-white/70 text-xs font-mono">{metric}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-[#FFB000]/30 text-[#FFB000] hover:bg-[#FFB000] hover:text-black transition-all group"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-[9px] uppercase tracking-[0.25em] font-mono font-bold">Visit Live Site</span>
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-all"
                        >
                          <Github className="w-3 h-3" />
                          <span className="text-[9px] uppercase tracking-[0.25em] font-mono font-bold">View Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
