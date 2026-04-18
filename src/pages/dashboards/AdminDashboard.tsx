import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Trash2, 
  ShieldAlert, 
  BadgeCheck, 
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
import { AdminManual } from './AdminManual';

import { GlassHeader } from './GlassHeader';
import { EtherealStatus } from './EtherealStatus';
import { MinimalDock } from './MinimalDock';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface AdminDashboardProps {
  handleLogout: () => void;
  onOpenPictureManager?: () => void;
  onTabChange?: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ handleLogout, onOpenPictureManager, onTabChange }) => {
  const { user: currentUser } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<'ROSTER' | 'TITHE' | 'COMMUNICATIONS' | 'MODERATION' | 'JOURNAL'>('ROSTER');
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

  const handleViewSwitch = (role: 'man' | 'woman' | 'admin') => {
    if (!onTabChange) return;
    if (role === 'admin') onTabChange('admin_panel');
    else if (role === 'man') onTabChange('profile');
    else if (role === 'woman') onTabChange('discovery');
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

  const parseIdentityNarrative = (bio: string) => {
    try {
      const data = JSON.parse(bio);
      if (data && (data.trump_stats || data.text !== undefined)) return data;
    } catch (e) {}
    return { text: bio, trump_stats: null };
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

        {selectedProfile && (() => {
          const narrative = parseIdentityNarrative(selectedProfile.bio || '');
          return (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl animate-in fade-in duration-700">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-white rounded-[4rem] max-w-6xl w-full border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row h-[90vh]"
            >
               {/* Image Section */}
               <div className="w-full md:w-2/5 h-1/2 md:h-full relative bg-slate-100">
                  <img 
                    src={selectedProfile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} 
                    className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-12 left-12 space-y-2">
                     <Badge className="bg-white/80 text-slate-900 border-none text-[8px] font-black tracking-widest px-4 py-1.5 backdrop-blur-md">
                        ID_{selectedProfile.user_id.slice(-8).toUpperCase()}
                     </Badge>
                  </div>
               </div>

               {/* Info Section */}
               <div className="flex-1 p-12 md:p-24 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                  <div className="space-y-16">
                     <div className="flex justify-between items-start">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] border-slate-200 text-slate-400 italic px-5 py-2">
                                {selectedProfile.role} // {selectedProfile.is_verified ? 'IDENTITY_SEALED' : 'PENDING_VERIFICATION'}
                              </Badge>
                           </div>
                           <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic leading-none">{selectedProfile.full_name}</h2>
                           <div className="flex items-center gap-6">
                              <p className="text-2xl font-medium text-slate-400 italic">{selectedProfile.city || 'Location Unknown'}</p>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <p className="text-xl font-bold text-slate-900 tabular-nums italic">{(selectedProfile as any).age || 25} Years</p>
                           </div>
                        </div>
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border border-black/[0.03] flex flex-col items-center justify-center">
                           <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Aura</span>
                           <span className="text-2xl font-bold text-slate-900 tabular-nums">{(selectedProfile.tokens || 0).toLocaleString()}</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-black/[0.03] py-12">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Identity Narrative</span>
                              <p className="text-sm text-slate-500 leading-relaxed italic">{narrative.text || 'The aspirant has not yet transmitted an identity narrative.'}</p>
                           </div>

                           {narrative.trump_stats && (
                             <div className="space-y-4 pt-4">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Aura Resonance Metrics</span>
                                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                                   {Object.entries(narrative.trump_stats).map(([key, val]: [string, any]) => {
                                     if (typeof val !== 'number') return null;
                                     return (
                                       <div key={key} className="space-y-1.5">
                                          <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-slate-400">
                                             <span>{key}</span>
                                             <span>{val}%</span>
                                          </div>
                                          <div className="h-0.5 w-full bg-slate-100 overflow-hidden">
                                             <div className="h-full bg-slate-900" style={{ width: `${val}%` }} />
                                          </div>
                                       </div>
                                     );
                                   })}
                                </div>
                                {narrative.trump_stats.signature_move && (
                                  <div className="pt-4 border-t border-black/[0.02]">
                                     <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest block mb-1">Signature Ritual</span>
                                     <p className="text-[10px] font-bold text-slate-900 italic uppercase tracking-tighter">{narrative.trump_stats.signature_move}</p>
                                  </div>
                                )}
                             </div>
                           )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 content-start">
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Occupation</span>
                              <p className="text-xs font-bold text-slate-900 italic">{(selectedProfile as any).occupation || 'Unspecified'}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Height</span>
                              <p className="text-xs font-bold text-slate-900 italic">{(selectedProfile as any).height || 'Undisclosed'}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Religion</span>
                              <p className="text-xs font-bold text-slate-900 italic">{(selectedProfile as any).religion || 'Private'}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Origin Point</span>
                              <p className="text-xs font-bold text-slate-900 italic">{narrative.trump_stats?.hometown || (selectedProfile as any).city || 'Unknown'}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Identity Archive Date</span>
                              <p className="text-xs font-bold text-slate-900 italic">{new Date((selectedProfile as any).created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Archive Protocols</span>
                        <div className="flex flex-wrap gap-4">
                           <button onClick={() => setMessageTarget({id: selectedProfile.user_id, name: selectedProfile.full_name})} className="px-8 py-4 bg-slate-50 text-slate-900 border border-black/[0.03] rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all">Direct Transmission</button>
                           <button onClick={() => AdminService.updateProfileStatus(selectedProfile.user_id, {is_verified: !selectedProfile.is_verified}).then(loadData)} className="px-8 py-4 bg-slate-50 text-slate-900 border border-black/[0.03] rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all">{selectedProfile.is_verified ? 'Revoke Seal' : 'Apply Identity Seal'}</button>
                           <button onClick={() => handleUpdateTokens(selectedProfile.user_id, 1000)} className="px-8 py-4 bg-slate-50 text-slate-900 border border-black/[0.03] rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all">Grant 1k Aura</button>
                        </div>
                     </div>
                  </div>

                  <div className="pt-12 mt-12 border-t border-black/[0.03]">
                     <button onClick={() => setSelectedProfile(null)} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-[10px] tracking-[0.6em] uppercase hover:bg-slate-800 transition-all shadow-2xl">Return to Index</button>
                  </div>
               </div>
            </motion.div>
          </div>
          );
        })()}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GlassHeader 
           activeTab={dashboardTab} 
           onTabChange={(t: any) => setDashboardTab(t)}
           roleFilter={filters.role}
           onRoleFilterChange={(r: any) => setFilters(f => ({...f, role: r}))}
           onLogout={handleLogout}
           onViewSwitch={handleViewSwitch}
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

                      <div className="flex items-center gap-4 bg-white/40 p-2 rounded-2xl border border-black/[0.02] w-fit backdrop-blur-sm">
                         {['all', 'man', 'woman'].map((r: any) => (
                            <button
                              key={r}
                              onClick={() => setFilters(f => ({...f, role: r}))}
                              className={`px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                filters.role === r 
                                  ? 'bg-slate-900 text-white shadow-lg scale-105' 
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/60'
                              }`}
                            >
                              {r}
                            </button>
                         ))}
                      </div>

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
                    </div>
                  ) : dashboardTab === 'TITHE' ? (
                    <AdminAuraPanel />
                  ) : dashboardTab === 'COMMUNICATIONS' ? (
                    <AdminCommunicationsHub onViewProfile={(p) => setSelectedProfile(p)} />
                  ) : dashboardTab === 'MODERATION' ? (
                    <AdminBlogModeration />
                  ) : (
                    <AdminManual />
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
