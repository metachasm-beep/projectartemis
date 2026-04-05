import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Book, Scroll, Award, Gavel, RefreshCcw } from 'lucide-react';

interface ContentOverlayProps {
  slug: string | null;
  onClose: () => void;
}

const DOCUMENT_CONTENT: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
  protocol: {
    title: 'COMMUNITY GUIDELINES',
    icon: Shield,
    content: (
      <div className="space-y-12">
        <div className="pb-8 border-b border-mat-rose/10">
           <p className="text-sm font-black uppercase tracking-[0.3em] text-mat-wine/40 mb-2">Effective Date: April 5, 2026</p>
           <p className="text-sm opacity-60 leading-relaxed italic">
             At Matriarch, we are building a respectful, women-led digital ecosystem. To ensure a safe experience for everyone, all users must adhere to these Guidelines. Failure to do so will result in immediate account restriction or permanent termination.
           </p>
        </div>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">1. RESPECT & SAFETY (NO HARASSMENT)</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>We have a zero-tolerance policy for abuse. You are prohibited from:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Harassment & Bullying:</strong> Sending unintended, repetitive, or threatening messages.</li>
              <li><strong>Hate Speech:</strong> Promoting violence or hatred based on race, religion, caste, or sexual orientation.</li>
              <li><strong>Bodily Privacy:</strong> Sharing or doxing private information/images of any user.</li>
              <li><strong>Gender-Based Insults:</strong> Degrading any gender is grounds for an immediate, non-negotiable ban.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">2. AUTHENTICITY (NO FAKE PROFILES)</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>Matriarch relies on real people making real connections:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Impersonation:</strong> Pretending to be someone else, including celebrities, is strictly prohibited.</li>
              <li><strong>Catfishing:</strong> Using deepfake or stolen images to deceive users.</li>
              <li><strong>Bot Activity:</strong> Automating scripts to "farm" ranks will lead to an immediate IP ban.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">3. INTEGRITY (NO SCAMS OR SOLICITATION)</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Financial Scams:</strong> Soliciting UPI "donations" or investment schemes.</li>
              <li><strong>Solicitation:</strong> Using the app for escort services or professional networking.</li>
              <li><strong>Link Spamming:</strong> Redirecting users to "OnlyFans" style or commercial platforms.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">4. CONTENT STANDARDS (EXPLICIT CONTENT)</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>To comply with Google AdSense and PWA status:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>No Nudity:</strong> Profile photos must be appropriate for a public space.</li>
              <li><strong>Sexual Content:</strong> Explicit media or "hookup-only" solicitation is not permitted.</li>
              <li><strong>Illegal Content:</strong> Depiction of non-consensual acts will be reported to certification nodes (NCBI/CERT-In).</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">5. THE RANKING SYSTEM INTEGRITY</h4>
          <p className="text-sm opacity-60 leading-relaxed">
            Men must not attempt to manipulate their "Rank" through coordinated loophole exploitation. Publicly "gaming" the system for discovery advantage is a violation of community trust.
          </p>
        </section>

        <section className="p-8 bg-mat-wine/5 rounded-[2rem] border border-mat-wine/10">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine mb-4 text-center">CONSEQUENCES OF VIOLATIONS</h4>
          <div className="space-y-3 text-xs opacity-60 text-center uppercase tracking-widest font-bold">
            <p>Strike 1: Warning & Shadow-ban (Hidden discovery feed)</p>
            <p>Strike 2: Account Suspension (Loss of access to chats)</p>
            <p className="text-mat-wine">Severe: Permanent Ban (IP & Device Blacklisted)</p>
          </div>
        </section>

        <footer className="pt-12 border-t border-mat-rose/10">
           <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine mb-4">REPORTING & GRIEVANCES</h4>
           <div className="text-sm opacity-60 space-y-4">
              <p>Under the IT Rules 2021, we provide a dedicated Grievance Redressal mechanism.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="px-6 py-2 bg-mat-wine text-white text-[10px] font-black uppercase tracking-widest rounded-full">Flag Any Profile</div>
                <div className="px-6 py-2 border border-mat-wine/20 text-mat-wine text-[10px] font-black uppercase tracking-widest rounded-full">contact@matriarchindia.com</div>
              </div>
           </div>
        </footer>
      </div>
    )
  },
  philosophy: {
    title: 'Selection Philosophy',
    icon: Book,
    content: (
      <div className="space-y-8">
        <p className="text-xl italic font-serif opacity-80">Why we exist: The Architecture of Intention.</p>
        <p className="text-sm opacity-60 leading-relaxed">
          The modern expanse of connection has devolved into a cycle of noise. Matriarch was founded on the principle of **Selective Merit**. We believe that high-value outcomes require high-friction entry. 
        </p>
        <p className="text-sm opacity-60 leading-relaxed">
          By prioritizing the choice of the Matriarch, we restore the natural order of selection. Intention is not found in volume, but in the silence of the curated vault.
        </p>
      </div>
    )
  },
  'case-studies': {
    title: 'Case Archive',
    icon: Award,
    content: (
      <div className="space-y-8">
        <p className="text-xl italic font-serif opacity-80">Historical resonances within the network.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-mat-wine/5 rounded-[2rem]">
            <h5 className="font-bold mb-4 italic">The Imperial Union (23-A)</h5>
            <p className="text-xs opacity-50">A resonance between a FAANG founder and a leading architectural sovereign. Status: Sealed Excellence.</p>
          </div>
          <div className="p-8 bg-mat-gold/5 rounded-[2rem]">
            <h5 className="font-bold mb-4 italic">The Vanguard Bridge (24-B)</h5>
            <p className="text-xs opacity-50">Connection established in Mumbai. Aligned via deep philosophy and heritage protocols.</p>
          </div>
        </div>
      </div>
    )
  },
  'privacy-pact': {
    title: 'PRIVACY POLICY',
    icon: Scroll,
    content: (
      <div className="space-y-12">
        <div className="pb-8 border-b border-mat-rose/10">
           <p className="text-sm font-black uppercase tracking-[0.3em] text-mat-wine/40 mb-2">Last Updated: April 5, 2026</p>
           <p className="text-sm opacity-60 leading-relaxed italic">
             Metachasm (OPC) Private Limited ("we," "us," or "our") is committed to protecting the digital personal data of our users ("Data Principals"). This Privacy Policy explains how we process your data in compliance with the Digital Personal Data Protection Act (DPDP), 2023.
           </p>
        </div>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">1. DATA WE COLLECT</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>We collect only the data necessary to provide our asymmetric dating and ranking services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity & Contact:</strong> Phone number (via Logto/Auth), name, age, and gender.</li>
              <li><strong>Profile Data:</strong> Photos (stored via Cloudinary), bio, interests, and preferences.</li>
              <li><strong>Communication:</strong> Text-only chat messages between matched users (stored via Turso).</li>
              <li><strong>Technical Metadata:</strong> IP address, device type, and interaction logs.</li>
              <li><strong>Ranking Data:</strong> Interaction metrics used to calculate the "Male Rank."</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">2. WHY WE COLLECT YOUR DATA (PURPOSE)</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>We process your data based on your explicit consent for the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Service Functionality:</strong> To allow women to browse and men to view their ranks.</li>
              <li><strong>Safety & Verification:</strong> To prevent bot accounts and ensure a 18+ community.</li>
              <li><strong>Personalization:</strong> To show profiles that match your specified preferences.</li>
              <li><strong>Monetization:</strong> To serve relevant ads via Google AdSense.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">3. DATA SHARING & THIRD-PARTY TRANSFERS</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>We share data with the following Data Processors to operate the app:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Turso (DB):</strong> Stores profile data and chat history.</li>
              <li><strong>Cloudinary:</strong> Processes and stores profile images.</li>
              <li><strong>Logto/Auth0:</strong> Manages secure login and identity verification.</li>
              <li><strong>Google AdSense:</strong> Processes limited metadata to serve ads.</li>
              <li><strong>Payment Gateways:</strong> We do not store credit card details.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">4. DATA RETENTION & ERASURE</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>Active Accounts:</strong> We retain data as long as your account is active.</p>
            <p><strong>Inactivity:</strong> Accounts inactive for {'>'}3 years will be flagged for erasure per DPDP guidelines.</p>
            <p><strong>Employee Erasure:</strong> If you delete your account, data is erased from primary databases within 30 days.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">5. YOUR RIGHTS AS A DATA PRINCIPAL</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm opacity-60 leading-relaxed">
            <li><strong>Right to Access:</strong> Request a summary of data we hold.</li>
            <li><strong>Right to Correction:</strong> Update inaccurate data via profile settings.</li>
            <li><strong>Right to Erasure:</strong> Request data deletion at any time.</li>
            <li><strong>Right to Nominate:</strong> Nominate an individual to exercise rights in event of incapacity.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">6. COOKIES & TRACKING</h4>
          <p className="text-sm opacity-60 leading-relaxed">
            As a PWA, we use "Local Storage" and cookies to keep you logged in and remember your preferences. You can manage these through your browser settings.
          </p>
        </section>

        <footer className="pt-12 border-t border-mat-rose/10">
           <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine mb-4">7. GRIEVANCE REDRESSAL</h4>
           <div className="text-sm opacity-60 space-y-2">
              <p>In accordance with the DPDP Act, contact our Grievance Officer:</p>
              <div className="p-6 bg-mat-wine/5 rounded-2xl border border-mat-wine/10">
                 <p><strong>Grievance Officer:</strong> Nachiketa Singh</p>
                 <p><strong>Entity:</strong> Metachasm (OPC) Private Limited</p>
                 <p className="font-black text-mat-wine">Email: contact@matriarchindia.com</p>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest mt-4">Response Timeline: Acknowledgement (24h) // Resolution (15 days)</p>
           </div>
        </footer>
      </div>
    )
  },
  'terms-of-merit': {
    title: 'TERMS OF SERVICE',
    icon: Gavel,
    content: (
      <div className="space-y-12">
        <div className="pb-8 border-b border-mat-rose/10">
           <p className="text-sm font-black uppercase tracking-[0.3em] text-mat-wine/40 mb-2">Last Updated: April 5, 2026</p>
           <p className="text-sm opacity-60 leading-relaxed italic">
             Welcome to Matriarch ("the App," "the Platform"), a Progressive Web App owned and operated by Metachasm (OPC) Private Limited. By creating an account, you agree to be bound by these Terms of Service ("Terms").
           </p>
        </div>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">1. USER ELIGIBILITY</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm opacity-60 leading-relaxed">
            <li><strong>Minimum Age:</strong> You must be at least 18 years of age to create an account. By using Matriarch, you represent that you have the right and capacity to enter into this agreement.</li>
            <li><strong>Single Account:</strong> Users are permitted only one active profile.</li>
            <li><strong>Criminal History:</strong> By joining, you represent that you have never been convicted of a felony or a crime involving violence, sexual misconduct, or harassment.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">2. PLATFORM ROLE & NATURE OF SERVICE</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>Intermediary Status:</strong> Matriarch acts solely as an intermediary platform (under Section 79 of the IT Act, 2000) providing a digital space for users to interact.</p>
            <p><strong>No Matchmaking Guarantee:</strong> We provide the tools for connection but do not guarantee "matches," dates, or successful relationships.</p>
            <p><strong>Asymmetric Model Disclosure:</strong> Users acknowledge that Matriarch operates on a "Women-First" mechanical model. This design is a core feature of the platform's safety philosophy and is not intended as unlawful discrimination.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">3. GENDER-SPECIFIC MECHANICS & RANKING</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>Women-First Mechanics:</strong> Platform architecture dictates that only female-identified profiles may browse the discovery feed and initiate first contact. Male-identified profiles are restricted to a "Status Dashboard."</p>
            <p><strong>Ranking System Disclaimer:</strong> The "Rank" displayed to male users is a metric based on profile completion and engagement. A "Rank Bump" is not a guarantee of visibility; final visibility depends on the browsing behavior of female users.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">4. USER RESPONSIBILITIES</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm opacity-60 leading-relaxed">
            <li><strong>Accuracy:</strong> You are responsible for providing truthful information. Impersonating others is prohibited.</li>
            <li><strong>Safety:</strong> You are solely responsible for your interactions. We advise following "Safe Dating" practices for any off-platform meetings.</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">5. PROHIBITED CONDUCT</h4>
          <div className="text-sm opacity-60 leading-relaxed">
            <p className="mb-4 font-bold">You agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Harass, bully, stalk, or intimidate any user.</li>
              <li>Post NSFW content, including nudity or sexually explicit text/images.</li>
              <li>Use the platform for any commercial purpose (escort services, unauthorized advertising).</li>
              <li>Scrape, crawl, or "bot" the platform to extract user data or manipulate rankings.</li>
              <li>Create fake profiles or "catfish" other users.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">6. CONTENT & MEDIA</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>Ownership:</strong> You retain ownership of uploaded photos, but grant Matriarch a non-exclusive license to host and display this content on the Platform.</p>
            <p><strong>Cloudinary/Storage:</strong> Media is processed via third-party services. You agree not to upload files containing malicious code.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">7. SUSPENSION & TERMINATION</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
             <p><strong>Termination by Matriarch:</strong> We reserve the right to suspend accounts immediately if these Terms are violated or if conduct is deemed harmful.</p>
             <p><strong>Effect of Termination:</strong> Upon termination, all data (including Rank and Tokens) may be deleted. No refunds will be issued for unused tokens if terminated for policy violation.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">8. LIMITATION OF LIABILITY</h4>
          <p className="text-sm opacity-60 leading-relaxed">
            To the maximum extent permitted by Indian law, Matriarch/Metachasm (OPC) Pvt Ltd shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
          </p>
        </section>

        <footer className="pt-12 border-t border-mat-rose/10">
           <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine mb-4">CONTACT US</h4>
           <div className="text-sm opacity-60 space-y-2">
              <p>For grievances or reporting prohibited conduct, please contact our Grievance Officer at:</p>
              <p className="font-black text-mat-wine">Email: contact@matriarchindia.com</p>
           </div>
        </footer>
      </div>
    )
  },
  'refund-policy': {
    title: 'Vault Fee Refund',
    icon: RefreshCcw,
    content: (
      <div className="space-y-8">
        <p className="text-xl italic font-serif opacity-80">Protocol on asset reallocation.</p>
        <p className="text-sm opacity-60 leading-relaxed">
          Aura tokens, once deployed, cannot be reversed as they represent computational intention. However, Imperial Membership fees are refundable within 24 hours if no resonances have been initiated.
        </p>
      </div>
    )
  }
};

