import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Trash2, 
  Layers, 
  Grid, 
  RotateCcw, 
  Search,
  AlertTriangle,
  ChevronLeft,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminService } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';
import type { MatriarchProfile } from '@/types';

interface PictureManagerProps {
    onBack?: () => void;
}

const PictureManager: React.FC<PictureManagerProps> = ({ onBack }) => {
    const { user: currentUser } = useAuth();
    const [profiles, setProfiles] = useState<MatriarchProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'dedupe'>('grid');
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [stats, setStats] = useState({ total: 0, duplicates: 0 });

    const fetchData = async () => {
        setLoading(true);
        console.log("PICTURE_MANAGER: Attempting sync...");
        try {
            const data = await AdminService.getAllCurationProfiles();
            console.log("PICTURE_MANAGER: Received profiles:", data.length);
            setProfiles(data);
            
            // Calculate duplicates
            const photoCounts: Record<string, number> = {};
            data.forEach((p) => {
                const url = p.photos?.[0];
                if (url) photoCounts[url] = (photoCounts[url] || 0) + 1;
            });
            const dupeCount = Object.values(photoCounts).filter(c => c > 1).length;
            setStats({ total: data.length, duplicates: dupeCount });
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 🍷 Nuclear-safe delay to ensure auth state and db locks are cleared
        const t = setTimeout(() => {
            fetchData();
        }, 1200);
        return () => clearTimeout(t);
    }, []);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        
        // 🛡️ ANTI-GENOCIDE PROTOCOL: Prevent the Admin from accidentally purging their own existence.
        if (currentUser?.id === itemToDelete) {
            alert("EVICTION ABORTED: You cannot excise your own identity from the registry while active. Command discarded.");
            setItemToDelete(null);
            return;
        }

        try {
            console.log(`PICTURE_MANAGER: Initializing absolute excision for identity: ${itemToDelete}`);
            const success = await AdminService.deleteUserRecord(itemToDelete);
            if (success) {
                console.log("PICTURE_MANAGER: Identity successfully excised from registry.");
                setProfiles(prev => prev.filter(p => p.user_id !== itemToDelete));
                // Update stats locally
                setStats(prev => ({ ...prev, total: prev.total - 1 }));
            } else {
                console.error("PICTURE_MANAGER: Turso rejected the purge request.");
                alert("EVICTION FAILED: The Sanctuary remains occupied. Turso rejected the purge.");
            }
        } catch (err) {
            console.error("PICTURE_MANAGER_EVICT_CRITICAL_ERROR:", err);
            alert("SYSTEM ERROR: A critical failure occurred during identity isolation. Check console for vault logs.");
        } finally {
            setItemToDelete(null);
        }
    };

    const handleBulkDedupe = async () => {
        if (!window.confirm("COLLECTIVE PURGE: Nuke all visual clones while preserving original identities?")) return;
        
        try {
            setLoading(true);
            const result = await AdminService.performBulkDedupe();
            alert(`Purge Complete: ${result.deletedCount} redundant identities evicted.`);
            fetchData();
        } catch (err) {
            console.error("Bulk dedupe failed", err);
        } finally {
            setLoading(false);
        }
    };

    const groupedProfiles = profiles.reduce((acc, p) => {
        const url = (p.photos && p.photos[0]) || 'none';
        if (!acc[url]) acc[url] = [];
        acc[url].push(p);
        return acc;
    }, {} as Record<string, MatriarchProfile[]>);

    const filteredProfiles = profiles.filter(p => 
        p && (
            p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.role?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen bg-matriarch-bg p-8 pt-24 space-y-12 pb-32">
            {/* 🛡️ PORTAL-MANAGED CONFIRMATION */}
            {itemToDelete && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-matriarch-bg/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="mat-glass-premium p-10 rounded-[3rem] max-w-md w-full border-2 border-matriarch-gold/20 shadow-[0_0_100px_rgba(191,160,106,0.1)] text-center animate-in zoom-in-95 duration-300 bg-matriarch-bg/95">
                        <AlertTriangle className="w-16 h-16 text-matriarch-gold mx-auto mb-6" />
                        <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-4">Obliterate Identity?</h2>
                        <p className="text-white/60 mb-10 text-xs font-medium leading-relaxed tracking-wide">
                            THIS ACTION IS ABSOLUTE. YOU ARE ABOUT TO EXCISE THIS IDENTITY FROM THE SANCTUARY REGISTRY PERMANENTLY.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-4 px-6 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all font-sans"
                            >
                                Retreat
                            </button>
                            <button 
                                type="button"
                                onClick={confirmDelete}
                                className="flex-1 py-4 px-6 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-red-600 text-white hover:bg-red-500 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] font-sans"
                            >
                                Obliterate
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <header className="flex justify-between items-end mb-12">
                <div className="space-y-2">
                    <button 
                        onClick={() => onBack?.()}
                        className="flex items-center gap-2 text-[10px] font-black tracking-widest text-matriarch-gold hover:text-white transition-colors uppercase mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Oversight
                    </button>
                    <Badge variant="gold" className="px-3 py-1">VISUAL CURATION</Badge>
                    <h1 className="text-5xl font-display font-black text-white italic tracking-tighter uppercase">Picture Manager</h1>
                </div>

                <div className="flex gap-4">
                    <Button 
                        variant="secondary" 
                        onClick={handleBulkDedupe}
                        disabled={stats.duplicates === 0}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
                    >
                        <Layers className="w-4 h-4 mr-2" /> Bulk Purge Clones
                    </Button>
                    <Button variant="outline" onClick={fetchData} className="gap-2 border-white/5">
                        <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="mat-panel mat-glass-premium p-6">
                    <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest mb-1">TOTAL IDENTITIES</div>
                    <div className="text-4xl font-display font-black text-white">{stats.total}</div>
                </div>
                <div className="mat-panel mat-glass-premium p-6">
                    <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest mb-1">REDUNDANT SETS</div>
                    <div className="text-4xl font-display font-black text-mat-gold">{stats.duplicates}</div>
                </div>
                <div className="mat-panel mat-glass-premium p-6 flex flex-col justify-between">
                    <div className="text-[10px] font-black text-matriarch-textFaint uppercase tracking-widest mb-1">REGISTRY STATUS</div>
                    {stats.duplicates === 0 ? (
                        <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase text-xs">
                            <Check className="w-4 h-4" /> Sanctuary is Pure
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs">
                            <AlertTriangle className="w-4 h-4" /> Integrity Breach Found
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 mb-8">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-matriarch-gold text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        <Grid className="w-3 h-3" /> Grid View
                    </button>
                    <button 
                        onClick={() => setViewMode('dedupe')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all ${viewMode === 'dedupe' ? 'bg-matriarch-gold text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        <Layers className="w-3 h-3" /> Dedupe View
                    </button>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                    <Input 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="SEARCH IDENTITIES..."
                        className="h-10 pl-10 text-[10px] bg-white/5 border-white/10"
                    />
                </div>
            </div>

            <div className="space-y-12">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filteredProfiles.map(p => (
                            <div key={p.user_id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-matriarch-gold/50 transition-all">
                                <img src={p.photos?.[0]} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <div className="text-[10px] font-black text-matriarch-gold uppercase tracking-tighter truncate">{p.full_name}</div>
                                    <div className="text-[8px] text-white/60 mb-2 uppercase">{p.role === 'woman' ? 'MATRIARCH' : 'SEEKER'}</div>
                                    <button 
                                        onClick={() => setItemToDelete(p.user_id)}
                                        className="w-full py-2 bg-red-500 text-white rounded-lg text-[8px] font-black tracking-widest uppercase flex items-center justify-center gap-1 hover:bg-red-400"
                                    >
                                        <Trash2 className="w-3 h-3" /> Evict
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedProfiles).filter(([_, items]) => items.length > 1).map(([url, items]) => (
                            <div key={url} className="mat-panel-premium p-8 space-y-6 bg-red-500/[0.02] border-red-500/10">
                                <div className="flex gap-8 items-start">
                                    <div className="w-48 aspect-square rounded-[2.5rem] overflow-hidden border-2 border-matriarch-gold/30">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Badge variant="destructive" className="animate-pulse px-3 py-1">VISUAL COLLISION DETECTED</Badge>
                                            <div className="text-[10px] font-mono text-white/20 break-all w-72">{url}</div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {items.map((it, idx) => (
                                                <div key={it.user_id} className={`p-4 rounded-2xl border transition-all ${idx === (items.length - 1) ? 'bg-white/[0.05] border-matriarch-gold/50' : 'bg-black/40 border-white/5 opacity-60'}`}>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="text-sm font-bold text-white uppercase">{it.full_name}</div>
                                                            <div className="text-[9px] text-matriarch-gold font-black tracking-widest uppercase">{it.role}</div>
                                                            <div className="text-[8px] text-white/20 font-mono mt-1">EST. {new Date(it.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                        {idx !== (items.length - 1) && (
                                                            <button 
                                                                onClick={() => setItemToDelete(it.user_id)}
                                                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                                title="Evict clone"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {idx === (items.length - 1) && (
                                                            <div className="text-[10px] font-black text-matriarch-gold uppercase tracking-widest flex items-center gap-1">
                                                                <Check className="w-4 h-4" /> Original
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PictureManager;
