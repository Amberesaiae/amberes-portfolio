import PageWrapper from '../components/PageWrapper';
import Meta from '../components/Meta';
import Footer from '../components/Footer';
import { Database, Cookie, ShieldCheck, Settings } from 'lucide-react';
import { PAGE_CONTAINER_NARROW, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';
import { TRACK_LABEL } from '../styles/uiTokens';

export default function Cookies() {
  return (
    <PageWrapper>
      <Meta title="Cookie Policy // Amber Systems" description="Specifications for data packets and browser cache handling." />
      
      <main className={`${PAGE_CONTAINER_NARROW} ${PADY.header} ${PADY.footer}`}>
        <div className={`space-y-12 mb-24 border-b ${BORDER_SUBTLE} pb-16`}>
          <div className="flex items-center gap-4 text-[#FFB000]/60">
            <Cookie size={14} />
            <p className="text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-mono font-black">Legal_Protocol_03</p>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter uppercase">
            COOKIE <span className="text-[#FFB000] italic">POLICY.</span>
          </h1>

          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-12 text-[#444] font-mono text-[9px] uppercase ${TRACK_LABEL}`}>
            <p>LAST_REVISED // 2024.04.29</p>
            <p>STATUS // ENFORCED</p>
          </div>
        </div>

        <div className="space-y-12 md:space-y-20 font-mono text-white/70 text-sm leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <Database size={14} /> 01_WHAT_ARE_COOKIES
            </h2>
            <p>
              Cookies are small data packets stored in your browser's local repository. They allow our system to recognize your terminal and store your preferences across sessions.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <ShieldCheck size={14} /> 02_ESSENTIAL_COOKIES
            </h2>
            <p>
              These cookies are critical for system operation. They manage session security, user authentication, and core interface performance. Disabling these may cause system desynchronization.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <Settings size={14} /> 03_PREFERENCE_COOKIES
            </h2>
            <p>
              These store your UI configuration, including terminal theme settings, archive view preferences, and language selections. They ensure a consistent experience across different access points.
            </p>
          </section>

          <section className={`space-y-6 border-t ${BORDER_SUBTLE} pt-12`}>
            <p className="text-[10px] uppercase tracking-widest text-[#444]">
              You can manage your data packet preferences via your browser's security settings. 
            </p>
          </section>
        </div>

        <div className="mt-20 md:mt-32">
          <Footer showFull={false} />
        </div>
      </main>
    </PageWrapper>
  );
}
