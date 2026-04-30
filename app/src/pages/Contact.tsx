import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Instagram, Twitter, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';
import Meta from '../components/Meta';
import PageWrapper from '../components/PageWrapper';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';

const contactSchema = z.object({
  name: z.string().min(2, { message: "IDENTIFIER_REQUIRED" }),
  email: z.string().email({ message: "INVALID_PROTOCOL" }),
  subject: z.string().min(5, { message: "SUBJECT_INSUFFICIENT" }),
  message: z.string().min(10, { message: "DATA_MINIMUM_NOT_MET" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return <p id={id} className="text-[#ff4d4d] text-[10px] font-mono tracking-widest">{message}</p>;
}

export default function Contact() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitted(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.from('.reveal', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2
      });

      // Background line animation
      gsap.from('.bg-line', {
        scaleX: 0,
        duration: 1.5,
        ease: 'expo.inOut',
        stagger: 0.2
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageWrapper>
      <main ref={pageRef} className="bg-transparent min-h-screen text-white overflow-hidden selection:bg-[#FFB000] selection:text-black">
        <Meta 
          title="Contact // Start the Story" 
          description="Initiate a transmission. Reach out for technical inquiries, marine engineering projects, or creative collaborations."
        />
        {/* Background Architectural Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="bg-line absolute top-1/4 left-0 w-full h-[1px] bg-white/10" />
          <div className="bg-line absolute top-2/4 left-0 w-full h-[1px] bg-white/10" />
          <div className="bg-line absolute top-3/4 left-0 w-full h-[1px] bg-white/10" />
        </div>

        <div className={`relative z-10 ${CONTAINER.wide} ${CENTER} ${PADX.page} ${PADY.header} ${PADY.footer} min-h-screen`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
            {/* Left: Content & Form */}
            <div className="lg:col-span-7 space-y-12 md:space-y-16">
              <div className="space-y-6">
                <p className="reveal text-[#FFB000] text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] font-medium">Inquiry & Connection</p>
                <h1 className="reveal font-serif text-4xl sm:text-5xl md:text-8xl leading-[0.9] tracking-tighter">
                  START THE <br />
                  <span className="italic text-[#FFB000]">STORY.</span>
                </h1>
                <div className="reveal max-w-sm pt-4">
                  <p className="text-white/70 text-base leading-relaxed font-light">
                    Bridging the gap between heavy industry and digital precision requires a conversation. Reach out to discuss the next build.
                  </p>
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="reveal pt-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 group">
                        <label htmlFor="contact-name" className="text-[10px] uppercase tracking-[0.3em] text-[#888] group-focus-within:text-[#FFB000] transition-colors">Identifier_Name</label>
                        <input 
                          id="contact-name"
                          {...register('name')}
                          placeholder="NAME.V1"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          className="w-full min-h-11 bg-transparent border-b border-white/10 py-4 font-mono text-sm focus:outline-none focus:border-[#FFB000] transition-colors placeholder:text-[#222]"
                        />
                        <FieldError id="contact-name-error" message={errors.name?.message} />
                      </div>
                      <div className="space-y-2 group">
                        <label htmlFor="contact-email" className="text-[10px] uppercase tracking-[0.3em] text-[#444] group-focus-within:text-[#FFB000] transition-colors">Protocol_Email</label>
                        <input 
                          id="contact-email"
                          type="email"
                          {...register('email')}
                          placeholder="ADDRESS@NODE.COM"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          className="w-full min-h-11 bg-transparent border-b border-white/10 py-4 font-mono text-sm focus:outline-none focus:border-[#FFB000] transition-colors placeholder:text-[#222]"
                        />
                        <FieldError id="contact-email-error" message={errors.email?.message} />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label htmlFor="contact-subject" className="text-[10px] uppercase tracking-[0.3em] text-[#444] group-focus-within:text-[#FFB000] transition-colors">Transmission_Subject</label>
                      <input 
                        id="contact-subject"
                        {...register('subject')}
                        placeholder="CORE_INQUIRY"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                        className="w-full min-h-11 bg-transparent border-b border-white/10 py-4 font-mono text-sm focus:outline-none focus:border-[#FFB000] transition-colors placeholder:text-[#222]"
                      />
                      <FieldError id="contact-subject-error" message={errors.subject?.message} />
                    </div>

                    <div className="space-y-2 group">
                      <label htmlFor="contact-message" className="text-[10px] uppercase tracking-[0.3em] text-[#444] group-focus-within:text-[#FFB000] transition-colors">Data_Packet_Message</label>
                      <textarea 
                        id="contact-message"
                        {...register('message')}
                        placeholder="SPECIFY_REQUIREMENTS..."
                        rows={4}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        className="w-full min-h-11 bg-transparent border-b border-white/10 py-4 font-mono text-sm focus:outline-none focus:border-[#FFB000] transition-colors placeholder:text-[#222] resize-none"
                      />
                      <FieldError id="contact-message-error" message={errors.message?.message} />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-4 group text-[#FFB000] hover:text-white transition-all disabled:opacity-50"
                    >
                      <span className="text-xs font-mono uppercase tracking-[0.2em] md:tracking-[0.5em]">{isSubmitting ? 'TRANSMITTING...' : 'INITIATE_TRANSMISSION'}</span>
                      <div className="w-12 h-12 border border-[#FFB000]/30 flex items-center justify-center group-hover:border-white transition-colors">
                        <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    aria-live="polite"
                    className="space-y-6 max-w-xl py-12 border border-[#FFB000]/20 bg-[#FFB000]/5 p-12 text-center"
                  >
                    <div className="flex justify-center">
                      <CheckCircle2 className="text-[#FFB000] w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl">TRANSMISSION_COMPLETE</h3>
                      <p className="text-[#888] font-mono text-[10px] uppercase tracking-[0.3em]">Protocol confirmed. Expect response within 24 standard cycles.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-[#FFB000] text-[9px] uppercase tracking-[0.5em] font-mono hover:text-white transition-colors pt-6"
                    >
                      Reset_Protocol
                    </button>
                  </motion.div>
                )}
              </div>
              
              {/* Social Details */}
              <div className="reveal space-y-10 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="group cursor-pointer border-l border-white/10 pl-4 md:pl-6">
                    <p className="text-[#444] text-[10px] uppercase tracking-[0.4em] mb-4">Digital Bridge</p>
                    <a 
                      href="mailto:isaiahamber5@gmail.com"
                      className="flex items-center gap-4 text-lg md:text-xl font-serif hover:text-[#FFB000] transition-colors duration-500 break-all"
                    >
                      isaiahamber5@gmail.com
                      <ArrowUpRight size={16} className="opacity-40" />
                    </a>
                  </div>

                  <div className="group cursor-pointer border-l border-white/10 pl-4 md:pl-6">
                    <p className="text-[#444] text-[10px] uppercase tracking-[0.4em] mb-4">Direct Lines</p>
                    <div className="space-y-1">
                      <a href="tel:+233509913229" className="block text-lg md:text-xl font-serif hover:text-[#FFB000] transition-colors">+233 509 913 229</a>
                      <a href="tel:+233533011071" className="block text-lg md:text-xl font-serif hover:text-[#FFB000] transition-colors">+233 533 011 071</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 pt-6 border-l border-white/10 pl-6">
                  <a aria-label="Visit Instagram profile" href="https://www.instagram.com/is_lamptey/" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#FFB000] transition-all hover:scale-110">
                    <Instagram size={28} strokeWidth={1.2} />
                  </a>
                  <a aria-label="Visit X profile" href="https://x.com/Esaiaemose" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#FFB000] transition-all hover:scale-110">
                    <Twitter size={28} strokeWidth={1.2} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: The Portrait (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="reveal relative w-full h-[60vh] md:h-[75vh] overflow-hidden rounded-sm bg-[#0a0a0a]">
                <img 
                  src="/images/portrait.png" 
                  alt="Portrait" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-6 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-[0.2em] md:tracking-[0.4em]">
                <span>Identity_Verified</span>
                <span>Ref: AMB_77_ARCH</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`reveal ${PADY.medium} flex flex-col md:flex-row justify-between items-center gap-8 border-t ${BORDER_SUBTLE} opacity-40`}>
            <p className="text-[10px] uppercase tracking-[0.25em] md:tracking-[0.5em] text-[#555] text-center md:text-left">
              © 2026 AMBER. ACCRA, GHANA.
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] uppercase tracking-[0.25em] md:tracking-[0.5em] text-[#555]">
              <span>ENGINEERING</span>
              <span>BUILDING</span>
              <span>CRAFTING</span>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
