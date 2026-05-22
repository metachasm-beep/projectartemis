import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Book, Scroll, Award, Gavel, RefreshCcw } from 'lucide-react';

interface ContentOverlayProps {
  slug: string | null;
  onClose: () => void;
}

export const DOCUMENT_CONTENT: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
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
              <li><strong>Solicitation:</strong> Using the app for commercial engagement or professional networking.</li>
              <li><strong>Link Spamming:</strong> Redirecting users to third-party adult platforms or commercial entities.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">4. CONTENT STANDARDS (EXPLICIT CONTENT)</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>To comply with Google AdSense and PWA status:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Appropriate Attire:</strong> Profile photos must be appropriate for a public space.</li>
              <li><strong>Inappropriate Content:</strong> Explicit media or "casual-only" solicitation is not permitted.</li>
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
    title: 'GRIEVANCE REDRESSAL POLICY',
    icon: Award,
    content: (
      <div className="space-y-12">
        <div className="pb-8 border-b border-mat-rose/10">
           <p className="text-sm font-black uppercase tracking-[0.3em] text-mat-wine/40 mb-2">Effective Date: April 5, 2026</p>
           <p className="text-sm opacity-60 leading-relaxed italic">
             In accordance with the Information Technology Rules 2021 (including 2026 Amendments) and the Digital Personal Data Protection Act 2023, Matriarch has established a robust mechanism to address user grievances.
           </p>
        </div>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">1. GRIEVANCE OFFICER DETAILS</h4>
          <div className="p-8 bg-mat-wine/5 rounded-[2rem] border border-mat-wine/10 space-y-2 text-sm opacity-60">
             <p><strong>Name:</strong> Paul Marandi</p>
             <p><strong>Designation:</strong> Resident Grievance Officer (RGO)</p>
             <p><strong>Company:</strong> Metachasm (OPC) Private Limited</p>
             <p className="font-black text-mat-wine">Email: contact@matriarchindia.com</p>
             <p className="text-[10px] mt-4 uppercase tracking-widest">Note: Our Grievance Officer is a resident of India as mandated by law.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">2. COMPLIANCE TIMELINES (STATUTORY)</h4>
          <div className="overflow-hidden border border-mat-rose/10 rounded-2xl">
             <table className="w-full text-left text-[11px] uppercase tracking-widest font-bold">
                <thead className="bg-mat-wine text-white">
                   <tr>
                      <th className="p-4 border-r border-white/10">Type of Grievance</th>
                      <th className="p-4 border-r border-white/10 text-center">Ack</th>
                      <th className="p-4 text-center">Resolution</th>
                   </tr>
                </thead>
                <tbody className="text-mat-wine/60">
                   <tr className="border-b border-mat-rose/10 bg-mat-wine/5">
                      <td className="p-4 border-r border-mat-rose/10">Standard Complaints</td>
                      <td className="p-4 border-r border-mat-rose/10 text-center">24H</td>
                      <td className="p-4 text-center">7 Days</td>
                   </tr>
                   <tr className="border-b border-mat-rose/10">
                      <td className="p-4 border-r border-mat-rose/10 text-mat-wine">Intimate Imagery</td>
                      <td className="p-4 border-r border-mat-rose/10 text-center">Immediate</td>
                      <td className="p-4 text-center text-mat-wine">24 Hours</td>
                   </tr>
                   <tr className="border-b border-mat-rose/10 bg-mat-wine/5">
                      <td className="p-4 border-r border-mat-rose/10">Impersonation</td>
                      <td className="p-4 border-r border-mat-rose/10 text-center">Immediate</td>
                      <td className="p-4 text-center">24 Hours</td>
                   </tr>
                   <tr>
                      <td className="p-4 border-r border-mat-rose/10">Prohibited Content</td>
                      <td className="p-4 border-r border-mat-rose/10 text-center">24H</td>
                      <td className="p-4 text-center">36 Hours</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">3. HOW TO FILE A GRIEVANCE</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p>Please include your Registered Phone Number, Description of the violation, Evidence (screenshots/links), and the Redressal sought.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">4. ESCALATION MATRIX</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
             <p><strong>Appellate Committee (GAC):</strong> Appeal to the Government-appointed GAC within 30 days of our decision.</p>
             <p><strong>Data Protection Board (DPB):</strong> For personal data breaches under the DPDP Act 2023.</p>
          </div>
        </section>

        <footer className="pt-12 border-t border-mat-rose/10">
           <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine mb-4">5. COMPLIANCE REPORTING</h4>
           <p className="text-sm opacity-60 leading-relaxed">
             Matriarch publishes a Monthly Compliance Report DETAILING reports received and proactive removals actioned by the Imperial nodes.
           </p>
        </footer>
      </div>
    )
  },
  'privacy-pact': {
    title: 'PRIVACY POLICY',
    icon: Scroll,
    content: (
      <div className="space-y-12">
        <div className="pb-8 border-b border-mat-rose/10">
           <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-mat-wine/40">Last Updated: April 5, 2026</p>
              <div className="flex gap-2">
                 {['EN', 'HI', 'TA', 'TE', 'BN'].map(lang => (
                    <button key={lang} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${lang === 'EN' ? 'bg-mat-wine text-white border-mat-wine' : 'bg-transparent text-mat-wine/60 border-mat-wine/20 hover:border-mat-wine/60'}`}>{lang}</button>
                 ))}
              </div>
           </div>
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
              <li>Post inappropriate content, including explicit text/images.</li>
              <li>Use the platform for any commercial purpose (commercial companionship, unauthorized advertising).</li>
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
    title: 'REFUND & CANCELLATION POLICY',
    icon: RefreshCcw,
    content: (
      <div className="space-y-12">
        <div className="pb-8 border-b border-mat-rose/10">
           <p className="text-sm font-black uppercase tracking-[0.3em] text-mat-wine/40 mb-2">Last Updated: April 5, 2026</p>
           <p className="text-sm opacity-60 leading-relaxed italic">
             This policy outlines the terms and conditions for purchases made on the Matriarch PWA. By purchasing any digital product or subscription, you agree to the terms below.
           </p>
        </div>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">1. TYPES OF PURCHASES</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>Consumables:</strong> These include "Rank Bumps," "Profile Boosts," and "Token Packs." These are one-time use items that provide a specific, immediate effect.</p>
            <p><strong>Subscriptions:</strong> These include "Matriarch Plus" or "Apex Status" plans that provide recurring benefits over a set period (e.g., monthly).</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">2. REFUND ELIGIBILITY</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>General Rule:</strong> All purchases are final and non-refundable unless otherwise required by law.</p>
            <p><strong>Technical Errors:</strong> If you were charged but did not receive the digital item due to a technical glitch, you are entitled to a full refund or manual credit.</p>
            <p><strong>14-Day Cooling-Off Period:</strong> You may request a refund for a new subscription within 14 days of purchase, provided no premium features have been used.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">3. NON-REFUNDABLE ITEMS</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm opacity-60 leading-relaxed">
            <li><strong>Consumed Boosts:</strong> Once a "Rank Bump" or "Boost" has been activated, it is considered consumed and non-refundable.</li>
            <li><strong>Partial Subscription Periods:</strong> We do not offer pro-rated refunds for mid-month cancellations.</li>
            <li><strong>Banned Accounts:</strong> If your account is terminated for violating Community Guidelines, you forfeit all unused balances; no refunds will be issued.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">4. CANCELLATION OF SUBSCRIPTIONS</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
            <p><strong>Self-Service:</strong> You can cancel your subscription at any time through the "Account Settings."</p>
            <p><strong>Timing:</strong> To avoid charges for the next cycle, you must cancel at least 24 hours before the renewal date.</p>
            <p><strong>Effect:</strong> Cancellation stops future billing; it does not trigger a refund for the current period.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine">5. HOW TO REQUEST A REFUND</h4>
          <div className="space-y-4 text-sm opacity-60 leading-relaxed">
             <p>Contact us at <span className="text-mat-wine font-black underline">contact@matriarchindia.com</span> with your Registered Phone Number and Transaction ID.</p>
             <p className="p-4 bg-mat-wine/5 border border-mat-wine/10 rounded-2xl italic">"We will acknowledge your request within 48 hours. Approved refunds are processed back to the original payment method within 5-7 business days, as per RBI guidelines."</p>
          </div>
        </section>

        <footer className="pt-12 border-t border-mat-rose/10">
           <h4 className="text-lg font-black uppercase tracking-widest text-mat-wine mb-4">6. CHARGEBACKS</h4>
           <p className="text-sm opacity-60 leading-relaxed">
             Initiating a chargeback without contacting support is considered a violation of our Terms. We reserve the right to permanently ban accounts that engage in unjustified chargebacks or "friendly fraud."
           </p>
        </footer>
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
        className="fixed inset-0 z-[300] bg-mat-obsidian/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
          className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative"
        >
          {/* Bento Cell 1: Metadata & Archive Identity (Span 4) */}
          <div className="md:col-span-4 mat-glass-deep p-10 rounded-[3.5rem] bg-mat-cream/5 border border-mat-rose/10 flex flex-col justify-between space-y-12">
             <div className="space-y-8">
                <div className="w-20 h-20 bg-mat-wine text-white rounded-3xl flex items-center justify-center shadow-mat-premium">
                   {Icon && <Icon size={40} strokeWidth={1.5} />}
                </div>
                <div className="space-y-4">
                   <h2 className="text-5xl font-black text-mat-wine italic leading-tight">{doc.title}</h2>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-slate/40">Sanctuary Registry</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-gold">Protocol // {slug?.toUpperCase()}</span>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-mat-obsidian/40 rounded-3xl border border-mat-rose/10 space-y-4">
                <div className="flex items-center gap-3 text-mat-gold">
                   <Award size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Statutory Compliance</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed italic">Verified under Global Asymmetric Governance Standards and DPDP 2023.</p>
             </div>
          </div>

          {/* Bento Cell 2: Primary Archive Content (Span 8) */}
          <div className="md:col-span-8 mat-glass-deep rounded-[4rem] bg-mat-cream/10 border border-mat-rose/10 overflow-hidden flex flex-col shadow-2xl relative" style={{ height: '70vh' }}>
              <div className="absolute top-8 right-8 z-50">
                <button onClick={onClose} className="w-14 h-14 rounded-full bg-mat-obsidian/10 text-mat-obsidian flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                   <X size={28} />
                </button>
              </div>
             
             <div className="flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar text-mat-wine">
                <div className="max-w-3xl mx-auto">
                   {doc.content}
                </div>
             </div>

             <div className="px-12 py-8 bg-mat-obsidian/20 text-center border-t border-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[1.2rem] text-mat-gold/40">Imperial Archive Sealed // Registry 0.1</p>
                <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">Matriarch is a trademark of METACHASM (OPC) PRIVATE LIMITED.</p>
             </div>
          </div>

          {/* Bento Cell 3: Support & Grievance (Span 12) Overlay Context */}
          <div className="md:col-span-12 mat-glass-deep p-8 rounded-[2.5rem] border border-mat-gold/10 bg-mat-gold/5 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6">
                <RefreshCcw size={20} className="text-mat-gold animate-spin-slow" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-mat-wine/60">Registry state is persistent. Changes to protocols are broadcast via the communications hub.</p>
             </div>
             <div className="flex items-center gap-4">
                <span className="text-[9px] font-black uppercase text-mat-gold">Support Line:</span>
                <span className="text-[10px] font-bold italic text-mat-wine">contact@matriarchindia.com</span>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LegalArchiveOverlay;
