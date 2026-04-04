import React, { useEffect } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

/**
 * MATRIARCH: The Sovereign Entry
 * 
 * This is the lean entry point for the sanctuary.
 * Authentication, Onboarding, and Feature routing are now modularized.
 */
const App: React.FC = () => {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Handshake with main.tsx to dismantle the root loader shell
      window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-mat-cream font-body selection:bg-mat-rose selection:text-white">
      <AuthGate>
        <DashboardLayout />
      </AuthGate>
    </div>
  );
};

export default App;
