import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  Zap,
  X,
  Eye,
  MessageSquare,
  Lock,
  ArrowRight,
  Shield,
  Star,
  UserCheck,
  ZapOff
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import MatriarchLogo from "@/components/MatriarchLogo";
import { supabase } from "@/lib/supabase";
import LegalArchiveOverlay from "@/components/layout/LegalArchiveOverlay";

const HeroSlideshow: React.FC<{ opacity?: number, className?: string }> = ({ opacity = 1, className = "" }) => {
  const images = [
    "/assets/slideshow/desi-1.png",
    "/assets/slideshow/desi-2.png",
    "/assets/slideshow/desi-3.png",
    "/assets/slideshow/desi-4.png"
  ];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [error, setError] = useState("");
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Persistence Logic: If not remembering, set a persistent marker in localStorage
      // and a tab-local marker in sessionStorage. On app load, if the marker exists
      // but the tab-local one is gone, we know the session has "expired".
      if (!rememberMe) {
        localStorage.setItem('MAT_SESSION_ONLY', 'true');
        sessionStorage.setItem('MAT_TAB_SESSION', 'true');
      } else {
        localStorage.removeItem('MAT_SESSION_ONLY');
        sessionStorage.removeItem('MAT_TAB_SESSION');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-body" style={{background:'linear-gradient(160deg,#FAF7F2 0%,#F5E6E4 50%,#EEE0DA 100%)'}}>
      {/* Romantic background — soft parchment gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20" style={{background:'radial-gradient(circle, #C9A09A, transparent 70%)', transform:'translate(30%, -30%)'}} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15" style={{background:'radial-gradient(circle, #BFA06A, transparent 70%)', transform:'translate(-30%, 30%)'}} />
      </div>

      <header className="fixed top-0 z-50 w-full backdrop-blur-xl" style={{borderBottom:'1px solid rgba(201,160,154,0.15)', background:'rgba(250,247,242,0.82)'}}>
        <nav className="mat-container flex h-16 items-center justify-between">
          <MatriarchLogo className="scale-75 origin-left" />
          <button
            onClick={() => setShowSignIn(true)}
            className="h-9 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            style={{background:'linear-gradient(135deg,#7B2D42,#96404F)', color:'white', fontFamily:'Helvetica,sans-serif', boxShadow:'0 4px 16px rgba(123,45,66,0.2)'}}
          >
            Sign In
          </button>
        </nav>
      </header>

      <main className="pt-16">
        {/* 1. HERO SECTION */}
        <section className="mat-section relative overflow-hidden">
          <div className="mat-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-12 lg:pt-24">
            <div className="fade-up space-y-8 lg:space-y-12 text-left">
              <div className="flex justify-start">
                <span style={{fontFamily:'Helvetica,sans-serif', background:'rgba(201,160,154,0.12)', border:'1px solid rgba(201,160,154,0.25)', borderRadius:'999px'}} className="py-1.5 px-5 text-[10px] font-bold uppercase tracking-[0.4em] text-mat-rose italic">
                  Real Connections, by Intention
                </span>
              </div>
              
              <h1 style={{fontFamily:'"Playfair Display",Georgia,serif'}} className="text-6xl sm:text-7xl lg:text-8xl font-bold italic leading-tight text-mat-wine py-2">
                Where love <br />
                <span className="text-mat-rose/40">finds its way</span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4 text-mat-gold/80">
                  — beautifully.
                </span>
              </h1>
              
              <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-lg lg:text-xl text-mat-slate/70 font-medium leading-relaxed max-w-xl">
                Matriarch is a curated sanctuary for meaningful connection — where her choice leads and every story matters.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-start gap-4 lg:gap-6 mt-8 lg:mt-12 px-0">
                <button
                  onClick={() => setShowSignIn(true)}
                  className="h-14 px-10 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] text-white transition-all flex items-center justify-center gap-3"
                  style={{background:'linear-gradient(135deg,#7B2D42,#96404F)', boxShadow:'0 6px 20px rgba(123,45,66,0.3)', fontFamily:'Helvetica,sans-serif'}}
                >
                  Begin Your Journey
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 px-10 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] transition-all border-2"
                  style={{borderColor:'rgba(123,45,66,0.3)', color:'#7B2D42', fontFamily:'Helvetica,sans-serif'}}
                >
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-8 border-t" style={{borderColor:'rgba(201,160,154,0.25)'}}>
                {[
                  "Women-first design",
                  "Verified matching",
                  "Intentional connections",
                  "Privacy by default"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]" style={{color:'#7B2D42', fontFamily:'Helvetica,sans-serif'}}>
                    <Heart className="w-3 h-3 text-mat-rose shrink-0" strokeWidth={2} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative fade-in mt-12 lg:mt-0 w-full h-full min-h-[500px] bg-black/5 border border-black/10 overflow-hidden">
                <HeroSlideshow opacity={0.8} />
                <div className="absolute inset-0 bg-white/20 mix-blend-overlay pointer-events-none" />
                <div className="absolute bottom-8 left-8 z-10 px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.5em]">
                  Case Archive: Profile // Selected
                </div>
            </div>
          </div>
        </section>
        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="mat-section border-b border-black/5">
          <div className="mat-container">
            <div className="mb-24 space-y-6">
              <Badge variant="outline" className="px-4 py-1 border-black/10 uppercase tracking-[0.4em] font-black text-[9px] bg-black/5 rounded-none">The Architecture</Badge>
              <h2 className="text-6xl lg:text-8xl mat-text-display-pro text-black uppercase leading-[0.9] py-2">
                Engineering <br />
                <span className="text-black/20">Connection.</span>
              </h2>
              <p className="text-xl text-black/60 max-w-2xl font-medium">A sanctuary for intentional engagement, designed for hearts that value depth over noise.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
              {[
                { title: "Her Choice", label: "Observe. Decide.", desc: "Browse profiles of men who share your values. Connect only when you feel a genuine spark.", icon: Eye },
                { title: "The Seeker", label: "Grow. Be Found.", desc: "No chasing. Construct a profile of substance, share your story, and await discovery by the woman who recognizes your heart.", icon: UserCheck },
                { title: "Grace", label: "Her Terms. Always.", desc: "Connection begins only how and when she defines. Once a match is made, she chooses the way you both talk.", icon: MessageSquare }
              ].map((step, i) => (
                <div key={i} className="bg-white p-12 lg:p-16 group hover:bg-black/5 transition-all duration-500">
                  <div className="mb-12 p-6 border border-black/10 w-fit group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <step.icon className="w-8 h-8" strokeWidth={1} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-black/40">{step.title}</h3>
                  <h4 className="text-4xl mat-text-display-pro text-black mb-6 uppercase leading-tight">{step.label}</h4>
                  <p className="text-[14px] text-black/60 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PROBLEM / SOLUTION */}
        <section className="mat-section bg-black text-white px-4 lg:px-8">
          <div className="mat-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                   <ZapOff className="text-white/20 w-8 h-8" strokeWidth={1} />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">The Landscape</h3>
                </div>
                <h2 className="text-5xl lg:text-7xl mat-text-display-pro text-white uppercase leading-[0.9]">Noise is <br /><span className="text-white/20">The Default.</span></h2>
                <div className="space-y-8">
                  {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                    <div key={item} className="flex items-center gap-6 text-white/40 border-l border-white/10 pl-6">
                      <X className="w-4 h-4" />
                      <span className="text-xl font-medium uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-12 border-l border-white/5 lg:pl-24">
                <div className="flex items-center gap-6">
                  <Crown className="text-white w-8 h-8" strokeWidth={1} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">The Matriarch Protocol</h3>
                </div>
                <h2 className="text-5xl lg:text-7xl mat-text-display-pro text-white uppercase leading-[0.9]">Quality is <br /><span className="underline decoration-4 underline-offset-8">Engineered.</span></h2>
                <div className="space-y-8">
                  {["Female-controlled matching", "Curated male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                    <div key={item} className="flex items-center gap-6 text-white group">
                      <div className="w-2 h-2 bg-white shrink-0" />
                      <span className="text-xl font-black uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURES */}
        <section className="mat-section border-b border-black/5">
          <div className="mat-container">
            <div className="mb-24 space-y-6">
              <h2 className="text-7xl mat-text-display-pro text-black uppercase leading-[0.85]">
                System <br /> <span className="text-black/20">Integrity.</span>
              </h2>
              <p className="text-xl text-black/60 font-medium max-w-xl">Designed for women who value their time and selective attention.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { title: "Women-first matching", desc: "Men do not browse women. Women decide who gets access to their time.", icon: UserCheck },
                { title: "Curated Discovery", desc: "Profiles are accessed through a smart system based on quality and relevance.", icon: Zap },
                { title: "Communication Modes", desc: "After matching, the woman selects exactly how the interaction starts.", icon: Shield },
                { title: "High-trust profiles", desc: "Verification and elite referrals are built into the core experience.", icon: Star },
                { title: "Intentional Standing", desc: "Men improve visibility through substance, not swiping volume.", icon: Crown },
                { title: "Private Architecture", desc: "Designed like a private salon, not a public attention feed.", icon: Lock },
              ].map((f, i) => (
                <div key={i} className="space-y-8 group">
                  <f.icon className="w-10 h-10 text-black/20 group-hover:text-black transition-all duration-500" strokeWidth={1} />
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-black">{f.title}</h3>
                    <p className="text-[14px] text-black/50 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. MEN'S RANKING SECTION */}
        <section className="mat-section relative overflow-hidden bg-black text-white px-4 lg:px-8">
           <div className="mat-container">
             <div className="grid lg:grid-cols-2 gap-24 items-start py-24">
                <div className="space-y-12">
                   <Badge variant="outline" className="px-5 py-1 uppercase tracking-[0.4em] font-black text-[9px] border-white/20 text-white/60">The Seeker Protocol</Badge>
                   <h2 className="text-6xl lg:text-8xl mat-text-display-pro text-white uppercase leading-[0.9]">Excellence <br /><span className="text-white/20">of Merit.</span></h2>
                   <p className="text-xl text-white/60 font-medium">
                     On Matriarch, visibility is not bought. It is earned through integrity, verification, and absolute standing.
                   </p>
                   
                   <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/10">
                     {[
                       { label: "Integrity", val: "99%" },
                       { label: "Elite Tier", val: "Top 1%" },
                       { label: "Auth Status", val: "Verified" },
                       { label: "Standing", val: "Absolute" }
                     ].map(item => (
                       <div key={item.label} className="space-y-3">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{item.label}</span>
                         <span className="text-4xl mat-text-display-pro text-white block">{item.val}</span>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Merit UI Mockup */}
                <div className="border border-white/10 p-12 lg:p-16 bg-white/5 space-y-12">
                   <div className="flex justify-between items-center">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Merit Status</span>
                         <h4 className="text-4xl mat-text-display-pro text-white uppercase">Elite Tier</h4>
                      </div>
                      <div className="w-16 h-16 border-2 border-white grid place-items-center">
                         <Crown className="w-8 h-8 text-white" strokeWidth={1} />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Visibility Index</span>
                         <span className="text-3xl mat-text-display-pro text-white">99.4</span>
                      </div>
                      <div className="h-6 bg-white/10 relative">
                         <div className="absolute inset-0 bg-white" style={{ width: '99.4%' }} />
                      </div>
                   </div>

                   <div className="p-8 border border-white/20 flex items-center justify-between group hover:bg-white hover:text-black transition-all duration-500 cursor-pointer">
                      <span className="text-[11px] font-black uppercase tracking-[0.5em]">Verification Archive // REQ</span>
                      <ArrowRight className="w-6 h-6" />
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* 6.5 DIVINE ECONOMY (DAILY REWARDS) */}
        <section className="mat-section border-b border-black/5">
           <div className="mat-container flex flex-col items-start pt-24">
              <div className="mb-24 max-w-2xl space-y-8">
                 <Badge variant="outline" className="px-6 py-1 uppercase tracking-[0.4em] font-black text-[9px] border-black/10 bg-black/5 rounded-none">Devotion</Badge>
                 <h2 className="text-6xl lg:text-8xl mat-text-display-pro text-black uppercase leading-[0.9]">Consistency <br /><span className="text-black/20">Inherited.</span></h2>
                 <p className="text-xl text-black/60 font-medium">Daily engagement is recognized and rewarded through token blessings. Presence is prestige.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-px bg-black/5 border border-black/5 w-full">
                 {[
                   { title: "Daily Entry", reward: "+10", desc: "For every dawn you join the sanctuary.", icon: Zap },
                   { title: "7 Day Streak", reward: "+100", desc: "A week of dedicated intention.", icon: Star },
                   { title: "30 Day Devotion", reward: "+1000", desc: "Monthly absolute alignment.", icon: Crown }
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-12 lg:p-16 group hover:bg-black/5 transition-all duration-500">
                      <div className="relative z-10 space-y-12">
                         <div className="w-16 h-16 border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                            <item.icon size={28} strokeWidth={1} />
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-black/40">{item.title}</h4>
                            <div className="text-5xl lg:text-7xl mat-text-display-pro text-black leading-none">{item.reward}</div>
                         </div>
                         <p className="text-[12px] text-black/60 font-medium uppercase tracking-widest">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 7. SAFETY / TRUST */}
        <section className="mat-section bg-black text-white py-40">
          <div className="mat-container text-left max-w-7xl">
             <div className="grid lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                   <div className="w-32 h-32 border-4 border-white grid place-items-center">
                      <ShieldCheck className="w-16 h-16 text-white" strokeWidth={1} />
                   </div>
                   <h2 className="text-6xl lg:text-9xl mat-text-display-pro text-white uppercase leading-[0.85]">Grace <br /><span className="text-white/20">& Security.</span></h2>
                   <p className="text-2xl text-white/40 font-medium max-w-xl">
                     Matriarch is designed to give women absolute control. Safety is not a feature; it is the fundamental architecture.
                   </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     "Communication Isolation",
                     "Verification Journey",
                     "Privacy Infrastructure",
                     "Selective Discovery",
                     "Moderated Mechanics",
                     "Elite Referral Protocols"
                   ].map((item, i) => (
                     <div key={i} className="p-10 border border-white/10 hover:bg-white hover:text-black transition-all cursor-crosshair">
                       <span className="text-[11px] font-black uppercase tracking-[0.5em]">{item}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* 8. PREMIUM BRAND STATEMENT */}
        <section className="mat-section py-40 border-b border-black/5">
            <div className="mat-container text-left relative z-10 space-y-16">
               <h2 className="text-[11px] font-black uppercase tracking-[1em] text-black/20">Private // Selective // System</h2>
               <div className="max-w-4xl space-y-12">
                  <p className="text-4xl lg:text-6xl font-medium leading-[1.1] text-black uppercase tracking-tighter">
                    "Matriarch is for women who are done performing for algorithms. It creates an <span className="text-black/20">elegant dynamic</span> of choice."
                  </p>
                  <div className="w-40 h-px bg-black" />
                  <div className="text-4xl mat-text-display-pro text-black uppercase tracking-tighter">Matriarch.</div>
               </div>
            </div>
        </section>

        {/* Bento Feature Matrix */}
        <section className="mat-section relative overflow-hidden" id="matrix">
          <div className="mat-container space-y-24">
            <div className="text-left space-y-6 max-w-2xl">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">The Infrastructure</span>
               <h2 className="text-6xl lg:text-8xl mat-text-display-pro text-black leading-[0.9] uppercase tracking-tighter">
                 Selection <br />
                 <span className="text-black/20">Architecture.</span>
               </h2>
            </div>
            
            <div className="bento-grid">
               {/* 1. Vetting (Large) */}
               <div className="bento-span-8 bento-item mat-glass-deep p-12 group h-[400px]">
                  <div className="flex flex-col h-full justify-between">
                     <div className="space-y-6">
                        <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-2xl">
                           <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-4xl font-black text-black uppercase tracking-tighter leading-[1.1] italic">Identity <br />Verification.</h3>
                        <p className="text-black/60 font-mono text-xs leading-relaxed max-w-sm uppercase">Every initiate undergoes a multi-layer verification sequence to ensure the sanctuary's absolute integrity. Zero exceptions.</p>
                     </div>
                     <div className="flex gap-3">
                        <Badge variant="outline" className="px-4 py-2 text-[9px] font-black uppercase border-black/10">Verified Souls Only</Badge>
                        <Badge variant="outline" className="px-4 py-2 text-[9px] font-black uppercase border-black/10">0% Ghosting</Badge>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                     <ShieldCheck size={280} strokeWidth={0.5} />
                  </div>
               </div>

               {/* 2. Synch (Medium) */}
               <div className="bento-span-4 bento-item mat-glass bg-matriarch-violet/5 hover:bg-matriarch-violet/10 group h-[400px]">
                  <div className="flex flex-col h-full justify-between gap-8">
                     <div className="space-y-6">
                        <Zap className="w-10 h-10 text-matriarch-violet" strokeWidth={1.5} />
                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">Instant <br />Synchronicity.</h3>
                        <p className="text-black/60 font-mono text-[10px] leading-relaxed uppercase">Real-time matching based on intent, standing, and presence score. No algorithms, just alignment.</p>
                     </div>
                     <div className="mt-auto space-y-4">
                        <div className="flex justify-between text-[8px] font-black uppercase text-matriarch-violet">
                           <span>Matrix Alignment</span>
                           <span>98.4%</span>
                        </div>
                        <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                           <motion.div 
                              animate={{ x: ["-100%", "100%"] }} 
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="h-full w-20 bg-matriarch-violet" 
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* 3. Sanctuary (Small) */}
               <div className="bento-span-4 bento-item mat-glass group overflow-hidden">
                  <div className="space-y-6">
                     <Heart className="w-8 h-8 text-red-500" strokeWidth={1.5} />
                     <h4 className="text-xl font-black text-black uppercase tracking-tighter italic">Safe <br />Haven.</h4>
                     <p className="text-black/40 font-mono text-[9px] leading-relaxed uppercase">A focus on high-value dialogue and long-term meaningful connection.</p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-black/5 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase text-black/20 italic">Encrypted</span>
                     <ArrowUpRight className="w-4 h-4 text-black/20 group-hover:text-black transition-colors" />
                  </div>
               </div>

               {/* 4. Rank (Small - Dark) */}
               <div className="bento-span-4 bento-item bg-black text-white group h-[300px]">
                  <div className="flex flex-col h-full justify-between">
                     <div className="space-y-6">
                        <Activity className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" strokeWidth={1} />
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Standing <br />Hierarchy.</h4>
                        <p className="text-white/40 font-mono text-[9px] leading-relaxed uppercase">Earn your standing through verified presence and contribution.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-white/20" />
                        <span className="text-[8px] font-black tracking-widest uppercase">Verified System</span>
                     </div>
                  </div>
               </div>

               {/* 5. Discovery (Small) */}
               <div className="bento-span-4 bento-item mat-glass">
                  <div className="space-y-6">
                     <Crown className="w-8 h-8 text-mat-gold" strokeWidth={1.5} />
                     <h4 className="text-xl font-black text-black uppercase tracking-tighter italic">Discovery <br />Indexing.</h4>
                     <p className="text-black/40 font-mono text-[9px] leading-relaxed uppercase">Sophisticated indexing that honors your preferences and temporal status.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 8.5 ACCESS MATRIX (Refactored Pricing) */}
        <section className="mat-section relative bg-neutral-50/30" id="access">
          <div className="mat-container space-y-24">
            <div className="text-center space-y-6">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">The Covenant</span>
               <h2 className="text-6xl lg:text-9xl mat-text-display-pro text-black leading-[0.85] uppercase tracking-tighter">
                 Tiered <br />
                 <span className="text-black/20">Access.</span>
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
              {[
                { name: 'Observer', price: 'Free', role: 'Basic access for verified searchers.', items: ['Limited discovery', 'Standard profile', 'Base ranking'], cta: 'Begin Journey' },
                { name: 'Initiate', price: '₹2,499', role: 'Advanced presence for seekers.', items: ['Extended discovery', 'Verified seal', 'Priority synchronicity', 'Token yield'], premium: true },
                { name: 'Sovereign', price: '₹9,999', role: 'Absolute authority within sanctuary.', items: ['Infinite discovery', 'Direct intervention', 'Architect status', 'Elite standing'], cta: 'Ascend Status' },
              ].map((tier, i) => (
                <div key={i} className={`p-16 space-y-16 flex flex-col justify-between transition-all group ${tier.premium ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'}`}>
                   <div className="space-y-12">
                      <div className="flex justify-between items-start">
                         <h3 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none">{tier.name}<br /><span className="opacity-10 text-2xl">Access.</span></h3>
                         {tier.premium && <Crown className="text-mat-gold w-6 h-6" />}
                      </div>
                      
                      <div className="space-y-4">
                         <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{tier.role}</p>
                      </div>

                      <ul className="space-y-4 pt-12 border-t border-current opacity-10">
                         {tier.items.map(item => (
                           <li key={item} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-all group-hover:translate-x-1">
                              <ShieldCheck className="w-4 h-4 opacity-40" />
                              {item}
                           </li>
                         ))}
                      </ul>
                   </div>

                   <button className={`w-full h-20 text-[10px] font-black uppercase tracking-[0.5em] transition-all border-2 ${
                     tier.premium ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white border-black hover:bg-neutral-800'
                   }`}>
                      {tier.cta || 'Initiate Access'}
                   </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section className="mat-section py-40">
          <div className="mat-container">
             <div className="text-left space-y-16">
                <h2 className="text-8xl lg:text-[12rem] mat-text-display-pro text-black leading-[0.8] uppercase tracking-tighter">
                   Your <br />
                   <span className="text-black/20">Legacy</span> 
                   <br />Begins.
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                    <button className="h-32 px-16 bg-black text-white text-2xl font-black uppercase tracking-[0.2em] transition-all hover:bg-neutral-800" onClick={() => setShowSignIn(true)}>
                       Enter Portal
                    </button>
                    <p className="text-xl text-black/40 font-medium max-w-sm italic">
                       Matriarch is a private architectural dynamic for connection. By merit only.
                    </p>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-40">
        <div className="mat-container">
           <div className="grid lg:grid-cols-4 gap-24 mb-40">
              <div className="space-y-12">
                 <MatriarchLogo className="invert brightness-0" />
                 <p className="text-[13px] text-white/40 leading-relaxed font-medium max-w-xs">
                   Private ecosystem built for selective intention. Swiss precision dating architecture.
                 </p>
              </div>
              
              <div className="space-y-8">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Archive</h5>
                 <ul className="space-y-4 text-[12px] font-black uppercase tracking-widest text-white/60">
                    <li onClick={() => setActiveOverlay('protocol')} className="hover:text-white transition-all cursor-pointer">Protocol</li>
                    <li onClick={() => setActiveOverlay('philosophy')} className="hover:text-white transition-all cursor-pointer">Philosophy</li>
                    <li onClick={() => setActiveOverlay('case-studies')} className="hover:text-white transition-all cursor-pointer">Case Studies</li>
                 </ul>
              </div>

              <div className="space-y-8">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Legal</h5>
                 <ul className="space-y-4 text-[12px] font-black uppercase tracking-widest text-white/60">
                    <li onClick={() => setActiveOverlay('privacy-pact')} className="hover:text-white transition-all cursor-pointer">Privacy Pact</li>
                    <li onClick={() => setActiveOverlay('terms-of-merit')} className="hover:text-white transition-all cursor-pointer">Terms of Merit</li>
                    <li onClick={() => setActiveOverlay('refund-policy')} className="hover:text-white transition-all cursor-pointer">Refund Policy</li>
                 </ul>
              </div>

              <div className="space-y-8">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">System Status</h5>
                 <div className="p-8 border border-white/10 space-y-6">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                       <span>Nodes Active</span>
                       <span className="text-white">99.9%</span>
                    </div>
                    <div className="h-1 bg-white/20 relative">
                       <div className="absolute inset-0 bg-white" style={{ width: '99%' }} />
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="pt-24 border-t border-white/10 text-center">
              <p className="text-[14px] font-black tracking-[1em] text-white/10 uppercase select-none">
                MATRIARCH // SINCE 2024
              </p>
           </div>
        </div>
      </footer>

      {/* Sign-In Modal — Romantic Glass */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: 'rgba(250,240,235,0.5)', backdropFilter: 'blur(24px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="max-w-md w-full overflow-hidden"
              style={{ borderRadius: '3rem', border: '1px solid rgba(201,160,154,0.25)', background: 'rgba(255,251,247,0.95)', boxShadow: '0 40px 100px rgba(123,45,66,0.18)' }}
            >
              <div className="p-12 space-y-8 relative">
                <button
                  onClick={() => setShowSignIn(false)}
                  className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full transition-all"
                  style={{ background: 'rgba(201,160,154,0.12)', color: '#7B2D42' }}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="text-center space-y-4 pt-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2"
                    style={{ background: 'linear-gradient(135deg, #C9A09A, #7B2D42)' }}>
                    <Heart className="w-8 h-8 text-white" strokeWidth={1.5} fill="rgba(255,255,255,0.3)" />
                  </div>
                  <h2 style={{fontFamily:'"Playfair Display",Georgia,serif', color:'#7B2D42'}} className="text-4xl font-bold italic leading-tight">
                    Welcome back
                  </h2>
                  <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[12px] text-mat-slate/50 leading-relaxed">
                    Sign in with Google to continue your journey
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl border" style={{ background: 'rgba(255,235,235,0.8)', borderColor: 'rgba(220,100,100,0.2)' }}>
                    <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-red-600 text-[11px] font-bold text-center">{error}</p>
                  </div>
                )}

                <button
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="w-full h-14 flex items-center justify-center gap-4 rounded-2xl font-bold text-sm transition-all"
                  style={{
                    background: isLoading ? 'rgba(201,160,154,0.3)' : 'linear-gradient(135deg, #7B2D42, #96404F)',
                    color: 'white',
                    fontFamily: 'Helvetica,sans-serif',
                    boxShadow: '0 8px 32px rgba(123,45,66,0.25)'
                  }}
                >
                  {isLoading ? (
                    <div className="flex gap-1.5">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay:`${i*0.12}s`}} />)}
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Keep Me Signed In */}
                <label className="flex items-center gap-3 cursor-pointer group px-1">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className="relative w-10 h-6 rounded-full transition-all flex-shrink-0"
                    style={{ background: rememberMe ? 'linear-gradient(135deg,#C9A09A,#7B2D42)' : 'rgba(201,160,154,0.2)' }}
                  >
                    <motion.div
                      animate={{ x: rememberMe ? 16 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                  <span style={{fontFamily:'Helvetica,sans-serif'}} className="text-[11px] text-mat-slate/60 font-medium">
                    Keep me signed in on this device
                  </span>
                </label>

                <p style={{fontFamily:'Helvetica,sans-serif'}} className="text-[10px] text-mat-slate/30 text-center leading-relaxed">
                  By signing in you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛠️ Dev Admin Bypass — visible via ?admin=true query param */}
      {new URLSearchParams(window.location.search).get('admin') === 'true' && (
        <div className="fixed bottom-4 left-4 z-[200] flex gap-2">
           <button 
             onClick={() => { window.location.href = window.location.origin + '?devbypass=woman'; }}
             className="px-4 py-2 bg-mat-wine text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg opacity-60 hover:opacity-100 transition-opacity"
           >
             Bypass: Woman
           </button>
           <button 
             onClick={() => { window.location.href = window.location.origin + '?devbypass=man'; }}
             className="px-4 py-2 bg-mat-gold text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg opacity-60 hover:opacity-100 transition-opacity"
           >
             Bypass: Man
           </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      ` }} />

       <LegalArchiveOverlay 
         slug={activeOverlay} 
         onClose={() => setActiveOverlay(null)} 
       />
    </div>
  );
};

export default LandingPage;
