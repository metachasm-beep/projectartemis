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
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

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
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (profiles) {
        setUsers(profiles);
        const statsData: AdminStats = {
          totalUsers: profiles.length,
          totalMen: profiles.filter(p => p.role === 'man').length,
          totalWomen: profiles.filter(p => p.role === 'woman').length,
          verifiedUsers: profiles.filter(p => p.is_verified).length,
          totalTokens: profiles.reduce((acc, p) => acc + (p.tokens || 0), 0)
        };
        setStats(statsData);
      }
    } catch (err) {
      console.error("MATRIARCH: Admin data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateUserProfile = async (userId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);
      
      if (!error) {
        setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, ...updates } : u));
        setActiveMenuUserId(null);
      } else {
         throw error;
      }
    } catch (err) {
      console.error("MATRIARCH: Profile update failed:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("ARE YOU CERTAIN? This record will be purged.")) return;
    try {
       const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
       if (!error) {
         setUsers(users.filter(u => u.user_id !== userId));
         setActiveMenuUserId(null);
       }
    } catch (err) {
       console.error("Purge failed:", err);
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
    <div className="min-h-screen bg-white">
      <main className="mat-container pt-24 space-y-24">
        {/* Command Header */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-12 border-b border-black/10">
           <div className="space-y-6">
              <Badge variant="outline" className="px-4 py-1 uppercase tracking-[0.4em] font-black text-[9px] border-black/10 rounded-none">Protocol // Oversight</Badge>
              <h1 className="text-6xl lg:text-8xl mat-text-display-pro text-black leading-[0.9] uppercase tracking-tighter">
                Matrix <br />
                <span className="text-black/20">Control.</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-px bg-black/5 border border-black/5 p-px w-full lg:w-auto">
              <button 
                className="bg-white text-black px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-neutral-50 transition-all h-full border border-black/5 flex items-center gap-4"
                onClick={fetchData}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Synchronize
              </button>
              <button 
                className="bg-black text-white px-12 py-8 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-neutral-800 transition-all h-full flex items-center gap-4"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Purge Session
              </button>
           </div>
        </section>

        {/* Stats Registry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 border border-black/5">
           {[
             { label: 'Souls Arch-Total', val: stats.totalUsers, icon: Users },
             { label: 'Truth Verified', val: stats.verifiedUsers, icon: ShieldCheck },
             { label: 'Token Flow Volume', val: stats.totalTokens.toLocaleString(), icon: Coins },
             { label: 'Symmetry Ratio', val: `${stats.totalMen}:${stats.totalWomen}`, icon: Activity },
           ].map((item, i) => (
             <div key={i} className="bg-white p-12 space-y-12 group hover:bg-black/5 transition-all">
                <div className="flex justify-between items-start">
                   <item.icon className="w-6 h-6 text-black" strokeWidth={1} />
                   <ArrowUpRight className="w-4 h-4 text-black/10 group-hover:text-black transition-colors" />
                </div>
                <div className="space-y-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">{item.label}</span>
                   <h4 className="text-4xl font-bold text-black uppercase tracking-tight">{item.val}</h4>
                </div>
             </div>
           ))}
        </div>

        {/* Soul matrix visualization */}
        <div className="space-y-12">
           <div className="flex flex-col lg:flex-row gap-12 justify-between items-start lg:items-end">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Active Soul Matrix</h3>
                 <div className="flex bg-black/5 border border-black/5 p-px h-12">
                   {(['all', 'man', 'woman', 'verified'] as const).map(f => (
                     <button
                       key={f}
                       onClick={() => setFilter(f)}
                       className={`px-8 h-full text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-black text-white' : 'bg-white text-black/40 hover:text-black'}`}
                     >
                       {f}
                     </button>
                   ))}
                 </div>
              </div>
              <div className="relative w-full lg:w-96">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                 <input 
                   placeholder="ARCHIVE SEARCH..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full h-16 pl-16 pr-6 bg-white border border-black/10 text-[11px] uppercase font-black tracking-widest focus:outline-none focus:border-black"
                 />
              </div>
           </div>

           <div className="border border-black/5 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/5">
                   <tr>
                      <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Soul Identity</th>
                      <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Standing</th>
                      <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Verification</th>
                      <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Wealth</th>
                      <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-black/40 text-right">Intervention</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                   {loading ? (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <RefreshCw className="animate-spin text-black mx-auto mb-4" size={32} />
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Archiving Matrix...</p>
                        </td>
                     </tr>
                   ) : filteredUsers.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Matrix Vacant.</p>
                        </td>
                     </tr>
                   ) : filteredUsers.map((u) => (
                     <tr key={u.user_id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="px-12 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-black/5 border border-black/5 overflow-hidden">
                                 {u.photos?.[0] ? (
                                   <img src={u.photos[0]} alt="" className="w-full h-full object-cover grayscale" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-black/10">
                                      <Users size={24} />
                                   </div>
                                 )}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-black uppercase tracking-tighter">{u.full_name || 'ANONYMOUS'}</p>
                                 <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">{u.user_id.slice(0, 12)}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-8">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                              {u.role || 'GHOST'}
                           </span>
                        </td>
                        <td className="px-12 py-8">
                           {u.is_verified ? (
                             <Badge variant="outline" className="border-black/20 text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none">SEALED</Badge>
                           ) : (
                             <Badge variant="outline" className="border-dashed border-black/20 text-black/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none">VOID</Badge>
                           )}
                        </td>
                        <td className="px-12 py-8">
                           <span className="text-sm font-black text-black tracking-tight">₹{u.tokens || 0}</span>
                        </td>
                        <td className="px-12 py-8 text-right relative">
                           <button 
                             onClick={() => setActiveMenuUserId(activeMenuUserId === u.user_id ? null : u.user_id)}
                             className="p-4 hover:bg-black hover:text-white transition-all text-black/40"
                           >
                             <MoreHorizontal size={20} />
                           </button>

                           {activeMenuUserId === u.user_id && (
                             <div className="absolute right-12 top-full z-[100] w-64 bg-white border border-black shadow-[0_30px_60px_rgba(0,0,0,0.2)] p-2 space-y-px">
                                <div className="px-4 py-2 border-b border-black/5 mb-2">
                                   <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.4em]">Protocols</p>
                                </div>
                                <button 
                                  onClick={() => updateUserProfile(u.user_id, { is_active: !u.is_active })}
                                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                   {u.is_active === false ? 'Restore access' : 'Sever access'}
                                </button>
                                <button 
                                  onClick={() => toggleVerification(u.user_id, u.is_verified)}
                                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                   {u.is_verified ? 'Revoke truth' : 'Seal truth'}
                                </button>
                                <button 
                                  onClick={() => {
                                     const amt = window.prompt("Wealth Delta:", "1000");
                                     if (amt) adjustTokens(u.user_id, u.tokens || 0, parseInt(amt));
                                  }}
                                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                   Modify wealth
                                </button>
                                <button 
                                  onClick={() => updateUserProfile(u.user_id, { onboarding_status: 'PENDING' })}
                                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                   Reset evolution
                                </button>
                                <div className="h-px bg-black/5 my-2" />
                                <button 
                                  onClick={() => handleDeleteUser(u.user_id)}
                                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
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

        {/* Swiss Footer */}
        <div className="py-40 text-center border-t border-black/5">
          <p className="text-[11px] font-black uppercase tracking-[1.5em] text-black/10">
            MATRIARCH // SUPREME OVERSIGHT // SECURED
          </p>
        </div>
      </main>
    </div>
  );
};
