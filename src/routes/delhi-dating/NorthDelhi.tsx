import React from 'react';
import { SEOProvider } from '@/components/SEOProvider';
import { motion } from 'framer-motion';
import { MapPin, Heart, Shield, CheckCircle } from 'lucide-react';

const NorthDelhi: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Best First Date Places in North Delhi | Matriarch Dating",
    "description": "Discover North Delhi's best-kept secrets for a perfect first date. Matriarch provides a secure platform for couples in Civil Lines, Model Town, and Pitampura.",
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
        "name": "North Delhi",
        "item": "https://www.matriarchindia.com/delhi-dating/north-delhi"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-mat-cream text-mat-wine pb-20 font-body">
      <SEOProvider 
        title="Best First Date Places North Delhi | Matriarch Dating Guide"
        description="Discover North Delhi's top first date spots. From Civil Lines cafes to Model Town views, plan your perfect safe date with Matriarch."
        canonical="https://www.matriarchindia.com/delhi-dating/north-delhi"
        schema={schema}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-mat-cream">
        <div className="absolute inset-x-0 bottom-0 top-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mat-rose/20 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-mat-rose uppercase tracking-[0.4em] text-xs font-black mb-8 block"
          >
            North Delhi's Hidden Gems
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mat-text-fluid-huge mb-8 italic"
          >
            The Perfect <br /><span className="text-mat-rose/60 font-black">First Date Guide.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-mat-wine/50 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Planning a first date in North Delhi? From the colonial charm of Civil Lines to the vibrant cafes of Model Town, we've curated the safest, most elite spots for your first connection.
          </motion.p>
        </div>
      </section>

      {/* Discovery List */}
      <section className="container mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-24">
            <div>
              <span className="text-mat-rose uppercase tracking-[0.3em] text-[10px] font-black mb-6 block">Spotlight 01</span>
              <h3 className="text-4xl mat-text-display-pro mb-4">Civil Lines Heritage Cafes</h3>
              <p className="text-lg text-mat-wine/60 font-light leading-relaxed mb-8">
                North Delhi's quietest retreat. Ideal for deep conversations over artisanal coffee in a colonial-era setting.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mat-rose/5 rounded-full border border-mat-rose/10 text-mat-rose text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3 h-3" /> Recommended for: Verification Highs
              </div>
            </div>
            <div>
              <span className="text-mat-rose uppercase tracking-[0.3em] text-[10px] font-black mb-6 block">Spotlight 02</span>
              <h3 className="text-4xl mat-text-display-pro mb-4">Model Town Lake Views</h3>
              <p className="text-lg text-mat-wine/60 font-light leading-relaxed mb-8">
                A serene sunset walk by the Naini Lake followed by dinner at a boutique rooftop restaurant.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mat-rose/5 rounded-full border border-mat-rose/10 text-mat-rose text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3 h-3" /> Recommended for: Romantic Resonance
              </div>
            </div>
          </div>
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-mat-wine/10 border border-mat-rose/5">
             <img 
               src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000" 
               alt="North Delhi First Date" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/80 via-transparent to-transparent flex items-end p-12">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-full border border-mat-rose/30 flex items-center justify-center">
                    <CheckCircle className="text-mat-rose w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em]">Safety-Verified Zone</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="bg-white/50 py-32 border-y border-mat-rose/10">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="h-48 rounded-[2rem] bg-mat-rose/5 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60" />
                </div>
                <div className="h-48 rounded-[2rem] bg-mat-rose/10 transform translate-y-8"></div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <Shield className="w-12 h-12 text-mat-rose mb-8" strokeWidth={1} />
            <h2 className="mat-text-fluid-huge mb-8 italic">North Delhi <span className="text-mat-rose/40">Trust Loop.</span></h2>
            <p className="text-lg text-mat-wine/60 font-light leading-relaxed mb-12">
              Every profile matching in North Delhi is audited by the Matriarch Selection Engine. We ensure that your dating experience in the district is built on a foundation of verified intent and government-backed ID synchronization.
            </p>
             <div className="grid grid-cols-2 gap-8">
               <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-mat-rose mb-4">Verification</h4>
                  <p className="text-sm font-light text-mat-wine/40">Aadhaar + Biometric facial recognition protocol.</p>
               </div>
               <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-mat-rose mb-4">Authority</h4>
                  <p className="text-sm font-light text-mat-wine/40">Community-vetted sanctuary admission.</p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NorthDelhi;
