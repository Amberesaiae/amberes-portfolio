import { Link } from 'react-router-dom';
import { Instagram, Twitter, Github } from 'lucide-react';
import { CONTAINER, CENTER, PADX } from '../styles/layoutTokens';

interface FooterProps {
  showFull?: boolean;
}

export default function Footer({ showFull = true }: FooterProps) {
  return (
    <footer className="bg-[#111] text-white">
      {showFull && (
        <div className={`min-h-[70vh] md:min-h-screen flex flex-col items-center justify-center ${PADX.page} py-12 md:py-20 relative overflow-hidden border-t border-white/5`}>
          {/* ... existing content ... */}
          <div className={`relative z-10 text-center ${CONTAINER.content} ${CENTER}`}>
            {/* Keeping the top part the same to avoid breaking layout */}
            <h2 className="font-serif text-4xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] mb-8">
              LET'S CREATE<br />
              PROJECTS THAT<br />
              STAND OUT.
            </h2>

            <p className="text-[#E8E6E3] text-base md:text-lg max-w-md mx-auto mb-12">
              Reach out for collaborations, commissions, or just to connect.
            </p>

            <div className="flex flex-col items-center gap-6">
              <a 
                href="mailto:isaiahamber5@gmail.com"
                aria-label="Start a project - send email"
                className="relative px-8 sm:px-12 py-4 sm:py-6 border border-[#FFB000]/40 text-[#FFB000] text-xs uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black hover:bg-[#FFB000] hover:text-black transition-all duration-500 overflow-hidden group mb-10"
              >
                <span className="relative z-10">Start a Project</span>
                <div className="absolute inset-0 bg-[#FFB000] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </a>

              <div className="flex flex-col items-center gap-3">
                <a
                  href="mailto:isaiahamber5@gmail.com"
                  className="block font-serif text-xl md:text-2xl lg:text-3xl text-white/40 hover:text-white transition-colors"
                >
                  ISAIAHAMBER5@GMAIL.COM
                </a>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-4 items-center">
                  <a href="tel:+233509913229" className="font-mono text-[9px] text-white/30 hover:text-[#FFB000] transition-colors uppercase tracking-[0.3em]">
                    +233 50 991 3229
                  </a>
                  <div className="hidden md:block h-3 w-[1px] bg-white/10" />
                  <a href="tel:+233533011071" className="font-mono text-[9px] text-white/30 hover:text-[#FFB000] transition-colors uppercase tracking-[0.3em]">
                    +233 53 301 1071
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-12 mt-8">
                <a href="https://github.com/Amberesaiae" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#FFB000] transition-all duration-300 hover:scale-110" aria-label="Visit GitHub profile">
                  <Github size={24} strokeWidth={1.5} />
                </a>
                <a href="https://www.instagram.com/is_lamptey/" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#FFB000] transition-all duration-300 hover:scale-110" aria-label="Visit Instagram profile">
                  <Instagram size={24} strokeWidth={1.5} />
                </a>
                <a href="https://x.com/Esaiaemose" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#FFB000] transition-all duration-300 hover:scale-110" aria-label="Visit X profile">
                  <Twitter size={24} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`border-t border-white/5 ${PADX.page} py-4`}>
        <div className={`${CONTAINER.content} ${CENTER} flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] md:text-xs text-[#aaa] uppercase tracking-wider`}>
          <span className="text-center md:text-left">&copy; {new Date().getFullYear()} Amber &mdash; All rights reserved</span>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <div className="hidden md:block h-3 w-[1px] bg-white/20" />
            <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <div className="hidden md:block h-3 w-[1px] bg-white/20" />
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
          <span className="opacity-60 text-[#FFB000] text-center md:text-right">Amber Systems // ARCHIVE_V4.2</span>
        </div>
      </div>
    </footer>
  );
}
