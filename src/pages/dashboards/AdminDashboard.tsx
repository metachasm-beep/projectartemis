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

import { SecurityMesh } from './SecurityMesh';
import { TerminalHeader } from './TerminalHeader';
import { SecurityMatrix } from './SecurityMatrix';
import { AccessDock } from './AccessDock';

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
      console.warn("Registry uplink failed:", err);
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
      alert("MATRIX ERROR: Token uplink rejected.");
    }
  };

  const handleCulling = async () => {
    if (!window.confirm("PROTOCOL ULTIMATUM: INITIATE GLOBAL CULLING? This permanently purges inactive nodes from the matrix. This is absolute.")) return;
    try {
        setLoading(true);
        const res = await AdminService.executeGlobalCulling();
        window.alert(`Culling Complete\n\n${res.purged} stagnant packets purged.\nMatrix reflowed.`);
        loadData();
    } catch(err) {
        console.error(err);
        setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const title = window.prompt("Enter Broadcast Title (e.g. ULTIMATUM_NODE_01)");
    if(!title) return;
    const body = window.prompt("Enter message payload for ALL active resonance channels:");
    if(!body) return;
    
    if(!window.confirm(`BROADCAST CONFIRMATION\n\nYou are about to transmit a high-priority payload to ALL active identities. Proceed?`)) return;
    
    setLoading(true);
    const res = await AdminService.sendSovereignBroadcast(title, body);
    window.alert(`Sovereign TX successful. Packet delivery: ${res.count} targets.`);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    if (currentUser?.id === itemToDelete) {
        alert("CRITICAL: Self-termination protocol rejected.");
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
    <div className="min-h-screen bg-[#050505] text-white font-mono relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* 🔮 Security Mesh Background */}
      <SecurityMesh />
      
      {/* ⚠️ Protocol Violation Modal */}
      {itemToDelete && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] p-10 rounded-2xl max-w-md w-full border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-6 mx-auto animate-pulse" />
            <h2 className="text-3xl font-black text-white mb-4 text-center tracking-tighter uppercase italic">Excision_Confirm?</h2>
            <p className="text-white/40 mb-10 text-xs text-center leading-relaxed tracking-widest uppercase">
              You are about to permanently obliterate this node from the sanctuary matrix. This action is absolute.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-4 bg-white/5 text-white/40 hover:bg-white/10 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all"
              >
                Abort
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-4 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg"
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
        <TerminalHeader 
           activeTab={dashboardTab} 
           onTabChange={(t) => setDashboardTab(t)}
           roleFilter={filters.role}
           onRoleFilterChange={(r) => setFilters(f => ({...f, role: r}))}
        />

        <main className="flex-1 py-12 space-y-16 pb-64">
           {/* Matrix Scroll Transition */}
           <AnimatePresence mode="wait">
             <motion.div 
               key={dashboardTab}
               initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="space-y-16"
             >
                <SecurityMatrix metrics={metrics} />

                <div className="max-w-[1600px] mx-auto px-10 space-y-12">
                  <div className="flex justify-between items-center bg-black/60 p-4 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                           Identity_Node_Registry
                        </h2>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode('STREAM')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'STREAM' ? 'bg-purple-600 text-white' : 'text-white/20 hover:text-white'}`}>
                           <Layers size={10} className="inline mr-2" /> Stream
                        </button>
                        <button onClick={() => setViewMode('GAZE')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'GAZE' ? 'bg-purple-600 text-white' : 'text-white/20 hover:text-white'}`}>
                           <Eye size={10} className="inline mr-2" /> Gaze
                        </button>
                     </div>
                  </div>

                  {dashboardTab === 'ROSTER' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="flex flex-col md:flex-row gap-4">
                         <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500/40 group-focus-within:text-purple-500 transition-colors" />
                            <Input 
                              placeholder="FILTER_NODES_BY_SIGL_OR_UID..." 
                              className="h-14 pl-16 bg-black border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/10" 
                              value={searchQuery} 
                              onChange={e => setSearchQuery(e.target.value)} 
                            />
                         </div>
                         <button 
                            onClick={loadData}
                            className="w-14 h-14 bg-black border border-white/10 rounded-xl flex items-center justify-center text-purple-500 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all shadow-sm"
                         >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
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
                        <div className="bg-black/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative min-h-[500px]">
                           <div className="hidden md:block h-[60vh] overflow-y-auto scrollbar-hide">
                              <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
                                 <thead className="bg-[#0a0a0a] sticky top-0 z-20 border-b border-purple-500/20">
                                    <tr>
                                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Node_ID</th>
                                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Tier</th>
                                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 text-center">TX_Status</th>
                                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Aura_Count</th>
                                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Access</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/5">
                                    {profiles.map((p) => (
                                       <tr key={p.user_id} className="group hover:bg-purple-500/[0.03] transition-all duration-300 relative">
                                          <td className="px-10 py-6 flex items-center gap-6">
                                             <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/10 relative group-hover:border-purple-500/40 transition-colors duration-500">
                                                <img 
                                                   src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} 
                                                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                                />
                                                {p.is_verified && <BadgeCheck size={14} className="absolute -bottom-1 -right-1 text-purple-500" fill="black" />}
                                             </div>
                                             <div className="space-y-0.5">
                                                <p className="font-black text-white italic text-lg uppercase tracking-tighter transition-colors group-hover:text-purple-400">{p.full_name}</p>
                                                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">{p.city || 'U_NODE'}</p>
                                             </div>
                                          </td>
                                          <td className="px-10 py-6">
                                             <Badge variant="outline" className="text-[8px] font-black p-2 uppercase border-purple-500/20 text-purple-500 bg-purple-500/5">{p.role}</Badge>
                                          </td>
                                          <td className="px-10 py-6 text-center">
                                             <div className={`w-1.5 h-1.5 rounded-full mx-auto ${p.payment_status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`} />
                                          </td>
                                          <td className="px-10 py-6">
                                             <div className="flex items-center gap-4">
                                                <span className="font-black text-2xl text-white tracking-widest tabular-nums">{(p.tokens || 0).toLocaleString()}</span>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                   <button onClick={() => handleUpdateTokens(p.user_id, 1000)} className="w-6 h-6 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-purple-500 hover:text-white transition-all">+</button>
                                                   <button onClick={() => handleUpdateTokens(p.user_id, -1000)} className="w-6 h-6 bg-white/5 text-white/20 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-white/10 hover:text-white transition-all">-</button>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-10 py-6 text-right">
                                             <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-3 hover:bg-cyan-500/10 text-cyan-500 rounded-xl transition-all border border-transparent hover:border-cyan-500/20"><MessageSquare size={16} /></button>
                                                <button onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} className={`p-3 rounded-xl transition-all border border-transparent ${p.is_verified ? 'text-purple-500 bg-purple-500/10 border-purple-500/20' : 'text-white/20 hover:text-purple-500 hover:bg-purple-500/5'}`}><Shield size={16} /></button>
                                                <button onClick={() => setItemToDelete(p.user_id)} className="p-3 hover:bg-red-600/10 text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/20"><Trash2 size={16} /></button>
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
                    <div className="py-40 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                       <div className="w-24 h-24 rounded-3xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                          <CreditCard size={48} strokeWidth={1} />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">REGISTRY_EXPANSION</h3>
                       <p className="text-[10px] font-mono font-bold text-white/20 max-w-sm mx-auto leading-relaxed tracking-widest uppercase italic">DIRECT_SOVEREIGN_TRANSMISSION_REQUIRED. CONNECT_TO_OPERATOR_FOR_AURA_ALLOCATION.</p>
                       <button className="px-10 py-4 bg-purple-600 border border-purple-400 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-purple-500 hover:border-purple-500/40 transition-all shadow-xl active:scale-95">REQUEST_UPLINK</button>
                    </div>
                  ) : (
                    <AdminBlogModeration />
                  )}
                </div>
             </motion.div>
           </AnimatePresence>
        </main>

        <AccessDock 
           onLogout={handleLogout}
           onSync={loadData}
           onBroadcast={handleBroadcast}
           onCulling={handleCulling}
           loading={loading}
        />
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          to { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
