import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from "@/lib/supabase";
import { turso, tursoHelpers } from '@/lib/turso';
import type { MatriarchProfile } from '../App';
import { MenDashboard } from './dashboards/MenDashboard';
import { WomenSanctuary } from '@/components/dashboards/WomenSanctuary';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { EditProfile } from '@/components/EditProfile';
import { GeneralSettings } from '@/components/GeneralSettings';
import { AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

        // 📊 Fetch Real-Time Metrics for the Sanctuary
        const metricsRes = await Promise.all([
           turso.execute("SELECT COUNT(*) as count FROM selection_events WHERE woman_id = ?", [user.id]),
           turso.execute("SELECT COUNT(*) as count FROM matches WHERE woman_id = ? AND status = 'active'", [user.id])
        ]).catch(() => [null, null]);

        const profilesViewedCount = metricsRes[0]?.rows[0]?.count || 0;
        const profilesMatchedCount = metricsRes[1]?.rows[0]?.count || 0;

        setProfile(finalProfile);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`, {
            signal: controller.signal
          });
          const data = await response.json();
          if (data) {
            setStatus({
              ...data,
              profilesViewed: profilesViewedCount,
              profilesEngaged: profilesMatchedCount,
              sessionSeconds: 12400 + (Math.random() * 3600), // Simulated real-time total
              activeStreak: 12,
              responseRate: 'High',
              vibeRating: 9.8,
              safetyLevel: data.is_aadhaar_verified ? 'Elite' : 'Stable'
            });
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
        className="p-1 rounded-full bg-gradient-to-tr from-mat-accent-blue/30 to-mat-accent-rose/30 shadow-2xl"
      >
        <div className="bg-white/40 backdrop-blur-3xl rounded-full p-10 border border-white/40">
          <Heart className="w-16 h-16 text-mat-accent-blue fill-mat-accent-blue/10" strokeWidth={1} />
        </div>
      </motion.div>
      <div className="space-y-4 text-center">
        <h3 className="mat-text-label-pro text-mat-black/40 animate-pulse">Synchronizing Protocol...</h3>
        <p className="mat-text-editorial italic text-xs text-mat-black/40">Retrieving Sanctuary Status</p>
      </div>
    </div>
  );

  if (profile?.role === 'man') {
    return (
      <MenDashboard 
        profile={profile} 
        status={status} 
        handleLogout={handleLogout} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    );
  }

  if (profile?.role === 'admin') {
    return (
      <AdminDashboard handleLogout={handleLogout} />
    );
  }

  return (
    <>
      <WomenSanctuary 
        profile={profile} 
        metrics={{
          matches: status?.profilesEngaged || 0,
          sessionSeconds: status?.sessionSeconds || 0,
          profilesViewed: status?.profilesViewed || 0,
          profilesEngaged: status?.profilesEngaged || 0,
          responseRate: status?.responseRate,
          vibeRating: status?.vibeRating,
          activeStreak: status?.activeStreak,
          safetyLevel: status?.safetyLevel
        }} 
        setIsEditing={setIsEditing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onBeginDiscovery={() => window.location.href = '/discovery'}
      />

      <AnimatePresence>
        {isEditing && profile && (
          <EditProfile 
            profile={profile}
            onUpdate={(updated) => {
              setProfile(updated);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
            onOpenSettings={() => {
              setIsEditing(false);
              setIsSettingsOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <GeneralSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Dashboard;

export default Dashboard;
