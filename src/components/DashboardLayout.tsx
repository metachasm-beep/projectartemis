import React, { useState, useContext, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatriarchToolbar } from '@/components/navigation/MatriarchToolbar';
import { useAuth } from '@/hooks/useAuth';
import { AuthBypassContext } from '@/components/auth/AuthGate';
import type { Tab, SanctuaryMatch } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MigrationService } from '@/services/MigrationService';
import { useEffect } from 'react';


// 🚀 GRANULAR CODE SPLITTING: Load views only when entered
const Discovery = lazy(() => import('@/pages/Discovery').then(m => ({ default: m.Discovery })));
const SanctuaryInbox = lazy(() => import('@/components/SanctuaryInbox').then(m => ({ default: m.SanctuaryInbox })));
const MagicChat = lazy(() => import('@/components/MagicChat').then(m => ({ default: m.MagicChat })));
const ProfileDashboard = lazy(() => import('@/components/ProfileDashboard').then(m => ({ default: m.ProfileDashboard })));
const SovereignBrowsing = lazy(() => import('@/components/SovereignBrowsing').then(m => ({ default: m.SovereignBrowsing })));
const PaymentScreen = lazy(() => import('@/components/payments/PaymentScreen').then(m => ({ default: m.PaymentScreen })));
const AdminDashboard = lazy(() => import('@/pages/dashboards/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const PictureManager = lazy(() => import('@/components/dashboards/PictureManager'));
const AadhaarVerification = lazy(() => import('@/components/AadhaarVerification').then(m => ({ default: m.AadhaarVerification })));
const Leaderboard = lazy(() => import('@/components/discovery/Leaderboard').then(m => ({ default: m.Leaderboard })));
const FAQSection = lazy(() => import('@/components/FAQSection').then(m => ({ default: m.FAQSection })));

const DashboardSkeleton = () => (
  <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6 opacity-20">
      <div className="w-12 h-12 rounded-full border-2 border-mat-rose animate-spin border-t-transparent" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sanctuary Sync...</span>
    </div>
  </div>
);


export const DashboardLayout: React.FC = () => {
  const bypassCtx = useContext(AuthBypassContext);
  const realAuth = useAuth();
  const { profile, signOut } = bypassCtx || realAuth;
  // Define correct initial tab based on role so admins land on control panel, women on browse
  const initialTab: Tab = profile?.role === 'admin' ? 'admin_panel' : 
                         profile?.role === 'woman' ? 'discovery' : 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedMatch, setSelectedMatch] = useState<SanctuaryMatch | null>(null);

  useEffect(() => {
    // 🏛️ SANCTUARY INTEGRITY CHECK
    // Run migrations only once the user has entered the dashboard shell.
    MigrationService.runAll();
  }, []);


  // 🍷 Sovereign Ritual Toggle
  const isImmersive = activeTab === 'sovereign_browse' || activeTab === 'profile' || activeTab === 'faq' || activeTab === 'discovery';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={cn(
        "min-h-screen transition-colors duration-1000",
        isImmersive ? "bg-mat-obsidian pt-0" : "bg-mat-cream pt-20 md:pt-32 pb-16 mat-safe-pt"
      )}
    >
      <MatriarchToolbar 
        activeTab={activeTab as any} 
        setActiveTab={setActiveTab as any} 
        onLogout={signOut} 
      />
      
      <main className={cn(
        "mx-auto transition-all duration-1000",
        isImmersive ? "w-full px-0" : "container px-6 md:px-8 lg:px-0"
      )}>
        <Suspense fallback={<DashboardSkeleton />}>
          <AnimatePresence mode="wait">
            {activeTab === 'discovery' && (
              <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {profile?.role === 'man' && !profile?.is_verified ? (
                  <AadhaarVerification userId={profile?.user_id || ''} onVerified={() => realAuth.refreshProfile()} />
                ) : (
                  <Discovery />
                )}
              </motion.div>
            )}

            {activeTab === 'sovereign_browse' && (
              <motion.div key="sovereign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {profile?.role === 'man' && !profile?.is_verified ? (
                  <div className="pt-20">
                    <AadhaarVerification userId={profile?.user_id || ''} onVerified={() => realAuth.refreshProfile()} />
                  </div>
                ) : (
                  <SovereignBrowsing onStop={() => setActiveTab('profile')} />
                )}
              </motion.div>
            )}
            
            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-[70vh]">
                {!selectedMatch ? (
                    <div className="space-y-12">
                      <div className="text-center space-y-4">
                          <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5">Resonance History</Badge>
                          <h1 className="mat-text-fluid-huge text-mat-wine italic">Sanctuary <br /><span className="text-mat-rose/20">Dialogues.</span></h1>
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
                <ProfileDashboard 
                  onBeginDiscovery={() => setActiveTab('sovereign_browse')}
                  onNavigateToStore={() => setActiveTab('store')}
                />
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Leaderboard />
              </motion.div>
            )}

            {activeTab === 'faq' && (
              <motion.div key="faq" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <FAQSection />
              </motion.div>
            )}

            {activeTab === 'store' && (
              <motion.div key="store" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <PaymentScreen />
              </motion.div>
            )}

            {activeTab === 'admin_panel' && profile?.role === 'admin' && (
              <motion.div key="admin_panel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <AdminDashboard onOpenPictureManager={() => setActiveTab('picture_manager' as any)} />
              </motion.div>
            )}

            {activeTab === 'picture_manager' && profile?.role === 'admin' && (
              <motion.div key="picture_manager" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <PictureManager onBack={() => setActiveTab('admin_panel')} />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>
    </motion.div>
  );
};

export default DashboardLayout;

// 🍷 Aesthetic Helper for Layout Transitions
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
