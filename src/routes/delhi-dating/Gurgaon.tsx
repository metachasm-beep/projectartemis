import React from 'react';
import { SEOProvider } from '@/components/SEOProvider';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Zap } from 'lucide-react';

const Gurgaon: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Verified Professionals Dating Gurgaon | Matriarch NCR",
    "description": "The premium dating protocol for Gurgaon's corporate elite. Verified professionals in CyberHub, Golf Course Road, and DLF Phase 1-5.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Delhi Dating",
        "item": "https://www.matriarchindia.com/delhi-dating"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Gurgaon",
        "item": "https://www.matriarchindia.com/delhi-dating/gurgaon"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-mat-cream text-mat-wine pb-20 font-body">
      <SEOProvider 
        title="Gurgaon Dating | Verified Professionals NCR | Matriarch"
        description="Elite dating for Gurgaon's professionals. High-tech verification sanctuary for CyberHub and Golf Course Road elitists."
        canonical="https://www.matriarchindia.com/delhi-dating/gurgaon"
        schema={schema}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[#0A0A0B]">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=2000" 
            alt="Gurgaon Skyline" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mat-rose/10 border border-mat-rose/20 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-mat-rose fill-mat-rose" />
            <span className="text-mat-rose uppercase tracking-[0.4em] text-[10px] font-black">CyberHub & Golf Course Road</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mat-text-fluid-huge text-white mb-8 italic"
          >
            Gurgaon's Corporate <br /><span className="text-mat-rose/80">Elite Sanctuary.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            For the high-performance professional, time is the ultimate currency. Matriarch automates the screening process, ensuring your Gurgaon dating experience is as efficient as it is curated.
          </motion.p>
        </div>
      </section>

      {/* Stats/Benefits */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-mat-rose uppercase tracking-[0.3em] text-[10px] font-black mb-6 block">Elite Presence</span>
            <h2 className="mat-text-fluid-huge text-5xl md:text-7xl mb-8 italic">Professionals <span className="text-mat-rose/40">Only.</span></h2>
            <p className="text-xl text-mat-wine/60 font-light leading-relaxed mb-12">
              Our Gurgaon directory is strictly limited to verified CXOs, founders, and consultants across NCR. We implement a rigorous vetting protocol that excludes any non-verified intent.
            </p>
            <div className="space-y-6">
              {[
                "Linked-In Professional Verification",
                "Workplace Validation",
                "Annual Professional Audits"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-mat-wine/10">
                  <CheckCircle className="text-mat-rose w-5 h-5" />
                  <span className="text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-mat-wine/5 p-8 rounded-[2rem] border border-mat-rose/5 transform translate-y-12">
              <h4 className="text-4xl font-bold mb-2">92%</h4>
              <p className="text-mat-wine/40 uppercase tracking-tighter text-xs">Verified Accuracy</p>
            </div>
            <div className="bg-mat-wine/5 p-8 rounded-[2rem] border border-mat-rose/5">
              <h4 className="text-4xl font-bold mb-2">450+</h4>
              <p className="text-mat-wine/40 uppercase tracking-tighter text-xs">Gurgaon Pioneers</p>
            </div>
            <div className="bg-mat-wine/5 p-8 rounded-[2rem] border border-mat-rose/5 transform translate-y-12">
              <h4 className="text-4xl font-bold mb-2">ZERO</h4>
              <p className="text-mat-wine/40 uppercase tracking-tighter text-xs">Bot Tolerance</p>
            </div>
            <div className="bg-mat-wine/5 p-8 rounded-[2rem] border border-mat-rose/5">
              <h4 className="text-4xl font-bold mb-2">SAFE</h4>
              <p className="text-mat-wine/40 uppercase tracking-tighter text-xs">Sanctuary Design</p>
            </div>
          </div>
        </div>
      </section>

       {/* Safety First Section */}
       <section className="bg-mat-wine py-32 text-white">
        <div className="container mx-auto px-6 text-center">
          <Shield className="w-16 h-16 text-mat-rose mx-auto mb-8" strokeWidth={1} />
          <h2 className="text-5xl mat-text-display-pro mb-8">Matriarch <span className="text-mat-rose">Verification Protocol</span></h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-16 font-light">
            Our multi-layered safety engine is designed to satisfy E-E-A-T signals, providing you with a high-authority sanctuary for dating in Gurgaon.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Visual Recognition", desc: "Live-selfie matching against government IDs to prevent catfishing." },
              { title: "Status Sync", desc: "Background verification of professional credentials for Gurgaon's elite." },
              { title: "Activity Guard", desc: "AI-driven monitoring to ensure all interactions adhere to sanctuary rules." }
            ].map((item, idx) => (
              <div key={idx} className="p-10 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-mat-rose mb-6 mx-auto" />
                <h4 className="text-xl font-bold mb-4 uppercase tracking-wider">{item.title}</h4>
                <p className="text-white/40 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gurgaon;
