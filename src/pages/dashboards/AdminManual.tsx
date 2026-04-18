import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  MessageSquare, 
  Cpu, 
  Fingerprint, 
  Activity, 
  Lock, 
  Eye, 
  BookOpen, 
  Globe, 
  Database,
  Flame,
  Star,
  Compass
} from 'lucide-react';

export const AdminManual: React.FC = () => {
  const sections = [
    {
      title: "I. THE CORE PROTOCOL",
      icon: Cpu,
      content: "The Matriarch Protocol is a sovereign identity and resonance framework designed to facilitate high-fidelity human alignment. It operates on a zero-noise, high-intent architectural philosophy, where every interaction is filtered through multiple layers of verification and merit.",
      details: [
        "Sovereign Identity: Users are 'Aspirants' until sealed.",
        "The Gnosis: A proprietary matching algorithm based on resonance, not swiping.",
        "Zero-Scroll UX: Optimized for presence, not consumption."
      ]
    },
    {
      title: "II. IDENTITY & VERIFICATION",
      icon: Shield,
      content: "Verification is the 'Seal of Truth'. It is not a binary flag but a multi-stage biometric and social proofing process.",
      details: [
        "Identity Seal: Granted by admins after UTR/Payment verification.",
        "Biometric Sync: Automated image consistency checks.",
        "Aura Ranks: A competitive meritocracy based on platform contribution."
      ]
    },
    {
      title: "III. RESONANCE & COMMUNICATION",
      icon: MessageSquare,
      content: "The 'Magic Chat' interface manages communication modes to prevent digital fatigue and ensure intentionality.",
      details: [
        "TEXT: Standard real-time dialogue.",
        "DELAYED_TEXT: Artificial latency for deep reflection.",
        "HOLD: Temporary conduit suspension.",
        "REVOKED: Permanent identity decoupling."
      ]
    },
    {
      title: "IV. AURA ECONOMICS",
      icon: Zap,
      content: "Aura tokens are the fuel of the Sanctuary. They are used for identity amplification and protocol access.",
      details: [
        "Aura Tithes: Direct UPI/UTR based token claims.",
        "Sovereign Broadcast: High-visibility manifesto delivery.",
        "Merit Rewards: Automated rewards for high-resonance interactions."
      ]
    },
    {
      title: "V. ADMINISTRATIVE OVERSIGHT",
      icon: Eye,
      content: "The Admin Dashboard provides total visibility into the Sanctuary's pulse while maintaining the 'Veil of Privacy' for aspirants.",
      details: [
        "SIGINT: Passive resonance monitoring of communication conduits.",
        "Excision: The recursive deletion of non-aligned identities.",
        "The Ledger: Real-time tracking of Aura flows and system metrics."
      ]
    }
  ];

  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-32">
       <header className="space-y-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black tracking-[0.5em] uppercase italic">
             <Globe size={12} className="animate-spin-slow" /> SYSTEM_MANUAL_V3.0
          </div>
          <h1 className="text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
             THE MATRIARCH <span className="font-light text-slate-300">CODEX</span>
          </h1>
          <p className="text-xl text-slate-400 italic font-medium max-w-2xl mx-auto leading-relaxed">
             Comprehensive operational manual for the sovereign administration of the Matriarch Sanctuary and its resonant Aspirants.
          </p>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-10">
          {sections.map((s, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="group p-12 bg-white border border-black/[0.02] rounded-[4rem] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                   <s.icon size={180} strokeWidth={1} />
                </div>
                
                <div className="space-y-8 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-slate-50 rounded-[2rem] border border-black/[0.03] text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                         <s.icon size={24} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{s.title}</h3>
                   </div>
                   
                   <p className="text-sm text-slate-500 leading-relaxed italic border-l-2 border-slate-100 pl-6">
                      {s.content}
                   </p>
                   
                   <ul className="space-y-4">
                      {s.details.map((d, j) => (
                         <li key={j} className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                            <Star size={10} className="text-slate-200" /> {d}
                         </li>
                      ))}
                   </ul>
                </div>
             </motion.div>
          ))}
       </div>

       <div className="max-w-7xl mx-auto px-10">
          <div className="bg-slate-900 p-20 rounded-[5rem] relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-20 opacity-10">
                <Flame size={300} className="text-white" strokeWidth={1} />
             </div>
             
             <div className="max-w-3xl space-y-10 relative z-10">
                <div className="space-y-4">
                   <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">EMERGENCY PROTOCOLS</h2>
                   <p className="text-slate-400 text-lg italic leading-relaxed">In the event of a system-wide resonance failure or high-priority security breach, use the 'Excision Protocol' to purge the non-aligned identity immediately.</p>
                </div>
                
                <div className="grid grid-cols-3 gap-10 border-t border-white/10 pt-10">
                   <div className="space-y-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Auth Status</span>
                      <p className="text-white font-bold italic">SOVEREIGN_ADMIN</p>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Resonance</span>
                      <p className="text-white font-bold italic">GLOBAL_PULSE_ACTIVE</p>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Uplink</span>
                      <p className="text-white font-bold italic">TURSO_SYNCHRONIZED</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <footer className="text-center pb-20 opacity-20">
          <p className="text-[9px] font-black text-slate-900 uppercase tracking-[1em] italic">Matriarch Protocol © 2026 // AD_VITAM</p>
       </footer>
    </div>
  );
};
