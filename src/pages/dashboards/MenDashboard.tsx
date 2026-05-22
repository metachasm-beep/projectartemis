import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
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

export const MenDashboard: React.FC<MenDashboardProps> = ({ 
  profile,
  refreshProfile,
  setIsEditing,
  onOpenSettings,
  onNavigateToStore,
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

  // 🛰️ Geolocation Resonance - Once per session
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
      const validProfiles = mapped.filter((p: any) => p.image && p.image.startsWith('http'));
      if (validProfiles.length > 0) {
        setGazeProfiles(validProfiles);
      } else {
        setGazeProfiles([
          {
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
            text: 'Elena',
            subText: '24 • Mumbai',
            originalName: 'Elena V',
            age: 24,
            city: 'Mumbai'
          },
          {
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
            text: 'Aanya',
            subText: '23 • Delhi',
            originalName: 'Aanya S',
            age: 23,
            city: 'Delhi'
          },
          {
            image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
            text: 'Kiara',
            subText: '25 • Bangalore',
            originalName: 'Kiara M',
            age: 25,
            city: 'Bangalore'
          },
          {
            image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop',
            text: 'Rhea',
            subText: '22 • Pune',
            originalName: 'Rhea K',
            age: 22,
            city: 'Pune'
          },
          {
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
            text: 'Sophia',
            subText: '26 • Goa',
            originalName: 'Sophia R',
            age: 26,
            city: 'Goa'
          }
        ]);
      }
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

    // 🛡️ Visibility Awareness Ritual
    const hidden = localStorage.getItem('mat_hide_visibility_alert');
    if (!profile.is_verified && hidden !== 'true') {
      setShowVisibilityAlert(true);
    }
    
    // 🔮 Dashboard Intelligence Fetch
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

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgAOpacity = useTransform(smoothProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const bgAScale = useTransform(smoothProgress, [0, 1], [1.0, 1.05]);
  const bgBOpacity = useTransform(smoothProgress, [0.3, 0.6, 1], [0, 1, 1]);
  const bgBScale = useTransform(smoothProgress, [0, 1], [1.05, 1.0]);

  return (
    <SanctuaryErrorBoundary onReset={() => { refreshProfile(); fetchRank(); }}>
      <motion.div 
        ref={scrollContainerRef}
        initial="initial"
        animate="animate"
        className="relative isolate min-h-screen bg-mat-obsidian snap-y snap-mandatory overflow-y-auto overflow-x-hidden h-screen no-scrollbar"
      >
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <motion.div 
            style={{ scale: bgAScale, opacity: bgAOpacity, willChange: 'transform, opacity' }} 
            className="absolute inset-0 mat-cinematic-grain bg-mat-obsidian"
          >
            <div 
              className="absolute inset-0 animate-[mat-breathe-gradient_15s_ease-in-out_infinite]"
              style={{ 
                background: 'radial-gradient(circle at 50% 40%, oklch(0.2 0.01 20 / 0.4) 0%, transparent 70%)',
                backgroundSize: '100% 100%'
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-obsidian/40 to-mat-obsidian" />
          </motion.div>

          <motion.div 
            style={{ scale: bgBScale, opacity: bgBOpacity, willChange: 'transform, opacity' }}
            className="absolute inset-0 mat-cinematic-grain bg-[#0C0A09]"
          >
            <div 
              className="absolute inset-0 animate-[mat-breathe-gradient_20s_ease-in-out_infinite]"
              style={{ 
                background: 'radial-gradient(circle at 60% 60%, oklch(0.25 0.04 10 / 0.3) 0%, transparent 70%)',
                backgroundSize: '100% 100%'
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-obsidian/40 to-mat-obsidian" />
          </motion.div>
        </div>

        <div className="max-w-[1600px] mx-auto px-0 md:px-4">
          {/* ─── FOLD ONE: IDENTITY & GAZE ─── */}
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

          {/* ─── FOLD TWO: SANCTUARY INTELLIGENCE ─── */}
          {isMobile ? (
            <>
              <section className="min-h-[100dvh] landscape:min-h-0 landscape:h-auto landscape:py-12 px-4 snap-start flex flex-col justify-center">
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
                  isMobile={true}
                />
              </section>

              <section className="min-h-[100dvh] landscape:min-h-0 landscape:h-auto landscape:py-12 px-4 snap-start flex flex-col justify-center">
                 <div className="h-full py-20 flex flex-col max-w-lg mx-auto w-full">
                    <QuestBoard refreshProfile={refreshProfile} />
                 </div>
              </section>
            </>
          ) : (
            <section className="min-h-[100dvh] landscape:min-h-0 landscape:h-auto landscape:py-12 py-20 snap-start flex flex-col justify-center">
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
                isMobile={false}
              />
            </section>
          )}

          {/* ─── FOLD THREE: THE PATH TO HONOR ─── */}
          {!isMobile && (
            <section className="min-h-[100dvh] landscape:min-h-0 landscape:h-auto landscape:py-12 py-24 snap-start flex flex-col items-center justify-center">
              <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center px-10">
                <div className="space-y-8">
                   <h2 className="text-8xl font-light text-mat-bone italic tracking-tighter leading-[0.85]">
                      The Path to <br/> 
                      <span className="text-mat-gold font-black uppercase not-italic tracking-[0.2em] text-5xl">Sovereignty.</span>
                   </h2>
                   <p className="text-sm text-white/40 leading-relaxed max-w-md uppercase tracking-[0.4em]">
                      Perform the daily rituals of the Protocol. Every journal entry and verification elevates your Standing.
                   </p>
                   <div className="flex gap-6 items-center pt-8">
                      <div className="mat-glass-deep px-8 py-5 rounded-[2rem] border border-white/5">
                         <p className="text-[10px] font-black uppercase text-mat-gold/40 mb-2 tracking-[0.3em]">Tier</p>
                         <p className="text-xl font-bold text-white uppercase tracking-widest italic">{currentLevel.name}</p>
                      </div>
                      <div className="mat-glass-deep px-8 py-5 rounded-[2rem] border border-white/5">
                         <p className="text-[10px] font-black uppercase text-mat-gold/40 mb-2 tracking-[0.3em]">Power</p>
                         <p className="text-xl font-bold text-white uppercase tracking-widest italic">+{integrity} Standing</p>
                      </div>
                   </div>
                </div>
                <div className="mat-glass-deep p-12 rounded-[3.5rem] border border-white/10 shadow-mat-premium h-[700px] overflow-hidden">
                   <QuestBoard refreshProfile={refreshProfile} />
                </div>
              </div>
            </section>
          )}

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
      </motion.div>
    </SanctuaryErrorBoundary>
  );
};
