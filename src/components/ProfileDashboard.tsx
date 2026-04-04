import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditProfile } from '@/components/EditProfile';
import { useAuth } from '@/hooks/useAuth';
import { SanctuaryService } from '@/services/sanctuary';
import { MenDossier } from '@/components/dashboards/MenDossier';
import { WomenSanctuary } from '@/components/dashboards/WomenSanctuary';

export const ProfileDashboard: React.FC<{ onBeginDiscovery?: () => void }> = ({ onBeginDiscovery }) => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [metrics, setMetrics] = useState({ impression: 0, visit: 0, save: 0 });
  const [sovereignMetrics, setSovereignMetrics] = useState({ matches: 0, sessionSeconds: 0 });

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

  const isMan = profile.role === 'man';
  
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pb-20 pt-8">
            <EditProfile profile={profile} onUpdate={() => { refreshProfile(); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />
          </motion.div>
        ) : isMan ? (
          <motion.div key="view-man" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
             <MenDossier profile={profile} metrics={{ impression: metrics.impression, visit: metrics.visit, save: metrics.save }} setIsEditing={setIsEditing} handleVerify={handleVerify} refreshProfile={refreshProfile} />
          </motion.div>
        ) : (
          <motion.div key="view-woman" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
             <WomenSanctuary profile={profile} metrics={{ matches: sovereignMetrics.matches, sessionSeconds: sovereignMetrics.sessionSeconds }} setIsEditing={setIsEditing} onBeginDiscovery={onBeginDiscovery} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
