import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Crown, Activity, Heart, Zap, ExternalLink, ArrowUpRight } from 'lucide-react';
import { SEO_COPY } from '@/content/copy';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface BentoDashboardFoldProps {
  onOpenLegal?: (slug: string) => void;
  onScrollToTop?: () => void;
}

const BENTO_ITEMS = [
  {
    title: "Identity Verification",
    desc: "Every member is verified to ensure a secure and genuine community.",
    icon: ShieldCheck,
    badges: ["Verified Profiles Only", "0% Ghosting"],
  },
  {
    title: "Precision Matching",
    desc: "Real-time matching based on lifestyle, values, and activity.",
    icon: Zap,
    badges: ["Alignment", "98.4%"],
  },
  {
    title: "Safe Haven",
    desc: "A private community designed for high-value dialogue and meaningful connection.",
    icon: Heart,
    badges: ["E2E Encrypted"],
  },
  {
    title: "Quality Network",
    desc: "Enhance your profile through verified activity and positive interactions.",
    icon: Activity,
    badges: ["Verified Status"],
  }
];

const BentoDashboardFold: React.FC<BentoDashboardFoldProps> = ({ onOpenLegal, onScrollToTop }) => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="relative min-h-[100dvh] w-full snap-start flex flex-col pt-20 pb-8 px-6 lg:px-12 bg-mat-cream selection:bg-mat-gold/20 selection:text-mat-slate z-20">
      
      {/* Background Ambient Grid/Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(123,45,66,0.03)_0%,transparent_50%)]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_50%_50%,rgba(191,160,106,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto w-full flex-grow flex flex-col relative z-10 gap-6">
        
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
          
          {/* Card 1: The Distinction (Chaos vs Order) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-mat-ivory p-8 md:p-12 border border-mat-gold/20 shadow-xl relative overflow-hidden group flex flex-col justify-between min-h-[400px]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-mat-gold/5 blur-[100px] pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <Crown className="text-mat-gold w-5 h-5" strokeWidth={1} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">The Protocol</h3>
              </div>
              <h2 className="text-4xl md:text-6xl font-display text-mat-slate uppercase leading-[0.9]">
                Chaos vs <br /><span className="text-mat-gold italic font-display tracking-normal">Order</span>
              </h2>
              <p className="text-mat-slate/50 font-light leading-relaxed max-w-sm mt-4">
                Noise is the default in modern connection. Here, quality is engineered through rigorous selection and absolute female control.
              </p>
            </div>

            <div className="space-y-3 pt-8 relative z-10">
              {SEO_COPY.landing.protocol.features.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-mat-slate/80">
                  <div className="w-1.5 h-1.5 bg-mat-gold rounded-full shadow-[0_0_12px_#BFA06A]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Selection Matrix Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENTO_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-mat-ivory/50 backdrop-blur-sm border border-mat-gold/10 p-6 flex flex-col justify-between group hover:bg-mat-ivory hover:border-mat-gold/30 transition-all duration-500 shadow-sm"
              >
                <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-mat-gold/5 border border-mat-gold/20 text-mat-gold shadow-md">
                    <item.icon className="w-5 h-5" strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-mat-slate uppercase leading-none tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-mat-slate/50 font-light text-[12px] leading-relaxed max-w-xs">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-6 mt-4 border-t border-mat-gold/10 flex gap-2">
                   {item.badges.map(b => (
                     <Badge key={b} variant="outline" className="px-2 py-0.5 text-[8px] font-black uppercase border-mat-gold/20 text-mat-slate/40">
                       {b}
                     </Badge>
                   ))}
                </div>
                <item.icon 
                  size={120} 
                  strokeWidth={0.5} 
                  className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none text-mat-slate" 
                />
              </motion.div>
            ))}
          </div>

          {/* Card 3: The Process / How it Works (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 bg-mat-wine text-mat-cream rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center justify-between border border-mat-rose/20 shadow-2xl mt-6"
          >
            {/* Ambient Background for Dark Card */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-mat-rose/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="md:w-1/3 space-y-6 relative z-10 text-center md:text-left">
              <span className="px-4 py-1 border border-mat-rose/30 uppercase tracking-[0.4em] font-black text-[9px] bg-mat-rose/10 text-mat-rose inline-block">
                The Process
              </span>
              <h2 className="text-4xl md:text-6xl font-display uppercase leading-[0.9]">
                Step by <br /><span className="text-mat-rose/60 italic font-display">Step</span>
              </h2>
              <p className="text-mat-cream/50 font-light leading-relaxed text-sm max-w-sm mx-auto md:mx-0">
                A sanctuary for intentional engagement, designed for hearts that value depth over noise.
              </p>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              {SEO_COPY.landing.how_it_works.steps.map((step, i) => (
                <div key={i} className="flex flex-col space-y-4 items-center text-center">
                  <div className="w-12 h-12 rounded-full border border-mat-rose/30 flex items-center justify-center text-mat-rose font-display text-xl bg-mat-rose/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-rose/60 mb-2">{step.title}</h3>
                    <h4 className="text-lg font-display uppercase tracking-tight text-white mb-2">{step.label}</h4>
                    <p className="text-[11px] text-mat-cream/40 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>


        {/* Footer (Simplified & Embedded) */}
        <div className="mt-auto pt-8 border-t border-mat-gold/10 w-full pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex gap-6 text-[9px] text-mat-slate/60 font-bold uppercase tracking-[0.2em]">
              <Link to="/legal/privacy-pact" className="hover:text-mat-wine transition-colors">Privacy Pact</Link>
              <Link to="/legal/terms-of-merit" className="hover:text-mat-wine transition-colors">Terms of Merit</Link>
              <Link to="/legal/protocol" className="hover:text-mat-wine transition-colors">Sanctuary Code</Link>
            </div>
            
            <button 
              onClick={onScrollToTop}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold/60 hover:text-mat-gold transition-colors"
            >
              Return to Zenith <ArrowUpRight className="w-3 h-3" />
            </button>

            <p className="text-[8px] text-mat-slate/40 font-bold tracking-[0.4em] uppercase text-center lg:text-right">
              © {currentYear} Matriarch. <br className="lg:hidden" />
              METACHASM (OPC) PVT LTD.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BentoDashboardFold;
