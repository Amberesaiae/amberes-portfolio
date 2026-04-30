import PageWrapper from '../components/PageWrapper';
import Meta from '../components/Meta';
import Footer from '../components/Footer';
import { FileText, Gavel, AlertTriangle, Scale } from 'lucide-react';
import { PAGE_CONTAINER_NARROW, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';
import { TRACK_LABEL } from '../styles/uiTokens';

export default function Terms() {
  return (
    <PageWrapper>
      <Meta title="Terms & Conditions // Amber Systems" description="System usage terms and legal conditions for Amber Systems." />
      
      <main className={`${PAGE_CONTAINER_NARROW} ${PADY.header} ${PADY.footer}`}>
        <div className={`space-y-12 mb-24 border-b ${BORDER_SUBTLE} pb-16`}>
          <div className="flex items-center gap-4 text-[#FFB000]/60">
            <Gavel size={14} />
            <p className="text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-mono font-black">Legal_Protocol_02</p>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter uppercase">
            TERMS & <span className="text-[#FFB000] italic">CONDITIONS.</span>
          </h1>

          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-12 text-[#444] font-mono text-[9px] uppercase ${TRACK_LABEL}`}>
            <p>LAST_REVISED // 2024.04.29</p>
            <p>STATUS // ENFORCED</p>
          </div>
        </div>

        <div className="space-y-12 md:space-y-20 font-mono text-white/70 text-sm leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <Scale size={14} /> 01_SYSTEM_USAGE
            </h2>
            <p>
              By accessing Amber Systems, you agree to comply with all localized system protocols and legal frameworks. The digital archive provided is intended for informational and professional evaluation purposes.
            </p>
            <p>
              Unauthorized attempts to penetrate system security, modify archive data, or disrupt service stability are strictly prohibited and may result in permanent node blacklisting.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <FileText size={14} /> 02_INTELLECTUAL_PROPERTY
            </h2>
            <p>
              All technical blueprints, project manifests, and visual records contained within this archive are the exclusive intellectual property of Amber Systems, unless otherwise specified.
            </p>
            <p>
              Reproduction or redistribution of these assets without explicit system clearance is a violation of proprietary protocols.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <AlertTriangle size={14} /> 03_LIMITATION_OF_LIABILITY
            </h2>
            <p>
              Amber Systems provides the archive "as is" without any express or implied warranties. We are not liable for any system disruptions, data desynchronization, or external interpretations of the archived materials.
            </p>
          </section>

          <section className={`space-y-6 border-t ${BORDER_SUBTLE} pt-12`}>
            <p className="text-[10px] uppercase tracking-widest text-[#444]">
              System usage implies full acceptance of these terms. Amber Systems reserves the right to update these protocols at any time without prior notice.
            </p>
          </section>
        </div>

        <div className="mt-40">
          <Footer showFull={false} />
        </div>
      </main>
    </PageWrapper>
  );
}
