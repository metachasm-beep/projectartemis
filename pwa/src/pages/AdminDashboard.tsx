import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  RefreshCcw, 
  Crown,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || user.email !== 'metachasm@gmail.com') {
                window.location.href = '/dashboard';
                return;
            }
            setUser(user);
            setAuthorized(true);
            fetchData();
        };
        checkAuth();
    }, []);

    const fetchData = async (searchTerm = '') => {
        setLoading(true);
        try {
            const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/stats`, {
                headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
            });
            const statsData = await statsRes.json();
            setStats(statsData);

            const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users?search=${searchTerm}`, {
                headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
            });
            const usersData = await usersRes.json();
            setUsers(usersData);
        } catch (err) {
            console.error("Admin fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId: string, updates: any) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify(updates)
            });
            fetchData(search);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-matriarch-bg p-8 pt-24 space-y-12 pb-32">
            <header className="flex justify-between items-end mb-12">
                <div className="space-y-2">
                    <Badge variant="gold" className="px-3 py-1">ADMINISTRATIVE COMMAND</Badge>
                    <h1 className="text-5xl font-display font-black text-white italic tracking-tighter uppercase">Protocol Oversight</h1>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest mb-1">System Operator</div>
                    <div className="text-sm font-bold text-matriarch-gold">{user?.email}</div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'TOTAL CORE', val: stats?.total_users || 0, icon: Users, color: 'text-white' },
                    { label: 'MATRIARCHS', val: stats?.matriarchs || 0, icon: Crown, color: 'text-matriarch-violetBright' },
                    { label: 'PETITIONERS', val: stats?.petitioners || 0, icon: ShieldCheck, color: 'text-mat-gold' },
                    { label: 'VERIFIED', val: stats?.verified_users || 0, icon: Activity, color: 'text-emerald-500' }
                ].map((s, i) => (
                    <Card key={i} className="mat-panel mat-glass-premium border-none bg-white/[0.02]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black tracking-widest text-matriarch-textFaint uppercase">{s.label}</CardTitle>
                            <s.icon className={`w-4 h-4 ${s.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-display font-black text-white">{s.val}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* User Management Table */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <Input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchData(search)}
                            placeholder="SEARCH BY EMAIL, PHONE, OR NAME..." 
                            className="h-12 pl-12 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-white/10 uppercase font-mono text-xs tracking-widest"
                        />
                    </div>
                    <Button variant="secondary" onClick={() => fetchData(search)} className="gap-2 shrink-0">
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Data
                    </Button>
                </div>

                <div className="mat-panel-premium rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5">
                                {['Designation', 'Access', 'Security', 'Actions'].map(h => (
                                    <th key={h} className="p-6 text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-matriarch-gold">
                                                {u.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase tracking-tight">{u.full_name}</div>
                                                <div className="text-[10px] text-matriarch-textSoft font-mono tracking-tighter opacity-60">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <Badge variant={u.role === 'woman' ? 'violet' : 'outline'} className="uppercase text-[9px] font-black px-2">
                                            {u.role === 'woman' ? 'MATRIARCH' : 'PETITIONER'}
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2">
                                            {u.is_verified && <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] uppercase">VERIFIED</Badge>}
                                            {u.is_banned && <Badge className="bg-red-500/20 text-red-500 border-none text-[8px] uppercase">BANNED</Badge>}
                                            {u.is_shadowbanned && <Badge className="bg-orange-500/20 text-orange-500 border-none text-[8px] uppercase">SHADOW</Badge>}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleUpdateStatus(u.id, { is_verified: !u.is_verified })}
                                                className="h-8 text-[8px] font-black tracking-widest border-white/10 hover:bg-emerald-500/10"
                                            >
                                                {u.is_verified ? 'REVOKE' : 'VERIFY'}
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleUpdateStatus(u.id, { is_banned: !u.is_banned })}
                                                className="h-8 text-[8px] font-black tracking-widest border-white/10 hover:bg-red-500/10"
                                            >
                                                {u.is_banned ? 'UNBAN' : 'BAN'}
                                            </Button>
                                            {u.role === 'man' && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleUpdateStatus(u.id, { is_shadowbanned: !u.is_shadowbanned })}
                                                    className="h-8 text-[8px] font-black tracking-widest border-white/10 hover:bg-orange-500/10"
                                                >
                                                    {u.is_shadowbanned ? 'VISIBILITY ON' : 'SHADOWBAN'}
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
