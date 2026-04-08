import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ShieldCheck, Search, Filter } from 'lucide-react';
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import CircularGallery from '@/components/animations/CircularGallery';
import { turso } from '@/lib/turso';

interface MenDiscoveryProps {
  onClose: () => void;
}

interface GalleryItem {
  image: string;
  text: string;
}

const MenDiscovery: React.FC<MenDiscoveryProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchAspirants = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch men ordered by their exclusive absolute rank
      const result = await turso.execute(`
        SELECT full_name, date_of_birth, city, photos, absolute_rank
        FROM profiles 
        WHERE role = 'woman'
        ORDER BY created_at DESC
        LIMIT 200
      `, []);

      const mapped = result.rows.map((r: any) => {
        const photos = JSON.parse(r.photos || '[]');
        const dob = new Date(r.date_of_birth);
        const age = isNaN(dob.getTime()) ? 25 : new Date().getFullYear() - dob.getFullYear();
        const name = r.full_name?.split(' ')[0] || 'Aspirant';
        const rankPrefix = r.absolute_rank ? `#${r.absolute_rank} | ` : '';
        
        return {
          image: photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.full_name}`,
          text: `${rankPrefix}${name}, ${age} | ${r.city || 'Skyline'}`,
          name: name,
          city: r.city || ''
        };
      });

      setItems(mapped);
    } catch (err) {
      console.error("Aspirant directory sync failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAspirants();
  }, [fetchAspirants]);

  // Filter items based on search
  const filteredItems = items.filter(item => {
    const raw = (item as any);
    return raw.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           raw.city.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[100] bg-mat-obsidian overflow-hidden flex flex-col animate-in fade-in duration-700">
      
      {/* Sovereign Header - Dark Themed for 3D Experience */}
      <header className="absolute top-0 left-0 w-full z-[110] px-8 py-10 flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-mat-obsidian to-transparent pointer-events-none">
        <div className="flex items-center gap-6 mb-4 md:mb-0 pointer-events-auto">
          <Button 
            onPress={onClose} 
            variant="ghost" 
            isIconOnly
            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 p-0 flex items-center justify-center h-14 w-14"
          >
            <ArrowLeft size={24} className="text-white" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight">The Sanctuary Array</h2>
            <div className="flex items-center gap-2 mt-1">
               <ShieldCheck size={12} className="text-mat-gold" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Sovereign Discovery Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto pointer-events-auto">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 z-10" />
            <Input 
              placeholder="Search by name or city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/10 border-white/10 rounded-full h-14 text-white focus:bg-white/20 transition-all placeholder:text-white/20"
            />
          </div>
          <Button isIconOnly className="bg-mat-wine text-mat-cream rounded-full w-14 h-14 p-0 flex items-center justify-center border-none shadow-xl min-w-0">
            <Filter size={18} />
          </Button>
        </div>
      </header>

      {/* The 3D Infinite Stream (WebGL Gallery) */}
      <main className="absolute inset-0 z-0">
        {!loading && (
          <CircularGallery 
            items={filteredItems}
            bend={0}
            borderRadius={0.23}
            scrollSpeed={0.2}
            scrollEase={0.11}
          />
        )}
        
        {loading && (
           <div className="flex items-center justify-center h-full">
              <div className="space-y-4 text-center">
                 <div className="w-16 h-16 border-4 border-mat-gold/20 border-t-mat-gold rounded-full animate-spin mx-auto" />
                 <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-mat-gold animate-pulse">Syncing Array...</p>
              </div>
           </div>
        )}
        
        {/* Interaction Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[110] pointer-events-none">
           <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30 animate-pulse">Drag to Navigate</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
           </div>
        </div>
      </main>

      {/* Subtle Mystical Overlays */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-mat-obsidian to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-mat-obsidian to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default MenDiscovery;
