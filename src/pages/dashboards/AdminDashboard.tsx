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
  Cpu, 
  Globe, 
  Layers, 
  Eye,
  RefreshCw,
  LogOut,
  Activity
} from 'lucide-react';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';
import { Input } from '@/components/ui/input';
import DecryptedText from '@/components/ui/cyber/DecryptedText';
import SpotlightCard from '@/components/ui/cyber/SpotlightCard';
import CountUp from '@/components/ui/cyber/CountUp';
import ShinyText from '@/components/ui/cyber/ShinyText';

import { Badge } from '@/components/ui/badge';
import { AdminCommunicationsHub } from './AdminCommunicationsHub';
import { AdminBlogModeration } from './AdminBlogModeration';
import { DirectMessageModal } from './DirectMessageModal';
import { AdminAuraPanel } from './AdminAuraPanel';
import GazeHologram from './GazeHologram';

interface AdminDashboardProps {
  handleLogout: () => void;
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ handleLogout, onOpenPictureManager }) => {
  const { user: currentUser } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<'ROSTER' | 'COMMUNICATIONS' | 'JOURNAL' | 'TITHE'>('ROSTER');
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
      
      // Update metrics silently
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
      alert("TOKEN UPDATE FAILED: Registry connection error.");
    }
  };

  const handleCulling = async () => {
    if (!window.confirm("INITIATE CULLING? This permanently purges men inactive for over 30 days and reflows global ranks. This is absolute.")) return;
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
    const body = window.prompt("Enter the manifesto or message body to broadcast to ALL men:");
    if(!body) return;
    
    if(!window.confirm(`BROADCAST CONFIRMATION\n\nYou are about to send:\n[${title}]\n${body}\n\nTo ALL active male profiles. Proceed?`)) return;
    
    setLoading(true);
    const res = await AdminService.sendSovereignBroadcast(title, body);
    window.alert(`Sovereign Broadcast successful to ${res.count} channels.`);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    if (currentUser?.id === itemToDelete) {
        alert("EVICTION ABORTED: You cannot excise your own identity from the registry while active.");
        setItemToDelete(null);
        return;
    }

    try {
      const success = await AdminService.deleteUserRecord(itemToDelete);
      if (success) {
        setProfiles(prev => prev.filter(x => x.user_id !== itemToDelete));
        loadData();
      } else {
        alert("EVICTION FAILED: The Turso uplink rejected the excision request.");
      }
    } catch (err) {
      alert("CRITICAL ERROR: A system fault occurred during the excision protocol.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Confirmation Modal */}
      {itemToDelete ? createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-mat-wine/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full border-2 border-mat-wine/20 shadow-2xl">
            <ShieldAlert className="w-12 h-12 text-mat-wine mb-4" />
            <h2 className="text-2xl font-bold text-mat-wine mb-2">Absolute Excision?</h2>
            <p className="text-mat-slate/70 mb-8 text-sm">
              YOU ARE ABOUT TO PERMANENTLY OBLITERATE THIS IDENTITY FROM THE SANCTUARY. THIS ACTION CANNOT BE REVERSED.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase bg-mat-rose/10 text-mat-wine">Retreat</button>
              <button onClick={confirmDelete} className="flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase bg-mat-wine text-white">Obliterate</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

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

      {/* COMMAND HEADER */}
      <header className="relative py-12 px-8 overflow-hidden rounded-[3rem] bg-mat-charcoal/90 border border-mat-rose/20 backdrop-blur-xl group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
          <Cpu className="w-64 h-64 text-mat-rose" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Badge variant="outline" className="px-5 py-2 border-mat-rose/30 text-mat-rose text-[9px] font-black uppercase tracking-[0.4em] rounded-full bg-mat-rose/10">
              <Zap className="w-3 h-3 mr-2 fill-mat-rose animate-pulse" />
              Sovereign Operator Output
            </Badge>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight italic">
              CENTRAL <span className="text-mat-rose/30">COMMAND.</span>
            </h1>
            
            <p className="text-mat-slate/70 text-[11px] font-bold tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              Monitoring active matrices and registry integrity.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-3">
             <button 
               onClick={handleBroadcast}
               className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-mat-rose hover:border-mat-rose transition-all flex items-center gap-2"
             >
                Sovereign Broadcast
             </button>
             <button 
               onClick={handleCulling}
               className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-mat-rose hover:border-mat-rose transition-all flex items-center gap-2"
             >
                <Activity size={12} /> The Culling
             </button>
             <button 
               onClick={handleLogout}
               className="px-6 py-3 bg-mat-wine text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg"
             >
                <LogOut size={12} /> Purge Session
             </button>
          </div>
        </div>
      </header>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Aspirants', val: metrics.totalMen, icon: Shield, color: 'rgba(212, 18, 67, 0.15)' },
            { label: 'Gaze Registry', val: metrics.totalWomen, icon: Users, color: 'rgba(212, 18, 67, 0.05)' },
            { label: 'Verified Nodes', val: metrics.verifiedProfiles, icon: BadgeCheck, color: 'rgba(59, 130, 246, 0.1)' },
            { label: 'Active Topics', val: metrics.totalForumTopics, icon: MessageSquare, color: 'rgba(212, 18, 67, 0.05)' }
          ].map((m) => (
             <SpotlightCard key={m.label} spotlightColor={m.color} className="p-8 flex flex-col items-center justify-center text-center space-y-4 border-mat-rose/5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-2">
                  <m.icon className="w-6 h-6 text-mat-rose/80" />
                </div>
                <div className="space-y-1">
                  <div className="text-5xl font-black text-mat-wine tracking-tighter">
                    <CountUp to={m.val} duration={2} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-black text-mat-slate/70">
                    <ShinyText text={m.label} speed={3} />
                  </div>
                </div>
             </SpotlightCard>
          ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-mat-rose/10 pb-6 px-4">
          <div className="flex gap-8">
             {['ROSTER', 'TITHE', 'COMMUNICATIONS', 'JOURNAL'].map(t => (
                <button 
                  key={t}
                  onClick={() => setDashboardTab(t as any)}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-2 border-b-2 relative ${dashboardTab === t ? 'border-mat-wine text-mat-wine' : 'border-transparent text-mat-wine/40 hover:text-mat-wine'}`}
                >
                   {t}
                   {t === 'TITHE' && pendingClaimsCount > 0 && (
                      <span className="absolute -top-1 -right-4 w-2 h-2 rounded-full bg-mat-rose shadow-[0_0_8px_#d41243] animate-pulse" />
                   )}
                </button>
             ))}
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-mat-wine/5 rounded-2xl border border-mat-rose/10">
             <button onClick={() => setViewMode('STREAM')} className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'STREAM' ? 'bg-mat-wine text-white shadow-lg' : 'text-mat-wine/40'}`}>
                <Layers size={10} /> Stream
             </button>
             <button onClick={() => setViewMode('GAZE')} className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'GAZE' ? 'bg-mat-wine text-white shadow-lg' : 'text-mat-wine/40'}`}>
                <Eye size={10} /> Gaze Mode
             </button>
          </div>
      </div>

      {dashboardTab === 'ROSTER' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row gap-4 px-4 md:px-0">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mat-slate/40" />
                <Input placeholder="Search nodes..." className="pl-12 bg-white/50 border-mat-rose/20 rounded-xl h-11" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
             </div>
             <select value={filters.role} onChange={e => setFilters(f => ({...f, role: e.target.value}))} className="bg-white/50 border border-mat-rose/20 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                <option value="all">ALL ROLES</option>
                <option value="man">MEN</option>
                <option value="woman">WOMEN</option>
                <option value="admin">ADMINS</option>
             </select>
             <button 
               onClick={() => loadData()}
               className="p-3 bg-mat-wine/5 text-mat-wine rounded-xl hover:bg-mat-wine/10 transition-all"
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
            <div className="mat-glass-deep rounded-[2.5rem] border border-mat-rose/10 overflow-hidden mx-4 md:mx-0 shadow-mat-premium">
               <div className="hidden md:block h-[60vh] overflow-y-auto scrollbar-hide">
                  <table className="w-full text-left whitespace-nowrap">
                     <thead className="bg-mat-wine/5 sticky top-0 z-20 backdrop-blur-xl border-b border-mat-rose/10">
                        <tr>
                           <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-mat-wine/60">Identity</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-mat-wine/60">Affiliation</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-mat-wine/60 text-center">Status</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-mat-wine/60">Aura</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-mat-wine/60 text-right">Rituals</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-mat-rose/5">
                        {profiles.map((p) => (
                           <tr key={p.user_id} className="group hover:bg-mat-rose/[0.03] transition-all duration-300">
                              <td className="px-8 py-5 flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl overflow-hidden bg-mat-cream border border-mat-rose/10 relative">
                                    <img src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    {p.is_verified && <BadgeCheck size={12} className="absolute -bottom-1 -right-1 text-blue-500" fill="white" />}
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="font-bold text-mat-wine italic text-sm">{p.full_name}</p>
                                    <p className="text-[8px] font-black text-mat-slate/40 uppercase tracking-widest">{p.city || 'Unknown'}</p>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <Badge variant="outline" className="text-[8px] font-black p-1 uppercase">{p.role}</Badge>
                              </td>
                              <td className="px-8 py-5 text-center">
                                 <div className={`w-2 h-2 rounded-full mx-auto ${p.payment_status === 'APPROVED' ? 'bg-green-500' : 'bg-mat-rose'}`} />
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-mat-wine">{(p.tokens || 0).toLocaleString()}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleUpdateTokens(p.user_id, 1000)} className="w-5 h-5 bg-mat-gold/20 text-mat-gold rounded flex items-center justify-center font-bold text-[8px]">+</button>
                                       <button onClick={() => handleUpdateTokens(p.user_id, -1000)} className="w-5 h-5 bg-mat-wine/10 text-mat-wine rounded flex items-center justify-center font-bold text-[8px]">-</button>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                    <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-2 hover:bg-mat-wine/5 text-mat-wine rounded-lg"><MessageSquare size={14} /></button>
                                    <button onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} className={`p-2 rounded-lg ${p.is_verified ? 'text-blue-500 bg-blue-500/10' : 'text-mat-slate/40 hover:bg-mat-rose/5'}`}><Shield size={14} /></button>
                                    <button onClick={() => setItemToDelete(p.user_id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               {/* Mobile Cards */}
               <div className="md:hidden space-y-4 p-4 h-[60vh] overflow-y-auto">
                  {profiles.map(p => (
                     <div key={p.user_id} className="bg-white/40 border border-mat-rose/10 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-xl bg-mat-cream overflow-hidden border border-mat-rose/10">
                              <img src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <p className="font-bold text-mat-wine italic">{p.full_name}</p>
                              <p className="text-[8px] font-black uppercase text-mat-slate/40">{p.role} | {p.city || '??'}</p>
                           </div>
                           <button onClick={() => setMessageTarget({id: p.user_id, name: p.full_name})} className="p-3 bg-mat-wine text-white rounded-xl"><MessageSquare size={14} /></button>
                        </div>
                     </div>
                  ))}
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
  );
};
