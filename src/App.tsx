import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthGate } from '@/components/auth/AuthGate';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { SEOProvider, defaultSchema } from '@/components/SEOProvider';

// Lazy load Delhi dating routes
const SouthDelhi = React.lazy(() => import('./routes/delhi-dating/SouthDelhi'));
const Gurgaon = React.lazy(() => import('./routes/delhi-dating/Gurgaon'));
const NorthDelhi = React.lazy(() => import('./routes/delhi-dating/NorthDelhi'));

const App: React.FC = () => {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    }
  }, [loading]);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-mat-cream font-body selection:bg-mat-rose selection:text-white">
        <BrowserRouter>
          <SEOProvider 
            title="MATRIARCH | Premium Selection Protocol & Delhi's Elite Dating" 
            schema={defaultSchema} 
          />
          <Routes>
            <Route path="/delhi-dating/south-delhi" element={<React.Suspense fallback={<div>Loading...</div>}><SouthDelhi /></React.Suspense>} />
            <Route path="/delhi-dating/gurgaon" element={<React.Suspense fallback={<div>Loading...</div>}><Gurgaon /></React.Suspense>} />
            <Route path="/delhi-dating/north-delhi" element={<React.Suspense fallback={<div>Loading...</div>}><NorthDelhi /></React.Suspense>} />
            <Route path="*" element={
              <AuthGate>
                <DashboardLayout />
              </AuthGate>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
};

export default App;

