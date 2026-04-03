import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LogOut, 
  HelpCircle, 
  ShieldCheck, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { MatriarchLogo } from "@/components/MatriarchLogo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const MatriarchHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'wisdom', label: 'Divine Wisdom', desc: 'Frequently Asked Questions', icon: HelpCircle, action: () => {
      setIsOpen(false);
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }},
    { id: 'verification', label: 'The Truth Protocol', desc: 'Secure Your Identity', icon: ShieldCheck, action: () => {
      setIsOpen(false);
      // Logic for verification
    }},
    { id: 'settings', label: 'Sanctuary Settings', desc: 'Privacy & Preferences', icon: Settings, action: () => {
      setIsOpen(false);
    }},
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F10]/60 backdrop-blur-xl border-b border-white/5">
        <div className="mat-container h-16 flex items-center justify-between">
          <MatriarchLogo className="scale-75 origin-left" />
          
          <button 
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all shadow-xl"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-2xl px-8 flex flex-col pt-24"
          >
            <div className="flex justify-between items-center mb-16">
               <MatriarchLogo />
               <button 
                 onClick={() => setIsOpen(false)}
                 className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40"
               >
                 <X size={24} />
               </button>
            </div>

            <div className="space-y-4">
               {menuItems.map((item) => (
                 <motion.div
                   key={item.id}
                   whileTap={{ scale: 0.98 }}
                   onClick={item.action}
                   className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-between group cursor-pointer"
                 >
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-mat-gold group-hover:text-black transition-all">
                        <item.icon size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                         <h4 className="mat-text-label-pro !text-white !not-italic mb-1">{item.label}</h4>
                         <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">{item.desc}</p>
                      </div>
                   </div>
                   <ChevronRight size={16} className="text-white/10 group-hover:text-mat-gold transition-colors" />
                 </motion.div>
               ))}
            </div>

            <div className="mt-auto pb-16 space-y-8">
               <button 
                 onClick={async () => {
                   await supabase.auth.signOut();
                   window.location.reload();
                 }}
                 className="w-full h-16 rounded-[1.5rem] border border-red-500/20 bg-red-500/5 text-red-500 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.4em]"
               >
                  <LogOut size={16} />
                  Leave the Sanctuary
               </button>
               
               <p className="text-center mat-text-label-pro opacity-10">
                 Matriarch Protocol v1.0.4 — Sanctuary Secured
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
