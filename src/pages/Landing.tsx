import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LegalArchiveOverlay from "@/components/layout/LegalArchiveOverlay";
import OnboardingOverlay from "@/components/layout/OnboardingOverlay";
import GrainOverlay from "@/components/landing/GrainOverlay";
import HeroFold from "@/components/landing/HeroFold";
import HowItWorksFold from "@/components/landing/HowItWorksFold";
import LandscapeProtocolFold from "@/components/landing/LandscapeProtocolFold";
import MeritFold from "@/components/landing/MeritFold";
import SystemIntegrityFold from "@/components/landing/SystemIntegrityFold";
import SelectionMatrixFold from "@/components/landing/SelectionMatrixFold";
import SecurityFold from "@/components/landing/SecurityFold";
import Footer from "@/components/landing/Footer";
import MatriarchLogo from "@/components/MatriarchLogo";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const LandingPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { scrollYProgress } = useScroll({
    container: mainRef,
  });

  // Dynamic Logo Transitions: Gradual drift across the entire scroll
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const logoY = useTransform(scrollYProgress, [0, 1], [24, 12]);
  
  // Mobile-specific X transition (Center -> Top Right) - only applied if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mobileX = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "44vw" : "0%"]);
  const mobileTranslateX = useTransform(scrollYProgress, [0, 1], ["-50%", "-50%"]); // Keep center anchor

  // Desktop stays centered but scales down
  const desktopScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

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
          scale: logoScale,
          y: logoY,
          x: mobileX,
          translateX: mobileTranslateX
        }}
        className="fixed left-1/2 top-6 z-[100] pointer-events-none origin-center"
      >
        <MatriarchLogo iconOnly={isMobile} className="transition-transform duration-300" />
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
          <SystemIntegrityFold />
          <MeritFold />
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
