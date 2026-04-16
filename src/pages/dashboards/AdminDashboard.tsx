import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Search, 
  Trash2, 
  ShieldAlert, 
  BadgeCheck, 
  Zap, 
  Layers, 
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';
import { Input } from '@/components/ui/input';
import DecryptedText from '@/components/ui/cyber/DecryptedText';

import { Badge } from '@/components/ui/badge';
import { AdminCommunicationsHub } from './AdminCommunicationsHub';
import { AdminBlogModeration } from './AdminBlogModeration';
import { DirectMessageModal } from './DirectMessageModal';
import { AdminAuraPanel } from './AdminAuraPanel';
import GazeHologram from './GazeHologram';

import { IdentityConstellation } from './IdentityConstellation';
import { TacticalStatus } from './TacticalStatus';
import { CommandBlade } from './CommandBlade';
import { ObserverBento } from './ObserverBento';

interface AdminDashboardProps {
  handleLogout: () => void;
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ handleLogout, onOpenPictureManager }) => {
  const { user: currentUser } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<'ROSTER' | 'TITHE' | 'COMMUNICATIONS' | 'JOURNAL'>('ROSTER');
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
      console.warn("Roster hydration failed:", err);
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
      alert("TERMINAL ERROR: Registry uplink failed.");
    }
  };

  const handleCulling = async () => {
    if (!window.confirm("PROTOCOL ULTIMATUM: INITIATE GLOBAL CULLING? This permanently purges inactive aspirants. This is absolute.")) return;
    try {
        setLoading(true);
        const res = await AdminService.executeGlobalCulling();
        window.alert(`Culling Complete\n\n${res.purged} stagnant souls evicted.\nAbsolute Rank Matrix reflowed.`);
        loadData();
    } catch(err) {
        console.error(err);
        setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const title = window.prompt("Enter Broadcast Notice Title (e.g. ULTIMATUM)");
    if(!title) return;
    const body = window.prompt("Enter the manifesto or message body to broadcast to ALL aspirants:");
    if(!body) return;
    
    if(!window.confirm(`BROADCAST CONFIRMATION\n\nYou are about to transmit a high-priority decree to ALL active profiles. Proceed?`)) return;
    
    setLoading(true);
    const res = await AdminService.sendSovereignBroadcast(title, body);
    window.alert(`Sovereign Broadcast successful to ${res.count} channels.`);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    if (currentUser?.id === itemToDelete) {
        alert("CRITICAL: Self-eviction protocol rejected.");
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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-x-hidden selection:bg-emerald-500 selection:text-black scroll-smooth">
      {/* 🌌 Background 3D & Effects */}
      <IdentityConstellation />
      
      {/* 🛡️ Confirmation Modal */}
      {itemToDelete && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 p-10 rounded-[2rem] max-w-md w-full border-2 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-6 mx-auto animate-pulse" />
            <h2 className="text-3xl font-black text-white mb-4 text-center tracking-tighter uppercase italic">Absolute Excision?</h2>
            <p className="text-slate-400 mb-10 text-xs text-center leading-relaxed tracking-widest uppercase">
              You are about to permanently obliterate this identity from the sanctuary. This action is absolute and irreversible.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-4 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all"
              >
                Retreat
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-4 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase bg-red-600 text-white hover:bg-black transition-all shadow-lg"
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

      {/* ⚙️ Tactical Shell */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <TacticalStatus metrics={metrics} />

        <main className="flex-1 py-12 space-y-20 pb-48">
           <ObserverBento metrics={metrics} />

           {/* 🧬 Action Matrix */}
           <div className="space-y-12 max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-10 px-10">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                       <span className="w-8 h-[2px] bg-emerald-500/40" />
                       <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">
                          <DecryptedText text="Identity Processing Matrix" speed={80} revealDirection="center" />
                       </h2>
                    </div>
                    <div className="flex gap-8">
                       {['ROSTER', 'TITHE', 'COMMUNICATIONS', 'JOURNAL'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setDashboardTab(t as any)}
                            className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-2 border-b-2 relative ${dashboardTab === t ? 'border-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.1)]' : 'border-transparent text-slate-500 hover:text-emerald-500/60'}`}
                          >
                             {t}
                             {t === 'TITHE' && pendingClaimsCount > 0 && (
                                <span className="absolute -top-1 -right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                             )}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
                       <button onClick={() => setViewMode('STREAM')} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'STREAM' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}>
                          <Layers size={10} /> Stream
                       </button>
                       <button onClick={() => setViewMode('GAZE')} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'GAZE' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}>
                          <Eye size={10} /> Gaze Mode
                       </button>
                    </div>
                 </div>
              </div>

              {dashboardTab === 'ROSTER' ? (
                <div className="space-y-8 animate-in fade-in duration-700 px-10">
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" />
                        <Input 
                          placeholder="FILTER NODES BY UID OR IDENTITY..." 
                          className="h-14 pl-16 bg-white/[0.03] border-emerald-500/10 rounded-2xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-slate-700 transition-all" 
                          value={searchQuery} 
                          onChange={e => setSearchQuery(e.target.value)} 
                        />
                     </div>
                     <select 
                       value={filters.role} 
                       onChange={e => setFilters(f => ({...f, role: e.target.value}))} 
                       className="bg-white/[0.03] border border-emerald-500/10 rounded-2xl px-8 py-2 text-[9px] font-black text-emerald-500/60 uppercase tracking-widest focus:outline-none focus:border-emerald-500 transition-all"
                     >
                        <option value="all">ALL ROLES</option>
                        <option value="man">MEN</option>
                        <option value="woman">WOMEN</option>
                        <option value="admin">ADMINS</option>
                     </select>
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
                    <div className="bg-white/[0.01] rounded-[2.5rem] border border-emerald-500/5 overflow-hidden shadow-2xl relative">
                       {/* Table Layout */}
                       <div className="hidden md:block h-[60vh] overflow-y-auto scrollbar-hide">
                          <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
                             <thead className="bg-slate-900 sticky top-0 z-20 border-b border-emerald-500/10">
                                <tr>
                                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/40">Identity Node</th>
                                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/40">Affiliation</th>
                                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/40 text-center">Protocol Status</th>
                                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/40">Aura Balance</th>
                                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/40 text-right">Rituals</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-emerald-500/5">
                                {profiles.map((p) => (
                                   <tr key={p.user_id} className="group hover:bg-emerald-500/[0.02] transition-all duration-300 relative">
                                      {/* Laser Scanning Hover Effect */}
                                      <td className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                                         <div className="w-[1px] h-full bg-emerald-500/40 absolute top-0 left-0 animate-[laser_2s_ease-in-out_infinite]" />
                                      </td>

                                      <td className="px-12 py-8 flex items-center gap-6">
                                         <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-500/5 border border-emerald-500/10 relative">
                                            <img src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            {p.is_verified && <BadgeCheck size={14} className="absolute -bottom-1 -right-1 text-emerald-500" fill="black" />}
                                         </div>
                                         <div className="space-y-0.5">
                                            <p className="font-black text-white italic text-base uppercase tracking-tight">{p.full_name}</p>
                                            <p className="text-[8px] font-black text-emerald-500/30 uppercase tracking-[0.3em]">{p.city || 'Unknown Node'}</p>
                                         </div>
                                      </td>
                                      <td className="px-12 py-8">
                                         <Badge variant="outline" className="text-[8px] font-black p-2 uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5">{p.role}</Badge>
                                      </td>
                                      <td className="px-12 py-8 text-center text-[10px] font-mono font-bold text-emerald-500/60 uppercase">
                                         {p.payment_status || 'NOT_LINKED'}
                                      </td>
                                      <td className="px-12 py-8">
                                         <div className="flex items-center gap-3">
                                            <span className="font-mono font-black text-xl text-white tracking-widest">{(p.tokens || 0).toLocaleString()}</span>
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                               <button onClick={() => handleUpdateTokens(p.user_id, 1000)} className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-emerald-500 hover:text-black transition-all">+</button>
                                               <button onClick={() => handleUpdateTokens(p.user_id, -1000)} className="w-6 h-6 bg-white/5 text-slate-500 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-red-500 hover:text-white transition-all">-</button>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="px-12 py-8 text-right">
                                         <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-3 hover:bg-emerald-500/10 text-emerald-500 rounded-xl transition-all"><MessageSquare size={16} /></button>
                                            <button onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} className={`p-3 rounded-xl transition-all ${p.is_verified ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-700 hover:bg-emerald-500/5 hover:text-emerald-500'}`}><Shield size={16} /></button>
                                            <button onClick={() => setItemToDelete(p.user_id)} className="p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
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
                <div className="px-10"><AdminAuraPanel /></div>
              ) : dashboardTab === 'COMMUNICATIONS' ? (
                <div className="px-10"><AdminCommunicationsHub /></div>
              ) : (
                <div className="px-10"><AdminBlogModeration /></div>
              )}
           </div>
        </main>

        <CommandBlade 
          onLogout={handleLogout} 
          onSync={loadData} 
          onBroadcast={handleBroadcast} 
          onCulling={handleCulling} 
          loading={loading} 
        />
      </div>

      <style>{`
        @keyframes laser {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
