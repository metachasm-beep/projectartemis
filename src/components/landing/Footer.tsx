import React from 'react';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-mat-obsidian border-t border-white/5 py-4 px-8 snap-start z-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        
        {/* Top: Links Grid (Condensed) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
          <div className="space-y-2">
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Protocol</h4>
            <ul className="space-y-1 text-[8px] text-mat-cream/30 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Sanctuary Code</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Integrity Archive</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Legal</h4>
            <ul className="space-y-1 text-[8px] text-mat-cream/30 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-cream cursor-pointer transition-colors flex items-center gap-1 text-mat-gold">Privacy Policy <ArrowUpRight className="w-2 h-2" /></li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors flex items-center gap-1">Terms of Service <ArrowUpRight className="w-2 h-2" /></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Standing</h4>
            <ul className="space-y-1 text-[8px] text-mat-cream/30 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Candidate Index</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Referral Ledger</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold">Connect</h4>
            <ul className="space-y-1 text-[8px] text-mat-cream/30 uppercase tracking-[0.2em]">
              <li className="hover:text-mat-cream cursor-pointer transition-colors text-mat-gold">Refund Policy</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Journal</li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright & Meta */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
          <p className="text-[7px] text-white/10 tracking-[0.4em] uppercase">© {currentYear} Matriarch Protocol. All Standing Reserved.</p>
          <div className="flex gap-4 text-[7px] text-white/5 uppercase tracking-[0.2em]">
            <span>Delhi / Gurgaon / NCR</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
