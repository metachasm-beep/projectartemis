import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("Matriarch Protocol Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', width: '100vw', background: '#0A0A0B', color: '#D4AF37', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora, sans-serif' }}>
          <h1 style={{ fontSize: '24px', fontStyle: 'italic', fontWeight: 900, letterSpacing: '-0.05em' }}>SYSTEM RECOVERY</h1>
          <p style={{ fontSize: '10px', marginTop: '10px', opacity: 0.5, letterSpacing: '0.4em' }}>Protocol error detected. Refreshing designation...</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '30px', padding: '10px 20px', border: '1px solid #D4AF37', background: 'transparent', color: '#D4AF37', fontSize: '10px', fontWeight: 'bold' }}>RE-INITIALIZE</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Emergency Protocol Cache Purge
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Protocol Cache Purged: Unregistered SW");
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  
  // Dismiss boot loader only after successful initialization
  setTimeout(() => {
    const loader = document.getElementById('boot-loader');
    if (loader) loader.style.display = 'none';
  }, 500);
} else {
  console.error("Fatal: Selection Protocol Root missing.");
}
