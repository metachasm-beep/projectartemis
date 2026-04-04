import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Discovery } from '@/pages/Discovery';
import { SanctuaryInbox } from '@/components/SanctuaryInbox';
import { MagicChat } from '@/components/MagicChat';
import { MatriarchToolbar } from '@/components/navigation/MatriarchToolbar';
import { ProfileDashboard } from '@/components/ProfileDashboard';
import { SovereignBrowsing } from '@/components/SovereignBrowsing';
import { useAuth } from '@/hooks/useAuth';
import { AuthBypassContext } from '@/components/auth/AuthGate';
import type { Tab, SanctuaryMatch } from '@/types';
import { Badge } from '@/components/ui/badge';

export const DashboardLayout: React.FC = () => {
  const bypassCtx = useContext(AuthBypassContext);
  const realAuth = useAuth();
  const { profile, signOut } = bypassCtx || realAuth;
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [selectedMatch, setSelectedMatch] = useState<SanctuaryMatch | null>(null);

  // 🍷 Sovereign Ritual Toggle
  const isSovereignMode = activeTab === 'sovereign_browse';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={cn(
        "min-h-screen transition-colors duration-1000",
        isSovereignMode ? "bg-mat-cream/50 pt-0" : "bg-mat-cream pt-32 pb-16"
      )}
    >
      <MatriarchToolbar 
        activeTab={activeTab as any} 
        setActiveTab={setActiveTab as any} 
        onLogout={signOut} 
      />
      
      <main className={cn(
        "mx-auto transition-all duration-1000",
        isSovereignMode ? "w-full px-0" : "container px-4 md:px-0"
      )}>
        <AnimatePresence mode="wait">
          {activeTab === 'discovery' && (
            <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Discovery />
            </motion.div>
          )}

          {activeTab === 'sovereign_browse' && (
            <motion.div key="sovereign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <SovereignBrowsing onStop={() => setActiveTab('profile')} />
            </motion.div>
          )}
          
          {activeTab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-[70vh]">
               {!selectedMatch ? (
                  <div className="space-y-12">
                     <div className="text-center space-y-4">
                        <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5">Resonance History</Badge>
                        <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic">Sanctuary <br /><span className="text-mat-rose/20">Dialogues.</span></h1>
                     </div>
                     <SanctuaryInbox 
                        currentUserId={profile?.user_id || ''} 
                        userRole={profile?.role as any} 
                        onSelectMatch={setSelectedMatch as any} 
                     />
                  </div>
               ) : (
                  <MagicChat 
                    match={selectedMatch as any} 
                    currentUserId={profile?.user_id || ''} 
                    userRole={profile?.role as any} 
                    onBack={() => setSelectedMatch(null)} 
                  />
               )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProfileDashboard onBeginDiscovery={() => setActiveTab('sovereign_browse')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default DashboardLayout;

// 🍷 Aesthetic Helper for Layout Transitions
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