const LegalArchiveOverlay: React.FC<ContentOverlayProps> = ({ slug, onClose }) => {
  const doc = slug ? DOCUMENT_CONTENT[slug] : null;
  const Icon = doc?.icon;

  if (!doc) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-mat-obsidian/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          className="max-w-4xl w-full bg-mat-cream rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col"
          style={{ minHeight: '60vh' }}
        >
          {/* Header */}
          <div className="px-12 py-10 flex justify-between items-center border-b border-mat-rose/10">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-mat-wine text-white rounded-2xl flex items-center justify-center">
                   {Icon && <Icon size={28} strokeWidth={1.5} />}
                </div>
                <div>
                   <h2 className="text-3xl font-black text-mat-wine italic">{doc.title}</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40 mt-1">Official Matriarch Documentation</p>
                </div>
             </div>
             <button onClick={onClose} className="w-12 h-12 rounded-full bg-mat-wine/5 flex items-center justify-center text-mat-wine hover:bg-mat-wine/10 transition-colors">
                <X size={24} />
             </button>
          </div>

          {/* Content */}
          <div className="p-12 md:p-20 flex-1 overflow-y-auto custom-scrollbar text-mat-wine">
             {doc.content}
          </div>

          {/* Footer Decoration */}
          <div className="p-12 text-center border-t border-mat-rose/5">
             <p className="text-[10px] font-black uppercase tracking-[1em] text-mat-wine/20">Sealed under the Imperial Seal // 2024</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LegalArchiveOverlay;
