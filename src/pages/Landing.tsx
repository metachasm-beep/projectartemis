// Matriarch Production - v1.0.1 (master)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  ArrowRight, 
  Shield, 
  Star, 
  Zap, 
  X, 
  Check, 
  Eye, 
  UserCheck, 
  MessageSquare, 
  ChevronRight,
  ShieldCheck,
  ZapOff,
  Crown,
  Trophy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { supabase } from "@/lib/supabase";
import DecryptedText from "@/components/ui/react-bits/DecryptedText";
import { cn } from "@/lib/utils";

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
    <div className="mat-shell selection:bg-matriarch-violet/30 selection:text-white">
      {/* Premium Background Layer */}
      <div className="fixed inset-0 -z-10 bg-matriarch-bg overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-matriarch-violet/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-matriarch-plum/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <HeroSlideshow 
          opacity={0.15} 
          className="absolute inset-0 z-[-5] mix-blend-screen pointer-events-none" 
        />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-matriarch-bg/60 backdrop-blur-xl">
        <nav className="mat-container flex h-16 items-center justify-between">
          <MatriarchLogo className="scale-75 origin-left" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
            onClick={() => setShowSignIn(true)}
          >
            Sign In
          </Button>
        </nav>
      </header>

      <main className="pt-16">
        {/* 1. HERO SECTION */}
        <section className="mat-section relative overflow-hidden">
          <div className="mat-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="fade-up space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Badge variant="secondary" className="py-2 px-6 border-white/10 uppercase tracking-[0.3em] font-black text-[8px] lg:text-[9px] bg-white/5 backdrop-blur-md">
                  A Sanctuary for Her Choice
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl mat-text-display-pro text-white lowercase tracking-tighter overflow-visible py-2 px-1">
                <DecryptedText text="Her" animateOn="view" speed={120} className="inline-block" sequential /> heart <span className="mat-text-gradient-gold">decides.</span><br />
                <span className="italic block mt-2 lg:mt-4 border-l-4 border-mat-gold pl-4 lg:pl-6 overflow-visible">Everything</span> <span className="text-white/40">else follows.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/50 leading-relaxed font-medium italic max-w-xl mx-auto lg:mx-0">
                MATRIARCH is a sanctuary where connections are nurtured, and every journey begins with her choice. A space built for intention, not noise.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 lg:gap-6 mt-8 lg:mt-12 px-2 sm:px-0">
                <Button variant="gold" size="lg" className="h-16 px-6 sm:px-12 rounded-2xl shadow-mat-gold font-black uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] w-full sm:w-auto" onClick={() => setShowSignIn(true)}>
                  Sign In with Google
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg" className="h-16 px-6 sm:px-12 rounded-2xl font-black uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] w-full sm:w-auto" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  See How It Works
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-x-8 lg:gap-x-12 gap-y-4 lg:gap-y-6 pt-12 border-t border-white/5 text-[9px] lg:text-[10px]">
                {[
                  "Women-first architecture",
                  "Curated discovery",
                  "Communication on her terms",
                  "Safety built in"
                ].map(item => (
                  <div key={item} className="mat-text-label-pro flex items-center gap-2 lg:gap-3 !tracking-[0.2em] lg:!tracking-[0.5em] text-left">
                    <div className="w-1.5 h-1.5 rounded-full bg-matriarch-violetBright shadow-[0_0_8px_rgba(110,63,243,0.8)] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative fade-in mt-12 lg:mt-0 max-w-sm mx-auto lg:max-w-none lg:mx-0 w-full">
              <div className="relative z-10 p-3 lg:p-4 rounded-[2.5rem] lg:rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-2xl">
                <div className="rounded-[2.2rem] lg:rounded-[3rem] bg-[#0F0F10] overflow-hidden aspect-[4/5] relative border border-white/5">
                  <div className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-matriarch-violet/20 border border-matriarch-violet/30" />
                      <div className="w-24 lg:w-32 h-1.5 lg:h-2 bg-white/10 rounded-full" />
                    </div>
                    <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-white/20" />
                  </div>
                  
                  <div className="p-6 lg:p-10 h-full flex flex-col justify-center">
                    <div className="relative aspect-[3/4] rounded-[1.8rem] lg:rounded-[2.5rem] bg-[#0F0F10] border border-white/5 p-6 lg:p-8 flex flex-col justify-end group overflow-hidden shadow-2xl">
                        <HeroSlideshow 
                          opacity={0.6} 
                          className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10]/20 to-transparent opacity-90" />
                        
                        <div className="relative z-10 space-y-3 lg:space-y-4">
                          <Badge variant="gold" className="font-black text-[8px] lg:text-[9px] px-3 py-1 uppercase tracking-widest bg-mat-gold text-black shadow-mat-gold border-none">IMPACT #12 — ELITE</Badge>
                          <div className="h-6 lg:h-8 w-3/4 bg-white/20 rounded-xl" />
                          <div className="h-3 lg:h-4 w-1/2 bg-white/10 rounded-xl" />
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700">
                           <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-mat-gold grid place-items-center shadow-mat-gold animate-bounce">
                              <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-black" strokeWidth={1} />
                           </div>
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-10 space-y-4 lg:space-y-6">
                      <span className="mat-text-label-pro text-center block mat-text-shimmer-subtle !text-[8px] lg:!text-[10px]">Looking for a spark...</span>
                      <div className="flex gap-4">
                        <div className="flex-1 h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10" />
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-matriarch-violetBright grid place-items-center shadow-mat-violet">
                          <Check className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 lg:-top-24 lg:-right-24 w-40 lg:w-80 h-40 lg:h-80 bg-matriarch-violet/10 blur-[80px] lg:blur-[120px] rounded-full" />
              <div className="absolute -bottom-12 -left-12 lg:-bottom-24 lg:-left-24 w-40 lg:w-80 h-40 lg:h-80 bg-matriarch-gold/5 blur-[80px] lg:blur-[120px] rounded-full" />
            </div>
          </div>
        </section>

        {/* 2. INTRIGUE STRIP */}
        <section className="bg-white/[0.01] border-y border-white/5 py-8 lg:py-16 overflow-hidden whitespace-nowrap">
          <div className="flex gap-20 lg:gap-40 items-center animate-marquee">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-20 lg:gap-40 items-center">
                <span className="text-3xl lg:text-5xl font-display font-black tracking-tighter text-white/5 uppercase italic">Not another swipe app.</span>
                <Crown className="w-6 h-6 lg:w-10 lg:h-10 text-matriarch-gold/5" />
                <span className="text-3xl lg:text-5xl font-display font-black tracking-tighter text-white/5 uppercase italic">Not another attention marketplace.</span>
                <Crown className="w-6 h-6 lg:w-10 lg:h-10 text-matriarch-gold/5" />
                <span className="text-3xl lg:text-5xl font-display font-black tracking-tighter text-white/5 uppercase italic">Not another inbox war.</span>
                <Crown className="w-6 h-6 lg:w-10 lg:h-10 text-matriarch-gold/5" />
                <span className="text-xl lg:text-3xl font-display font-black text-matriarch-violetBright/10 uppercase tracking-[0.2em] lg:tracking-[0.4em]">MATRIARCH transforms dating.</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="mat-section">
          <div className="mat-container">
            <div className="text-center mb-24 space-y-6">
              <Badge variant="violet" className="px-6 py-2 border-matriarch-violetBright/20 uppercase tracking-[0.3em] font-black text-[9px]">The Journey Forward</Badge>
              <h2 className="text-4xl lg:text-6xl mat-text-display-pro text-white leading-tight lowercase overflow-visible-important py-2 px-1">
                How Matriarch <span className="mat-text-gradient-gold ring-mat-gold/20">Works</span>
              </h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto italic font-medium">A sanctuary for intentional engagement, designed for hearts that value depth over noise.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {[
                { title: "Her Choice", label: "Observe. Decide.", desc: "Browse profiles of men who share your values. Connect only when you feel a genuine spark.", icon: Eye, color: "text-matriarch-violetBright", bg: "bg-matriarch-violet/10" },
                { title: "The Seeker", label: "Grow. Be Found.", desc: "No chasing. Construct a profile of substance, share your story, and await discovery by the woman who recognizes your heart.", icon: UserCheck, color: "text-matriarch-goldSoft", bg: "bg-matriarch-gold/10" },
                { title: "Grace", label: "Her Terms. Always.", desc: "Connection begins only how and when she defines. Once a match is made, she chooses the way you both talk.", icon: MessageSquare, color: "text-matriarch-plum", bg: "bg-matriarch-plum/10" }
              ].map((step, i) => (
                <div key={i} className="mat-card mat-glass-premium border-none p-6 lg:p-12 group hover:bg-white/[0.06] transition-all duration-500 rounded-[2.5rem] lg:rounded-[3rem]">
                  <div className={cn("mb-8 lg:mb-10 p-5 lg:p-6 rounded-2xl border border-white/5 w-fit group-hover:scale-110 transition-all duration-500 shadow-2xl", step.bg)}>
                    <step.icon className={cn("w-8 h-8 lg:w-10 lg:h-10", step.color)} strokeWidth={1.5} />
                  </div>
                  <h3 className={cn("text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] mb-4 not-italic", step.color)}>{step.title}</h3>
                  <h4 className="text-3xl lg:text-4xl mat-text-display-pro text-white mb-6 leading-tight lowercase">{step.label}</h4>
                  <p className="text-[12px] lg:text-[13px] text-white/50 leading-relaxed italic font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PROBLEM / SOLUTION */}
        <section className="mat-section bg-white/[0.01] border-y border-white/5 px-4 lg:px-8">
          <div className="mat-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-[#0F0F10] p-8 lg:p-24">
                <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-12">
                   <ZapOff className="text-matriarch-red w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                   <h3 className="mat-text-label-pro !text-matriarch-red !not-italic">The Problem</h3>
                </div>
                <h2 className="text-4xl lg:text-5xl mat-text-display-pro text-white mb-8 lg:mb-10 leading-tight">Dating apps <span className="text-matriarch-red">reward</span> noise.</h2>
                <div className="space-y-6 lg:space-y-8">
                  {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                    <div key={item} className="flex items-center gap-4 text-white/30">
                      <X className="w-4 h-4 lg:w-5 lg:h-5 text-matriarch-red/60" />
                      <span className="text-lg lg:text-xl font-medium italic">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/[0.02] p-8 lg:p-24 relative overflow-hidden group">
                <div className="absolute inset-0 bg-mat-violet-glow opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-12">
                    <Crown className="text-matriarch-violetBright w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                    <h3 className="mat-text-label-pro !text-matriarch-violetBright !not-italic">The Matriarch Solution</h3>
                  </div>
                  <h2 className="text-4xl lg:text-5xl mat-text-display-pro text-white mb-8 lg:mb-10 leading-tight">Matriarch rewards <span className="text-matriarch-violetBright italic">quality.</span></h2>
                  <div className="space-y-6 lg:space-y-8">
                    {["Female-controlled matching", "Curated male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                      <div key={item} className="flex items-center gap-4 lg:gap-5 text-white">
                        <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-matriarch-violetBright/20 flex items-center justify-center shrink-0">
                           <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-matriarch-violetBright" strokeWidth={3} />
                        </div>
                        <span className="text-lg lg:text-xl font-bold tracking-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURES */}
        <section className="mat-section">
          <div className="mat-container">
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-6xl mat-text-display-pro text-white leading-tight uppercase">
                Built for <span className="mat-text-gradient-gold ring-mat-gold/20">Control,</span> not Clutter
              </h2>
              <p className="text-xl text-white/40 italic font-medium">Designed for women who value their time and attention.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Women-first matching", desc: "Men do not browse women. Women decide who gets access to their time.", icon: UserCheck },
                { title: "Curated Discovery", desc: "Profiles are accessed through a smart system based on quality and relevance.", icon: Zap },
                { title: "Communication Modes", desc: "After matching, the woman selects exactly how the interaction starts.", icon: Shield },
                { title: "High-trust profiles", desc: "Verification and elite referrals are built into the core experience.", icon: Star },
                { title: "Intentional Standing", desc: "Men improve visibility through substance, not swiping volume.", icon: Crown },
                { title: "Private Architecture", desc: "Designed like a private salon, not a public attention feed.", icon: Lock },
              ].map((f, i) => (
                <Card key={i} className="mat-glass-premium border-none p-10 group hover:bg-white/[0.06] transition-all duration-500 rounded-[2.5rem]">
                  <CardContent className="p-0">
                    <f.icon className="w-12 h-12 text-matriarch-violetBright/40 group-hover:text-matriarch-violetBright mb-10 transition-all duration-500" strokeWidth={1} />
                    <h3 className="mat-text-label-pro !text-white !not-italic mb-4">{f.title}</h3>
                    <p className="text-[13px] text-white/50 leading-relaxed italic font-medium">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. MEN'S RANKING SECTION */}
        <section className="mat-section relative overflow-hidden px-4 lg:px-8">
           <div className="mat-container">
             <div className="mat-panel-premium p-8 lg:p-32 rounded-[2.5rem] lg:rounded-[4rem] border-white/5 bg-white/[0.01] shadow-2xl relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                   <div className="space-y-8 lg:space-y-10">
                      <Badge variant="gold" className="px-5 py-2 uppercase tracking-[0.3em] font-black text-[8px] lg:text-[9px] bg-mat-gold/10 text-mat-gold">The Seeker's Journey</Badge>
                      <h2 className="text-4xl lg:text-7xl mat-text-display-pro text-white leading-tight uppercase overflow-visible py-2">Excellence of <br/><span className="mat-text-gradient-gold ring-mat-gold/20">Heart.</span></h2>
                      <p className="text-lg lg:text-xl text-white/50 leading-relaxed italic font-medium">
                        On MATRIARCH, attention isn't a commodity to be bought or spammed. It is qualified for through excellence, authenticity, and verified standing.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6 lg:gap-12">
                        {[
                          { label: "Profile Integrity", val: "99%" },
                          { label: "Elite Standing", val: "Top 1%" },
                          { label: "Verification", val: "Verified" },
                          { label: "Referral Count", val: "Elite" }
                        ].map(item => (
                          <div key={item.label} className="border-l-2 border-matriarch-gold/30 pl-4 lg:pl-8 space-y-2 lg:space-y-3">
                            <span className="mat-text-label-pro !text-[8px] lg:!text-[10px] !not-italic">{item.label}</span>
                            <span className="text-xl lg:text-3xl mat-text-display-pro text-white block">{item.val}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Ranking UI Demo */}
                   <div className="mat-panel mat-glass-premium p-8 lg:p-16 rounded-[2.5rem] lg:rounded-[3.5rem] border-white/10 bg-white/[0.03] shadow-[0_0_100px_rgba(212,175,55,0.1)] relative group">
                      <div className="absolute inset-0 bg-mat-gold-glow opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="relative z-10 space-y-12">
                         <div className="flex justify-between items-center">
                            <div className="space-y-2">
                               <span className="mat-text-label-pro !text-mat-gold !not-italic">Heart Impact</span>
                               <h4 className="text-4xl mat-text-display-pro text-white leading-none lowercase">Elite Tier</h4>
                            </div>
                            <Crown className="w-16 h-16 text-matriarch-gold animate-pulse" strokeWidth={1} />
                         </div>

                         <div className="space-y-6">
                            <div className="flex justify-between items-end">
                               <span className="mat-text-label-pro !text-white/40 !not-italic">Visibility Index</span>
                               <span className="text-2xl mat-text-display-pro text-mat-gold shadow-mat-gold/20">99.4</span>
                            </div>
                            <Progress value={99} className="h-4 bg-white/5" />
                         </div>

                         <div className="mat-panel bg-black/40 p-6 lg:p-10 flex items-center justify-between border-matriarch-gold/20 rounded-3xl group-hover:border-matriarch-gold/40 transition-all duration-500">
                            <div className="flex items-center gap-4 lg:gap-6">
                               <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-matriarch-gold shadow-[0_0_15px_rgba(212,175,55,0.8)] shrink-0" />
                               <span className="mat-text-label-pro !text-white !not-italic !text-[9px] lg:!text-[10px]">Referral Code Required</span>
                            </div>
                            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-matriarch-gold group-hover:translate-x-1 transition-transform shrink-0" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* 6.5 DIVINE ECONOMY (DAILY REWARDS) */}
        <section className="mat-section relative overflow-hidden">
           <div className="mat-container flex flex-col items-center">
              <div className="text-center mb-16 lg:mb-24 max-w-2xl space-y-6 lg:space-y-8">
                 <Badge variant="secondary" className="px-6 py-2 uppercase tracking-[0.3em] font-black text-[9px] opacity-60">The Economy of Devotion</Badge>
                 <h2 className="text-4xl lg:text-7xl mat-text-display-pro text-white leading-tight uppercase">Devotion is <span className="mat-text-gradient-gold ring-mat-gold/20">Recognized.</span></h2>
                 <p className="text-lg lg:text-xl text-white/40 italic font-medium">Every day the sanctuary doors open, your presence is honored through token blessings. Consistency amplifies your radiance.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-10 w-full">
                 {[
                   { title: "Daily Entry", reward: "+10", desc: "For every dawn you join the sanctuary.", icon: Zap },
                   { title: "7 Day Streak", reward: "+100", desc: "A week of dedicated intention.", icon: Star },
                   { title: "30 Day Devotion", reward: "+1000", desc: "Monthly absolute alignment.", icon: Crown }
                 ].map((item, i) => (
                   <div key={i} className="mat-panel mat-glass-premium p-8 lg:p-12 border-none bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 group overflow-hidden relative rounded-[2rem] lg:rounded-[3rem]">
                      <div className="absolute -top-10 -right-10 p-8 lg:p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000">
                         <item.icon size={120} className="text-matriarch-gold lg:size-[180px]" strokeWidth={1} />
                      </div>
                      <div className="relative z-10 space-y-10">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-mat-gold group-hover:text-black transition-all duration-500">
                            <item.icon size={28} strokeWidth={1.5} />
                         </div>
                         <div>
                            <h4 className="mat-text-label-pro !text-white/40 !not-italic mb-2">{item.title}</h4>
                            <div className="text-4xl lg:text-6xl mat-text-display-pro text-white leading-tight mat-text-glow-gold">{item.reward} <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.5em] opacity-40 not-italic block mt-1 lg:mt-2">Tokens</span></div>
                         </div>
                         <p className="text-[11px] text-white/40 uppercase font-black tracking-widest leading-relaxed italic">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 7. SAFETY / TRUST */}
        <section className="mat-section px-8">
          <div className="mat-container text-center max-w-5xl">
             <div className="inline-flex mb-16 p-12 rounded-[3.5rem] bg-matriarch-violet/5 border border-matriarch-violet/20 shadow-mat-premium relative group overflow-hidden">
                <div className="absolute inset-0 bg-mat-violet-glow opacity-20 pointer-events-none" />
                <ShieldCheck className="w-24 h-24 text-matriarch-violetBright relative z-10 animate-pulse" strokeWidth={1.5} />
             </div>
             <h2 className="text-6xl lg:text-7xl mat-text-display-pro text-white mb-12 uppercase leading-tight tracking-tighter shadow-mat-violet/10 overflow-visible py-2">True grace comes <br/>with <span className="text-mat-gold">peace of mind.</span></h2>
             <p className="text-2xl text-white/40 italic font-medium mb-20 max-w-3xl mx-auto">
               MATRIARCH is designed to give women absolute, gentle control. Safety is not a feature; it is the fundamental heart of our sanctuary.
             </p>
             
             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  "Communication isolation",
                  "Verification journey",
                  "Privacy infrastructure",
                  "Selective discovery",
                  "Moderated mechanics",
                  "Elite Referral Only"
                ].map((item, i) => (
                  <div key={i} className="mat-panel mat-glass-premium p-10 border-none bg-white/[0.02] hover:bg-white/[0.04] transition-all h-24 flex items-center justify-center rounded-[2rem]">
                    <span className="mat-text-label-pro !text-white !not-italic">{item}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 8. PREMIUM BRAND STATEMENT */}
        <section className="mat-section relative overflow-hidden bg-white/[0.01] border-y border-white/5 py-40">
            <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(ellipse_at_center,rgba(110,63,243,0.08)_0%,transparent_70%)]" />
            <div className="mat-container text-center relative z-10 space-y-16">
               <h2 className="text-[12px] font-black uppercase tracking-[1em] text-white/20 select-none">PRIVATE SYSTEM // MODERN SELECTION</h2>
               <div className="max-w-4xl mx-auto space-y-12">
                  <p className="text-4xl font-display font-light leading-relaxed italic text-white/90">
                    "MATRIARCH is for women who are done performing for algorithms and filtering chaos. It creates a more elegant dating dynamic: <span className="text-mat-gold font-normal">less noise, more signal, more control.</span>"
                  </p>
                  <Separator className="bg-mat-gold/20 w-40 mx-auto h-[2px]" />
                  <div className="text-6xl mat-text-display-pro text-white lowercase tracking-tighter">Matriarch<span className="mat-text-gradient-gold">.</span></div>
               </div>
            </div>
        </section>

        {/* 8.5 PRICING SECTION */}
        <section className="mat-section mb-32 px-8">
          <div className="mat-container">
            <div className="text-center mb-24 space-y-8">
              <h2 className="text-7xl mat-text-display-pro text-white leading-tight uppercase">The <span className="mat-text-gradient-gold ring-mat-gold/20">Value</span> of Intent</h2>
              <p className="mat-text-label-pro opacity-40">Excellence is preserved through discipline.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Women's Card */}
              <div className="mat-panel mat-glass-premium p-16 border-none rounded-[4rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 shadow-2xl">
                <div className="absolute bottom-[-10%] right-[-10%] p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000">
                   <Crown size={240} strokeWidth={1} />
                </div>
                <div className="space-y-12 relative z-10">
                   <div>
                      <span className="mat-text-label-pro !text-matriarch-violetBright !not-italic mb-6 block">The Invitation</span>
                      <h3 className="text-5xl mat-text-display-pro text-white lowercase leading-none">Matriarch</h3>
                   </div>
                   <div className="flex items-baseline gap-4">
                      <span className="text-8xl mat-text-display-pro text-white leading-none">₹0</span>
                      <span className="mat-text-label-pro opacity-30 !not-italic">/ Lifetime</span>
                   </div>
                   <ul className="space-y-6 pt-6">
                      {[
                        "Selective Architecture",
                        "Verified Soul Access",
                        "Inner Circle Privacy"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-5 mat-text-label-pro !text-white/60 !not-italic">
                           <div className="w-2 h-2 rounded-full bg-matriarch-violetBright shadow-[0_0_8px_rgba(110,63,243,0.8)]" />
                           {item}
                        </li>
                      ))}
                   </ul>
                   <Button variant="outline" className="w-full border-matriarch-violetBright/30 text-matriarch-violetBright uppercase tracking-wider sm:tracking-[0.4em] text-[10px] sm:text-[11px] font-black h-16 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-matriarch-violetBright/10 transition-all">By Selection Only</Button>
                </div>
              </div>

              {/* Men's Card */}
              <div className="mat-panel mat-glass-premium p-16 border-mat-gold/20 bg-mat-gold/[0.02] rounded-[4rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 shadow-[0_0_100px_rgba(212,175,55,0.08)]">
                <div className="absolute bottom-[-10%] right-[-10%] p-12 opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-1000">
                   <Trophy size={240} className="text-mat-gold" strokeWidth={1} />
                </div>
                <div className="space-y-12 relative z-10">
                   <div>
                      <span className="mat-text-label-pro !text-mat-gold !not-italic mb-6 block">The Presence</span>
                      <h3 className="text-5xl mat-text-display-pro text-mat-gold lowercase leading-none">The Seeker</h3>
                   </div>
                   <div className="flex items-baseline gap-4">
                      <span className="text-8xl mat-text-display-pro text-white leading-none">₹2,499</span>
                      <span className="mat-text-label-pro opacity-30 !not-italic">/ Month</span>
                   </div>
                   <ul className="space-y-6 pt-6">
                      {[
                        "Rank Ladder Access",
                        "Presence Impact Hub",
                        "Full Discovery Visibility"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-5 mat-text-label-pro !text-mat-gold/60 !not-italic">
                           <div className="w-2 h-2 rounded-full bg-mat-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                           {item}
                        </li>
                      ))}
                   </ul>
                   <Button variant="gold" className="w-full h-16 sm:h-20 uppercase tracking-wider sm:tracking-[0.4em] text-[10px] sm:text-[11px] font-black rounded-[1.5rem] sm:rounded-[2rem] shadow-mat-gold transition-all hover:scale-[1.02]">Scale the Ladder</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA (Waitlist) */}
        <section className="mat-section mb-40 px-8">
          <div className="mat-container">
             <div className="mat-panel mat-glass-premium p-24 lg:p-40 text-center rounded-[5rem] border-none shadow-[0_0_150px_rgba(110,63,243,0.15)] overflow-hidden relative group">
                <div className="absolute inset-0 bg-mat-violet-glow opacity-20" />
                <div className="relative z-10 space-y-16">
                   <h2 className="text-7xl lg:text-9xl mat-text-display-pro text-white leading-[0.9] lowercase tracking-tighter overflow-visible py-4 px-2">
                      Start Your <br/>
                      <span className="mat-text-gradient-gold ring-mat-gold/20 italic">Story</span> 
                      <br/>Today.
                   </h2>
                   <p className="text-2xl text-white/50 max-w-2xl mx-auto italic font-medium">Join a sanctuary redefining connection.</p>
                   
                   <div className="max-w-md mx-auto space-y-12">
                       <Button variant="gold" size="lg" className="w-full h-24 text-3xl font-black uppercase tracking-[0.2em] shadow-mat-gold border-none rounded-[2.5rem] transition-all hover:scale-105" onClick={() => setShowSignIn(true)}>
                          <DecryptedText text="Open Doors" animateOn="view" speed={150} className="inline-block" sequential />
                      </Button>
                      <p className="mat-text-label-pro opacity-40 select-none">
                         Women-first. By invitation of merit.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mat-section bg-[#0F0F10] border-t border-white/5 py-40">
        <div className="mat-container">
           <div className="grid lg:grid-cols-6 gap-24 mb-40">
              <div className="lg:col-span-2 space-y-12">
                 <MatriarchLogo />
                 <p className="text-sm text-white/40 leading-relaxed italic font-medium max-w-sm">
                   Redefining connection through selective architecture. A private ecosystem built for intention, not noise.
                 </p>
              </div>
              
              <div className="space-y-10">
                 <h5 className="mat-text-label-pro !text-white/20 !not-italic">Stories</h5>
                 <ul className="space-y-6 mat-text-label-pro !text-white/60 !not-italic uppercase !tracking-widest">
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">About</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Our Way</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Shared Stories</li>
                 </ul>
              </div>

              <div className="space-y-10">
                 <h5 className="mat-text-label-pro !text-white/20 !not-italic">Protocol</h5>
                 <ul className="space-y-6 mat-text-label-pro !text-white/60 !not-italic uppercase !tracking-widest">
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Terms & Conditions</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Privacy Policy</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Refund Policy</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Contact Us</li>
                 </ul>
              </div>

              <div className="lg:col-span-2 space-y-10">
                 <h5 className="mat-text-label-pro !text-white/20 !not-italic">Global Standing</h5>
                 <div className="mat-panel p-10 bg-white/5 border-none rounded-[2.5rem] shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                       <span className="mat-text-label-pro !text-mat-gold !not-italic">Capacity Used</span>
                       <span className="text-2xl mat-text-display-pro text-white leading-none">92%</span>
                    </div>
                    <Progress value={92} className="h-3 bg-white/5 shadow-inner" />
                 </div>
              </div>
           </div>
           
           <Separator className="bg-white/5 mb-16" />
           
           <div className="text-center">
              <p className="text-[12px] font-black tracking-[1.5em] text-white/5 uppercase select-none mat-shimmer">
                MATRIARCH — CONNECTION BEGINS WITH HER CHOICE.
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90"
            onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="max-w-lg w-full mat-panel-premium rounded-[4rem] p-16 text-center relative overflow-hidden border-white/10 bg-[#0F0F10] shadow-[0_0_150px_rgba(110,63,243,0.3)]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-mat-gold shadow-mat-gold" />
              
              <button
                onClick={() => setShowSignIn(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 shadow-xl"
              >
                <X className="w-6 h-6 text-white/40" />
              </button>

              <div className="mb-12 inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-matriarch-violet/10 border border-matriarch-violet/30 shadow-2xl relative">
                <div className="absolute inset-0 bg-mat-violet-glow opacity-20" />
                <Crown className="w-12 h-12 text-matriarch-violetBright relative z-10" strokeWidth={1} />
              </div>

              <h2 className="text-5xl mat-text-display-pro mb-6 text-white leading-none lowercase">Access Sanctuary</h2>
              <p className="text-sm text-white/40 mb-12 italic font-medium leading-relaxed max-w-sm mx-auto">
                Sign in with Google to enter Matriarch's private selective architecture.
              </p>

              {error && (
                <p className="text-matriarch-red text-[10px] font-black uppercase tracking-[0.3em] animate-shake mb-8 border border-matriarch-red/20 py-4 rounded-2xl bg-matriarch-red/5">{error}</p>
              )}

              <Button
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="w-full h-20 bg-white text-black hover:bg-neutral-100 flex items-center justify-center gap-6 rounded-[2rem] shadow-2xl group border-none font-black transition-all hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/60">Connecting Sanctuary...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Continue with Google</span>
                  </>
                )}
              </Button>

              <p className="mat-text-label-pro opacity-30 mt-12 !not-italic">
                By entering, you agree to the Matriarch Privacy Pact.
              </p>
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
