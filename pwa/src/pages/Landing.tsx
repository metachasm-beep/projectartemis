import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShinyText from "../components/ui/react-bits/ShinyText";
import SpotlightCard from "../components/ui/react-bits/SpotlightCard";
import LiquidChrome from "../components/ui/react-bits/LiquidChrome";
import TextPressure from "../components/ui/react-bits/TextPressure";
import { Lock, ArrowRight, Shield, Star, Zap, X, Check, Eye, UserCheck, MessageSquare, Crown } from "lucide-react";

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
    <div className="min-h-screen bg-[#0A0A0B] text-[#F6F3EE] selection:bg-[#6E3FF3]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Premium Waves Background */}
      <div className="fixed inset-0 -z-10">
        <LiquidChrome
          baseColor={[0.1, 0.05, 0.2]}
          speed={0.15}
          amplitude={0.6}
          interactive={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0B]/50 to-[#0A0A0B]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0B]/40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#D4AF37]/20 bg-[#24152E]/40 shadow-2xl">
              <Crown className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-black uppercase tracking-[0.6em] text-white/90">MATRIARCH</p>
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
              className="btn-primary"
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
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-[#6E3FF3]/20 bg-[#6E3FF3]/5 px-6 py-2.5 text-[10px] uppercase tracking-[0.4em] text-[#6E3FF3] font-black">
                <Crown className="w-3.5 h-3.5" />
                Sovereign Selection Architecture
              </div>

              <div className="h-[180px] mb-12">
                <TextPressure
                  text="SHE CHOOSES."
                  fontFamily="Sora"
                  textColor="#F6F3EE"
                  minFontSize={80}
                  width={true}
                  weight={true}
                />
              </div>

              <p className="text-xl leading-relaxed text-white/70 mb-6 max-w-xl">
                MATRIARCH is a women-first dating platform where men don’t swipe, chase, or flood inboxes. They build their profile, earn their visibility, and wait to be chosen.
              </p>
              
              <p className="text-base text-white/40 mb-10 max-w-xl italic">
                A high-trust, high-tech dating experience designed around feminine control, selective access, and intentional connection.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <button
                  onClick={() => setShowInviteGate(true)}
                  className="btn-gold"
                >
                  Join the Waitlist
                  <ArrowRight className="ml-2 w-5 h-5 inline-block" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-secondary"
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

        <section className="border-y border-white/5 bg-white/[0.02] py-12 overflow-hidden whitespace-nowrap">
          <div className="flex gap-24 items-center animate-marquee">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-24 items-center">
                <span className="text-4xl font-black tracking-tighter text-white/5 uppercase italic">Not another swipe app.</span>
                <Crown className="w-8 h-8 text-[#D4AF37]/20" />
                <span className="text-4xl font-black tracking-tighter text-white/5 uppercase italic">Not another attention marketplace.</span>
                <Crown className="w-8 h-8 text-[#D4AF37]/20" />
                <span className="text-4xl font-black tracking-tighter text-white/5 uppercase italic">Not another inbox war.</span>
                <Crown className="w-8 h-8 text-[#D4AF37]/20" />
                <span className="text-4xl font-black tracking-tighter text-[#6E3FF3]/20 uppercase italic">MATRIARCH redefines dating.</span>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-8 py-40">
           <div className="text-center mb-24">
              <h2 className="text-5xl font-black tracking-tight sm:text-6xl mb-6">Sovereign Mechanics</h2>
              <p className="text-[#A6A0B3] text-xl font-medium">A three-tiered system of intentional engagement.</p>
           </div>

          <div className="grid gap-8 md:grid-cols-3">
            <SpotlightCard className="p-12 surface-premium rounded-xl relative overflow-hidden group border-none">
              <div className="mb-10 rounded-2xl bg-[#6E3FF3]/10 p-6 w-fit group-hover:bg-[#6E3FF3]/20 transition-all duration-500 shadow-2xl">
                <Eye className="w-10 h-10 text-[#6E3FF3]" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-black mb-4 uppercase tracking-[0.3em] text-[#6E3FF3]">For Women</h3>
              <h4 className="text-3xl font-bold mb-6 text-white leading-tight">Review. <br/>Decide.</h4>
              <p className="text-[#A6A0B3] leading-relaxed text-lg">Browse curated profiles of men who meet your exacting criteria. Match only when excellence is evident.</p>
            </SpotlightCard>

            <SpotlightCard className="p-12 surface-premium rounded-xl relative overflow-hidden group border-none">
              <div className="mb-10 rounded-2xl bg-fuchsia-600/10 p-6 w-fit group-hover:bg-fuchsia-600/20 transition-all duration-500 shadow-2xl">
                <UserCheck className="w-10 h-10 text-fuchsia-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-black mb-4 uppercase tracking-[0.3em] text-fuchsia-400">For Men</h3>
              <h4 className="text-3xl font-bold mb-6 text-white leading-tight">Build. <br/>Qualify.</h4>
              <p className="text-[#A6A0B3] leading-relaxed text-lg">No swiping. No chasing. Construct a profile of substance, earn your rank, and await discovery.</p>
            </SpotlightCard>

            <SpotlightCard className="p-12 surface-premium rounded-xl relative overflow-hidden group border-none">
              <div className="mb-10 rounded-2xl bg-[#D4AF37]/10 p-6 w-fit group-hover:bg-[#D4AF37]/20 transition-all duration-500 shadow-2xl">
                <MessageSquare className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-black mb-4 uppercase tracking-[0.3em] text-[#D4AF37]">Execution</h3>
              <h4 className="text-3xl font-bold mb-6 text-white leading-tight">Her Terms. <br/>Always.</h4>
              <p className="text-[#A6A0B3] leading-relaxed text-lg">Communication begins only how and when she defines. No uninvited access, ever.</p>
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

        <section className="mx-auto max-w-7xl px-8 py-40">
          <div className="text-center mb-32">
             <h2 className="text-4xl font-black tracking-tight sm:text-6xl mb-6">Selection Protocol Features</h2>
             <p className="text-[#A6A0B3] text-xl">Designed for women who want control, not clutter.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
                { title: "Sovereign Matching", desc: "Men do not browse women. Women initiate every selection cycle.", icon: Crown },
                { title: "Ranked Discovery", desc: "Profiles are accessed through a meritocratic ranking system.", icon: Zap },
                { title: "Communication Modes", desc: "After matching, she defines the connection parameters.", icon: MessageSquare },
                { title: "Verified Lineage", desc: "Multi-factor verification and elite referral systems.", icon: Shield },
                { title: "intentional Standing", desc: "Men improve visibility through quality and authenticity.", icon: Star },
                { title: "Private Architecture", desc: "Designed as a closed-loop selection system.", icon: Lock },
            ].map((feature, i) => (
                <SpotlightCard key={i} className="p-10 surface-raised rounded-xl hover:border-[#6E3FF3]/30 transition-all border-none">
                    <feature.icon className="w-8 h-8 text-[#6E3FF3] mb-8" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-[#A6A0B3] leading-relaxed">{feature.desc}</p>
                </SpotlightCard>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-8 py-32">
            <div className="rounded-xl surface-premium p-16 lg:p-24 relative overflow-hidden border-none shadow-premium">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6E3FF3]/10 blur-[120px] -z-10" />
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-4xl font-black mb-8 tracking-tight italic uppercase leading-none">Visibility is <br/><span className="text-[#D4AF37]">Earned.</span></h2>
                        <p className="text-xl text-[#A6A0B3] mb-12 leading-relaxed">On MATRIARCH, attention isn't a commodity to be bought or spammed. It is qualified for through excellence, authenticity, and verified standing.</p>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { label: "Profile Integrity", val: "98%" },
                                { label: "Elite Standing", val: "Tier 1" },
                                { label: "Verification", val: "Royal" },
                                { label: "Platform Signal", val: "A+" }
                            ].map(item => (
                                <div key={item.label} className="border-l-2 border-[#6E3FF3]/30 pl-6 py-2">
                                    <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black mb-2">{item.label}</div>
                                    <div className="text-2xl font-bold text-white">{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#0A0A0B]/60 backdrop-blur-3xl rounded-xl border border-white/5 p-12 shadow-3xl relative">
                        <div className="absolute inset-0 bg-[#6E3FF3]/5" />
                        <div className="relative space-y-12">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black tracking-[0.4em] text-[#6E3FF3] uppercase">Sovereign Standing</div>
                                    <div className="text-4xl font-black italic">ELITE TIER</div>
                                </div>
                                <Crown className="w-12 h-12 text-[#D4AF37] animate-pulse" strokeWidth={1} />
                            </div>
                            <div className="space-y-8">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                                    <span>Visibility Index</span>
                                    <span className="text-[#D4AF37]">Top 1%</span>
                                </div>
                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "99%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#6E3FF3] to-[#D4AF37] shadow-[0_0_20px_rgba(110,63,243,0.5)]" />
                                </div>
                            </div>
                            <div className="p-8 rounded-xl surface-raised flex items-center justify-between border-none">
                                <div className="flex items-center gap-6">
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
                                    <span className="text-sm font-black uppercase tracking-widest text-[#F6F3EE]">Sovereign Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 7. SAFETY / TRUST SECTION */}
        <section className="mx-auto max-w-5xl px-8 py-40 text-center">
             <div className="inline-flex mb-12 items-center justify-center w-24 h-24 rounded-xl bg-[#6E3FF3]/10 border border-[#6E3FF3]/20 shadow-premium">
                <Shield className="w-12 h-12 text-[#6E3FF3]" strokeWidth={1.5} />
              </div>
            <h2 className="text-4xl font-black mb-10 italic tracking-tight sm:text-5xl uppercase">Security through Authority</h2>
            <p className="text-xl text-[#A6A0B3] mb-16 leading-relaxed max-w-3xl mx-auto">
                MATRIARCH is built to give women not just choice—but absolute, secure control. Safety is not a feature; it is the fundamental architecture of the Sovereign selection cycle.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {[
                    "Communication isolation",
                    "Verification protocols",
                    "Privacy infrastructure",
                    "Selective discovery",
                    "Moderated mechanics"
                ].map(item => (
                    <div key={item} className="flex flex-col items-center gap-4 surface-raised p-8 rounded-xl border-none">
                        <div className="w-2 h-2 rounded-full bg-[#6E3FF3] shadow-violet-500/50 shadow-glow" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white/80">{item}</span>
                    </div>
                ))}
            </div>
            <p className="mt-24 text-sm font-black italic text-white/20 uppercase tracking-[0.4em]">Real power is the power to choose safely.</p>
        </section>

        <section className="mx-auto max-w-7xl px-8 py-40 border-t border-white/5 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-[radial-gradient(circle,rgba(110,63,243,0.08)_0%,transparent_70%)] -z-10" />
             <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl font-black mb-12 tracking-[0.3em] uppercase italic">The Private Selection System</h2>
                <div className="space-y-10 text-xl leading-relaxed text-[#A6A0B3]">
                    <p>MATRIARCH is for those who are done performing for machines. It creates a more elegant dynamic: less noise, more excellence, more power where it belongs.</p>
                    <p className="text-white font-black uppercase tracking-[0.5em] text-sm">For the selective. For the exceptional.</p>
                    <div className="text-6xl font-black tracking-tighter text-white mt-12">MATRIARCH.</div>
                </div>
             </div>
        </section>

        <section className="mx-auto max-w-7xl px-8 py-40 text-center">
             <div className="rounded-xl surface-premium p-20 lg:p-40 shadow-premium relative overflow-hidden border-none">
                <div className="relative z-10">
                    <h2 className="text-5xl font-black tracking-tight mb-12 sm:text-7xl uppercase leading-none">The Era of <br/><span className="text-[#6E3FF3]">Selection</span> Begins.</h2>
                    <p className="text-xl text-[#A6A0B3] mb-16 font-medium">Join the waitlist for sovereign access priority.</p>
                    
                    <div className="max-w-md mx-auto">
                         <button
                            onClick={() => setShowInviteGate(true)}
                            className="btn-gold w-full py-8 text-2xl shadow-premium"
                        >
                            Reserve Your Place
                        </button>
                        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                            Women receive priority. Men earn their rank.
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
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="max-w-md w-full surface-premium rounded-xl p-12 shadow-premium text-center relative overflow-hidden border-none"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6E3FF3] via-[#D4AF37] to-[#6E3FF3]" />
              
              <div className="mb-10 inline-flex items-center justify-center w-20 h-20 rounded-xl bg-[#6E3FF3]/10 border border-[#6E3FF3]/20 shadow-glow">
                <Lock className="w-10 h-10 text-[#6E3FF3]" strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl font-black mb-6 italic tracking-tight uppercase">Sovereign Access</h2>
              <p className="text-[#A6A0B3] mb-12 leading-relaxed font-medium">MATRIARCH is a private selective infrastructure. Please enter your Sovereign code or verify your waitlist standing.</p>
              
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="SOVEREIGN CODE"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-8 py-6 text-center text-xl font-black tracking-[0.5em] focus:border-[#6E3FF3] focus:bg-white/10 outline-none transition-all placeholder:text-white/5"
                  />
                </div>
                {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.3em]">{error}</p>}
                <button
                  onClick={validateAndLogin}
                  className="btn-primary w-full py-6 text-lg shadow-glow"
                >
                  Verify Access
                </button>
                <button
                  onClick={() => setShowInviteGate(false)}
                  className="w-full text-white/20 text-[10px] font-black uppercase tracking-[0.5em] hover:text-[#6E3FF3] transition-colors pt-6"
                >
                  Return to Archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto max-w-7xl px-8 border-t border-white/5 py-40">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            <div className="col-span-2">
                <div className="flex items-center gap-4 mb-10">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/5">
                      <Crown className="w-5 h-5 text-[#6E3FF3]" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.5em] text-white">MATRIARCH</p>
                </div>
                <p className="text-sm text-[#A6A0B3] leading-relaxed max-w-sm font-medium">Redefining connection through selective architecture. A private ecosystem built for intention, not noise.</p>
            </div>
            <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Archive</h5>
                <ul className="space-y-6 text-xs font-black text-white/40 tracking-[0.2em] uppercase">
                    <li className="hover:text-[#6E3FF3] transition-colors cursor-pointer">About</li>
                    <li className="hover:text-[#6E3FF3] transition-colors cursor-pointer">Protocol</li>
                    <li className="hover:text-[#6E3FF3] transition-colors cursor-pointer">Safety</li>
                </ul>
            </div>
            <div>
                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Sovereign</h5>
                <ul className="space-y-6 text-xs font-black text-white/40 tracking-[0.2em] uppercase">
                    <li className="hover:text-[#6E3FF3] transition-colors cursor-pointer">Terms</li>
                    <li className="hover:text-[#6E3FF3] transition-colors cursor-pointer">Privacy</li>
                    <li className="hover:text-[#6E3FF3] transition-colors cursor-pointer">Waitlist</li>
                </ul>
            </div>
        </div>
        <div className="text-center text-white/5 text-[10px] font-black tracking-[0.8em] uppercase">
          MATRIARCH — CONNECTION BEGINS WITH HER CHOICE.
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
