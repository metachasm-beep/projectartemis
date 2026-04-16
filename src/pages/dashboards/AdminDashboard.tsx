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
  MessageSquare,
  CreditCard
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

import { LiquidOrb } from './LiquidOrb';
import { GlassHeader } from './GlassHeader';
import { EtherealStatus } from './EtherealStatus';
import { MinimalDock } from './MinimalDock';

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
      console.warn("Archive mapping interrupted:", err);
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
      alert("SYSTEM FAULT: Token allocation failed.");
    }
  };

  const handleCulling = async () => {
    if (!window.confirm("DEFINITIVE EXCISION: REORDER ARCHIVE? This permanently relocates inactive identities. This action is intentional and refined.")) return;
    try {
        setLoading(true);
        const res = await AdminService.executeGlobalCulling();
        window.alert(`Excision Protocol Finished\n\n${res.purged} records archived.\nArchive integrity verified.`);
        loadData();
    } catch(err) {
        console.error(err);
        setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const title = window.prompt("Enter Decree Title (e.g. Protocol Alignment)");
    if(!title) return;
    const body = window.prompt("Enter the manifesto payload for all active resonators:");
    if(!body) return;
    
    if(!window.confirm(`PROTOCOL CONFIRMATION\n\nYou are about to manifest this decree across the entire network. Proceed?`)) return;
    
    setLoading(true);
    const res = await AdminService.sendSovereignBroadcast(title, body);
    window.alert(`Manifestation successful. Network coverage: ${res.count} identities.`);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    if (currentUser?.id === itemToDelete) {
        alert("ARCHIVE REJECTION: Self-archiving sequence identified and blocked.");
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
      alert("ERROR: System failed to execute record excision.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative overflow-x-hidden selection:bg-slate-900 selection:text-white">
      {/* ⚪ Ethereal Background */}
      <LiquidOrb />
      
      {/* 🌫️ Excision Confirmation */}
      {itemToDelete && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl animate-in fade-in duration-700">
          <div className="bg-white p-16 rounded-[4rem] max-w-xl w-full border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-10">
               <ShieldAlert size={48} strokeWidth={1} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center tracking-tighter uppercase italic">Protocol Excision?</h2>
            <p className="text-slate-400 mb-12 text-sm text-center font-medium leading-relaxed max-w-xs mx-auto uppercase tracking-widest">
              Identifying record for permanent relocation. This structural change is definitive.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-5 px-8 rounded-2xl font-bold text-[10px] tracking-widest uppercase bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
              >
                Retreat
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-5 px-8 rounded-2xl font-bold text-[10px] tracking-widest uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl"
              >
                Execute
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
        <GlassHeader 
           activeTab={dashboardTab} 
           onTabChange={(t) => setDashboardTab(t)}
           roleFilter={filters.role}
           onRoleFilterChange={(r) => setFilters(f => ({...f, role: r}))}
        />

        <main className="flex-1 py-16 space-y-20 pb-64">
           {/* Soft Blur Transition */}
           <AnimatePresence mode="wait">
             <motion.div 
               key={dashboardTab}
               initial={{ opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               exit={{ opacity: 0, scale: 1.01, filter: 'blur(10px)' }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="space-y-20"
             >
                <EtherealStatus metrics={metrics} />

                <div className="max-w-[1600px] mx-auto px-10 space-y-12">
                  <div className="flex justify-between items-center bg-white/40 p-4 rounded-3xl border border-black/[0.03] shadow-sm backdrop-blur-md">
                     <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 italic">
                           Archive Index Retrieval
                        </h2>
                     </div>
                     <div className="flex items-center gap-2 p-1 bg-black/[0.02] rounded-2xl">
                        <button onClick={() => setViewMode('STREAM')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'STREAM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                           <Layers size={11} strokeWidth={2} /> Stream
                        </button>
                        <button onClick={() => setViewMode('GAZE')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'GAZE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                           <Eye size={11} strokeWidth={2} /> Gaze Mode
                        </button>
                     </div>
                  </div>

                  {dashboardTab === 'ROSTER' ? (
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row gap-6">
                         <div className="relative flex-1 group">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                            <Input 
                              placeholder="RETRIEVE RECORD BY IDENTITY PIN..." 
                              className="h-16 pl-20 bg-white border-black/[0.03] rounded-[2rem] focus:border-slate-900 focus:ring-4 focus:ring-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-900 placeholder:text-slate-200 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)]" 
                              value={searchQuery} 
                              onChange={e => setSearchQuery(e.target.value)} 
                            />
                         </div>
                         <button 
                            onClick={loadData}
                            className="w-16 h-16 bg-white border border-black/[0.03] rounded-[2rem] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
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
                        <div className="bg-white rounded-[4rem] border border-black/[0.02] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] relative min-h-[500px]">
                           <div className="hidden md:block h-[60vh] overflow-y-auto scrollbar-hide">
                              <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
                                 <thead className="bg-[#f8fafc] sticky top-0 z-20 border-b border-black/[0.02]">
                                    <tr>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Identity Structure</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Class</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 text-center">Protocol</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Aura Link</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 text-right">Access</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-black/[0.02]">
                                    {profiles.map((p) => (
                                       <tr key={p.user_id} className="group hover:bg-black/[0.01] transition-all duration-700 relative">
                                          <td className="px-14 py-10 flex items-center gap-10">
                                             <div className="w-16 h-16 rounded-[2.25rem] overflow-hidden bg-slate-50 border border-black/[0.02] relative shadow-sm group-hover:scale-105 transition-transform duration-1000">
                                                <img 
                                                   src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} 
                                                   className="w-full h-full object-cover group-hover:grayscale transition-all duration-700" 
                                                />
                                                {p.is_verified && <BadgeCheck size={18} className="absolute -bottom-1 -right-1 text-slate-900" fill="white" />}
                                             </div>
                                             <div className="space-y-1">
                                                <p className="font-bold text-slate-900 text-xl tracking-tight leading-none italic">{p.full_name}</p>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.25em]">{p.city || 'UNDEFINED'}</p>
                                             </div>
                                          </td>
                                          <td className="px-14 py-10">
                                             <Badge variant="outline" className="text-[8px] font-bold p-2 uppercase border-slate-200 text-slate-400 bg-white italic tracking-widest">{p.role}</Badge>
                                          </td>
                                          <td className="px-14 py-10 text-center">
                                             <div className={`w-2 h-2 rounded-full mx-auto ${p.payment_status === 'APPROVED' ? 'bg-slate-900' : 'bg-slate-100'}`} />
                                          </td>
                                          <td className="px-14 py-10">
                                             <div className="flex items-center gap-4">
                                                <span className="font-bold text-3xl text-slate-900 tabular-nums leading-none tracking-tighter">{(p.tokens || 0).toLocaleString()}</span>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                   <button onClick={() => handleUpdateTokens(p.user_id, 1000)} className="w-7 h-7 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs hover:bg-slate-700 transition-all shadow-lg">+</button>
                                                   <button onClick={() => handleUpdateTokens(p.user_id, -1000)} className="w-7 h-7 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-bold text-xs hover:bg-slate-100 transition-all">-</button>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-14 py-10 text-right">
                                             <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                                                <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-4 hover:bg-indigo-50 text-indigo-400 rounded-2xl transition-all"><MessageSquare size={18} strokeWidth={1.5} /></button>
                                                <button onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} className={`p-4 rounded-2xl transition-all ${p.is_verified ? 'text-slate-900 bg-slate-50 shadow-inner' : 'text-slate-300 hover:text-slate-900'}`}><Shield size={18} strokeWidth={1.5} /></button>
                                                <button onClick={() => setItemToDelete(p.user_id)} className="p-4 hover:bg-rose-50 text-rose-400 rounded-2xl transition-all"><Trash2 size={18} strokeWidth={1.5} /></button>
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
                    <div className="py-48 text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                       <div className="w-24 h-24 rounded-[2rem] bg-white border border-black/[0.03] flex items-center justify-center mx-auto text-slate-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                          <CreditCard size={48} strokeWidth={1} />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-5xl font-bold text-slate-900 uppercase italic tracking-tighter">Identity Uplink</h3>
                          <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-[0.25em]">Direct physical request required for Aura expansion. Coordinate via sovereign link.</p>
                       </div>
                    </div>
                  ) : (
                    <AdminBlogModeration />
                  )}
                </div>
             </motion.div>
           </AnimatePresence>
        </main>

        <MinimalDock 
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
