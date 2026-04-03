import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  Coins, 
  Activity, 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserMinus,
  ArrowUpRight,
  RefreshCw,
  Crown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminStats {
  totalUsers: number;
  totalMen: number;
  totalWomen: number;
  verifiedUsers: number;
  totalTokens: number;
}

export const AdminDashboard: React.FC = () => {
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

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('user_id', userId);
      
      if (!error) {
        setUsers(users.map(u => u.user_id === userId ? { ...u, is_verified: !currentStatus } : u));
      }
    } catch (err) {
      console.error("Toggle verification failed:", err);
    }
  };

  const adjustTokens = async (userId: string, currentTokens: number, amount: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: Math.max(0, currentTokens + amount) })
        .eq('user_id', userId);
      
      if (!error) {
        setUsers(users.map(u => u.user_id === userId ? { ...u, tokens: Math.max(0, currentTokens + amount) } : u));
      }
    } catch (err) {
      console.error("Token adjustment failed:", err);
    }
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
    <div className="min-h-screen p-8 pt-24 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-white italic tracking-tight uppercase mb-2 flex items-center gap-4">
            Command Center <Activity className="text-mat-gold animate-pulse" />
          </h1>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.6em]">System Oversight & Divine Intervention</p>
        </div>
        <Button 
          onClick={fetchData} 
          disabled={loading}
          className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl flex gap-3 items-center backdrop-blur-xl"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">Refresh Pulse</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Souls', value: stats.totalUsers, icon: Users, color: 'text-white' },
          { label: 'Verified Truth', value: stats.verifiedUsers, icon: ShieldCheck, color: 'text-green-400' },
          { label: 'Token Flow', value: stats.totalTokens.toLocaleString(), icon: Coins, color: 'text-mat-gold' },
          { label: 'Sanctuary Balance', value: `${stats.totalMen}:${stats.totalWomen}`, icon: Activity, color: 'text-matriarch-violet' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mat-panel-premium p-8 rounded-[2rem] border border-white/5 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-white/20" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-mono font-black text-white italic">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Soul Matrix (User List) */}
      <div className="mat-panel-premium rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center">
           <h3 className="text-xl font-display font-black text-white italic uppercase tracking-widest">Soul Matrix</h3>
           <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
               <Input 
                 placeholder="SEARCH BY NAME OR ID" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-[10px] uppercase font-black"
               />
             </div>
             <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
               {(['all', 'man', 'woman', 'verified'] as const).map(f => (
                 <button
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                 >
                   {f}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Tokens</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                   <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-mat-gold" size={32} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Reading the database...</span>
                      </div>
                   </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-20 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No souls found matching your query.</p>
                   </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.user_id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden border border-white/10">
                        {u.photos?.[0] ? (
                          <img src={u.photos[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <Users size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tighter">{u.full_name || 'PENDING'}</p>
                        <p className="text-[9px] font-mono text-white/20">{u.user_id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      u.role === 'man' ? 'bg-mat-gold/10 text-mat-gold' : 
                      u.role === 'woman' ? 'bg-matriarch-violet/10 text-matriarch-violet' :
                      'bg-white/10 text-white'
                    }`}>
                      {u.role || 'GHOST'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {u.is_verified ? (
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                            <ShieldCheck size={10} /> Verified
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                            <Activity size={10} /> Pending
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-mono font-bold text-mat-gold">{u.tokens || 0}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => toggleVerification(u.user_id, u.is_verified)}
                         title={u.is_verified ? "Revoke Verification" : "Grant Verification"}
                         className="h-10 w-10 p-0 hover:bg-white/5 rounded-xl text-white/40 hover:text-white"
                       >
                         {u.is_verified ? <UserMinus size={18} /> : <UserCheck size={18} />}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => adjustTokens(u.user_id, u.tokens || 0, 1000)}
                         title="Grant 1000 Tokens"
                         className="h-10 w-10 p-0 hover:bg-white/5 rounded-xl text-mat-gold/40 hover:text-mat-gold"
                       >
                         <Coins size={18} />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm"
                         className="h-10 w-10 p-0 hover:bg-white/5 rounded-xl text-white/20 hover:text-white"
                       >
                         <MoreHorizontal size={18} />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex justify-center flex-col items-center gap-4 opacity-20">
         <Crown className="text-mat-gold" size={32} />
         <p className="text-[10px] font-black uppercase tracking-[1em] text-white">Matriarch Command</p>
      </div>
    </div>
  );
};
