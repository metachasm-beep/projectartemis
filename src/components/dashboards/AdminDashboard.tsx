import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Verified, MessageSquare, Search, Trash2, ShieldAlert, BadgeCheck } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { AdminCommunicationsHub } from './AdminCommunicationsHub';
import { AdminBlogModeration } from './AdminBlogModeration';
import { DirectMessageModal } from './DirectMessageModal';

interface AdminDashboardProps {
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenPictureManager }) => {
  const { user: currentUser } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<'ROSTER' | 'COMMUNICATIONS' | 'JOURNAL'>('ROSTER');
  const [metrics, setMetrics] = useState({ totalMen: 0, totalWomen: 0, verifiedProfiles: 0, totalForumTopics: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<MatriarchProfile[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [messageTarget, setMessageTarget] = useState<{ id: string, name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  // Fetch initial data
  useEffect(() => {
    loadData();
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

  const handleRoleChange = async (userId: string, newRole: 'man' | 'woman' | 'admin') => {
    const ok = await AdminService.updateProfileStatus(userId, { role: newRole });
    if (ok) {
        setProfiles(p => p.map(x => x.user_id === userId ? { ...x, role: newRole } : x));
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    // 🛡️ ANTI-GENOCIDE PROTOCOL: Prevent the Admin from accidentally purging their own existence.
    if (currentUser?.id === itemToDelete) {
        alert("EVICTION ABORTED: You cannot excise your own identity from the registry while active. Command discarded.");
        setItemToDelete(null);
        return;
    }

    try {
      console.log(`ADMIN_DASHBOARD: Initializing absolute excision for identity: ${itemToDelete}`);
      const success = await AdminService.deleteUserRecord(itemToDelete);
      if (success) {
        console.log("ADMIN_DASHBOARD: Identity successfully excised from registry.");
        setProfiles(prev => prev.filter(x => x.user_id !== itemToDelete));
        // Refresh metrics to reflect the void
        const m = await AdminService.getSystemMetrics();
        setMetrics(m as any);
      } else {
        console.error("ADMIN_DASHBOARD: Turso rejected the purge request.");
        alert("EVICTION FAILED: The Turso uplink rejected the excision request.");
      }
    } catch (err) {
      console.error("ADMIN_DASHBOARD_CRITICAL_EVICTION_ERROR:", err);
      alert("CRITICAL ERROR: A system fault occurred during the excision protocol.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 🛡️ SOVEREIGN CONFIRMATION MODAL */}
      {itemToDelete && createPortal(
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
      )}

      {/* 🛡️ SOVEREIGN TRANSMISSION MODAL */}
      <AnimatePresence>
        {messageTarget && (
          <DirectMessageModal 
            userId={messageTarget.id}
            userName={messageTarget.name}
            onClose={() => setMessageTarget(null)}
            onSuccess={() => {
              // Sovereign transmission success.
            }}
          />
        )}
      </AnimatePresence>

      {/* 🚀 Header */}
      <div className="text-center space-y-4">
         <Badge variant="outline" className="px-5 py-2 border-mat-rose/20 text-mat-rose text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-rose/5">The Architect</Badge>
         <h1 className="text-5xl md:text-7xl mat-text-display-pro text-mat-wine italic">Sovereign <br /><span className="text-mat-rose/20">Control Panel.</span></h1>
         <div className="flex justify-center gap-4">
            <button 
              onClick={onOpenPictureManager}
              className="px-6 py-2 bg-mat-wine text-white rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-mat-rose transition-all flex items-center gap-2"
            >
               <Users className="w-3 h-3" /> Manage Identity Assets
            </button>
         </div>
      </div>

      {/* 📊 Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
          {[
            { label: 'Total Men', val: metrics.totalMen, icon: Shield },
            { label: 'Total Women', val: metrics.totalWomen, icon: Users },
            { label: 'Verified Matrix', val: metrics.verifiedProfiles, icon: Verified },
            { label: 'Active Topics', val: metrics.totalForumTopics, icon: MessageSquare }
          ].map((m, i) => (
             <motion.div 
               key={m.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white/50 backdrop-blur-xl border border-mat-rose/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden"
             >
                <m.icon className="w-5 h-5 text-mat-rose/60 absolute top-4 right-4" />
                <span className="text-6xl font-light text-mat-wine">{m.val}</span>
                <span className="text-xs uppercase tracking-widest text-mat-slate/50 font-bold">{m.label}</span>
             </motion.div>
          ))}
      </div>

      {/* 🏛️ Dashboard Navigation */}
      <div className="flex justify-center border-b border-mat-rose/10 pb-4 gap-8">
         {['ROSTER', 'COMMUNICATIONS', 'JOURNAL'].map(t => (
            <button 
              key={t}
              onClick={() => setDashboardTab(t as any)}
              className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-2 border-b-2 ${dashboardTab === t ? 'border-mat-wine text-mat-wine' : 'border-transparent text-mat-wine/30 hover:text-mat-wine'}`}
            >
               {t}
            </button>
         ))}
      </div>

      {dashboardTab === 'ROSTER' ? (
        <>
          {/* 📋 Master Roster Filters */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-4 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <h2 className="text-2xl font-light text-mat-wine self-start">Master <span className="italic text-mat-rose/50">Roster</span></h2>
                 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Role Filter */}
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

                    {/* Verification Filter */}
                    <select 
                      value={filters.isVerified}
                      onChange={e => setFilters(prev => ({ ...prev, isVerified: e.target.value === 'all' ? 'all' : e.target.value === 'true' }))}
                      className="bg-white/50 border border-mat-rose/20 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-mat-rose/50 transition-all"
                    >
                      <option value="all">ALL VERIFICATION</option>
                      <option value="true">VERIFIED ONLY</option>
                      <option value="false">NOT VERIFIED</option>
                    </select>

                    {/* Date Sort */}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, dateSort: prev.dateSort === 'newest' ? 'oldest' : 'newest' }))}
                      className="bg-white/50 border border-mat-rose/20 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase hover:bg-mat-rose/5 transition-all flex items-center gap-2"
                    >
                      Sorted by: {filters.dateSort}
                    </button>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                 {/* Global Search */}
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mat-slate/40" />
                    <Input 
                      placeholder="Search by name or ID..." 
                      className="pl-12 bg-white/50 border-mat-rose/20 rounded-xl h-11"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                 </div>
                 
                 {/* City Search */}
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mat-slate/40" />
                    <Input 
                      placeholder="Filter by City..." 
                      className="pl-12 bg-white/50 border-mat-rose/20 rounded-xl h-11"
                      value={filters.city}
                      onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    />
                 </div>

                 {/* Token Filter */}
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

          {/* 📋 Master Roster Table */}
          <div className="bg-white/50 backdrop-blur-xl border border-mat-rose/10 rounded-3xl overflow-hidden mx-4 md:mx-0">
            <div className="h-[60vh] w-full overflow-y-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-mat-rose/5 border-b border-mat-rose/10 sticky top-0 z-10 backdrop-blur-md">
                     <tr>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">Identity</th>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">Role</th>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">Payment</th>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">Tokens</th>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-mat-rose/5">
                     <AnimatePresence>
                        {profiles.map(p => (
                           <motion.tr 
                             key={p.user_id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="hover:bg-mat-rose/5 transition-colors"
                           >
                              <td className="px-6 py-4 flex items-center space-x-4">
                                 <div className="relative">
                                     <div className="w-10 h-10 border border-mat-rose/20 rounded-full overflow-hidden flex items-center justify-center bg-mat-cream text-mat-wine font-bold group/avatar">
                                         {p.photos?.length ? (
                                            <img 
                                              src={p.photos[0]} 
                                              referrerPolicy="no-referrer"
                                              crossOrigin="anonymous"
                                              className="w-full h-full object-cover" 
                                              onError={(e) => {
                                                 const target = e.currentTarget;
                                                 const currentSrc = target.src || '';
                                                 
                                                 // STAGE 1: Check for Google URL and attempt re-format
                                                 if (currentSrc.includes('googleusercontent.com') && !currentSrc.includes('sz=300')) {
                                                   // Remove standard size parameters (=s96-c etc) and try high-res sz=300
                                                   const base = currentSrc.split('=')[0];
                                                   target.src = `${base}=s300`;
                                                   return;
                                                 }

                                                 // STAGE 2: Try second photo if it exists
                                                 if (p.photos && p.photos[1] && currentSrc !== p.photos[1]) {
                                                   target.src = p.photos[1];
                                                   return;
                                                 }

                                                 // STAGE 3: Final generated fallback
                                                 target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.full_name || p.user_id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9&eyes=default,happy,surprised&mouth=default,smile,twinkle`;
                                                 // Disable crossOrigin for the final fallback to prevent any further blocking
                                                 target.removeAttribute('crossorigin');
                                              }}
                                            />
                                          ) : (p.full_name?.[0] || '?')}
                                     </div>
                                    {p.is_verified && (
                                       <BadgeCheck className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full border border-mat-rose/10" />
                                    )}
                                 </div>
                                 <div className="max-w-[120px] overflow-hidden">
                                   <div className="font-semibold text-mat-wine truncate">{p.full_name}</div>
                                   <div className="text-[9px] text-mat-slate/50 font-mono truncate">{p.city || 'NO_CITY'}</div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${p.role === 'admin' ? 'bg-mat-charcoal text-white' : p.role === 'woman' ? 'bg-mat-rose/10 text-mat-rose' : 'bg-mat-slate/5 text-mat-slate'}`}>
                                    {p.role}
                                 </Badge>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="space-y-1">
                                    <Badge 
                                      variant="secondary" 
                                      className={`text-[8px] font-black tracking-widest uppercase ${
                                        p.payment_status === 'APPROVED' ? 'bg-green-500/10 text-green-600' : 
                                        p.payment_status === 'PENDING' ? 'bg-mat-gold/10 text-mat-gold animate-pulse' : 
                                        p.payment_status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 
                                        'bg-mat-slate/5 text-mat-slate/40'
                                      }`}
                                    >
                                       {p.payment_status || 'NONE'}
                                    </Badge>
                                    {p.payment_utr && (
                                      <div className="text-[10px] font-mono text-mat-wine/60 font-bold select-all">{p.payment_utr}</div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-mat-wine font-semibold">{p.tokens || 0} AURA</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    {p.payment_status === 'PENDING' && (
                                      <>
                                         <button 
                                           onClick={() => handlePaymentApprove(p.user_id)} 
                                           className="px-3 py-1 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-sm"
                                         >
                                            Approve
                                         </button>
                                         <button 
                                           onClick={() => handlePaymentReject(p.user_id)} 
                                           className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                         >
                                            Reject
                                         </button>
                                      </>
                                    )}
                                    <button 
                                      onClick={() => setMessageTarget({ id: p.user_id, name: p.full_name })} 
                                      className="px-3 py-1 bg-mat-wine text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-mat-rose transition-all flex items-center gap-1 shadow-sm"
                                    >
                                       <MessageSquare className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} 
                                      className={`px-3 py-1 border rounded-lg text-xs transition-colors flex items-center ${p.is_verified ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-red-50' : 'bg-white border-mat-rose/20 hover:bg-mat-rose/10'}`}
                                    >
                                       <Shield className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => setItemToDelete(p.user_id)}
                                      className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                 </div>
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                     {!loading && profiles.length === 0 && (
                        <tr>
                           <td colSpan={5} className="text-center py-12 text-mat-slate/50">No profiles found matching constraints.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        </>
      ) : dashboardTab === 'COMMUNICATIONS' ? (
        <AdminCommunicationsHub />
      ) : (
        <AdminBlogModeration />
      )}
    </div>
  );
};
