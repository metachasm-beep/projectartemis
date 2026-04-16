import React from 'react';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-mat-ivory/50 border-t border-mat-gold/10 py-4 px-8 snap-start z-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        
        {/* Top: Links Grid (Condensed) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Protocol</p>
            <ul className="space-y-1 text-[8px] text-mat-slate/40 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-slate cursor-pointer transition-colors">Sanctuary Code</li>
              <li className="hover:text-mat-slate cursor-pointer transition-colors">Integrity Archive</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Legal</p>
            <ul className="space-y-1 text-[8px] text-mat-slate/40 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-slate cursor-pointer transition-colors flex items-center gap-1 text-mat-gold">Privacy Policy <ArrowUpRight className="w-2 h-2" /></li>
              <li className="hover:text-mat-slate cursor-pointer transition-colors flex items-center gap-1">Terms of Service <ArrowUpRight className="w-2 h-2" /></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Standing</p>
            <ul className="space-y-1 text-[8px] text-mat-slate/40 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-slate cursor-pointer transition-colors">Candidate Index</li>
              <li className="hover:text-mat-slate cursor-pointer transition-colors">Referral Ledger</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Connect</p>
            <ul className="space-y-1 text-[8px] text-mat-slate/40 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-slate cursor-pointer transition-colors text-mat-gold">Refund Policy</li>
              <li className="hover:text-mat-slate cursor-pointer transition-colors">Journal</li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright & Meta */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-mat-gold/10">
          <p className="text-[7px] text-mat-slate/30 tracking-[0.4em] uppercase">
            © {currentYear} Matriarch Protocol. All Standing Reserved. <br className="md:hidden" />
            Matriarch is a trademark of METACHASM (OPC) PRIVATE LIMITED.
          </p>
          <div className="flex gap-4 text-[7px] text-mat-slate/20 uppercase tracking-[0.2em]">
            <span>Delhi / Gurgaon / NCR</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
