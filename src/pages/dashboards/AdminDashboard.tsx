import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Coins, 
  Activity, 
  Search, 
  MoreHorizontal, 
  ArrowUpRight,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { tursoHelpers } from '@/lib/turso';
import { AdminService } from '@/services/admin';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalMen: number;
  totalWomen: number;
  verifiedUsers: number;
  totalTokens: number;
}

interface AdminDashboardProps {
  handleLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ handleLogout }) => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMen: 0,
    totalWomen: 0,
    verifiedUsers: 0,
    totalTokens: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'man' | 'woman' | 'verified' | 'audits' | 'tithes'>('all');
  const [audits, setAudits] = useState<any[]>([]);
  const [tithes, setTithes] = useState<any[]>([]);
  const [census, setCensus] = useState<any[]>([]);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Scalable SQL Aggregations Layer
      const metrics = await AdminService.getSystemMetrics();
      setStats({
        totalUsers: metrics.totalMen + metrics.totalWomen,
        totalMen: metrics.totalMen,
        totalWomen: metrics.totalWomen,
        verifiedUsers: metrics.verifiedProfiles,
        totalTokens: metrics.totalTokens || 0
      });

      // 2. High-Capacity Paginated Profile Roster
      const profiles = await AdminService.searchProfiles({ limit: 200 });
      setUsers(profiles);

      const pendingAudits = await AdminService.getPendingAudits();
      setAudits(pendingAudits);

      const financialAudits = await AdminService.getFinancialAudits();
      setTithes(financialAudits);

      const cityCensusData = await AdminService.getCityCensus();
      setCensus(cityCensusData);
    } catch (err) {
      console.error("MATRIARCH: Admin data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveAudit = async (auditId: string, userId: string, approved: boolean) => {
    setLoading(true);
    await AdminService.resolveAudit(auditId, userId, approved);
    await fetchData();
  };

  const updateUserProfile = async (userId: string, updates: any) => {
    try {
      const sets = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      
      await turso.execute(
        `UPDATE profiles SET ${sets}, updated_at = ? WHERE user_id = ?`,
        [...(Object.values(updates) as any[]), new Date().toISOString(), userId]
      );
      
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, ...updates } : u));
      setActiveMenuUserId(null);
    } catch (err) {
      console.error("MATRIARCH: Profile update failed (Turso):", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("ARE YOU CERTAIN? This record will be permanently purged along with all associated messages and history.")) return;
    try {
       await AdminService.deleteUserRecord(userId);
       setUsers(users.filter(u => u.user_id !== userId));
       setActiveMenuUserId(null);
       fetchData(); // Sync metrics
    } catch (err) {
       console.error("Purge failed (Turso/AdminService):", err);
    }
  };

  const toggleVerification = async (userId: string, currentStatus: any) => {
    const targetStatus = !currentStatus;
    await updateUserProfile(userId, { is_verified: targetStatus });
    await import('@/services/sanctuary').then(m => m.SanctuaryService.recalculateGlobalRanks());
  };

  const adjustTokens = async (userId: string, currentTokens: number, amount: number) => {
    await updateUserProfile(userId, { tokens: Math.max(0, currentTokens + amount) });
    await import('@/services/sanctuary').then(m => m.SanctuaryService.recalculateGlobalRanks());
  };

  const handleCulling = async () => {
    if (!window.confirm("INITIATE CULLING? This permanently purges men inactive for over 30 days and reflows global ranks. This is absolute.")) return;
    try {
        setLoading(true);
        const res = await AdminService.executeGlobalCulling();
        window.alert(`Culling Complete\n\n${res.purged} stagnant souls evicted.\nAbsolute Rank Matrix reflowed.`);
        fetchData();
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

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (u.user_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'verified' && u.is_verified) || 
                         (u.role === filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen font-body" style={{background:'linear-gradient(160deg,#FAF7F2 0%,#F5E6E4 50%,#EEE0DA 100%)'}}>
      <main className="mat-container pt-24 space-y-24 pb-40">
        {/* Command Header */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-12 border-b border-mat-rose/20">
           <div className="space-y-6">
              <h1 className="sr-only">Admin Matrix Control: Resident Management & Oversight</h1>
              <Badge variant="outline" className="px-4 py-1 uppercase tracking-[0.4em] font-bold text-[9px] border-mat-gold/20 text-mat-gold rounded-full">Nobility // Oversight</Badge>
              <div className="text-6xl lg:text-8xl mat-text-display-pro text-mat-wine leading-[0.9] italic">
                Matrix <br />
                <span className="text-mat-rose/20">Control.</span>
              </div>
           </div>
           
           <div className="flex flex-wrap items-center gap-px bg-mat-gold/10 border border-mat-gold/20 p-px w-full lg:w-auto rounded-3xl overflow-hidden shadow-mat-premium">
              <button 
                className="bg-mat-cream text-mat-wine px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all flexitems-center gap-3"
                onClick={fetchData}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Synchronize
              </button>
              <button 
                className="bg-mat-cream text-mat-wine px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-mat-rose hover:text-white transition-all flex items-center gap-3"
                onClick={handleBroadcast}
              >
                Sovereign Broadcast
              </button>
              <button 
                className="bg-mat-cream text-mat-wine px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-mat-rose hover:text-white transition-all flex items-center gap-3"
                onClick={handleCulling}
              >
                <Activity size={14} />
                The Culling
              </button>
              <button 
                className="bg-mat-wine text-mat-cream px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-mat-wine-soft transition-all flex items-center gap-3 shadow-mat-premium"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Purge Session
              </button>
           </div>
        </section>

        {/* Stats Registry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-mat-rose/10 border border-mat-rose/10 rounded-[2.5rem] overflow-hidden shadow-mat-rose/5">
           {[
             { label: 'Souls Arch-Total', val: stats.totalUsers, icon: Users },
             { label: 'Truth Verified', val: stats.verifiedUsers, icon: ShieldCheck },
             { label: 'Token Flow Volume', val: stats.totalTokens.toLocaleString(), icon: Coins },
             { label: 'Symmetry Ratio', val: `${stats.totalMen}:${stats.totalWomen}`, icon: Activity },
           ].map((item, i) => (
             <div key={i} className="bg-mat-cream p-12 space-y-12 group hover:bg-mat-rose/5 transition-all">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-mat-rose/10 rounded-2xl">
                     <item.icon className="w-6 h-6 text-mat-wine" strokeWidth={1.5} />
                   </div>
                   <ArrowUpRight className="w-4 h-4 text-mat-rose/20 group-hover:text-mat-gold transition-colors" />
                </div>
                <div className="space-y-4">
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-slate/40 italic">{item.label}</span>
                   <h4 className="text-4xl font-bold text-mat-wine uppercase tracking-tight">{item.val}</h4>
                </div>
             </div>
           ))}
        </div>

        {/* Demographic Census */}
        {census.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {census.map(c => (
              <div key={c.city} className="flex-shrink-0 flex items-center gap-3 bg-mat-cream/80 backdrop-blur-md border border-mat-rose/10 px-6 py-3 rounded-full">
                <span className="text-[10px] font-bold uppercase tracking-widest text-mat-wine/60">{c.city}</span>
                <Badge variant="outline" className="text-[9px] font-black">{c.count}</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Soul matrix visualization */}
        <div className="space-y-12">
           <div className="flex flex-col lg:flex-row gap-12 justify-between items-start lg:items-end px-4">
              <div className="space-y-6 flex-1 overflow-x-auto">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-rose">Active Soul Matrix</h3>
                 <div className="flex bg-mat-rose/10 border border-mat-rose/10 p-px h-12 rounded-full overflow-x-auto">
                   {(['all', 'man', 'woman', 'verified', 'audits', 'tithes'] as const).map(f => (
                     <button
                       key={f}
                       onClick={() => setFilter(f)}
                       className={`px-8 h-full flex-shrink-0 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-mat-wine text-mat-cream rounded-full shadow-lg' : 'bg-transparent text-mat-slate/40 hover:text-mat-wine hover:bg-mat-cream/50 rounded-full'}`}
                     >
                       {f}
                     </button>
                   ))}
                 </div>
              </div>
              <div className="relative w-full lg:w-96">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-mat-rose/40" size={16} />
                 <input 
                   placeholder="ARCHIVE SEARCH..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full h-14 pl-16 pr-6 bg-mat-cream border border-mat-rose/20 text-[11px] uppercase font-bold tracking-widest focus:outline-none focus:border-mat-wine rounded-full shadow-sm text-mat-wine"
                 />
              </div>
           </div>

           <div className="border border-mat-rose/10 rounded-[3rem] overflow-hidden shadow-mat-rose/5 bg-mat-cream/80 backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-mat-rose/5 border-b border-mat-rose/10">
                     <tr>
                        <th className="px-12 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/60">Soul Identity</th>
                        <th className="px-12 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/60">Standing</th>
                        <th className="px-12 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/60">Verification</th>
                        <th className="px-12 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/60">Wealth</th>
                        <th className="px-12 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-mat-slate/60 text-right">Intervention</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-mat-rose/10">
                     {loading ? (
                       <tr>
                          <td colSpan={5} className="py-24 text-center">
                             <RefreshCw className="animate-spin text-mat-wine mx-auto mb-4" size={32} />
                             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-slate/40">Archiving Matrix...</p>
                          </td>
                       </tr>
                     ) : filter === 'audits' ? (
                       audits.length === 0 ? (
                         <tr><td colSpan={5} className="py-24 text-center opacity-40">Repository Pure. No pending audits.</td></tr>
                       ) : audits.map((a) => (
                         <tr key={a.id} className="hover:bg-mat-rose/[0.03] transition-colors">
                           <td className="px-12 py-8">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 bg-mat-rose/5 border border-mat-rose/10 overflow-hidden rounded-2xl">
                                    <img src={tursoHelpers.deserialize(a.profile_photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.user_id}`} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-mat-wine italic">{a.full_name}</p>
                                    <p className="text-[9px] font-black uppercase text-mat-slate/40">{a.action}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-12 py-8"><Badge variant="outline" className="text-[8px] tracking-widest uppercase">{a.status}</Badge></td>
                           <td className="px-12 py-8 text-[9px] font-mono text-mat-wine/40">{new Date(a.created_at).toLocaleString()}</td>
                           <td className="px-12 py-8">
                              <div className="flex gap-2">
                                 <button onClick={() => handleResolveAudit(a.id, a.user_id, true)} className="px-3 py-1.5 bg-mat-gold text-mat-wine text-[8px] font-black uppercase rounded-lg hover:bg-mat-gold/80">Seal Identity</button>
                                 <button onClick={() => handleResolveAudit(a.id, a.user_id, false)} className="px-3 py-1.5 bg-mat-rose/10 text-mat-rose text-[8px] font-black uppercase rounded-lg hover:bg-mat-rose/20">Reject</button>
                              </div>
                           </td>
                           <td className="px-12 py-8 text-right italic text-[10px] opacity-20">Audit Record</td>
                         </tr>
                       ))
                     ) : filter === 'tithes' ? (
                       tithes.length === 0 ? (
                         <tr><td colSpan={5} className="py-24 text-center opacity-40">No Financial Audits</td></tr>
                       ) : tithes.map((t) => (
                         <tr key={t.id} className="hover:bg-mat-rose/[0.03] transition-colors">
                           <td className="px-12 py-8">
                              <p className="text-sm font-bold text-mat-wine italic">{t.user_name || t.user_id.slice(0, 8)}</p>
                              <p className="text-[9px] font-black uppercase text-mat-slate/40">{t.action}</p>
                           </td>
                           <td className="px-12 py-8"><Badge variant="outline" className="text-[8px] tracking-widest uppercase">{t.status || 'LOGGED'}</Badge></td>
                           <td className="px-12 py-8 text-[9px] font-mono text-mat-wine/40">
                             {t.metadata ? (
                               <div className="max-w-[200px] truncate">{t.metadata}</div>
                             ) : 'No details'}
                           </td>
                           <td className="px-12 py-8 text-[9px] font-mono text-mat-wine/60">{new Date(t.created_at).toLocaleString()}</td>
                           <td className="px-12 py-8 text-right italic text-[10px] opacity-20">Tithe Ledger</td>
                         </tr>
                       ))
                     ) : filteredUsers.length === 0 ? (
                       <tr>
                          <td colSpan={5} className="py-24 text-center">
                             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-slate/40">Matrix Vacant.</p>
                          </td>
                       </tr>
                     ) : filteredUsers.map((u) => (
                       <tr key={u.user_id} className="hover:bg-mat-rose/[0.03] transition-colors">
                          <td className="px-12 py-8">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-mat-rose/5 border border-mat-rose/10 overflow-hidden rounded-2xl">
                                   {u.photos?.[0] ? (
                                     <img 
                                       src={u.photos[0]} 
                                       alt="" 
                                       referrerPolicy="no-referrer"
                                       className="w-full h-full object-cover grayscale sepia-[0.2] hover:sepia-0 transition-all duration-700" 
                                     />
                                   ) : (
                                     <div className="w-full h-full flex items-center justify-center text-mat-rose/20">
                                        <Users size={24} />
                                     </div>
                                   )}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-mat-wine uppercase tracking-tight italic">{u.full_name || 'ANONYMOUS'}</p>
                                   <p className="text-[9px] font-medium text-mat-slate/40 uppercase tracking-widest">{u.user_id.slice(0, 12)}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-12 py-8">
                             <Badge variant="outline" className={cn(
                               "px-4 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full italic",
                               u.role === 'man' ? "border-mat-wine/20 text-mat-wine bg-mat-wine/5" : "border-mat-rose/20 text-mat-rose bg-mat-rose/5"
                             )}>
                                {u.role || 'GHOST'}
                             </Badge>
                          </td>
                          <td className="px-12 py-8">
                             {u.is_verified ? (
                               <Badge className="bg-mat-gold text-mat-wine px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">SEALED</Badge>
                             ) : (
                               <Badge variant="outline" className="border-dashed border-mat-rose/30 text-mat-slate/20 px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full">VOID</Badge>
                             )}
                          </td>
                          <td className="px-12 py-8">
                             <span className="text-sm font-bold text-mat-wine tracking-tight">₹{u.tokens || 0}</span>
                          </td>
                          <td className="px-12 py-8 text-right relative">
                             <button 
                               onClick={() => setActiveMenuUserId(activeMenuUserId === u.user_id ? null : u.user_id)}
                               className="p-4 hover:bg-mat-wine hover:text-mat-cream rounded-xl transition-all text-mat-rose"
                             >
                               <MoreHorizontal size={20} />
                             </button>

                             {activeMenuUserId === u.user_id && (
                               <div className="absolute right-12 top-full z-[100] w-64 bg-mat-cream border border-mat-rose/20 shadow-mat-premium p-2 space-y-px rounded-2xl">
                                  <div className="px-4 py-2 border-b border-mat-rose/10 mb-2">
                                     <p className="text-[9px] font-bold text-mat-slate/40 uppercase tracking-[0.4em]">Protocols</p>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const msg = window.prompt(`Send direct message to ${u.full_name}:`);
                                      if(msg) AdminService.sendDirectAdminMessage(u.user_id, msg);
                                    }}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-mat-wine hover:text-mat-cream rounded-xl transition-all"
                                  >
                                     Send message
                                  </button>
                                  <button 
                                    onClick={() => toggleVerification(u.user_id, u.is_verified)}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-mat-wine hover:text-mat-cream rounded-xl transition-all"
                                  >
                                     {u.is_verified ? 'Revoke truth' : 'Seal truth'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                       const amt = window.prompt("Wealth Delta:", "1000");
                                       if (amt) adjustTokens(u.user_id, u.tokens || 0, parseInt(amt));
                                    }}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-mat-wine hover:text-mat-cream rounded-xl transition-all"
                                  >
                                     Modify wealth
                                  </button>
                                  <button 
                                    onClick={() => updateUserProfile(u.user_id, { onboarding_status: 'PENDING' })}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-mat-wine hover:text-mat-cream rounded-xl transition-all"
                                  >
                                     Reset evolution
                                  </button>
                                  <div className="h-px bg-mat-rose/10 my-2" />
                                  <button 
                                    onClick={() => handleDeleteUser(u.user_id)}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                  >
                                     Matrix purge
                                  </button>
                               </div>
                             )}
                          </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Romantic Footer */}
        <div className="py-40 text-center border-t border-mat-rose/10">
          <p className="text-[11px] font-bold uppercase tracking-[1.5em] text-mat-wine/20">
            MATRIARCH // NOBLE OVERSIGHT // SECURED
          </p>
        </div>
      </main>
    </div>
  );
};
