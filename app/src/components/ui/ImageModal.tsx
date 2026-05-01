import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
}

export default function ImageModal({ isOpen, onClose, src, alt, title }: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !firstElement || !lastElement) return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    modal.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-zoom-out"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-7xl h-full flex flex-col pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-modal-title"
          >
            {/* Header / Info */}
            <div className="flex items-center justify-between py-6 border-b border-white/10 pointer-events-auto">
              <div className="space-y-1">
                <p className="text-[#FFB000] text-[10px] uppercase tracking-[0.5em] font-mono">
                  Visual_Asset // Full_Resolution
                </p>
                <h2 id="image-modal-title" className="text-white font-serif text-xl md:text-2xl uppercase tracking-tight">
                  {title || 'Project Detail'}
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close image preview"
                className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
              >
                <span className="text-[10px] uppercase tracking-widest font-mono hidden md:block">Close_Interface [ESC]</span>
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/40">
                  <X className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center overflow-hidden py-8 pointer-events-auto">
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  layoutId="modal-image"
                />
                
                {/* Decorative scanning line */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                  <div className="w-full h-[1px] bg-[#FFB000] animate-scan-slow opacity-50" />
                </div>
              </div>
            </div>

            {/* Footer / Metadata */}
            <div className="flex items-center justify-between py-6 border-t border-white/10 pointer-events-auto">
              <div className="flex items-center gap-8">
                <div className="space-y-1">
                  <p className="text-white/20 text-[9px] uppercase tracking-widest font-mono font-bold">System_Status</p>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-mono">Verified_Integrity</p>
                </div>
                <div className="hidden md:block space-y-1">
                  <p className="text-white/20 text-[9px] uppercase tracking-widest font-mono font-bold">Render_Scale</p>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-mono">1:1 Original Aspect</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white/10">
                <ZoomIn className="w-3 h-3" />
                <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Full_Archive_View</span>
              </div>
            </div>
          </motion.div>

          {/* Technical Corner Accents */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/5 pointer-events-none" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/5 pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/5 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/5 pointer-events-none" />
        </div>
      )}
    </AnimatePresence>
  );
}
