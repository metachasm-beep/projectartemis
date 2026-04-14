import React, { useState } from "react";
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

const LandingPage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
    <main className="relative h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-mat-cream selection:bg-mat-gold/20 selection:text-mat-slate">
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
