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
        <div style={{ height: '100vh', width: '100vw', background: '#0A0A0B', color: '#FF0000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900 }}>PROTOCOL BREACH</h1>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Critical React Failure. Check Console.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '30px', padding: '10px 20px', border: '1px solid #FF0000', background: 'transparent', color: '#FF0000', fontSize: '10px', fontWeight: 'bold' }}>RE-INITIALIZE</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Execution Tracker
// @ts-ignore
window.__BUNDLE_START__ = true;
const diagnostic = document.getElementById('diagnostic-console');
if (diagnostic) {
  diagnostic.style.display = 'block';
  diagnostic.innerHTML += '<div>> [SYSTEM] Bundle v1.0.2 execution confirmed.</div>';
}

// Emergency Protocol Cache Purge (Redundant but safe)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      if (diagnostic) diagnostic.innerHTML += '<div>> [SW] Legacy ServiceWorker purged.</div>';
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  if (diagnostic) diagnostic.innerHTML += '<div>> [SYSTEM] Rendering React Root...</div>';
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  
  // Handshake Listener: Dismiss loader only when app signals it's ready
  window.addEventListener('message', (event) => {
    if (event.data === 'MATRIARCH_PROTOCOL_READY') {
      const loader = document.getElementById('boot-loader');
      if (loader) {
        if (diagnostic) diagnostic.innerHTML += '<div style="color: #00F2FF">> [SUCCESS] App Handshake received. Dismantling shell...</div>';
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 500);
        }, 1000);
      }
    }
  });
} else {
  if (diagnostic) {
    diagnostic.innerHTML += '<div style="color: #FF0000">> [FATAL] Root container missing (#root).</div>';
  }
}
