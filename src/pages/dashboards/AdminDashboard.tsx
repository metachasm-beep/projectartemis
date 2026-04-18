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
  MessageSquare,
  Zap
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

import { GlassHeader } from './GlassHeader';
import { EtherealStatus } from './EtherealStatus';
import { MinimalDock } from './MinimalDock';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface AdminDashboardProps {
  handleLogout: () => void;
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ handleLogout, onOpenPictureManager }) => {
  const { user: currentUser } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<'ROSTER' | 'TITHE' | 'COMMUNICATIONS' | 'JOURNAL'>('ROSTER');
  const [viewMode, setViewMode] = useState<'STREAM' | 'GAZE'>('STREAM');
  const [metrics, setMetrics] = useState({ totalMen: 0, totalWomen: 0, verifiedProfiles: 0, totalForumTopics: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<MatriarchProfile[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [messageTarget, setMessageTarget] = useState<{ id: string, name: string } | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<MatriarchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const [filters, setFilters] = useState({
    role: 'all' as any,
    isVerified: 'all' as any,
    city: '',
    minTokens: 0,
    dateSort: 'newest' as any
  });

  useEffect(() => {
    loadData();
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
    } catch (err) {
      console.warn("Archive mapping interrupted:", err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleUpdateTokens = async (userId: string, amount: number) => {
    const ok = await AdminService.updateUserTokens(userId, amount);
    if (ok) {
       setProfiles(p => p.map(x => x.user_id === userId ? { ...x, tokens: (x.tokens || 0) + amount } : x));
    }
  };

  const handleCulling = async () => {
    if (!window.confirm("DEFINITIVE EXCISION: REORDER ARCHIVE?")) return;
    try {
        setLoading(true);
        const res = await AdminService.executeGlobalCulling();
        window.alert(`Excision Protocol Finished: ${res.purged} records archived.`);
        loadData();
    } catch(err) {
        setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const title = window.prompt("Enter Decree Title");
    if(!title) return;
    const body = window.prompt("Enter the manifesto payload:");
    if(!body) return;
    setLoading(true);
    const res = await AdminService.sendSovereignBroadcast(title, body);
    window.alert(`Manifestation successful: ${res.count} identities.`);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (await AdminService.deleteUserRecord(itemToDelete)) {
        setProfiles(prev => prev.filter(x => x.user_id !== itemToDelete));
        loadData();
      }
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative overflow-x-hidden selection:bg-slate-900 selection:text-white">
      
      
      {itemToDelete && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl animate-in fade-in duration-700">
          <div className="bg-white p-16 rounded-[4rem] max-w-xl w-full border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-10">
               <ShieldAlert size={48} strokeWidth={1} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center tracking-tighter uppercase italic">Excision?</h2>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-5 rounded-2xl font-bold text-[10px] tracking-widest uppercase bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">Retreat</button>
              <button onClick={confirmDelete} className="flex-1 py-5 rounded-2xl font-bold text-[10px] tracking-widest uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl">Execute</button>
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

        {selectedProfile && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl animate-in fade-in duration-700">
            <div className="bg-white rounded-[4rem] max-w-4xl w-full border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-auto">
               <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-full relative">
                  <img 
                    src={selectedProfile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
               </div>
               <div className="flex-1 p-12 md:p-20 flex flex-col justify-between space-y-12">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] border-slate-200 text-slate-400 italic px-4 py-1.5">{selectedProfile.role} // {selectedProfile.is_verified ? 'SEALED' : 'UNVERIFIED'}</Badge>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">{selectedProfile.full_name}</h2>
                        <p className="text-xl font-medium text-slate-400 italic">{selectedProfile.city || 'Location Unknown'}</p>
                     </div>
                     <div className="space-y-4">
                        <div className="h-px w-24 bg-slate-100" />
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md italic">{selectedProfile.bio || 'No transmission recorded.'}</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setSelectedProfile(null)} className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-slate-800 transition-all shadow-xl">Close Archive</button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GlassHeader 
           activeTab={dashboardTab} 
           onTabChange={(t: any) => setDashboardTab(t)}
           roleFilter={filters.role}
           onRoleFilterChange={(r: any) => setFilters(f => ({...f, role: r}))}
        />

        <main className="flex-1 py-16 space-y-20 pb-64">
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
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 italic">Archive Index</h2>
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
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900" />
                            <Input 
                              placeholder="RETRIEVE RECORD BY IDENTITY..." 
                              className="h-16 pl-20 bg-white border-black/[0.03] rounded-[2rem] focus:border-slate-900 focus:ring-4 focus:ring-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-900 placeholder:text-slate-200 shadow-sm" 
                              value={searchQuery} 
                              onChange={e => setSearchQuery(e.target.value)} 
                            />
                         </div>
                      </div>

                      {viewMode === 'GAZE' ? (
                        <GazeHologram profiles={profiles} onVerify={(id, s) => AdminService.updateProfileStatus(id, {is_verified: !s}).then(loadData)} onMessage={setMessageTarget} onDelete={setItemToDelete} />
                      ) : (
                        <div className="bg-white rounded-[4rem] border border-black/[0.02] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] relative min-h-[500px]">
                           <div className="hidden md:block h-[60vh] overflow-y-auto scrollbar-hide">
                              <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
                                 <thead className="bg-[#f8fafc] sticky top-0 z-20">
                                    <tr>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Identity</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Class</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 text-center">Status</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Aura Link</th>
                                       <th className="px-14 py-10 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 text-right">Access</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-black/[0.02]">
                                    {profiles.map((p) => (
                                       <tr key={p.user_id} className="group hover:bg-black/[0.01] transition-all relative">
                                          <td className="px-14 py-10 flex items-center gap-10 cursor-pointer group/id" onClick={() => setSelectedProfile(p)}>
                                             <div className="w-16 h-16 rounded-[2.25rem] overflow-hidden bg-slate-50 relative group-hover/id:scale-110 transition-transform duration-700 shadow-sm border border-black/[0.03]">
                                                <img src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} className="w-full h-full object-cover" />
                                                {p.is_verified && <BadgeCheck size={18} className="absolute -bottom-1 -right-1 text-slate-900" fill="white" />}
                                             </div>
                                             <div>
                                                <p className="font-bold text-slate-900 text-xl tracking-tight italic group-hover/id:translate-x-1 transition-transform">{p.full_name}</p>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">{p.city || 'UNDEFINED'}</p>
                                             </div>
                                          </td>
                                          <td className="px-14 py-10">
                                             <Badge variant="outline" className="text-[8px] font-bold p-2 uppercase border-slate-200 text-slate-400 bg-white italic">{p.role}</Badge>
                                          </td>
                                          <td className="px-14 py-10 text-center">
                                             <div className={`w-2 h-2 rounded-full mx-auto ${p.is_verified ? 'bg-slate-900' : 'bg-slate-100'}`} />
                                          </td>
                                          <td className="px-14 py-10">
                                             <div className="flex items-center gap-4">
                                                <span className="font-bold text-3xl text-slate-900 tabular-nums tracking-tighter">{(p.tokens || 0).toLocaleString()}</span>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                   <button onClick={() => handleUpdateTokens(p.user_id, 1000)} className="w-7 h-7 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg">+</button>
                                                   <button onClick={() => handleUpdateTokens(p.user_id, -1000)} className="w-7 h-7 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-bold text-xs">-</button>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-14 py-10 text-right">
                                             <TooltipProvider>
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                   <Tooltip>
                                                      <TooltipTrigger asChild>
                                                         <button onClick={() => handleUpdateTokens(p.user_id, 5000)} className="p-4 hover:bg-amber-50 text-amber-500 rounded-2xl transition-all"><Zap size={18} strokeWidth={1.5} /></button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>Aura Boost (+5000)</TooltipContent>
                                                   </Tooltip>

                                                   <Tooltip>
                                                      <TooltipTrigger asChild>
                                                         <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-4 hover:bg-slate-50 text-slate-400 rounded-2xl transition-all"><MessageSquare size={18} strokeWidth={1.5} /></button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>Direct Message</TooltipContent>
                                                   </Tooltip>

                                                   <Tooltip>
                                                      <TooltipTrigger asChild>
                                                         <button onClick={() => AdminService.updateProfileStatus(p.user_id, {is_verified: !p.is_verified}).then(loadData)} className={`p-4 rounded-2xl transition-all ${p.is_verified ? 'text-slate-900 bg-slate-50' : 'text-slate-200 hover:text-slate-900'}`}><Shield size={18} strokeWidth={1.5} /></button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>{p.is_verified ? 'Revoke Verification' : 'Grant Verification'}</TooltipContent>
                                                   </Tooltip>

                                                   <Tooltip>
                                                      <TooltipTrigger asChild>
                                                         <button onClick={() => setItemToDelete(p.user_id)} className="p-4 hover:bg-rose-50 text-rose-400 rounded-2xl transition-all"><Trash2 size={18} strokeWidth={1.5} /></button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>Excision Protocol</TooltipContent>
                                                   </Tooltip>
                                                </div>
                                             </TooltipProvider>
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
                  ) : (
                    <AdminBlogModeration />
                  )}
                </div>
             </motion.div>
           </AnimatePresence>
        </main>

        <MinimalDock onLogout={handleLogout} onSync={loadData} onBroadcast={handleBroadcast} onCulling={handleCulling} loading={loading} />
      </div>
    </div>
  );
};
