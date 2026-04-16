import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Trash2, 
  ShieldAlert, 
  BadgeCheck, 
  Layers, 
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { AdminCommunicationsHub } from './AdminCommunicationsHub';
import { AdminBlogModeration } from './AdminBlogModeration';
import { DirectMessageModal } from './DirectMessageModal';
import { AdminAuraPanel } from './AdminAuraPanel';
import GazeHologram from './GazeHologram';

import { SanctuaryPillar } from './SanctuaryPillar';
import { SpectralHeader } from './SpectralHeader';
import { ArchiveStatus } from './ArchiveStatus';
import { LuxuryDock } from './LuxuryDock';

interface AdminDashboardProps {
  handleLogout: () => void;
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ handleLogout, onOpenPictureManager }) => {
  const { user: currentUser } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<'ROSTER' | 'TITHE' | 'COMMUNICATIONS' | 'JOURNAL' | 'BUY_AURA'>('ROSTER');
  const [viewMode, setViewMode] = useState<'STREAM' | 'GAZE'>('STREAM');
  const [metrics, setMetrics] = useState({ totalMen: 0, totalWomen: 0, verifiedProfiles: 0, totalForumTopics: 0 });
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<MatriarchProfile[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [messageTarget, setMessageTarget] = useState<{ id: string, name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const [filters, setFilters] = useState({
    role: 'all' as any,
    isVerified: 'all' as any,
    city: '',
    minTokens: 0,
    dateSort: 'newest' as any
  });

  // Fetch initial data
  useEffect(() => {
    loadData();
    AdminService.getPendingAuraClaims().then(c => setPendingClaimsCount(c.length));
    AdminService.getSystemMetrics().then(m => setMetrics(m as any));
  }, []);

  // Active search / multi-filter effect
  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 150); 
    return () => clearTimeout(t);
  }, [searchQuery, filters, dashboardTab]);

  const loadData = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);

    try {
      const p = await AdminService.searchProfiles({
        query: searchQuery,
        ...filters
      });
      setProfiles(p);
      
      const m = await AdminService.getSystemMetrics();
      setMetrics(m as any);
      
      const claims = await AdminService.getPendingAuraClaims();
      setPendingClaimsCount(claims.length);
    } catch (err) {
      console.warn("Archive synchronization failed:", err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleVerifyToggle = async (userId: string, currentState: boolean) => {
    const ok = await AdminService.updateProfileStatus(userId, { is_verified: !currentState });
    if (ok) {
      setProfiles(p => p.map(x => x.user_id === userId ? { ...x, is_verified: !currentState } : x));
      await import('@/services/sanctuary').then(m => m.SanctuaryService.recalculateGlobalRanks());
      loadData();
    }
  };

  const handlePaymentApprove = async (userId: string) => {
    const ok = await AdminService.updateProfileStatus(userId, { payment_status: 'APPROVED' });
    if (ok) {
      setProfiles(p => p.map(x => x.user_id === userId ? { ...x, payment_status: 'APPROVED' } : x));
    }
  };

  const handlePaymentReject = async (userId: string) => {
    const ok = await AdminService.updateProfileStatus(userId, { payment_status: 'REJECTED' });
    if (ok) {
      setProfiles(p => p.map(x => x.user_id === userId ? { ...x, payment_status: 'REJECTED' } : x));
    }
  };

  const handleUpdateTokens = async (userId: string, amount: number) => {
    const ok = await AdminService.updateUserTokens(userId, amount);
    if (ok) {
       setProfiles(p => p.map(x => x.user_id === userId ? { ...x, tokens: (x.tokens || 0) + amount } : x));
       await import('@/services/sanctuary').then(m => m.SanctuaryService.recalculateGlobalRanks());
    } else {
      alert("ARCHIVE SYSTEM ERROR: Ledger link interrupted.");
    }
  };

  const handleCulling = async () => {
    if (!window.confirm("ULTIMATE CULLING? This permanently archives inactive men and reflows the Sanctuary hierarchy. This is definitive.")) return;
    try {
        setLoading(true);
        const res = await AdminService.executeGlobalCulling();
        window.alert(`Culling Complete\n\n${res.purged} stagnant souls archived.\nSpectral Matrix reflowed.`);
        loadData();
    } catch(err) {
        console.error(err);
        setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const title = window.prompt("Enter Decree Title (e.g. SANCTUARY ULTIMATUM)");
    if(!title) return;
    const body = window.prompt("Enter the manifesto or decree body for ALL active aspirants:");
    if(!body) return;
    
    if(!window.confirm(`BROADCAST CONFIRMATION\n\nYou are about to transmit a high-priority decree to ALL active profiles. Proceed?`)) return;
    
    setLoading(true);
    const res = await AdminService.sendSovereignBroadcast(title, body);
    window.alert(`Sovereign Broadcast delivered to ${res.count} archives.`);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    if (currentUser?.id === itemToDelete) {
        alert("DEFINITIVE: Self-archiving sequence rejected.");
        setItemToDelete(null);
        return;
    }

    try {
      const success = await AdminService.deleteUserRecord(itemToDelete);
      if (success) {
        setProfiles(prev => prev.filter(x => x.user_id !== itemToDelete));
        loadData();
      }
    } catch (err) {
      alert("ERROR: Excision protocol failed.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1A1A1A] font-body relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-white">
      {/* 🏛️ 3D Background */}
      <SanctuaryPillar />
      
      {/* ⚖️ Confirmation Portal */}
      {itemToDelete && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-[#1A1A1A]/20 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white p-12 rounded-[3.5rem] max-w-lg w-full border border-[#D4AF37]/30 shadow-[0_40px_100px_rgba(212,175,55,0.2)]">
            <ShieldAlert className="w-20 h-20 text-[#D4AF37] mb-8 mx-auto opacity-80" />
            <h2 className="text-4xl font-display font-black text-[#1A1A1A] mb-4 text-center tracking-tighter uppercase italic">Definitive Excision?</h2>
            <p className="text-[#1A1A1A]/60 mb-12 text-sm text-center font-body leading-relaxed max-w-xs mx-auto">
              You are about to permanently obliterate this identity from the sanctuary archives. This action is absolute.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-5 px-8 rounded-[2rem] font-black text-[10px] tracking-widest uppercase bg-[#1A1A1A]/5 text-[#1A1A1A]/40 hover:bg-[#1A1A1A]/10 transition-all"
              >
                Retreat
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-5 px-8 rounded-[2rem] font-black text-[10px] tracking-widest uppercase bg-[#D4AF37] text-white hover:bg-[#BFA06A] transition-all shadow-xl"
              >
                Obliterate
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <AnimatePresence>
        {messageTarget && (
          <DirectMessageModal 
            userId={messageTarget.id}
            userName={messageTarget.name}
            onClose={() => setMessageTarget(null)}
            onSuccess={() => {}}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <SpectralHeader 
           activeTab={dashboardTab} 
           onTabChange={(t) => setDashboardTab(t)}
           roleFilter={filters.role}
           onRoleFilterChange={(r) => setFilters(f => ({...f, role: r}))}
        />

        <main className="flex-1 py-16 space-y-24 pb-64">
           {/* Dolly Zoom Wrapper */}
           <AnimatePresence mode="wait">
             <motion.div 
               key={dashboardTab}
               initial={{ opacity: 0, scale: 0.95, z: -50 }}
               animate={{ opacity: 1, scale: 1, z: 0 }}
               exit={{ opacity: 0, scale: 1.05, z: 50 }}
               transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
               className="space-y-24"
             >
                <ArchiveStatus metrics={metrics} />

                <div className="max-w-[1600px] mx-auto px-10 space-y-16">
                  {/* Mode Selector */}
                  <div className="flex justify-between items-center border-b border-[#D4AF37]/10 pb-8">
                     <div className="flex items-center gap-4">
                        <span className="w-5 h-[1px] bg-[#D4AF37]" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">
                           Archive Retrieval Interface
                        </h2>
                     </div>
                     <div className="flex items-center gap-2 p-1 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/10">
                        <button onClick={() => setViewMode('STREAM')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'STREAM' ? 'bg-[#D4AF37] text-white shadow-md' : 'text-[#D4AF37]/40 hover:text-[#D4AF37]'}`}>
                           <Layers size={11} /> Stream
                        </button>
                        <button onClick={() => setViewMode('GAZE')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'GAZE' ? 'bg-[#D4AF37] text-white shadow-md' : 'text-[#D4AF37]/40 hover:text-[#D4AF37]'}`}>
                           <Eye size={11} /> Gaze Mode
                        </button>
                     </div>
                  </div>

                  {dashboardTab === 'ROSTER' ? (
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row gap-6">
                         <div className="relative flex-1 group">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40 group-focus-within:text-[#D4AF37] transition-all" />
                            <Input 
                              placeholder="SEARCH ARCHIVE BY IDENTITY KEY..." 
                              className="h-16 pl-20 bg-white border-[#D4AF37]/10 rounded-full focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] placeholder:text-[#1A1A1A]/10 shadow-sm" 
                              value={searchQuery} 
                              onChange={e => setSearchQuery(e.target.value)} 
                            />
                         </div>
                         <button 
                            onClick={loadData}
                            className="w-16 h-16 bg-white border border-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all shadow-sm"
                         >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                         </button>
                      </div>

                      {viewMode === 'GAZE' ? (
                        <GazeHologram 
                          profiles={profiles} 
                          onVerify={handleVerifyToggle}
                          onMessage={setMessageTarget}
                          onDelete={setItemToDelete}
                          onPaymentApprove={handlePaymentApprove}
                          onPaymentReject={handlePaymentReject}
                        />
                      ) : (
                        <div className="bg-white rounded-[4rem] border border-[#D4AF37]/10 overflow-hidden shadow-[0_30px_70px_rgba(212,175,55,0.05)] relative min-h-[500px]">
                           <div className="hidden md:block h-[60vh] overflow-y-auto scrollbar-hide">
                              <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
                                 <thead className="bg-[#fdfcfb] sticky top-0 z-20 border-b border-[#D4AF37]/10">
                                    <tr>
                                       <th className="px-14 py-10 text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Identity Soul</th>
                                       <th className="px-14 py-10 text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Presence</th>
                                       <th className="px-14 py-10 text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37] text-center">Protocol</th>
                                       <th className="px-14 py-10 text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Aura Tithe</th>
                                       <th className="px-14 py-10 text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37] text-right">Ritualism</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-[#D4AF37]/5">
                                    {profiles.map((p) => (
                                       <tr key={p.user_id} className="group hover:bg-[#D4AF37]/[0.02] transition-all duration-700 relative">
                                          <td className="px-14 py-10 flex items-center gap-8">
                                             <div className="w-16 h-16 rounded-[2rem] overflow-hidden bg-white border border-[#D4AF37]/10 relative shadow-sm">
                                                <img 
                                                   src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} 
                                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                                />
                                                {p.is_verified && <BadgeCheck size={16} className="absolute -bottom-1 -right-1 text-[#D4AF37]" fill="white" />}
                                             </div>
                                             <div className="space-y-1">
                                                <p className="font-display font-black text-[#1A1A1A] italic text-xl tracking-tight leading-none">{p.full_name}</p>
                                                <p className="text-[9px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.2em]">{p.city || 'PARTS UNKNOWN'}</p>
                                             </div>
                                          </td>
                                          <td className="px-14 py-10">
                                             <Badge variant="outline" className="text-[8px] font-black p-2 uppercase border-[#D4AF37]/20 text-[#D4AF37] bg-white italic">{p.role}</Badge>
                                          </td>
                                          <td className="px-14 py-10 text-center">
                                             <div className={`w-2.5 h-2.5 rounded-full mx-auto ${p.payment_status === 'APPROVED' ? 'bg-[#D4AF37]' : 'bg-red-200'}`} />
                                          </td>
                                          <td className="px-14 py-10">
                                             <div className="flex items-center gap-4">
                                                <span className="font-royal font-black text-2xl text-[#1A1A1A] tabular-nums leading-none">{(p.tokens || 0).toLocaleString()}</span>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                   <button onClick={() => handleUpdateTokens(p.user_id, 1000)} className="w-7 h-7 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl flex items-center justify-center font-bold text-xs hover:bg-[#D4AF37] hover:text-white transition-all">+</button>
                                                   <button onClick={() => handleUpdateTokens(p.user_id, -1000)} className="w-7 h-7 bg-[#1A1A1A]/5 text-[#1A1A1A]/40 rounded-xl flex items-center justify-center font-bold text-xs hover:bg-black hover:text-white transition-all">-</button>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-14 py-10 text-right">
                                             <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                                                <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-4 hover:bg-[#D4AF37]/5 text-[#D4AF37] rounded-2xl transition-all"><MessageSquare size={16} /></button>
                                                <button onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} className={`p-4 rounded-2xl transition-all ${p.is_verified ? 'text-[#D4AF37] bg-[#D4AF37]/5 shadow-inner' : 'text-[#1A1A1A]/20 hover:text-[#D4AF37]'}`}><Shield size={16} /></button>
                                                <button onClick={() => setItemToDelete(p.user_id)} className="p-4 hover:bg-red-50 text-red-400 rounded-2xl transition-all"><Trash2 size={16} /></button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                      )}
                    </div>
                  ) : dashboardTab === 'TITHE' ? (
                    <AdminAuraPanel />
                  ) : dashboardTab === 'COMMUNICATIONS' ? (
                    <AdminCommunicationsHub />
                  ) : dashboardTab === 'BUY_AURA' ? (
                    <div className="py-40 text-center spa-y-8 animate-in fade-in zoom-in-95 duration-700">
                       <CreditCard size={64} className="mx-auto text-[#D4AF37] opacity-20 mb-8" />
                       <h3 className="text-4xl font-display font-black text-[#D4AF37] uppercase italic mb-4">Registry Expansion</h3>
                       <p className="text-sm font-body text-[#1A1A1A]/40 max-w-md mx-auto leading-relaxed">Identity offset acquisitions are currently handled via direct sovereign request. Connect with an operator for priority allocation.</p>
                    </div>
                  ) : (
                    <AdminBlogModeration />
                  )}
                </div>
             </motion.div>
           </AnimatePresence>
        </main>

        <LuxuryDock 
           onLogout={handleLogout}
           onSync={loadData}
           onBroadcast={handleBroadcast}
           onCulling={handleCulling}
           loading={loading}
        />
      </div>
    </div>
  );
};
