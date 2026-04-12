import React from 'react';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-mat-obsidian border-t border-white/5 py-12 px-8 snap-start z-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        
        {/* Top: Branding & Socials */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-3xl font-display text-mat-cream tracking-[0.2em] opacity-80 mb-2 uppercase">MATRIARCH</div>
            <p className="text-[10px] text-mat-cream/40 uppercase tracking-[0.3em] font-light">The Elite Merit Protocol</p>
          </div>

          <div className="flex gap-6">
            {[
              { icon: ExternalLink, href: "#", label: "Instagram" },
              { icon: X, href: "#", label: "X" },
              { icon: ExternalLink, href: "#", label: "LinkedIn" }
            ].map((social) => (
              <motion.a 
                key={social.label}
                href={social.href}
                whileHover={{ y: -2, color: "#BFA06A" }}
                className="text-mat-cream/30 hover:text-mat-gold transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" strokeWidth={1.5} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Middle: Links Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">Protocol</h4>
            <ul className="space-y-2 text-[10px] text-mat-cream/30 uppercase tracking-[0.2em] font-medium">
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Sanctuary Code</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Integrity Archive</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Sovereign Contact</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">Legal</h4>
            <ul className="space-y-2 text-[10px] text-mat-cream/30 uppercase tracking-[0.2em] font-medium">
              <li className="hover:text-mat-cream cursor-pointer transition-colors flex items-center gap-1">Privacy Policy <ArrowUpRight className="w-3 h-3" /></li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors flex items-center gap-1">Terms of Service <ArrowUpRight className="w-3 h-3" /></li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors flex items-center gap-1">Refund & Cancellation <ArrowUpRight className="w-3 h-3" /></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">Standing</h4>
            <ul className="space-y-2 text-[10px] text-mat-cream/30 uppercase tracking-[0.2em] font-medium">
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Candidate Index</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Referral Ledger</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">Connect</h4>
            <ul className="space-y-2 text-[10px] text-mat-cream/30 uppercase tracking-[0.2em] font-medium">
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Journal</li>
              <li className="hover:text-mat-cream cursor-pointer transition-colors">Concierge</li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
          <p className="text-[9px] text-white/10 tracking-[0.4em] uppercase">© {currentYear} Matriarch Protocol. All Standing Reserved.</p>
          <div className="flex gap-4 text-[9px] text-white/5 uppercase tracking-[0.2em]">
            <span>Delhi / Gurgaon / NCR</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
