import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { serviceWorkerManager, performanceMarker } from './lib/serviceWorker'

// Performance marking for app initialization
performanceMarker.mark('app-init-start');

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  // Fallback so the app can render in environments without Clerk configured
  // (e.g. preview deploys before env vars are wired up). Auth-protected
  // routes will simply render their SignedOut state. Replace with a real
  // publishable key via Vercel env vars to enable authentication.
  'pk_test_aW5jb21wbGV0ZS1wbGF0eXB1cy01NS5jbGVyay5hY2NvdW50cy5kZXYk';
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn(
    '[Pashudhan] VITE_CLERK_PUBLISHABLE_KEY is not set — auth features are disabled. ' +
    'Set it in Vercel project settings to enable Clerk authentication.'
  );
}

// Register service worker for enhanced performance
if (import.meta.env.PROD) {
  serviceWorkerManager.register().then(() => {
    performanceMarker.mark('service-worker-registered');
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);

// Mark app initialization complete
performanceMarker.mark('app-init-end');
performanceMarker.measure('app-initialization', 'app-init-start', 'app-init-end');
