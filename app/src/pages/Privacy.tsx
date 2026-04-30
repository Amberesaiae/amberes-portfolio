import PageWrapper from '../components/PageWrapper';
import Meta from '../components/Meta';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { PAGE_CONTAINER_NARROW, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';
import { TRACK_LABEL } from '../styles/uiTokens';

export default function Privacy() {
  return (
    <PageWrapper>
      <Meta title="Privacy Policy // Amber Systems" description="Privacy protocols and data handling specifications for Amber Systems." />
      
      <main className={`${PAGE_CONTAINER_NARROW} ${PADY.header} ${PADY.footer}`}>
        <div className={`space-y-12 mb-24 border-b ${BORDER_SUBTLE} pb-16`}>
          <div className="flex items-center gap-4 text-[#FFB000]/60">
            <Lock size={14} />
            <p className="text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-mono font-black">Legal_Protocol_01</p>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter uppercase">
            PRIVACY <span className="text-[#FFB000] italic">POLICY.</span>
          </h1>

          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-12 text-[#444] font-mono text-[9px] uppercase ${TRACK_LABEL}`}>
            <p>LAST_REVISED // 2024.04.29</p>
            <p>STATUS // ENFORCED</p>
          </div>
        </div>

        <div className="space-y-12 md:space-y-20 font-mono text-white/70 text-sm leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <Eye size={14} /> 01_DATA_COLLECTION
            </h2>
            <p>
              Amber Systems ("we", "us", "our") values the privacy of its users. This policy outlines how we handle data within our high-fidelity digital archive. We collect minimal information necessary to provide a secure and optimized browsing experience.
            </p>
            <p>
              Information collected may include technical identifiers, system logs, and anonymous usage statistics used purely for node optimization and security monitoring.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <Shield size={14} /> 02_ENCRYPTION_&_SECURITY
            </h2>
            <p>
              All data transmissions within our systems are handled through encrypted channels. We employ industry-standard security protocols to prevent unauthorized access, alteration, or destruction of stored data.
            </p>
            <p>
              Our internal databases are firewalled and accessible only to authorized system administrators under strict confidentiality agreements.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[#FFB000] text-xs uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <FileText size={14} /> 03_THIRD_PARTY_DISCLOSURE
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section className={`space-y-6 border-t ${BORDER_SUBTLE} pt-12`}>
            <p className="text-[10px] uppercase tracking-widest text-[#444]">
              For any inquiries regarding data protocols, please contact the system administrator via the terminal or contact page.
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
