import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Verified, MessageSquare, Search, Trash2, ShieldAlert, BadgeCheck, Zap, Cpu, Globe, Star, ArrowRight, User, Sparkles, LayoutGrid, Layers, Eye } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';
import { Input } from '@/components/ui/input';
import DecryptedText from '../ui/cyber/DecryptedText';
import SpotlightCard from '../ui/cyber/SpotlightCard';
import CountUp from '../ui/cyber/CountUp';
import ShinyText from '../ui/cyber/ShinyText';

import { Badge } from '@/components/ui/badge';
import { AdminCommunicationsHub } from './AdminCommunicationsHub';
import { AdminBlogModeration } from './AdminBlogModeration';
import { DirectMessageModal } from './DirectMessageModal';
import { AdminAuraPanel } from './AdminAuraPanel';
import GazeHologram from './GazeHologram';

interface AdminDashboardProps {
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenPictureManager }) => {
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

  // Fetch initial data
  useEffect(() => {
    loadData();
    AdminService.getPendingAuraClaims().then(c => setPendingClaimsCount(c.length));
  }, []);

  const [filters, setFilters] = useState({
    role: 'all' as any,
    isVerified: 'all' as any,
    city: '',
    minTokens: 0,
    dateSort: 'newest' as any
  });

  // Fetch metrics once on mount
  useEffect(() => {
    AdminService.getSystemMetrics().then(m => setMetrics(m as any));
  }, []);

  // Active search / multi-filter effect
  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 150); // Sharp 150ms debounce for "Active" feel
    return () => clearTimeout(t);
  }, [searchQuery, filters]);

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
      // Refresh metrics silently
      const m = await AdminService.getSystemMetrics();
      setMetrics(m as any);
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
    setProfiles(p => p.map(x => x.user_id === userId ? { ...x, tokens: (x.tokens || 0) + amount } : x));
    
    const ok = await AdminService.updateUserTokens(userId, amount);
    if (!ok) {
      setProfiles(p => p.map(x => x.user_id === userId ? { ...x, tokens: (x.tokens || 0) - amount } : x));
      alert("TOKEN UPDATE FAILED: Registry connection error.");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    if (currentUser?.id === itemToDelete) {
        alert("EVICTION ABORTED: You cannot excise your own identity from the registry while active. Command discarded.");
        setItemToDelete(null);
        return;
    }

    try {
      const success = await AdminService.deleteUserRecord(itemToDelete);
      if (success) {
        setProfiles(prev => prev.filter(x => x.user_id !== itemToDelete));
        const m = await AdminService.getSystemMetrics();
        setMetrics(m as any);
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
      {/* 🛡️ SOVEREIGN CONFIRMATION MODAL */}
      {itemToDelete ? createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-mat-wine/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full border-2 border-mat-wine/20 shadow-2xl animate-in zoom-in-95 duration-300">
            <ShieldAlert className="w-12 h-12 text-mat-wine mb-4" />
            <h2 className="text-2xl font-bold text-mat-wine mb-2">Absolute Excision?</h2>
            <p className="text-mat-slate/70 mb-8 text-sm leading-relaxed">
              YOU ARE ABOUT TO PERMANENTLY OBLITERATE THIS IDENTITY FROM THE SANCTUARY. THIS ACTION CANNOT BE REVERSED.
            </p>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-xs tracking-widest uppercase bg-mat-rose/10 text-mat-wine hover:bg-mat-rose/20 transition-all font-sans"
              >
                Retreat
              </button>
              <button 
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-xs tracking-widest uppercase bg-mat-wine text-white hover:bg-black transition-all shadow-lg font-sans"
              >
                Obliterate
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {/* 🛡️ SOVEREIGN TRANSMISSION MODAL */}
      <AnimatePresence>
        {messageTarget ? (
          <DirectMessageModal 
            userId={messageTarget.id}
            userName={messageTarget.name}
            onClose={() => setMessageTarget(null)}
            onSuccess={() => {}}
          />
        ) : null}
      </AnimatePresence>

      {/* 🚀 SOVEREIGN COMMAND HEADER */}
      <header className="relative py-12 px-8 overflow-hidden rounded-[3rem] bg-mat-charcoal/90 border border-mat-rose/20 backdrop-blur-xl group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
          <Cpu className="w-64 h-64 text-mat-rose" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <Badge variant="outline" className="px-5 py-2 border-mat-rose/30 text-mat-rose text-[9px] font-black uppercase tracking-[0.4em] rounded-full bg-mat-rose/10 shadow-[0_0_20px_rgba(212,18,67,0.1)]">
            <Zap className="w-3 h-3 mr-2 fill-mat-rose animate-pulse" />
            Sovereign Operator Output
          </Badge>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight">
            <DecryptedText 
              text="CENTRAL COMMAND" 
              speed={100}
              maxIterations={20}
              sequential={true}
              animateOn="view"
              revealDirection="center"
              parentClassName="block"
              className="text-white"
              encryptedClassName="text-mat-rose/30"
            />
          </h1>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-mat-slate/70 text-[11px] font-bold tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
              Monitoring active matrices and registry integrity.
            </p>
            
            <button 
              onClick={onOpenPictureManager}
              className="mt-4 px-8 py-3 bg-white text-mat-charcoal rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-mat-rose hover:text-white transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 active:scale-95"
            >
               <Users className="w-4 h-4" /> Identity Assets Manager
            </button>
          </div>
        </div>
      </header>

      {/* 📊 TACTICAL METRICS BENTO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
          {[
            { label: 'Aspirants', val: metrics.totalMen, icon: Shield, color: 'rgba(212, 18, 67, 0.15)' },
            { label: 'Gaze Registry', val: metrics.totalWomen, icon: Users, color: 'rgba(212, 18, 67, 0.05)' },
            { label: 'Verified Nodes', val: metrics.verifiedProfiles, icon: Verified, color: 'rgba(59, 130, 246, 0.1)' },
            { label: 'Active Topics', val: metrics.totalForumTopics, icon: MessageSquare, color: 'rgba(212, 18, 67, 0.05)' }
          ].map((m, i) => (
             <SpotlightCard 
               key={m.label}
               spotlightColor={m.color}
               className="p-8 flex flex-col items-center justify-center text-center space-y-4 border-mat-rose/5"
             >
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-2">
                  <m.icon className="w-6 h-6 text-mat-rose/80" />
                </div>
                <div className="space-y-1">
                  <div className="text-5xl font-black text-mat-wine tracking-tighter">
                    <CountUp
                      to={m.val}
                      duration={2.5}
                      separator=","
                    />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-black text-mat-slate/70">
                    <ShinyText text={m.label} speed={3} />
                  </div>
                </div>
             </SpotlightCard>
          ))}
          <div className="flex items-center gap-1.5 p-1 bg-mat-wine/5 rounded-2xl border border-mat-rose/10 self-center mt-2">
             <button 
               onClick={() => setViewMode('STREAM')}
               className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all gap-2 flex items-center ${viewMode === 'STREAM' ? 'bg-mat-wine text-white shadow-lg' : 'text-mat-wine/40 hover:text-mat-wine/60'}`}
             >
                <Layers size={10} /> Stream
             </button>
             <button 
               onClick={() => setViewMode('GAZE')}
               className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all gap-2 flex items-center ${viewMode === 'GAZE' ? 'bg-mat-wine text-white shadow-lg shadow-mat-wine/20' : 'text-mat-wine/40 hover:text-mat-wine/60'}`}
             >
                <Eye size={10} /> Gaze Mode
             </button>
          </div>
      </div>

      <div className="flex justify-center border-b border-mat-rose/10 pb-4 gap-8">
         {['ROSTER', 'TITHE', 'COMMUNICATIONS', 'JOURNAL'].map(t => (
            <button 
              key={t}
              onClick={() => setDashboardTab(t as any)}
              className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-2 border-b-2 relative ${dashboardTab === t ? 'border-mat-wine text-mat-wine' : 'border-transparent text-mat-wine/70 hover:text-mat-wine'}`}
            >
               {t}
               {t === 'TITHE' && pendingClaimsCount > 0 ? (
                  <span className="absolute -top-1 -right-4 w-2 h-2 rounded-full bg-mat-rose shadow-[0_0_8px_#d41243] animate-pulse" />
               ) : null}
            </button>
         ))}
      </div>

      {dashboardTab === 'ROSTER' ? (
        <>
          <div className="space-y-6">
            <div className="flex flex-col space-y-4 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <h2 className="text-2xl font-light text-mat-wine self-start">Master <span className="italic text-mat-rose/50">Roster</span></h2>
                 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select 
                      value={filters.role}
                      onChange={e => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                      className="bg-white/50 border border-mat-rose/20 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-mat-rose/50 transition-all"
                    >
                      <option value="all">ALL ROLES</option>
                      <option value="man">MEN</option>
                      <option value="woman">WOMEN</option>
                      <option value="admin">ADMINS</option>
                    </select>

                    <select 
                      value={filters.isVerified}
                      onChange={e => setFilters(prev => ({ ...prev, isVerified: e.target.value === 'all' ? 'all' : e.target.value === 'true' }))}
                      className="bg-white/50 border border-mat-rose/20 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-mat-rose/50 transition-all"
                    >
                      <option value="all">ALL VERIFICATION</option>
                      <option value="true">VERIFIED ONLY</option>
                      <option value="false">NOT VERIFIED</option>
                    </select>

                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, dateSort: prev.dateSort === 'newest' ? 'oldest' : 'newest' }))}
                      className="bg-white/50 border border-mat-rose/20 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase hover:bg-mat-rose/5 transition-all flex items-center gap-2"
                    >
                      Sorted by: {filters.dateSort}
                    </button>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mat-slate/40" />
                    <Input 
                      placeholder="Search by name or ID..." 
                      className="pl-12 bg-white/50 border-mat-rose/20 rounded-xl h-11"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                 </div>
                 
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mat-slate/40" />
                    <Input 
                      placeholder="Filter by City..." 
                      className="pl-12 bg-white/50 border-mat-rose/20 rounded-xl h-11"
                      value={filters.city}
                      onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    />
                 </div>

                 <div className="relative w-full md:w-48 flex items-center">
                    <span className="absolute left-4 text-[10px] font-black text-mat-wine/40 uppercase">Min Aura</span>
                    <Input 
                      type="number"
                      placeholder="Min Aura..." 
                      className="pl-20 bg-white/50 border-mat-rose/20 rounded-xl h-11"
                      value={filters.minTokens || ''}
                      onChange={e => setFilters(prev => ({ ...prev, minTokens: parseInt(e.target.value) || 0 }))}
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* 📋 Sovereign          {/* 📋 Sovereign Master Roster */}
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
            <div className="mat-glass-deep rounded-[2.5rem] border border-mat-rose/10 overflow-hidden mx-4 md:mx-0 shadow-mat-premium theme-sovereign">
              {/* Desktop Table: Hidden on small screens */}
              <div className="hidden md:block h-[65vh] w-full overflow-y-auto scrollbar-hide">
                 <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
                    <thead className="bg-mat-wine/5 border-b border-mat-rose/10 sticky top-0 z-20 backdrop-blur-xl">
                       <tr>
                          <th className="px-8 py-5 text-[9px] tracking-[0.3em] text-mat-wine/60 font-black uppercase">Identity Node</th>
                          <th className="px-8 py-5 text-[9px] tracking-[0.3em] text-mat-wine/60 font-black uppercase">Affiliation</th>
                          <th className="px-8 py-5 text-[9px] tracking-[0.3em] text-mat-wine/60 font-black uppercase text-center">Status</th>
                          <th className="px-8 py-5 text-[9px] tracking-[0.3em] text-mat-wine/60 font-black uppercase">Aura Balance</th>
                          <th className="px-8 py-5 text-[9px] tracking-[0.3em] text-mat-wine/60 font-black uppercase text-right">Rituals</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-mat-rose/5">
                       <AnimatePresence mode="popLayout">
                          {profiles.map((p, idx) => (
                             <motion.tr 
                               key={p.user_id}
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: idx * 0.01 }}
                               className="group hover:bg-mat-rose/[0.03] transition-all duration-300 relative"
                             >
                                <td className="px-8 py-5 flex items-center gap-6">
                                   <div className="relative">
                                       <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-mat-rose/20 to-mat-gold/20 group-hover:from-mat-rose group-hover:to-mat-gold transition-all duration-500">
                                           <div className="w-full h-full rounded-[0.9rem] overflow-hidden bg-mat-cream flex items-center justify-center text-mat-wine font-black text-lg shadow-inner">
                                               {p.photos?.length ? (
                                                  <img 
                                                    src={p.photos[0]} 
                                                    referrerPolicy="no-referrer"
                                                    crossOrigin="anonymous"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-bold" 
                                                    onError={(e) => {
                                                       const target = e.currentTarget;
                                                       const currentSrc = target.src || '';
                                                       
                                                       if (currentSrc.includes('googleusercontent.com') && !currentSrc.includes('sz=300')) {
                                                         const base = currentSrc.split('=')[0];
                                                         target.src = `${base}=s300`;
                                                         return;
                                                       }
                                                       if (p.photos && p.photos[1] && currentSrc !== p.photos[1]) {
                                                         target.src = p.photos[1];
                                                         return;
                                                       }
                                                       target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.full_name || p.user_id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9`;
                                                       target.removeAttribute('crossorigin');
                                                    }}
                                                  />
                                                ) : (p.full_name?.[0] || '?')}
                                           </div>
                                       </div>
                                      {p.is_verified ? (
                                         <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-mat-rose/10">
                                            <BadgeCheck className="w-4 h-4 text-blue-500" fill="currentColor" stroke="white" />
                                         </div>
                                      ) : null}
                                   </div>
                                   <div className="space-y-0.5 max-w-[180px]">
                                     <div className="font-bold text-mat-wine italic tracking-tight flex items-center gap-2 truncate">
                                        {p.full_name}
                                        {p.user_id.includes('dummy') ? <span className="text-[7px] border border-mat-rose/20 px-1 rounded uppercase font-black text-mat-rose/40">Dummy</span> : null}
                                     </div>
                                     <div className="text-[9px] text-mat-slate/70 font-mono tracking-tighter uppercase flex items-center gap-1.5 truncate">
                                        <Globe size={8} className="shrink-0" /> {p.city || 'PARTS_UNKNOWN'}
                                        <span className="opacity-40 shrink-0">|</span>
                                        <span className="opacity-80 truncate">UID: {p.user_id.split('-').pop()}</span>
                                     </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border-mat-rose/10 ${p.role === 'admin' ? 'bg-mat-charcoal text-white' : p.role === 'woman' ? 'bg-mat-rose/5 text-mat-rose' : 'bg-mat-wine/5 text-mat-wine'}`}>
                                      {p.role}
                                   </Badge>
                                </td>
                                <td className="px-8 py-5 text-center">
                                   <div className="flex justify-center flex-col items-center gap-1">
                                      <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${p.payment_status === 'APPROVED' ? 'bg-green-500 shadow-green-500/50' : p.payment_status === 'PENDING' ? 'bg-mat-gold shadow-mat-gold/50 animate-pulse' : 'bg-mat-rose shadow-mat-rose/50'}`} />
                                      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60">{p.payment_status || 'NONE'}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <button 
                                        onClick={() => handleUpdateTokens(p.user_id, -500)}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-mat-wine/5 text-mat-wine hover:bg-mat-wine/10 transition-colors font-bold"
                                      >-</button>
                                      <div className="flex flex-col min-w-[3rem] text-center">
                                         <span className="font-mono font-black text-mat-wine text-xs tracking-tighter">
                                            {(p.tokens || 0).toLocaleString()}
                                         </span>
                                         <span className="text-[7px] font-bold text-mat-gold uppercase tracking-widest opacity-80">Balance</span>
                                      </div>
                                      <button 
                                        onClick={() => handleUpdateTokens(p.user_id, 500)}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-mat-gold/10 text-mat-gold hover:bg-mat-gold/20 transition-colors font-bold"
                                      >+</button>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                      {p.payment_status === 'PENDING' ? (
                                         <div className="flex gap-1.5 mr-2 pr-2 border-r border-mat-rose/10">
                                            <button 
                                              onClick={() => handlePaymentApprove(p.user_id)}
                                              className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
                                            >OK</button>
                                            <button 
                                              onClick={() => handlePaymentReject(p.user_id)}
                                              className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                            >NO</button>
                                         </div>
                                      ) : null}
                                      <button 
                                        onClick={() => setMessageTarget({ id: p.user_id, name: p.full_name })}
                                        className="p-2.5 hover:bg-mat-wine/5 text-mat-wine rounded-xl transition-colors border border-transparent hover:border-mat-rose/10"
                                        title="Communicate"
                                      >
                                         <MessageSquare size={14} />
                                      </button>
                                      <button 
                                        onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)}
                                        className={`p-2.5 rounded-xl transition-colors border ${p.is_verified ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : 'text-mat-slate/40 border-transparent hover:bg-mat-rose/5 hover:border-mat-rose/10'}`}
                                        title="Toggle Truth"
                                      >
                                         <Shield size={14} />
                                      </button>
                                      <button 
                                        onClick={() => setItemToDelete(p.user_id)}
                                        className="p-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                        title="Excise Identity"
                                      >
                                         <Trash2 size={14} />
                                      </button>
                                   </div>
                                </td>
                             </motion.tr>
                          ))}
                       </AnimatePresence>
                    </tbody>
                 </table>
              </div>

              {/* Mobile Cards: Visible only on small screens */}
              <div className="md:hidden h-[65vh] w-full overflow-y-auto p-4 space-y-4 scrollbar-hide">
                 <AnimatePresence mode="popLayout">
                    {profiles.map((p, idx) => (
                       <motion.div 
                         key={p.user_id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.05 }}
                         className="bg-white/40 border border-mat-rose/10 rounded-3xl p-5 space-y-5"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl overflow-hidden bg-mat-cream border border-mat-rose/10 relative">
                                <img 
                                  src={p.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.full_name || p.user_id}`} 
                                  className="w-full h-full object-cover" 
                                />
                                {p.is_verified && (
                                   <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-mat-rose/10">
                                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500" fill="currentColor" stroke="white" />
                                   </div>
                                )}
                             </div>
                             <div className="flex-1 space-y-0.5">
                                <h3 className="font-bold text-mat-wine italic">{p.full_name}</h3>
                                <div className="flex items-center gap-2 text-[9px] text-mat-slate/70 uppercase font-black tracking-widest">
                                   <Badge className="px-2 py-0.5 text-[7px] border-mat-rose/10">{p.role}</Badge>
                                   <span>{p.city || 'UNKNOWN'}</span>
                                </div>
                             </div>
                             <div className="text-right flex flex-col items-end gap-1">
                                <div className={`w-2 h-2 rounded-full ${p.payment_status === 'APPROVED' ? 'bg-green-500' : 'bg-mat-rose'}`} />
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-60">{p.payment_status || 'NONE'}</span>
                             </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-mat-rose/[0.03] rounded-2xl border border-mat-rose/5">
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-mat-wine/60 uppercase tracking-widest">Aura Balance</span>
                                <span className="font-mono font-black text-mat-wine">{(p.tokens || 0).toLocaleString()}</span>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => handleUpdateTokens(p.user_id, -500)} className="w-8 h-8 rounded-lg bg-mat-wine/5 flex items-center justify-center text-mat-wine font-bold">-</button>
                                <button onClick={() => handleUpdateTokens(p.user_id, 500)} className="w-8 h-8 rounded-lg bg-mat-gold/10 flex items-center justify-center text-mat-gold font-bold">+</button>
                             </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                             <button 
                               onClick={() => setMessageTarget({ id: p.user_id, name: p.full_name })}
                               className="flex-1 h-11 bg-mat-wine text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-mat-wine/10"
                             >
                                <MessageSquare size={14} /> Message
                             </button>
                             <button 
                               onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)}
                               className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${p.is_verified ? 'border-blue-500/20 bg-blue-500/5 text-blue-500' : 'border-mat-rose/10 bg-white/40 text-mat-slate/40'}`}
                             >
                                <Shield size={16} />
                             </button>
                             <button 
                               onClick={() => setItemToDelete(p.user_id)}
                               className="w-11 h-11 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500 flex items-center justify-center"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {!loading && profiles.length === 0 ? (
                 <div className="text-center py-24 text-mat-slate/70 uppercase tracking-[0.3em] font-black text-[10px]">Matrix Empty: No nodes found.</div>
              ) : null}
            </div>
          )}
          </div>
        </>
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
