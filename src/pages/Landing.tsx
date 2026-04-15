import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LegalArchiveOverlay from "@/components/layout/LegalArchiveOverlay";
import OnboardingOverlay from "@/components/layout/OnboardingOverlay";
import GrainOverlay from "@/components/landing/GrainOverlay";
import HeroFold from "@/components/landing/HeroFold";
import HowItWorksFold from "@/components/landing/HowItWorksFold";
import LandscapeProtocolFold from "@/components/landing/LandscapeProtocolFold";
import SecurityFold from "@/components/landing/SecurityFold";
import SelectionMatrixFold from "@/components/landing/SelectionMatrixFold";
import Footer from "@/components/landing/Footer";
import MatriarchLogo from "@/components/MatriarchLogo";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef } from "react";

const LandingPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hideLogoText, setHideLogoText] = useState(false);

  const { scrollYProgress } = useScroll({
    container: mainRef,
  });

  // Dynamic Logo transitions: STRICT First-Fold Visibility Only
  // With 8 folds, 1/8 = 0.125. We fade out exactly at the transition.
  const logoOpacity = useTransform(scrollYProgress, [0, 0.08, 0.12, 1], [1, 1, 0, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95]);
  
  // Mobile-specific X transition - strictly centered for Hero
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop stays centered with subtle fade
  const desktopOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Check session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('user_id', session.user.id)
          .single();
        
        if (!profile || !profile.date_of_birth) {
          setShowOnboarding(true);
        }
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('user_id', session.user.id)
          .single();
        
        if (!profile || !profile.date_of_birth) {
          setShowOnboarding(true);
        }
      } else {
        setCurrentUser(null);
        setShowOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = async (data: { dob: string; analytics: boolean; ads: boolean }) => {
    if (!currentUser) return;
    try {
      await fetch('/api/legal/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          document_type: 'dpdp_processing',
          version: '2026.04.05',
          device_info: navigator.userAgent
        })
      });

      const response = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          date_of_birth: data.dob,
          analytics_accepted: data.analytics,
          ads_accepted: data.ads
        })
      });

      if (!response.ok) throw new Error("Statutory validation failed.");
      setShowOnboarding(false);
      window.location.reload(); 
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <main 
      ref={mainRef}
      className="relative h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-mat-cream selection:bg-mat-gold/20 selection:text-mat-slate"
    >
      {/* 🔮 Dynamic Persistent Logo (Mobile: Top-Right Transition) */}
      <motion.div 
        style={{ 
          opacity: isMobile ? logoOpacity : desktopOpacity,
          scale: logoScale,
        }}
        className="fixed left-1/2 top-12 md:top-8 z-[100] -translate-x-1/2 pointer-events-none origin-center"
      >
        <MatriarchLogo className="transition-transform duration-300" />
      </motion.div>

      {/* 1. Global Cinematic Texture */}
      <GrainOverlay />
      
      {/* 2. Fold Sections */}
      <div className="relative z-10 w-full h-full">
        {/* Fixed Logo is handled internally by HeroFold with z-index control */}
        <HeroFold />
        
        {/* Subsequent Folds scroll over the Hero layer */}
        <div className="relative z-20">
          <HowItWorksFold />
          <LandscapeProtocolFold />
          <SelectionMatrixFold />
          <SecurityFold />
          
          <Footer />
        </div>
      </div>

      {/* Overlays */}
      <LegalArchiveOverlay />
      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} />}
    </main>
  );
};

export default LandingPage;
