import React from 'react';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  onOpenLegal?: (slug: string) => void;
  onScrollTo?: (id: string) => void;
  onScrollToTop?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenLegal, onScrollTo, onScrollToTop }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-mat-ivory/50 border-t border-mat-gold/10 py-12 px-8 snap-start z-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        
        {/* Top: Links Grid (Condensed) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-12 py-4">
          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold">Protocol</p>
            <ul className="space-y-2 text-[9px] text-mat-slate/60 font-bold uppercase tracking-[0.2em]">
              <li 
                onClick={() => onOpenLegal?.('protocol')}
                className="hover:text-mat-wine cursor-pointer transition-colors"
              >
                Sanctuary Code
              </li>
              <li 
                onClick={() => onOpenLegal?.('case-studies')}
                className="hover:text-mat-wine cursor-pointer transition-colors"
              >
                Integrity Archive
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold">Legal</p>
            <ul className="space-y-2 text-[9px] text-mat-slate/60 font-bold uppercase tracking-[0.2em]">
              <li 
                onClick={() => onOpenLegal?.('privacy-pact')}
                className="hover:text-mat-wine cursor-pointer transition-colors flex items-center gap-1"
              >
                Privacy Policy <ArrowUpRight className="w-2.5 h-2.5" />
              </li>
              <li 
                onClick={() => onOpenLegal?.('terms-of-merit')}
                className="hover:text-mat-wine cursor-pointer transition-colors flex items-center gap-1"
              >
                Terms of Service <ArrowUpRight className="w-2.5 h-2.5" />
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold">Standing</p>
            <ul className="space-y-2 text-[9px] text-mat-slate/60 font-bold uppercase tracking-[0.2em]">
              <li 
                onClick={() => onScrollTo?.('matrix')}
                className="hover:text-mat-wine cursor-pointer transition-colors"
              >
                Candidate Index
              </li>
              <li 
                onClick={() => onScrollTo?.('how-it-works')}
                className="hover:text-mat-wine cursor-pointer transition-colors"
              >
                Referral Ledger
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold">Connect</p>
            <ul className="space-y-2 text-[9px] text-mat-slate/60 font-bold uppercase tracking-[0.2em]">
              <li 
                onClick={() => onOpenLegal?.('refund-policy')}
                className="hover:text-mat-wine cursor-pointer transition-colors"
              >
                Refund Policy
              </li>
              <li>
                <a 
                  href="https://blogs.matriarchindia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-mat-wine cursor-pointer transition-colors flex items-center gap-1"
                >
                  Journal <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle: Back to Top elevator */}
        <div className="w-full flex justify-center -my-6">
           <button 
             onClick={() => onScrollToTop?.()}
             className="group flex flex-col items-center gap-2 p-4 transition-transform hover:-translate-y-1 active:scale-95"
           >
              <div className="w-10 h-10 rounded-full border border-mat-gold/20 flex items-center justify-center text-mat-gold bg-mat-ivory/50 group-hover:bg-mat-gold group-hover:text-white transition-all shadow-sm">
                 <ArrowUpRight className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-mat-gold/60 group-hover:text-mat-gold transition-colors">Return to Zenith</span>
           </button>
        </div>

        {/* Bottom: Copyright & Meta */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-mat-gold/10">
          <p className="text-[7px] text-mat-slate/40 font-bold tracking-[0.4em] uppercase text-center md:text-left leading-loose">
            © {currentYear} Matriarch Protocol. All Standing Reserved. <br className="md:hidden" />
            Matriarch is a trademark of METACHASM (OPC) PRIVATE LIMITED.
          </p>
          <div className="flex gap-4 text-[7px] text-mat-slate/30 font-bold uppercase tracking-[0.2em]">
            <span>Delhi / Gurgaon / NCR</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
