import React, { useEffect } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { HeroUIProvider } from '@heroui/system';

const App: React.FC = () => {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    }
  }, [loading]);

  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-mat-cream font-body selection:bg-mat-rose selection:text-white">
        <AuthGate>
          <DashboardLayout />
        </AuthGate>
      </div>
    </HeroUIProvider>
  );
};

export default App;
