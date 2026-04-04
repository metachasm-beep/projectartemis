import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  ArrowRight, 
  Shield, 
  Star, 
  Zap, 
  X, 
  Eye, 
  UserCheck, 
  MessageSquare, 
  ShieldCheck,
  ZapOff,
  Crown,
  Trophy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MatriarchLogo from "@/components/MatriarchLogo";
import { supabase } from "@/lib/supabase";

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
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError("");
    try {
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
    <div className="mat-shell bg-white text-black selection:bg-black selection:text-white font-body">
      {/* Background with subtle Swiss grid */}
      <div className="fixed inset-0 -z-10 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-black/[0.02] to-transparent" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <nav className="mat-container flex h-16 items-center justify-between">
          <MatriarchLogo className="scale-75 origin-left" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black hover:bg-transparent"
            onClick={() => setShowSignIn(true)}
          >
            Access Portal
          </Button>
        </nav>
      </header>

      <main className="pt-16">
        {/* 1. HERO SECTION */}
        <section className="mat-section relative overflow-hidden">
          <div className="mat-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-12 lg:pt-24">
            <div className="fade-up space-y-8 lg:space-y-12 text-left">
              <div className="flex justify-start">
                <Badge variant="outline" className="py-1 px-4 border-black/10 uppercase tracking-[0.4em] font-black text-[9px] bg-black/5 rounded-none">
                  Selection Protocol — 1.1.0
                </Badge>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-9xl mat-text-display-pro text-black uppercase tracking-tighter leading-[0.85] py-2">
                Her heart <br />
                <span className="text-black/20">decides.</span>
                <div className="h-4 lg:h-8" />
                Everyone <br />
                else <span className="underline decoration-4 lg:decoration-8 underline-offset-8 lg:underline-offset-16">follows.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-black font-medium leading-tight max-w-xl">
                Matriarch is a architectural connection engine where journeys are defined by intention. A space built for selection, not swiping.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-start gap-4 lg:gap-6 mt-8 lg:mt-12 px-0">
                <button className="h-20 px-12 bg-black text-white font-black uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-neutral-800 flex items-center justify-center gap-4" onClick={() => setShowSignIn(true)}>
                  Initiate Portal
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="h-20 px-12 border-2 border-black text-black font-black uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-black/5" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  Case Studies
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-12 border-t border-black/5 text-[10px]">
                {[
                  "Women-first architecture",
                  "Verified Discovery",
                  "Asymmetric Selection",
                  "Privacy Infrastructure"
                ].map(item => (
                  <div key={item} className="mat-text-label-pro flex items-center gap-3 !tracking-[0.4em] text-left !text-black/40">
                    <div className="w-1.5 h-1.5 bg-black shrink-0" />
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

        {/* 8.5 PRICING SECTION */}
        <section className="mat-section border-b border-black/5">
          <div className="mat-container pt-24 pb-40">
            <div className="mb-24 space-y-8">
              <h2 className="text-7xl lg:text-9xl mat-text-display-pro text-black uppercase leading-[0.85]">The <br /><span className="text-black/20">Value.</span></h2>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-black/40">Excellence is preserved through discipline.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-px bg-black/5 border border-black/5">
              {/* Women's Card */}
              <div className="bg-white p-12 lg:p-24 space-y-16">
                 <div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 mb-8 block">The Protocol</span>
                    <h3 className="text-6xl mat-text-display-pro text-black uppercase">Free.</h3>
                 </div>
                 <div className="space-y-4">
                    <span className="text-xl font-medium italic text-black/60 block">By Selection Only.</span>
                    <ul className="space-y-6 pt-12 border-t border-black/5">
                       {[
                         "Selective Architecture Access",
                         "Verified Discovery Engine",
                         "Inner Circle Infrastructure"
                       ].map(item => (
                         <li key={item} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-black/60">
                            <div className="w-2 h-2 bg-black" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <button className="w-full h-24 border-2 border-black text-black font-black uppercase tracking-[0.5em] text-[11px] hover:bg-black hover:text-white transition-all">Apply for Access</button>
              </div>

              {/* Men's Card */}
              <div className="bg-black text-white p-12 lg:p-24 space-y-16">
                 <div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 block">The Presence</span>
                    <h3 className="text-6xl mat-text-display-pro text-white uppercase">₹2,499</h3>
                 </div>
                 <div className="space-y-4">
                    <span className="text-xl font-medium italic text-white/40 block">Scale the Ladder.</span>
                    <ul className="space-y-6 pt-12 border-t border-white/10">
                       {[
                         "Merit Ranking Visibility",
                         "Archival Profile Verified",
                         "Unlimited Discovery Presence"
                       ].map(item => (
                         <li key={item} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-white/60">
                            <div className="w-2 h-2 bg-white" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <button className="w-full h-24 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] hover:bg-neutral-200 transition-all">Initiate Standing</button>
              </div>
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
                    <li className="hover:text-white transition-all cursor-pointer">Protocol</li>
                    <li className="hover:text-white transition-all cursor-pointer">Philosophy</li>
                    <li className="hover:text-white transition-all cursor-pointer">Case Studies</li>
                 </ul>
              </div>

              <div className="space-y-8">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Legal</h5>
                 <ul className="space-y-4 text-[12px] font-black uppercase tracking-widest text-white/60">
                    <li className="hover:text-white transition-all cursor-pointer">Privacy Pact</li>
                    <li className="hover:text-white transition-all cursor-pointer">Terms of Merit</li>
                    <li className="hover:text-white transition-all cursor-pointer">Refund Policy</li>
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

      {/* Google Sign-In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80"
            onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="max-w-md w-full bg-white border border-black p-16 text-left relative overflow-hidden"
            >
              <button
                onClick={() => setShowSignIn(false)}
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center transition-all bg-black text-white hover:bg-neutral-800"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-12 inline-flex items-center justify-center w-24 h-24 border-2 border-black">
                <Crown className="w-12 h-12 text-black" strokeWidth={1} />
              </div>

              <h2 className="text-5xl mat-text-display-pro mb-8 text-black uppercase leading-tight tracking-tighter">Access <br />Protocol</h2>
              <p className="text-[13px] text-black/40 mb-12 font-medium leading-relaxed uppercase tracking-widest">
                Sign in with Google to enter the selective architecture.
              </p>

              {error && (
                <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-red-100 p-4 bg-red-50">{error}</p>
              )}

              <Button
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="w-full h-24 bg-black text-white hover:bg-neutral-800 flex items-center justify-center gap-6 rounded-none font-black text-[11px] uppercase tracking-[0.5em] transition-all"
              >
                {isLoading ? (
                  <span>Initiating...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google Auth</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
