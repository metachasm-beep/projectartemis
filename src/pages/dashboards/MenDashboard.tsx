import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Star, Compass, Award } from 'lucide-react';
import { VerificationPaymentModal } from "@/components/verification/VerificationPaymentModal";
import { VisibilityAlertModal } from "@/components/verification/VisibilityAlertModal";
import { QuestBoard } from '@/components/dashboards/QuestBoard';
import { SanctuaryService } from '@/services/sanctuary';
import { DiscoveryService } from '@/services/discoveryService';
import { QuestService } from '@/services/questService';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateIntegrity } from '@/utils/integrityCalculator';
import { IdentityResonanceFold } from '@/components/dashboards/IdentityResonanceFold';
import { SanctuaryStandingCard } from '@/components/dashboards/SanctuaryStandingCard';
import { SanctuaryErrorBoundary } from '@/components/error/SanctuaryErrorBoundary';
import { Dock } from '@/components/dashboard/promax/Dock';
import type { MatriarchProfile } from '@/types';

interface MenDashboardProps {
  profile: MatriarchProfile;
  status?: any;
  handleLogout?: () => void;
  onOpenSettings: () => void;
  refreshProfile: () => Promise<void>;
  setIsEditing?: (val: boolean) => void;
  onNavigateToStore?: () => void;
  metrics?: { impression: number; visit: number; save: number };
}

/**
 * 🏛️ Men's Dashboard 2.0: Aspirant Sanctuary Hub (Fold Architecture)
 * Redesigned into pristine, full-screen deep modular folds with zero scrolling.
 */
