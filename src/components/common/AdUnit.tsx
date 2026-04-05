import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: 'true' | 'false';
  style?: React.CSSProperties;
  className?: string;
  ads_accepted?: boolean; // DPDP Consent Flag
}

/**
 * AdUnit: A high-fidelity React wrapper for Google AdSense.
 * Ensures the 'adsbygoogle.push' lifecycle is handled correctly.
 */
const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = 'true', 
  style, 
  className = "",
  ads_accepted = true 
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // If the user has opted out of ads (DPDP), do not initialize.
    if (!ads_accepted) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("MATRIARCH_AD_ENGINE: AdSense push failed.", err);
    }
  }, [ads_accepted]);

  // If consent is missing, render nothing.
  if (!ads_accepted) return null;

  return (
    <div className={`my-8 overflow-hidden rounded-2xl bg-mat-wine/5 border border-mat-rose/5 ${className}`} style={{ minHeight: '100px', ...style }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-mat-rose/5">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-mat-wine/30">Sponsored Section</span>
         <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-mat-wine/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-mat-wine/20" />
         </div>
      </div>
      
      <div className="p-4 flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px', ...style }}
          data-ad-client="ca-pub-8618345567810746"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
      
      <div className="px-4 py-2 bg-mat-wine/[0.02] text-[8px] text-mat-slate/20 text-center uppercase tracking-widest">
         Protocol-compliant advertisement // 2026
      </div>
    </div>
  );
};

export default AdUnit;
