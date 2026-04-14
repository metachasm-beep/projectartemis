import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditProfile } from '@/components/EditProfile';
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { MenDashboard } from '@/pages/dashboards/MenDashboard';
import { WomenSanctuary } from '@/components/dashboards/WomenSanctuary';

export const ProfileDashboard: React.FC<{ onBeginDiscovery?: () => void; onNavigateToStore?: () => void }> = ({ onBeginDiscovery, onNavigateToStore }) => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [metrics, setMetrics] = useState({ impression: 0, visit: 0, save: 0 });
  const [sovereignMetrics, setSovereignMetrics] = useState<any>({ matches: 0, sessionSeconds: 0, activeStreak: 0, profileViews: 0, profilesEngaged: 0, saves: 0, profileCompleteness: 94 });

  useEffect(() => {
    const init = async () => {
      if (profile?.user_id) {
         if (profile.role === 'man') {
            const sigs = await SanctuaryService.getSignalMetrics(profile.user_id);
            setMetrics({
              impression: Number(sigs.impression || 0),
              visit: Number(sigs.visit || 0),
              save: Number(sigs.save || 0)
            });
         } else {
            const sov = await SanctuaryService.getSovereignMetrics(profile.user_id);
            setSovereignMetrics(sov);
         }
      }
    };
    init();
  }, [profile?.user_id, profile?.role]);

  if (!profile) return null;

  const handleVerify = async () => {
    if (!profile?.user_id) return;
    const success = await SanctuaryService.rewardRank(profile.user_id, 100, "Seal of Truth: Identity Verified");
    if (success) {
       await refreshProfile();
       alert("Identity Sealed. Your Aura has ascended.");
    }
  };

  return (
    <div className="w-full relative">
      {/* ─── SANCTUARY VIEW LAYER ─── */}
      <AnimatePresence mode="wait">
        {profile.role === 'man' ? (
          <motion.div key="view-man" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
             <MenDashboard 
               profile={profile} 
               status={{ rank_tier: 'Aspirant' }} 
               refreshProfile={refreshProfile}
               setIsEditing={setIsEditing}
               onNavigateToStore={onNavigateToStore}
               metrics={{ impression: metrics.impression, visit: metrics.visit, save: metrics.save }}
             />
          </motion.div>
        ) : (
          <motion.div key="view-woman" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
             <WomenSanctuary 
               profile={{ ...profile, profile_completeness: sovereignMetrics.profileCompleteness }} 
               metrics={{ 
                 matches: sovereignMetrics.matches, 
                 sessionSeconds: sovereignMetrics.sessionSeconds,
                 activeStreak: sovereignMetrics.activeStreak,
                 profileViews: sovereignMetrics.profileViews,
                 profilesEngaged: sovereignMetrics.profilesEngaged,
                 saves: sovereignMetrics.saves
               }} 
               setIsEditing={setIsEditing} 
               onBeginDiscovery={onBeginDiscovery} 
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── IDENTITY EDIT OVERLAY LAYER ─── */}
      <AnimatePresence>
        {isEditing && (
          <EditProfile 
            profile={profile} 
            onUpdate={() => { refreshProfile(); setIsEditing(false); }} 
            onCancel={() => setIsEditing(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
