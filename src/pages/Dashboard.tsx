import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from "@/lib/supabase";
import { turso, tursoHelpers } from '@/lib/turso';
import type { MatriarchProfile } from '../App';
import { MenDashboard } from './dashboards/MenDashboard';
import { WomenDashboard } from './dashboards/WomenDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);

  useEffect(() => {
    const watchdog = setTimeout(() => {
      if (loading) {
        console.warn("MATRIARCH_DASHBOARD: Synchronization timeout. Forcing UI entry.");
        setLoading(false);
      }
    }, 10000);

    const fetchData = async () => {
      console.log("MATRIARCH_API: Connecting to sanctuary at", import.meta.env.VITE_API_URL || 'RELATIVE_PATH');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn("MATRIARCH_DASHBOARD: No user found. Redirecting to landing.");
          setLoading(false);
          return;
        }

        const result = await turso.execute(
          "SELECT * FROM profiles WHERE user_id = ?",
          [user.id]
        );
        
        const rawProfile = result.rows[0];
        let profileData: MatriarchProfile | null = null;

        if (rawProfile) {
          profileData = {
            ...(rawProfile as any),
            photos: tursoHelpers.deserialize(rawProfile.photos as string) || [],
            hobbies: tursoHelpers.deserialize(rawProfile.hobbies as string) || [],
            is_verified: !!rawProfile.is_verified,
            is_active: !!rawProfile.is_active
          };
        }
        
        let finalProfile = profileData;
        
        const ADMIN_EMAILS = ['metachasm@gmail.com', 'testeradmin@gmail.com'];
        if (user.email && ADMIN_EMAILS.includes(user.email)) {
          finalProfile = {
            ...profileData,
            user_id: user.id,
            full_name: user.user_metadata?.full_name || 'System Architect',
            role: 'admin',
            onboarding_status: 'COMPLETED'
          };
        }

        setProfile(finalProfile);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`, {
            signal: controller.signal
          });
          const data = await response.json();
          if (data) {
            setStatus(data);
          }
        } catch (fetchErr) {
          console.warn("MATRIARCH_API: Failed to fetch rank status (possibly offline or timeout). Continuing with profile data only.", fetchErr);
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("MATRIARCH_DASHBOARD: Critical fetch failure", err);
      } finally {
        setLoading(false);
        clearTimeout(watchdog);
      }
    };
    fetchData();
    
    return () => clearTimeout(watchdog);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleBoost = async () => {
    if (!status || status.points < 100) {
      alert("Insufficient points for a boost. Refer others to earn more.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/boost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, points_to_spend: 100 }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        const statusRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`);
        const statusData = await statusRes.json();
        setStatus(statusData);
        alert("Visibility boost active! Presence elevated.");
      } else {
        alert(data.detail || "Boost failed.");
      }
    } catch (err) {
      console.error("Boost failed", err);
      alert("System error during presence boost.");
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-12">
      <motion.div 
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="p-1 rounded-full bg-gradient-to-tr from-mat-rose/30 to-mat-gold/30 shadow-mat-rose"
      >
        <div className="bg-mat-ivory rounded-full p-10 border border-mat-rose/20 shadow-xl">
          <Heart className="w-16 h-16 text-mat-rose fill-mat-rose/10" strokeWidth={1} />
        </div>
      </motion.div>
      <div className="space-y-4 text-center">
        <h3 className="text-[10px] font-bold uppercase tracking-[1em] text-mat-wine/40 animate-pulse">Synchronizing Protocol...</h3>
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-mat-slate/40 italic">Retrieving Sanctuary Status</p>
      </div>
    </div>
  );

  if (profile?.role === 'man') {
    return (
      <MenDashboard 
        profile={profile} 
        status={status} 
        handleLogout={handleLogout} 
      />
    );
  }

  if (profile?.role === 'admin') {
    return (
      <AdminDashboard handleLogout={handleLogout} />
    );
  }

  return (
    <WomenDashboard 
      profile={profile} 
      status={status} 
      handleLogout={handleLogout} 
      handleBoost={handleBoost} 
    />
  );
};

export default Dashboard;