export const MenDashboard: React.FC<MenDashboardProps> = ({ 
  profile,
  refreshProfile,
  setIsEditing,
  onOpenSettings,
  onNavigateToStore,
  handleLogout,
  metrics: externalMetrics
}) => {
  const [absRank, setAbsRank] = useState<number | null>(null);
  const [cityRank, setCityRank] = useState<number | null>(null);
  const [totalMen, setTotalMen] = useState<number>(1);
  const [gazeProfiles, setGazeProfiles] = useState<any[]>([]);
  const [activeGazeIndex, setActiveGazeIndex] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [queueCount, setQueueCount] = useState(0);
  const [meritPct, setMeritPct] = useState(0);
  const [gazeCount, setGazeCount] = useState(0);
  const [showVisibilityAlert, setShowVisibilityAlert] = useState(false);
  const [activeFold, setActiveFold] = useState('identity');

  // Synchronize with ?fold= URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fold = params.get('fold');
    if (fold && ['identity', 'standing', 'quests'].includes(fold)) {
      setActiveFold(fold);
    }
  }, []);

  const handleSelectFold = (fold: string) => {
    setActiveFold(fold);
    const url = new URL(window.location.href);
    url.searchParams.set('fold', fold);
    window.history.replaceState({}, '', url.toString());
  };

  const { location } = useGeolocation(profile?.user_id);
  const integrity = calculateIntegrity(profile);

  const fetchGaze = useCallback(async () => {
    try {
      const profiles = await SanctuaryService.getGazeCarouselProfiles();
      const mapped = profiles.map((r: any) => {
        const age = r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth).getFullYear() : 25;
        let photo = '';
        if (typeof r.photos === 'string' && r.photos.startsWith('[')) {
          try {
            const parsed = JSON.parse(r.photos);
            if (Array.isArray(parsed) && parsed.length > 0) photo = parsed[0];
          } catch(e) {}
        } else if (Array.isArray(r.photos) && r.photos.length > 0) {
          photo = r.photos[0];
        }
        return {
          image: photo,
          text: (r.full_name || 'Sanctuary Identity').toString().split(' ')[0],
          subText: `${age} • ${r.city || 'Undisclosed'}`,
          originalName: r.full_name || 'Sanctuary Identity',
          age,
          city: r.city
        };
      });
      setGazeProfiles(mapped.filter((p: any) => p.image && p.image.startsWith('http')));
    } catch (err) { console.error("Gaze sync failed:", err); }
  }, []);

  const fetchRank = useCallback(async () => {
    if (!profile?.user_id) return;
    try {
      const data = await SanctuaryService.getStandingRanks(profile.city, profile.absolute_rank || 0);
      setTotalMen(data.totalMen || 1);
      setAbsRank(profile.absolute_rank || 0);
      setCityRank(data.cityRank || 1);
    } catch (err) { console.error("Rank ritual failure:", err); }
  }, [profile]);

  useEffect(() => {
    fetchGaze();
    fetchRank();

    const hidden = localStorage.getItem('mat_hide_visibility_alert');
    if (!profile.is_verified && hidden !== 'true') {
      setShowVisibilityAlert(true);
    }
    
    const fetchStats = async () => {
      try {
        const [qs, quests, gaze] = await Promise.all([
          DiscoveryService.getQueueStatus(),
          QuestService.getQuests(),
          DiscoveryService.getGazeCount()
        ]);
        setQueueCount(qs?.count || 0);
        setGazeCount(gaze || 0);
        
        if (quests && quests.length > 0) {
          const completed = quests.filter((q: any) => q.status === 'completed').length;
          setMeritPct(Math.round((completed / quests.length) * 100));
        }
      } catch (err) {
        console.warn("Dashboard intelligence fetch warning:", err);
      }
    };
    fetchStats();
  }, [fetchGaze, fetchRank, profile.is_verified]);

  const handleSyncIntegrity = async () => {
    setSyncStatus('syncing');
    try {
      await SanctuaryService.syncIntegrityBonus(profile.user_id, integrity);
      await refreshProfile();
      await fetchRank();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) { 
      console.error("Integrity Calibration Failure:", err); 
      setSyncStatus('idle');
    }
  };

  const handleCloseVisibilityAlert = (neverShowAgain: boolean) => {
    if (neverShowAgain) {
      localStorage.setItem('mat_hide_visibility_alert', 'true');
    }
    setShowVisibilityAlert(false);
  };

  const currentLevel = SanctuaryService.getTierFromRank(absRank || profile.absolute_rank || 9999, totalMen);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const foldsConfig = [
    { id: 'identity', label: 'Identity.Resonance', icon: User },
    { id: 'standing', label: 'Sanctuary.Standing', icon: Star },
    { id: 'quests', label: 'Ritual.Quests', icon: Award },
  ];

  const foldVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <SanctuaryErrorBoundary onReset={() => { refreshProfile(); fetchRank(); }}>
      <div className="relative isolate w-full h-[100dvh] overflow-hidden bg-mat-obsidian selection:bg-mat-wine selection:text-white flex flex-col justify-between pb-36 md:pb-28">
        {/* Background Grain & Breathing Gradients */}
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 mat-cinematic-grain bg-mat-obsidian">
            <div 
              className="absolute inset-0 animate-[mat-breathe-gradient_15s_ease-in-out_infinite]"
              style={{ 
                background: 'radial-gradient(circle at 50% 40%, oklch(0.2 0.01 20 / 0.4) 0%, transparent 70%)',
                backgroundSize: '100% 100%'
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-obsidian/40 to-mat-obsidian" />
          </div>
        </div>

        {/* ─── PURE FOLD SWITCHING CONTAINER ─── */}
        <div className="flex-1 w-full flex items-center justify-center overflow-y-auto my-4 px-2 md:px-4">
          <AnimatePresence mode="wait">
            {activeFold === 'identity' && (
              <motion.div key="identity" variants={foldVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[1600px] mx-auto py-4">
                <IdentityResonanceFold 
                  profile={profile}
                  gazeProfiles={gazeProfiles}
                  activeGazeIndex={activeGazeIndex}
                  setActiveGazeIndex={setActiveGazeIndex}
                  setShowVerificationModal={setShowVerificationModal}
                  currentLevel={currentLevel}
                  absRank={absRank}
                  location={location}
                  isMobile={isMobile}
                />
              </motion.div>
            )}

            {activeFold === 'standing' && (
              <motion.div key="standing" variants={foldVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-5xl mx-auto py-4 flex flex-col justify-center items-center">
                <SanctuaryStandingCard 
                  profile={profile}
                  integrity={integrity}
                  currentLevel={currentLevel}
                  gazeCount={gazeCount}
                  cityRank={cityRank}
                  absRank={absRank}
                  totalMen={totalMen}
                  meritPct={meritPct}
                  queueCount={queueCount}
                  syncStatus={syncStatus}
                  handleSyncIntegrity={handleSyncIntegrity}
                  setIsEditing={setIsEditing}
                  isMobile={isMobile}
                />
              </motion.div>
            )}

            {activeFold === 'quests' && (
              <motion.div key="quests" variants={foldVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-6xl mx-auto py-4 flex flex-col justify-center items-center gap-8">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-10">
                  <div className="space-y-6 text-center lg:text-left">
                     <h2 className="text-5xl md:text-7xl font-light text-mat-bone italic tracking-tighter leading-[0.85]">
                        The Path to <br/> 
                        <span className="text-mat-gold font-black uppercase not-italic tracking-[0.2em] text-3xl md:text-5xl block mt-2">Sovereignty.</span>
                     </h2>
                     <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-md mx-auto lg:mx-0 uppercase tracking-[0.4em]">
                        Perform the daily rituals of the Protocol. Every journal entry and verification elevates your Standing.
                     </p>
                     <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start pt-4">
                        <div className="mat-glass-deep px-6 py-4 rounded-[2rem] border border-white/5 shadow-lg">
                           <p className="text-[10px] font-black uppercase text-mat-gold/40 mb-1 tracking-[0.3em]">Tier</p>
                           <p className="text-lg font-bold text-white uppercase tracking-widest italic">{currentLevel.name}</p>
                        </div>
                        <div className="mat-glass-deep px-6 py-4 rounded-[2rem] border border-white/5 shadow-lg">
                           <p className="text-[10px] font-black uppercase text-mat-gold/40 mb-1 tracking-[0.3em]">Power</p>
                           <p className="text-lg font-bold text-white uppercase tracking-widest italic">+{integrity} Standing</p>
                        </div>
                     </div>
                  </div>
                  <div className="mat-glass-deep p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl w-full max-w-lg mx-auto">
                     <QuestBoard refreshProfile={refreshProfile} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🚀 Floating Command Dock (Zero-Scroll Navigation Switcher) */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
          <Dock 
            folds={foldsConfig}
            activeFold={activeFold}
            onSelectFold={handleSelectFold}
            onShowVerification={() => setShowVerificationModal(true)}
            handleLogout={handleLogout || (() => {})} 
          />
        </div>

        {/* Verification Modal Overlay */}
        <AnimatePresence>
          {showVerificationModal && (
            <VerificationPaymentModal 
              onClose={() => setShowVerificationModal(false)}
              onSuccess={() => {
                setShowVerificationModal(false);
                refreshProfile();
              }}
            />
          )}
        </AnimatePresence>

        <VisibilityAlertModal 
          isOpen={showVisibilityAlert}
          onClose={handleCloseVisibilityAlert}
        />
      </div>
    </SanctuaryErrorBoundary>
  );
};

export default MenDashboard;
