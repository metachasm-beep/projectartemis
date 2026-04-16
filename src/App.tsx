import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthContext } from '@/contexts/AuthContext';
import { SEOProvider, defaultSchema } from '@/components/SEOProvider';
import { MigrationService } from "./services/MigrationService";
import { AuthGate } from '@/components/auth/AuthGate';

// 🚀 THE PORTAL ENTRY: Eagerly imported to collapse the critical request chain
const DashboardLayout = React.lazy(() => import('@/components/DashboardLayout').then(m => ({ default: m.DashboardLayout })));

// Lazy load Delhi dating routes
const SouthDelhi = React.lazy(() => import('./routes/delhi-dating/SouthDelhi'));
const Gurgaon = React.lazy(() => import('./routes/delhi-dating/Gurgaon'));
const NorthDelhi = React.lazy(() => import('./routes/delhi-dating/NorthDelhi'));
const VerifyCallback = React.lazy(() => import('./pages/VerifyCallback'));
const VerifyPage = React.lazy(() => import('./pages/VerifyPage'));
const BlogApp = React.lazy(() => import('./blogs/App'));
const RootSkeleton = () => <div className="min-h-screen bg-mat-cream" />;


const App: React.FC = () => {
  const { loading } = useAuthContext();
  const hostname = window.location.hostname;
  const isBlogSubdomain = hostname.startsWith('blogs.');

  useEffect(() => {
    if (!loading && !isBlogSubdomain) {
      window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    }
  }, [loading, isBlogSubdomain]);


  return (
    <HelmetProvider>
      {isBlogSubdomain ? (
        <React.Suspense fallback={<RootSkeleton />}>
          <BlogApp />
        </React.Suspense>
      ) : (
        <BrowserRouter>
          <div className="min-h-screen bg-mat-cream font-body selection:bg-mat-rose selection:text-white">
            <SEOProvider 
              title="MATRIARCH | Premium Selection Protocol & Delhi's Elite Dating" 
              description="The most exclusive matchmaking portal for high-value individuals in Delhi, South Delhi, and Gurgaon."
              schema={defaultSchema}
            />
            <React.Suspense fallback={<RootSkeleton />}>
              <Routes>
                <Route path="/delhi-dating/south-delhi" element={<SouthDelhi />} />
                <Route path="/delhi-dating/gurgaon" element={<Gurgaon />} />
                <Route path="/delhi-dating/north-delhi" element={<NorthDelhi />} />
                <Route path="/signin" element={<AuthGate children={<DashboardLayout />} />} />
                <Route path="/verify/callback" element={<VerifyCallback />} />
                <Route path="/verify" element={<AuthGate><VerifyPage /></AuthGate>} />
                <Route path="*" element={
                  <AuthGate>
                    <DashboardLayout />
                  </AuthGate>
                } />
              </Routes>
            </React.Suspense>
          </div>
        </BrowserRouter>
      )}
    </HelmetProvider>
  );
};


export default App;
