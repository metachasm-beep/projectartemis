import React, { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import LegalArchiveOverlay from "@/components/layout/LegalArchiveOverlay";
import OnboardingOverlay from "@/components/layout/OnboardingOverlay";
import GrainOverlay from "@/components/landing/GrainOverlay";
import HeroFold from "@/components/landing/HeroFold";

// 🚀 Performance: Lazy load sections below the fold
const HowItWorksFold = lazy(() => import("@/components/landing/HowItWorksFold"));
const LandscapeProtocolFold = lazy(() => import("@/components/landing/LandscapeProtocolFold"));
const SecurityFold = lazy(() => import("@/components/landing/SecurityFold"));
const SelectionMatrixFold = lazy(() => import("@/components/landing/SelectionMatrixFold"));
const Footer = lazy(() => import("@/components/landing/Footer"));

import MatriarchLogo from "@/components/MatriarchLogo";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef } from "react";

const LandingPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const secondaryFoldRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSecondaryFolds, setShowSecondaryFolds] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🚀 Performance: Defer secondary folds until interaction or scroll proximity
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowSecondaryFolds(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' } // Start loading 400px before reaching the section
    );

    if (secondaryFoldRef.current) {
      observer.observe(secondaryFoldRef.current);
    }

    // Fail-safe: Also trigger on interaction/scroll
    const trigger = () => {
      setShowSecondaryFolds(true);
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('touchstart', trigger);
    };
    window.addEventListener('scroll', trigger, { passive: true });
    window.addEventListener('touchstart', trigger, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('touchstart', trigger);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    container: mainRef,
  });

  // Dynamic Logo transitions: STRICT First-Fold Visibility Only
  const logoOpacity = useTransform(scrollYProgress, [0, 0.005], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.005], [1, 0.9]);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const desktopOpacity = useTransform(scrollYProgress, [0, 0.005], [1, 0]);

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

  const [legalSlug, setLegalSlug] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && mainRef.current) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main 
      ref={mainRef}
      className="relative h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-mat-cream selection:bg-mat-gold/20 selection:text-mat-slate"
    >
      {/* 🔮 Dynamic Persistent Logo */}
      <motion.div 
        style={{ 
          opacity: isMobile ? logoOpacity : desktopOpacity,
          scale: logoScale,
        }}
        className="fixed left-1/2 top-12 md:top-8 z-[100] -translate-x-1/2 pointer-events-none origin-center"
      >
        <MatriarchLogo className="transition-transform duration-300" />
      </motion.div>

      <GrainOverlay />
      
      <div className="relative z-10 w-full h-full">
        <HeroFold />
        
        <div ref={secondaryFoldRef} className="relative z-20 min-h-[10px]">
          {showSecondaryFolds && (
            <Suspense fallback={<div className="h-40 bg-mat-cream" />}>
              <HowItWorksFold />
              <LandscapeProtocolFold />
              <SelectionMatrixFold />
              <SecurityFold />
              <Footer 
                onOpenLegal={setLegalSlug} 
                onScrollTo={scrollToSection}
                onScrollToTop={scrollToTop}
              />
            </Suspense>
          )}
        </div>
      </div>

      <LegalArchiveOverlay slug={legalSlug} onClose={() => setLegalSlug(null)} />
      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} />}
    </main>
  );
};


export default LandingPage;
