import React from 'react';
import { SEOProvider } from '@/components/SEOProvider';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, MapPin, Users } from 'lucide-react';

const SouthDelhi: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Safe Dating in South Delhi | Matriarch Verified Professionals",
    "description": "Experience the safest dating protocol in South Delhi. Matriarch offers a sanctuary for verified professionals in Greater Kailash, Saket, and Hauz Khas.",
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
        "name": "South Delhi",
        "item": "https://www.matriarchindia.com/delhi-dating/south-delhi"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-mat-cream text-mat-wine pb-20">
      <SEOProvider 
        title="Safe Dating South Delhi | Verified Professionals | Matriarch"
        description="Experience elite, safe dating in South Delhi. Verified professionals only. Secure sanctuary for GK, Saket, and Vasant Vihar."
        canonical="https://www.matriarchindia.com/delhi-dating/south-delhi"
        schema={schema}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-mat-wine">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-restaurant-interior-with-elegant-tables-and-chairs-42031-large.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-mat-rose uppercase tracking-[0.4em] text-xs font-bold mb-4 block"
          >
            South Delhi Exclusive
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mat-text-fluid-huge text-white mb-8 italic"
          >
            Safe Dating for <br /><span className="text-mat-rose/80">Verified Professionals.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-mat-cream/80 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Matriarch brings a new standard of trust to the heart of South Delhi. From Greater Kailash to Vasant Vihar, discover connections that are as authentic as they are elite.
          </motion.p>
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="container mx-auto px-6 -mt-24 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Identity Vault", desc: "Every profile in South Delhi undergoes 3-tier identity verification." },
            { icon: CheckCircle, title: "Aadhaar Sync", desc: "Direct integration with government-grade verification systems." },
            { icon: MapPin, title: "Locality Focus", desc: "Hyper-local matching in GK, Saket, Vasant Vihar & Hauz Khas." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-10 border border-mat-rose/10 rounded-[2rem] shadow-2xl shadow-mat-wine/5"
            >
              <item.icon className="w-12 h-12 text-mat-rose mb-6" strokeWidth={1} />
              <h3 className="text-2xl mat-text-display-pro mb-4">{item.title}</h3>
              <p className="text-mat-wine/60 font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety First Section (E-E-A-T) */}
      <section className="container mx-auto px-6 py-32">
        <div className="bg-mat-wine text-white rounded-[3rem] p-12 md:p-24 overflow-hidden relative">
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-mat-rose uppercase tracking-[0.3em] text-[10px] font-black mb-6 block">Our Commitment</span>
              <h2 className="mat-text-fluid-huge text-5xl md:text-7xl mb-8 italic">Safety <span className="text-mat-rose/40">First.</span></h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-mat-rose/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-mat-rose w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Mandatory Biometrics</h4>
                    <p className="text-white/60 font-light">We use government-standard facial recognition to ensure the person you see is the person you meet.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-mat-rose/20 flex items-center justify-center flex-shrink-0">
                    <Users className="text-mat-rose w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Curated Community</h4>
                    <p className="text-white/60 font-light">Matriarch is a closed-loop sanctuary. Entry is by selection, maintaining a safe space for high-authority individuals.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-mat-rose/20 to-mat-wine border border-white/10 p-2 overflow-hidden shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=1000" 
                  alt="Safe Dating South Delhi" 
                  className="w-full h-full object-cover rounded-[1.8rem] opacity-80 mix-blend-overlay"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SouthDelhi;
