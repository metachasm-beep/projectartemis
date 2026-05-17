import React, { useState, useContext, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatriarchToolbar } from '@/components/navigation/MatriarchToolbar';
import { useAuth } from '@/hooks/useAuth';
import { AuthBypassContext } from '@/components/auth/AuthGate';
import type { Tab, SanctuaryMatch } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MigrationService } from '@/services/MigrationService';
import { useEffect, useRef } from 'react';
import { PWAInstallFAB } from '@/components/ui/PWAInstallFAB';
import { Toast } from '@/components/ui/Toast';
import { VerificationRequirementModal } from '@/components/verification/VerificationRequirementModal';
import { supabase } from '@/lib/supabase';
import { turso } from '@/lib/turso';


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
const InfluencerDashboard = lazy(() => import('@/pages/dashboards/InfluencerDashboard').then(m => ({ default: m.InfluencerDashboard })));

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
  // Define correct initial tab based on role so admins land on control panel, women on browse, influencers on their hub
  const initialTab: Tab = profile?.role === 'admin' ? 'admin_panel' :
                         (profile as any)?.is_influencer ? 'influencer_dashboard' :
                         (profile?.role === 'woman' && profile?.is_verified) ? 'discovery' : 'profile';
   const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedMatch, setSelectedMatch] = useState<SanctuaryMatch | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; senderName?: string } | null>(null);
  const conversationIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 🏛️ SANCTUARY INTEGRITY CHECK
    MigrationService.runAll();

    if (!profile?.user_id) return;

    // 🛡️ INITIAL VERIFICATION ALERT
    if (!profile?.is_verified && profile?.role !== 'admin') {
      setShowVerificationModal(true);
    }

    let channel: any = null;

    // 📡 INITIALIZE GLOBAL RESONANCE LISTENER
    const initGlobalListener = async () => {
      try {
        // 1. Fetch user's active conversations for filtering
        const convResult = await turso.execute({
          sql: `SELECT c.id FROM conversations c 
                JOIN matches m ON c.match_id = m.id 
                WHERE m.woman_user_id = ? OR m.man_user_id = ?`,
          args: [profile.user_id, profile.user_id]
        });
        const ids = new Set(convResult.rows.map(r => r.id as string));
        conversationIdsRef.current = ids;

        // 2. Subscribe to ALL messages (filter by conv ID in callback)
        channel = supabase.channel('global_resonance')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
             const newMsg = payload.new as any;
             
             // Ignore our own messages or messages from unrelated conversations
             if (newMsg.sender_user_id === profile.user_id) return;
             if (!conversationIdsRef.current.has(newMsg.conversation_id)) return;

             // Don't notify if we're already looking at this chat
             // Note: selectedMatch comparison might need conversion mapping, but for now we'll show it
             
             // 🏺 Fetch Sender Identity
             const senderResult = await turso.execute({
               sql: "SELECT full_name FROM profiles WHERE user_id = ?",
               args: [newMsg.sender_user_id]
             });
             const senderName = senderResult.rows[0]?.full_name as string || 'Someone';

             setNotification({
               title: "New Message Received",
               message: newMsg.body,
               senderName: senderName
             });
          })
          .subscribe();
      } catch (err) {
        console.error("Resonance Sync Failed:", err);
      }
    };

    initGlobalListener();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [profile?.user_id]);

  const handleTabChange = (tab: Tab) => {
    // 🛡️ VERIFICATION GATEWAY
    const restrictedTabs: Tab[] = ['discovery', 'messages', 'sovereign_browse'];
    if (restrictedTabs.includes(tab) && !profile?.is_verified && profile?.role !== 'admin') {
      setShowVerificationModal(true);
      return;
    }
    setActiveTab(tab);
  };


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
      {activeTab !== 'admin_panel' && (
        <MatriarchToolbar 
          activeTab={activeTab as any} 
          setActiveTab={handleTabChange as any} 
          onLogout={signOut} 
          isImmersive={isImmersive}
        />
      )}
      
      <main className={cn(
        "mx-auto transition-all duration-1000",
        isImmersive ? "w-full px-0" : "container px-6 md:px-8 lg:px-0"
      )}>
        <Suspense fallback={<DashboardSkeleton />}>
          <AnimatePresence mode="wait">
            {activeTab === 'discovery' && (
              <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Discovery onOpenChat={(match) => {
                  setSelectedMatch(match as any);
                  setActiveTab('messages');
                }} />
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
                  <AdminDashboard 
                    onOpenPictureManager={() => setActiveTab('picture_manager' as any)} 
                    onTabChange={(t) => setActiveTab(t as any)}
                    handleLogout={signOut}
                  />
              </motion.div>
            )}

            {activeTab === 'influencer_dashboard' && (profile as any)?.is_influencer && (
              <motion.div key="influencer_dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <InfluencerDashboard onSwitchToProfile={() => setActiveTab('profile')} />
              </motion.div>
            )}

            {activeTab === 'picture_manager' && profile?.role === 'admin' && (
              <motion.div key="picture_manager" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <PictureManager onBack={() => setActiveTab('admin_panel')} />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
        <PWAInstallFAB variant="rose" />
      </main>

      <VerificationRequirementModal 
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onStartVerification={() => {
          setShowVerificationModal(false);
          setActiveTab('profile'); 
        }}
        role={profile?.role as any}
      />

      <Toast 
        show={!!notification}
        onClose={() => setNotification(null)}
        title={notification?.title || ''}
        message={notification?.message || ''}
        senderName={notification?.senderName}
      />
    </motion.div>
  );
};

export default DashboardLayout;

// 🍷 Aesthetic Helper for Layout Transitions
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
