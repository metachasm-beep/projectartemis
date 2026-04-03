import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DecryptedText from "../components/ui/react-bits/DecryptedText";
import ShinyText from "../components/ui/react-bits/ShinyText";
import TrueFocus from "../components/ui/react-bits/TrueFocus";
import SpotlightCard from "../components/ui/react-bits/SpotlightCard";
import Waves from "../components/ui/react-bits/Waves";
import { Lock, ArrowRight, Shield, Star, Zap, X, Check, Eye, UserCheck, MessageSquare } from "lucide-react";

interface LandingProps {
  onLogin: (inviteCode?: string) => void;
}

const LandingPage: React.FC<LandingProps> = ({ onLogin }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [showInviteGate, setShowInviteGate] = useState(false);
  const [error, setError] = useState("");

  const validateAndLogin = async () => {
    if (inviteCode.trim().length === 0) {
      setError("Please enter a valid invite code.");
      return;
    }
    
    try {
      const response = await fetch("/api/v1/auth/verify-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode }),
      });
      
      const data = await response.json();
      if (data && data.valid) {
        onLogin(inviteCode);
      } else {
        setError(data?.message || "Invalid Sovereign code.");
      }
    } catch (err) {
      setError("Sovereign network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-violet-500/30 selection:text-white font-sans overflow-x-hidden">
      {/* Premium Waves Background */}
      <div className="fixed inset-0 -z-10">
        <Waves
          lineColor="rgba(139, 92, 246, 0.2)"
          backgroundColor="#09090B"
          waveSpeedX={0.0125}
          waveSpeedY={0.005}
          waveAmpX={32}
          waveAmpY={16}
          friction={0.925}
          tension={0.005}
          maxCursorMove={100}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#09090B]/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 shadow-2xl">
              <span className="text-lg font-bold tracking-[0.2em] text-violet-400">M</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-white/80">MATRIARCH</p>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowInviteGate(true)}
              className="hidden text-sm text-white/60 transition hover:text-white md:block"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowInviteGate(true)}
              className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:scale-105 active:scale-95"
            >
              Enter Sovereign
            </button>
          </div>
        </div>
      </header>

      <main className="relative pt-32">
        {/* 1. HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-6 py-2 text-[10px] uppercase tracking-[0.3em] text-violet-300 font-bold">
                <Star className="w-3 h-3 fill-violet-300" />
                Women-First Architecture
              </div>

              <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl mb-8 leading-[1.1]">
                <TrueFocus 
                  sentence="She chooses."
                  blurAmount={5}
                  borderColor="#8B5CF6"
                  glowColor="rgba(139, 92, 246, 0.4)"
                />
                <span className="block mt-4">
                  <DecryptedText 
                    text="Everything else follows." 
                    animateOn="view"
                    revealDirection="center"
                    className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent"
                  />
                </span>
              </h1>

              <p className="text-xl leading-relaxed text-white/70 mb-6 max-w-xl">
                MATRIARCH is a women-first dating platform where men don’t swipe, chase, or flood inboxes. They build their profile, earn their visibility, and wait to be chosen.
              </p>
              
              <p className="text-base text-white/40 mb-10 max-w-xl italic">
                A high-trust, high-tech dating experience designed around feminine control, selective access, and intentional connection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => setShowInviteGate(true)}
                  className="group relative inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-base font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Join the Waitlist
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-10 py-5 text-base font-bold text-white transition hover:bg-white/10"
                >
                  See How It Works
                </button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-white/5 pt-8">
                {["Women-first architecture", "Ranked discovery", "Selective access", "Safety built in"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                    <Check className="w-3 h-3 text-violet-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Mockup Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden aspect-[4/5]">
                  <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-transparent" />
                  <div className="relative h-full flex flex-col">
                     {/* Mockup Header */}
                     <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-400/20" />
                           <div className="w-20 h-2 bg-white/10 rounded-full" />
                        </div>
                        <Lock className="w-4 h-4 text-white/20" />
                     </div>
                     {/* Mockup Content - Woman reviewing a ranked card */}
                     <div className="flex-1 p-8 flex flex-col justify-end relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl border border-white/10 p-6 flex flex-col justify-end backdrop-blur-md">
                            <div className="mb-4 flex justify-between items-start">
                                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                                <div className="px-3 py-1 rounded-full bg-violet-500/30 text-[10px] font-bold text-violet-300">RANK #12</div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-3/4 h-4 bg-white/20 rounded-md" />
                                <div className="w-1/2 h-3 bg-white/10 rounded-md" />
                            </div>
                        </div>
                        <div className="relative mt-auto">
                            <ShinyText text="SELECTION INTERFACE ACTIVE" className="text-[10px] tracking-[0.3em] font-black text-white/40 mb-4 block text-center" />
                            <div className="flex gap-4">
                               <div className="flex-1 h-14 rounded-2xl border border-white/5 bg-white/2 shadow-inner" />
                               <div className="w-14 h-14 rounded-2xl bg-white grid place-items-center"><Check className="text-black" /></div>
                            </div>
                        </div>
                     </div>
                  </div>
              </div>
              {/* Glow effects */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-fuchsia-600/10 blur-[120px] rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* 2. POSITIONING STRIP */}
        <section className="border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden whitespace-nowrap">
          <div className="flex gap-16 items-center animate-marquee">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-16 items-center">
                <span className="text-2xl font-bold tracking-tighter text-white/20 uppercase italic">Not another swipe app.</span>
                <span className="text-2xl font-bold tracking-tighter text-white/20 uppercase italic">Not another attention marketplace.</span>
                <span className="text-2xl font-bold tracking-tighter text-white/20 uppercase italic">Not another inbox war.</span>
                <span className="text-2xl font-bold tracking-tighter text-violet-400/40 uppercase italic">MATRIARCH redefines dating as a system of selection.</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
           <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">How MATRIARCH works</h2>
              <div className="mt-4 h-1 w-20 bg-violet-500 mx-auto rounded-full" />
           </div>

          <div className="grid gap-12 md:grid-cols-3">
            <SpotlightCard className="p-10 border border-white/5 bg-white/5 rounded-[2.5rem] relative overflow-hidden group">
              <div className="mb-8 rounded-2xl bg-violet-600/20 p-5 w-fit group-hover:bg-violet-600/30 transition-colors">
                <Eye className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 italic tracking-tight">For Women</h3>
              <h4 className="text-xl font-bold mb-4 text-violet-300">You review. You decide.</h4>
              <p className="text-white/50 leading-relaxed text-lg">Browse ranked profiles of men who meet your criteria. Match only when someone genuinely stands out.</p>
            </SpotlightCard>

            <SpotlightCard className="p-10 border border-white/5 bg-white/5 rounded-[2.5rem] relative overflow-hidden group">
              <div className="mb-8 rounded-2xl bg-fuchsia-600/20 p-5 w-fit group-hover:bg-fuchsia-600/30 transition-colors">
                <UserCheck className="w-10 h-10 text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 italic tracking-tight">For Men</h3>
              <h4 className="text-xl font-bold mb-4 text-fuchsia-300">You build. You earn. You wait.</h4>
              <p className="text-white/50 leading-relaxed text-lg">No swiping. No random chasing. Create a strong profile, improve your rank, and become visible to the right women.</p>
            </SpotlightCard>

            <SpotlightCard className="p-10 border border-white/5 bg-white/5 rounded-[2.5rem] relative overflow-hidden group">
              <div className="mb-8 rounded-2xl bg-amber-600/20 p-5 w-fit group-hover:bg-amber-600/30 transition-colors">
                <MessageSquare className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 italic tracking-tight">After Matching</h3>
              <h4 className="text-xl font-bold mb-4 text-amber-300">Communication on her terms.</h4>
              <p className="text-white/50 leading-relaxed text-lg">Once a match is made, the woman chooses how the connection begins—chat, call request, or a slower unlock.</p>
            </SpotlightCard>
          </div>
        </section>

        {/* 4. PROBLEM / SOLUTION */}
        <section className="bg-white/2 py-32 border-y border-white/5 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-24">
                   <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Dating apps reward noise. <br/>MATRIARCH rewards quality.</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="bg-[#09090B] p-12 lg:p-16">
                        <h4 className="text-lg font-bold text-red-500/80 mb-8 uppercase tracking-widest">The Problem</h4>
                        <p className="text-white/40 mb-10 leading-relaxed">Most platforms are built around speed, volume, and male pursuit:</p>
                        <div className="space-y-6">
                            {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                                <div key={item} className="flex items-center gap-4 text-white/30">
                                    <X className="w-5 h-5 text-red-500/50" />
                                    <span className="text-lg font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#0E0E12] p-12 lg:p-16 relative">
                        <div className="absolute inset-0 bg-violet-600/5" />
                        <h4 className="text-lg font-bold text-violet-400 mb-8 uppercase tracking-widest relative">The Matriarch Solution</h4>
                        <p className="text-white/70 mb-10 leading-relaxed relative">A platform built for intentionality and selective access:</p>
                        <div className="space-y-6 relative">
                            {["Female-controlled matching", "Ranked male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                                <div key={item} className="flex items-center gap-4 text-white/80">
                                    <Check className="w-5 h-5 text-violet-500" />
                                    <span className="text-lg font-bold">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 text-center italic opacity-40 text-sm">
                    <span>Less chaos.</span>
                    <span>Less chasing.</span>
                    <span>More signal.</span>
                    <span>More elegance.</span>
                    <span>More power where it belongs.</span>
                </div>
            </div>
        </section>

        {/* 5. FEATURES SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <div className="text-center mb-24">
             <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for women who want control, not clutter</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
                { title: "Women-first matching", desc: "Men do not browse women. Women initiate match selection.", icon: UserCheck },
                { title: "Ranked male visibility", desc: "Profiles are shown through a structured ranking system shaped by quality.", icon: Zap },
                { title: "Communication mode control", desc: "After matching, women choose how the interaction begins.", icon: MessageSquare },
                { title: "High-trust profiles", desc: "Verification, safety controls, and platform moderation are built-in.", icon: Shield },
                { title: "Intentional visibility", desc: "Men improve standing through profile quality and authenticity.", icon: Star },
                { title: "Premium architecture", desc: "Designed like a private network, not a public feed.", icon: Lock },
            ].map((feature, i) => (
                <SpotlightCard key={i} className="p-8 border border-white/5 bg-white/5 rounded-3xl hover:border-violet-500/30 transition-all">
                    <feature.icon className="w-8 h-8 text-violet-400 mb-6" />
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-white/40 leading-relaxed">{feature.desc}</p>
                </SpotlightCard>
            ))}
          </div>
        </section>

        {/* 6. MEN'S RANKING SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="rounded-[3rem] bg-gradient-to-br from-violet-600/10 to-transparent border border-white/5 p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] -z-10" />
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6 tracking-tight italic uppercase">Visibility is earned</h2>
                        <p className="text-lg text-white/50 mb-10 leading-relaxed">On MATRIARCH, men don’t win through swiping volume. They rise through profile strength, authenticity, activity, and platform signals.</p>
                        <p className="text-white/30 mb-8 italic mb-10">Attention isn’t claimed. It’s qualified for.</p>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {[
                                { label: "Profile Completion", val: "85%" },
                                { label: "Referral Strength", val: "High" },
                                { label: "Verification", val: "Level 2" },
                                { label: "Activity Score", val: "A+" }
                            ].map(item => (
                                <div key={item.label} className="border-l-2 border-violet-500/20 pl-4 py-1">
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{item.label}</div>
                                    <div className="text-xl font-bold text-white/80">{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-10 shadow-3xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
                        <div className="relative space-y-10">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold tracking-widest text-violet-400 uppercase">Current Standing</div>
                                    <div className="text-3xl font-black italic">ELITE TIER</div>
                                </div>
                                <Star className="w-10 h-10 text-violet-500 animate-pulse" />
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                                    <span>Visibility Potential</span>
                                    <span>Top 5%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "95%" }} className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <span className="text-sm font-bold tracking-tight">Access Verification Secured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 7. SAFETY / TRUST SECTION */}
        <section className="mx-auto max-w-5xl px-6 py-32 text-center">
             <div className="inline-flex mb-8 items-center justify-center w-20 h-20 rounded-[2rem] bg-violet-600/20 border border-violet-400/20">
                <Shield className="w-10 h-10 text-violet-400" />
              </div>
            <h2 className="text-4xl font-bold mb-8 italic tracking-tight">Power means nothing without protection</h2>
            <p className="text-xl text-white/50 mb-12 leading-relaxed max-w-3xl mx-auto">
                MATRIARCH is built to give women not just control—but secure control. From communication settings to reporting tools and platform moderation, safety is part of the architecture.
            </p>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {[
                    "Communication controls",
                    "Reporting & blocking",
                    "Profile verification",
                    "Privacy infrastructure",
                    "Moderation controls"
                ].map(item => (
                    <div key={item} className="flex flex-col items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white/80">{item}</span>
                    </div>
                ))}
            </div>
            <p className="mt-20 text-base italic text-white/40">Because real power in dating is not just choice. It’s safe choice.</p>
        </section>

        {/* 8. PREMIUM BRAND SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-32 lg:px-8 border-t border-white/5 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] -z-10" />
             <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 tracking-widest uppercase italic">A private system for modern selection</h2>
                <div className="space-y-8 text-xl leading-relaxed text-white/60">
                    <p>MATRIARCH is for women who are done performing for algorithms and filtering chaos. It creates a more elegant dating dynamic: less noise, more signal, more control.</p>
                    <p className="text-white/80 font-bold uppercase tracking-widest text-sm">For women who want standards. For men willing to qualify.</p>
                    <div className="text-4xl font-black tracking-tighter text-white">This is <span className="text-violet-500">MATRIARCH</span>.</div>
                </div>
             </div>
        </section>

        {/* 9. FINAL CTA / WAITLIST */}
        <section className="mx-auto max-w-7xl px-6 py-32 text-center">
             <div className="rounded-[4rem] bg-gradient-to-t from-violet-600/20 to-white/[0.03] border border-white/10 p-16 lg:p-32 shadow-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-5xl font-bold tracking-tight mb-8">The next era of dating <br/>begins with her choice.</h2>
                    <p className="text-xl text-white/50 mb-12">Join the waitlist for early access priority.</p>
                    
                    <div className="max-w-md mx-auto">
                         <button
                            onClick={() => setShowInviteGate(true)}
                            className="w-full bg-white text-black font-black py-6 rounded-3xl text-xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95"
                        >
                            Reserve Your Place
                        </button>
                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/20">
                            Women receive priority access. Men join the ranked waitlist.
                        </p>
                    </div>
                </div>
             </div>
        </section>
      </main>

      {/* Invite Gate Overlay */}
      <AnimatePresence>
        {showInviteGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/90"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-[#0E0E12] rounded-[2.5rem] border border-white/10 p-10 shadow-3xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600" />
              
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-400/20">
                <Lock className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 italic tracking-tight">Sovereign Access</h2>
              <p className="text-white/50 mb-8 leading-relaxed">MATRIARCH is currently invite-only. Please enter your Sovereign code or check your status on the waitlist.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ENTER SOVEREIGN CODE"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center text-lg font-black tracking-[0.3em] focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
                  />
                </div>
                {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>}
                <button
                  onClick={validateAndLogin}
                  className="w-full bg-violet-600 text-white font-bold py-5 rounded-2xl hover:bg-violet-500 transition-all active:scale-95 shadow-lg shadow-violet-900/40"
                >
                  Verify Access
                </button>
                <button
                  onClick={() => setShowInviteGate(false)}
                  className="w-full text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white/40 transition-colors pt-4"
                >
                  Return to Landing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto max-w-7xl px-6 border-t border-white/5 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5">
                    <span className="text-sm font-bold tracking-[0.1em] text-violet-400">M</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white">MATRIARCH</p>
                </div>
                <p className="text-sm text-white/30 leading-relaxed max-w-xs">Connecting intention with execution. A feminine-first dating ecosystem built for selection, not noise.</p>
            </div>
            <div>
                <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6">Archive</h5>
                <ul className="space-y-4 text-xs font-bold text-white/50">
                    <li className="hover:text-violet-400 transition-colors cursor-pointer tracking-widest uppercase">About</li>
                    <li className="hover:text-violet-400 transition-colors cursor-pointer tracking-widest uppercase">Lore</li>
                    <li className="hover:text-violet-400 transition-colors cursor-pointer tracking-widest uppercase">Safety</li>
                </ul>
            </div>
            <div>
                 <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6">Protocols</h5>
                <ul className="space-y-4 text-xs font-bold text-white/50">
                    <li className="hover:text-violet-400 transition-colors cursor-pointer tracking-widest uppercase">Terms</li>
                    <li className="hover:text-violet-400 transition-colors cursor-pointer tracking-widest uppercase">Privacy</li>
                    <li className="hover:text-violet-400 transition-colors cursor-pointer tracking-widest uppercase">Access</li>
                </ul>
            </div>
        </div>
        <div className="text-center text-white/10 text-[10px] font-bold tracking-[0.4em] uppercase">
          MATRIARCH — WHERE CONNECTION BEGINS WITH HER CHOICE.
        </div>
      </footer>

      {/* Marquee Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
