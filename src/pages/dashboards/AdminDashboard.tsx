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
import { turso, tursoHelpers } from '@/lib/turso';
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
  const [filter, setFilter] = useState<'all' | 'man' | 'woman' | 'verified'>('all');
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await turso.execute("SELECT * FROM profiles ORDER BY created_at DESC");
      const profiles = result.rows.map(r => ({
        ...(r as any),
        photos: tursoHelpers.deserialize(r.photos as string) || [],
        hobbies: tursoHelpers.deserialize(r.hobbies as string) || [],
        is_verified: !!r.is_verified,
        is_active: !!r.is_active
      }));

      setUsers(profiles);
      const statsData: AdminStats = {
        totalUsers: profiles.length,
        totalMen: profiles.filter(p => p.role === 'man').length,
        totalWomen: profiles.filter(p => p.role === 'woman').length,
        verifiedUsers: profiles.filter(p => p.is_verified).length,
        totalTokens: profiles.reduce((acc, p) => acc + (p.tokens || 0), 0)
      };
      setStats(statsData);
    } catch (err) {
      console.error("MATRIARCH: Admin data fetch failed (Turso):", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    if (!window.confirm("ARE YOU CERTAIN? This record will be purged.")) return;
    try {
       await turso.execute("DELETE FROM profiles WHERE user_id = ?", [userId]);
       setUsers(users.filter(u => u.user_id !== userId));
       setActiveMenuUserId(null);
    } catch (err) {
       console.error("Purge failed (Turso):", err);
    }
  };

  const toggleVerification = async (userId: string, currentStatus: any) => {
    const targetStatus = !currentStatus;
    await updateUserProfile(userId, { is_verified: targetStatus });
  };

  const adjustTokens = async (userId: string, currentTokens: number, amount: number) => {
    await updateUserProfile(userId, { tokens: Math.max(0, currentTokens + amount) });
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
              <Badge variant="outline" className="px-4 py-1 uppercase tracking-[0.4em] font-bold text-[9px] border-mat-gold/20 text-mat-gold rounded-full">Nobility // Oversight</Badge>
              <h1 className="text-6xl lg:text-8xl mat-text-display-pro text-mat-wine leading-[0.9] italic">
                Matrix <br />
                <span className="text-mat-rose/20">Control.</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-px bg-mat-gold/10 border border-mat-gold/20 p-px w-full lg:w-auto rounded-3xl overflow-hidden shadow-mat-premium">
              <button 
                className="bg-mat-cream text-mat-wine px-12 py-8 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all h-full flex items-center gap-4"
                onClick={fetchData}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Synchronize
              </button>
              <button 
                className="bg-mat-wine text-mat-cream px-12 py-8 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-mat-wine-soft transition-all h-full flex items-center gap-4 shadow-mat-premium"
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

        {/* Soul matrix visualization */}
        <div className="space-y-12">
           <div className="flex flex-col lg:flex-row gap-12 justify-between items-start lg:items-end px-4">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-rose">Active Soul Matrix</h3>
                 <div className="flex bg-mat-rose/10 border border-mat-rose/10 p-px h-12 rounded-full overflow-hidden">
                   {(['all', 'man', 'woman', 'verified'] as const).map(f => (
                     <button
                       key={f}
                       onClick={() => setFilter(f)}
                       className={`px-8 h-full text-[9px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-mat-wine text-mat-cream' : 'bg-mat-cream text-mat-slate/40 hover:text-mat-wine hover:bg-mat-rose/5'}`}
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
                                     <img src={u.photos[0]} alt="" className="w-full h-full object-cover grayscale sepia-[0.2] hover:sepia-0 transition-all duration-700" />
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
                                    onClick={() => updateUserProfile(u.user_id, { is_active: !u.is_active })}
                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-mat-wine hover:text-mat-cream rounded-xl transition-all"
                                  >
                                     {u.is_active === false ? 'Restore access' : 'Sever access'}
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
