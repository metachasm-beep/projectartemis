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
  Crown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { supabase } from "@/lib/supabase";

// Standard components from react-bits
// import ShinyText from "@/components/ui/react-bits/ShinyText"; // Removed for performance

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
        {/* Subtle Geometric Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-matriarch-bg/60 backdrop-blur-xl">
        <nav className="mat-container flex h-20 items-center justify-between">
          <MatriarchLogo />
          
          <div className="flex items-center gap-8">
            {/* CTAs removed from top bar per request */}
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* 1. HERO SECTION */}
        <section className="mat-section relative overflow-hidden">
          <div className="mat-container grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <Badge variant="secondary" className="mb-8 py-2 px-4">
                Women-First Selection Platform
              </Badge>
              
              <h1 className="mat-heading-xl mb-6 leading-[1.1]">
                She chooses.<br />
                <span className="text-mat-gold-text italic">Everything</span> else follows.
              </h1>
              
              <p className="mat-copy-lg mb-8 max-w-xl">
                MATRIARCH is a women-first dating platform where men don’t swipe, chase, or flood inboxes. They build their profile, earn their visibility, and wait to be chosen.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Button variant="gold" size="lg" className="px-10" onClick={() => setShowSignIn(true)}>
                  Sign In with Google
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  See How It Works
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-white/5 pt-8">
                {[
                  "Women-first architecture",
                  "Ranked discovery",
                  "Communication on her terms",
                  "Safety built in"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-caption uppercase tracking-wider text-matriarch-textFaint">
                    <Check className="w-4 h-4 text-matriarch-violetBright" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative lg:block hidden fade-in">
              <div className="relative z-10 p-4 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-2xl">
                <div className="rounded-[2rem] bg-matriarch-bg overflow-hidden aspect-[4/5] relative border border-white/5">
                  {/* Mockup Header */}
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-matriarch-violet/20 border border-matriarch-violet/30" />
                      <div className="w-24 h-2 bg-white/10 rounded-full" />
                    </div>
                    <Lock className="w-4 h-4 text-white/20" />
                  </div>
                  
                  {/* Mockup Content */}
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full aspect-[3/4] rounded-2xl bg-gradient-to-br from-matriarch-violet/10 via-matriarch-plum/5 to-transparent border border-white/5 p-6 flex flex-col justify-end relative group overflow-hidden">
                        <div className="absolute inset-0 bg-mat-violet-glow opacity-20" />
                        
                        <div className="relative z-10">
                          <Badge variant="gold" className="mb-4">RANK #12 — ELITE</Badge>
                          <div className="h-6 w-3/4 bg-white/20 rounded-md mb-2" />
                          <div className="h-4 w-1/2 bg-white/10 rounded-md" />
                        </div>

                        {/* Interactive Selection Trigger */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                           <div className="w-16 h-16 rounded-full bg-mat-gold grid place-items-center shadow-mat-gold">
                              <Crown className="w-8 h-8 text-black" />
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-4">
                      <span className="text-[10px] tracking-[0.4em] text-center block opacity-40 font-bold mat-shimmer uppercase">Selection Protocol Active</span>
                      <div className="flex gap-4">
                        <div className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10" />
                        <div className="w-12 h-12 rounded-xl bg-matriarch-violetBright grid place-items-center shadow-mat-violet">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Accents */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-matriarch-violet/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-matriarch-gold/10 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>

        {/* 2. INTRIGUE STRIP */}
        <section className="bg-white/[0.02] border-y border-white/5 py-12 overflow-hidden whitespace-nowrap">
          <div className="flex gap-32 items-center animate-marquee">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-32 items-center">
                <span className="text-4xl font-display font-black tracking-tighter text-white/5 uppercase italic">Not another swipe app.</span>
                <Crown className="w-8 h-8 text-matriarch-gold/10" />
                <span className="text-4xl font-display font-black tracking-tighter text-white/5 uppercase italic">Not another attention marketplace.</span>
                <Crown className="w-8 h-8 text-matriarch-gold/10" />
                <span className="text-4xl font-display font-black tracking-tighter text-white/5 uppercase italic">Not another inbox war.</span>
                <Crown className="w-8 h-8 text-matriarch-gold/10" />
                <span className="text-2xl font-display font-bold text-matriarch-violetBright/20 uppercase tracking-[0.3em]">MATRIARCH transforms dating.</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="mat-section">
          <div className="mat-container">
            <div className="text-center mb-20">
              <Badge variant="violet" className="mb-6">The Selection Workflow</Badge>
              <h2 className="mat-heading-lg mb-4 uppercase tracking-tight">How Matriarch Works</h2>
              <p className="mat-copy max-w-2xl mx-auto">A three-tiered system of intentional engagement designed for quality over noise.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="mat-card mat-glass-premium border-none p-10 group hover:bg-white/[0.07] transition-all duration-300">
                <div className="mb-8 p-5 rounded-2xl bg-matriarch-violet/10 border border-matriarch-violet/20 w-fit group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-10 h-10 text-matriarch-violetBright" />
                </div>
                <h3 className="text-matriarch-violetBright text-sm font-bold uppercase tracking-[0.3em] mb-4">For Women</h3>
                <h4 className="mat-heading-sm mb-6 leading-tight">Review.<br/>Decide.</h4>
                <p className="mat-copy leading-relaxed">
                  Browse ranked profiles of men who meet your exacting criteria. Match only when excellence is evident.
                </p>
              </div>

              <div className="mat-card mat-glass-premium border-none p-10 group hover:bg-white/[0.07] transition-all duration-300">
                <div className="mb-8 p-5 rounded-2xl bg-matriarch-gold/10 border border-matriarch-gold/20 w-fit group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-10 h-10 text-matriarch-goldSoft" />
                </div>
                <h3 className="text-matriarch-goldSoft text-sm font-bold uppercase tracking-[0.3em] mb-4">For Men</h3>
                <h4 className="mat-heading-sm mb-6 leading-tight">Build.<br/>Earn. Wait.</h4>
                <p className="mat-copy leading-relaxed">
                  No swiping. No random chasing. Construct a profile of substance, earn your rank, and await discovery by the right women.
                </p>
              </div>

              <div className="mat-card mat-glass-premium border-none p-10 group hover:bg-white/[0.07] transition-all duration-300">
                <div className="mb-8 p-5 rounded-2xl bg-matriarch-plum/10 border border-matriarch-plum/20 w-fit group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-10 h-10 text-matriarch-plum" />
                </div>
                <h3 className="text-matriarch-plum text-sm font-bold uppercase tracking-[0.3em] mb-4">Execution</h3>
                <h4 className="mat-heading-sm mb-6 leading-tight">Her Terms.<br/>Always.</h4>
                <p className="mat-copy leading-relaxed">
                  Communication begins only how and when she defines. Once a match is made, she choose the mode of interaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROBLEM / SOLUTION */}
        <section className="mat-section bg-white/[0.01] border-y border-white/5">
          <div className="mat-container">
            <div className="grid lg:grid-cols-2 gap-px bg-white/5 rounded-mat-lg overflow-hidden border border-white/10">
              <div className="bg-matriarch-bg p-12 lg:p-20">
                <div className="flex items-center gap-4 mb-10">
                   <ZapOff className="text-matriarch-red w-6 h-6" />
                   <h3 className="text-matriarch-red font-bold uppercase tracking-[0.4em] text-sm">The Problem</h3>
                </div>
                <h2 className="mat-heading-md mb-8">Dating apps reward <span className="text-matriarch-red">noise</span>.</h2>
                <div className="space-y-6">
                  {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                    <div key={item} className="flex items-center gap-4 text-matriarch-textFaint">
                      <X className="w-5 h-5 text-matriarch-red/50" />
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-matriarch-surface p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-mat-violet-glow opacity-5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <Crown className="text-matriarch-violetBright w-6 h-6" />
                    <h3 className="text-matriarch-violetBright font-bold uppercase tracking-[0.4em] text-sm">The Matriarch Solution</h3>
                  </div>
                  <h2 className="mat-heading-md mb-8">Matriarch rewards <span className="text-matriarch-violetBright italic">quality</span>.</h2>
                  <div className="space-y-6">
                    {["Female-controlled matching", "Ranked male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                      <div key={item} className="flex items-center gap-4 text-matriarch-text">
                        <Check className="w-5 h-5 text-matriarch-violetBright" />
                        <span className="text-lg font-semibold">{item}</span>
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
            <div className="text-center mb-20">
              <h2 className="mat-heading-lg mb-4">Built for control, not clutter</h2>
              <p className="mat-copy">Designed for women who value their time and attention.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Women-first matching", desc: "Men do not browse women. Women decide who gets access to their time.", icon: UserCheck },
                { title: "Ranked Discovery", desc: "Profiles are accessed through a smart system based on quality and relevance.", icon: Zap },
                { title: "Communication Modes", desc: "After matching, the woman selects exactly how the interaction starts.", icon: Shield },
                { title: "High-trust profiles", desc: "Verification and elite referrals are built into the core experience.", icon: Star },
                { title: "Intentional Standing", desc: "Men improve visibility through substance, not swiping volume.", icon: Crown },
                { title: "Private Architecture", desc: "Designed like a private salon, not a public attention feed.", icon: Lock },
              ].map((f, i) => (
                <Card key={i} className="group hover:border-matriarch-violet/40 transition-colors duration-500">
                  <CardContent className="p-10">
                    <f.icon className="w-10 h-10 text-matriarch-violetBright mb-8 group-hover:scale-110 transition-transform" strokeWidth={1} />
                    <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                    <p className="mat-copy leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. MEN'S RANKING SECTION */}
        <section className="mat-section relative overflow-hidden px-8">
           <div className="mat-container">
             <div className="mat-panel-premium p-16 lg:p-24 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                   <div>
                      <Badge variant="gold" className="mb-8">Men's Ranking Protocol</Badge>
                      <h2 className="mat-heading-lg mb-8 leading-none uppercase tracking-tighter">Visibility is <span className="text-matriarch-gold">Earned.</span></h2>
                      <p className="mat-copy-lg mb-12">
                        On MATRIARCH, attention isn't a commodity to be bought or spammed. It is qualified for through excellence, authenticity, and verified standing.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-8">
                        {[
                          { label: "Profile Integrity", val: "99%" },
                          { label: "Elite Standing", val: "Top 1%" },
                          { label: "Verification", val: "Verified" },
                          { label: "Referral Count", val: "Elite" }
                        ].map(item => (
                          <div key={item.label} className="border-l-2 border-matriarch-gold/20 pl-6 space-y-2">
                            <span className="text-[10px] text-matriarch-textFaint uppercase tracking-widest block font-bold">{item.label}</span>
                            <span className="text-2xl font-display font-bold text-white">{item.val}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Ranking UI Demo */}
                   <div className="mat-panel p-10 relative">
                      <div className="absolute inset-0 bg-mat-gold-glow opacity-5" />
                      <div className="relative z-10 space-y-10">
                         <div className="flex justify-between items-center">
                            <div className="space-y-1">
                               <span className="text-[10px] text-matriarch-gold font-black uppercase tracking-[0.4em]">Matriarch Standing</span>
                               <h4 className="text-3xl font-display font-black tracking-tighter italic text-white uppercase">Elite Tier</h4>
                            </div>
                            <Crown className="w-12 h-12 text-matriarch-gold animate-pulse" strokeWidth={1} />
                         </div>

                         <div className="space-y-6">
                            <div className="flex justify-between items-end">
                               <span className="text-xs font-bold text-matriarch-textSoft uppercase tracking-widest">Visibility Index</span>
                               <span className="text-matriarch-gold font-bold">99.4</span>
                            </div>
                            <Progress value={99} className="h-3 bg-white/5" />
                         </div>

                         <div className="mat-panel bg-white/[0.04] p-6 flex items-center justify-between border-matriarch-gold/20">
                            <div className="flex items-center gap-4">
                               <div className="w-3 h-3 rounded-full bg-matriarch-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                               <span className="text-sm font-bold tracking-widest uppercase text-white">Referral Code Required</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-matriarch-gold" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* 7. SAFETY / TRUST */}
        <section className="mat-section">
          <div className="mat-container text-center max-w-4xl">
             <div className="inline-flex mb-12 p-8 rounded-full bg-matriarch-violet/10 border border-matriarch-violet/20 shadow-mat-premium">
                <ShieldCheck className="w-16 h-16 text-matriarch-violetBright" strokeWidth={1} />
             </div>
             <h2 className="mat-heading-lg mb-8 uppercase italic tracking-tighter">Power means nothing <br/>without <span className="text-matriarch-violetBright">protection.</span></h2>
             <p className="mat-copy-lg mb-16">
               MATRIARCH is designed to give women absolute, secure control. Safety is not a feature; it is the fundamental architecture of the selection cycle.
             </p>
             
             <div className="grid md:grid-cols-3 gap-6">
                {[
                  "Communication isolation",
                  "Verification protocols",
                  "Privacy infrastructure",
                  "Selective discovery",
                  "Moderated mechanics",
                  "Elite Referral Only"
                ].map((item, i) => (
                  <div key={i} className="mat-panel p-6 border-none bg-white/[0.03] hover:bg-white/[0.05] transition-colors rounded-xl flex items-center gap-4 text-left justify-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-matriarch-violetBright shadow-[0_0_8px_rgba(110,63,243,0.8)]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-matriarch-textSoft">{item}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 8. PREMIUM BRAND STATEMENT */}
        <section className="mat-section relative overflow-hidden bg-white/[0.01]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-[radial-gradient(circle,rgba(110,63,243,0.06)_0%,transparent_70%)]" />
            <div className="mat-container text-center relative z-10">
               <h2 className="mat-heading-lg mb-12 uppercase tracking-[0.2em] opacity-40">A Private System for <br/>Modern Selection</h2>
               <div className="max-w-3xl mx-auto space-y-8">
                  <p className="text-2xl font-medium leading-relaxed italic text-matriarch-textSoft">
                    "MATRIARCH is for women who are done performing for algorithms and filtering chaos. It creates a more elegant dating dynamic: less noise, more signal, more control."
                  </p>
                  <Separator className="bg-white/10 w-24 mx-auto h-px" />
                  <div className="text-4xl font-display font-black tracking-tighter text-white">MATRIARCH<span className="text-matriarch-gold">.</span></div>
               </div>
            </div>
        </section>

        {/* 9. FINAL CTA (Waitlist) */}
        <section className="mat-section mb-20 px-8">
          <div className="mat-container">
             <div className="mat-panel bg-mat-panel-premium p-20 lg:p-32 text-center rounded-[3rem] border-none shadow-mat-premium overflow-hidden relative">
                <div className="absolute inset-0 bg-mat-violet-glow opacity-10" />
                <div className="relative z-10">
                   <h2 className="mat-heading-xl mb-8 uppercase leading-tight tracking-tighter">The Era of <br/><span className="text-matriarch-violetBright italic">Selection</span> Begins.</h2>
                   <p className="mat-copy-lg mb-12 font-semibold">Create your account and join the platform redefining connection.</p>
                   
                   <div className="max-w-md mx-auto space-y-8">
                       <Button variant="gold" size="lg" className="w-full h-20 text-2xl font-black uppercase tracking-widest shadow-mat-gold" onClick={() => setShowSignIn(true)}>
                         Sign In with Google
                      </Button>
                      <p className="text-[10px] text-matriarch-textFaint uppercase tracking-[0.5em] font-black">
                         Women-first. By invitation of merit.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mat-section bg-matriarch-bg border-t border-white/5 py-32 sm:py-40">
        <div className="mat-container">
           <div className="grid lg:grid-cols-6 gap-20 mb-32">
              <div className="lg:col-span-2 space-y-10">
                 <MatriarchLogo />
                 <p className="mat-copy max-w-sm">
                   Redefining connection through selective architecture. A private ecosystem built for intention, not noise.
                 </p>
              </div>
              
              <div className="space-y-8">
                 <h5 className="text-[11px] font-black text-matriarch-textFaint uppercase tracking-[0.4em]">Archive</h5>
                 <ul className="space-y-6 text-xs font-bold text-matriarch-textSoft tracking-widest uppercase">
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">About</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">The Protocol</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Archive Records</li>
                 </ul>
              </div>

              <div className="space-y-8">
                 <h5 className="text-[11px] font-black text-matriarch-textFaint uppercase tracking-[0.4em]">Security</h5>
                 <ul className="space-y-6 text-xs font-bold text-matriarch-textSoft tracking-widest uppercase">
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Matriarch Safety</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Privacy Pact</li>
                    <li className="hover:text-matriarch-violetBright transition-colors cursor-pointer">Verification</li>
                 </ul>
              </div>

              <div className="lg:col-span-2 space-y-8">
                 <h5 className="text-[11px] font-black text-matriarch-textFaint uppercase tracking-[0.4em]">Waitlist Status</h5>
                 <div className="mat-panel p-6 bg-white/[0.03] border-none rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-matriarch-goldSoft tracking-widest uppercase">Global Capacity</span>
                       <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-white/5" />
                 </div>
              </div>
           </div>
           
           <Separator className="bg-white/5 mb-12" />
           
           <div className="text-center">
              <p className="text-[10px] font-black tracking-[0.8em] text-white/5 uppercase select-none">
                MATRIARCH — CONNECTION BEGINS WITH HER CHOICE.
              </p>
           </div>
        </div>
      </footer>

      {/* Invite Gate Overlay (Dialog replacement) */}
      {/* Google Sign-In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-matriarch-bg/90"
            onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="max-w-md w-full mat-panel-premium rounded-[2.5rem] p-12 text-center relative overflow-hidden border-none"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-mat-gold" />
              
              {/* Close button */}
              <button
                onClick={() => setShowSignIn(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>

              <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-matriarch-violet/10 border border-matriarch-violet/20 shadow-xl shadow-mat-violet/20">
                <Crown className="w-10 h-10 text-matriarch-violetBright" strokeWidth={1} />
              </div>

              <h2 className="text-3xl font-display font-black mb-4 italic tracking-tight uppercase text-white">Matriarch Access</h2>
              <p className="mat-copy mb-10 font-medium leading-relaxed text-sm">
                Sign in with Google to access Matriarch's private selective architecture.
              </p>

              {error && (
                <p className="text-matriarch-red text-[11px] font-black uppercase tracking-[0.2em] animate-shake mb-6">{error}</p>
              )}

              <Button
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="w-full h-16 bg-white text-black hover:bg-neutral-100 flex items-center justify-center gap-4 rounded-2xl shadow-xl group border-none font-black"
              >
                {isLoading ? (
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-black/60">Connecting...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Continue with Google</span>
                  </>
                )}
              </Button>

              <p className="text-matriarch-textFaint text-[10px] font-bold uppercase tracking-[0.3em] mt-8">
                By signing in, you agree to the Matriarch Privacy Pact.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
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
