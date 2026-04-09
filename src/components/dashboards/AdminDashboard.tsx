import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Verified, MessageSquare, Search, Trash2, ShieldAlert, BadgeCheck } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';


interface AdminDashboardProps {
  onOpenPictureManager?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenPictureManager }) => {
  const { user: currentUser } = useAuth();
  const [metrics, setMetrics] = useState({ totalMen: 0, totalWomen: 0, verifiedProfiles: 0, totalForumTopics: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<MatriarchProfile[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      loadData(searchQuery);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadData = async (query = '') => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);

    try {
      const [m, p] = await Promise.all([
        AdminService.getSystemMetrics(),
        AdminService.searchProfiles(query)
      ]);
      setMetrics(m as any);
      setProfiles(p);
    } catch (err) {
      console.warn("Metrics hydration failed:", err);
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

      {/* 📋 Master Roster */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-0 gap-4">
            <h2 className="text-2xl font-light text-mat-wine">Master <span className="italic text-mat-rose/50">Roster</span></h2>
            <div className="relative w-full md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mat-slate/40" />
               <Input 
                 placeholder="Search by name, city, or ID..." 
                 className="pl-12 bg-white/50 border-mat-rose/20 rounded-full h-12"
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         <div className="bg-white/50 backdrop-blur-xl border border-mat-rose/10 rounded-3xl overflow-hidden mx-4 md:mx-0">
            <div className="h-[60vh] w-full overflow-y-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-mat-rose/5 border-b border-mat-rose/10 sticky top-0 z-10 backdrop-blur-md">
                     <tr>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">Identity</th>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">Role</th>
                        <th className="px-6 py-4 text-xs tracking-widest text-mat-slate/60 font-bold uppercase">City</th>
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
                                     <div className="w-10 h-10 border border-mat-rose/20 rounded-full overflow-hidden flex items-center justify-center bg-mat-cream text-mat-wine font-bold">
                                        {p.photos?.[0] ? <img src={p.photos[0]} className="w-full h-full object-cover" /> : (p.full_name?.[0] || '?')}
                                     </div>
                                    {p.is_verified && (
                                       <BadgeCheck className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full border border-mat-rose/10" />
                                    )}
                                 </div>
                                 <div>
                                   <div className="font-semibold text-mat-wine">{p.full_name}</div>
                                   <div className="text-[10px] text-mat-slate/50 font-mono">{p.user_id}</div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${p.role === 'admin' ? 'bg-mat-charcoal text-white' : p.role === 'woman' ? 'bg-mat-rose/10 text-mat-rose' : 'bg-mat-slate/5 text-mat-slate'}`}>
                                    {p.role}
                                 </Badge>
                              </td>
                              <td className="px-6 py-4 text-mat-slate">{p.city || '—'}</td>
                              <td className="px-6 py-4 text-mat-wine font-semibold">{p.tokens || 0} AURA</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button onClick={() => handleVerifyToggle(p.user_id, !!p.is_verified)} className="px-3 py-1 bg-white border border-mat-rose/20 rounded-lg text-xs hover:bg-mat-rose/10 transition-colors flex items-center">
                                       <Shield className="w-3 h-3 mr-1" /> {p.is_verified ? 'Revoke' : 'Verify'}
                                    </button>
                                    <button onClick={() => handleRoleChange(p.user_id, 'admin')} className="px-3 py-1 bg-white border border-mat-rose/20 rounded-lg text-xs hover:bg-mat-rose/10 transition-colors flex items-center">
                                       <ShieldAlert className="w-3 h-3 mr-1" /> Admin
                                    </button>
                                    <button 
                                      onClick={() => setItemToDelete(p.user_id)}
                                      className="flex-1 py-1.5 px-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" /> Obliterate
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
      </div>
    </div>
  );
};
