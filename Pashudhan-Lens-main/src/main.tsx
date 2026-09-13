import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Clerk is stubbed at build time via vite.config.ts alias, so this import
// resolves to src/lib/clerk-stub.tsx. To re-enable real Clerk auth, remove
// that alias and set VITE_CLERK_PUBLISHABLE_KEY in the build environment.
import { ClerkProvider } from '@clerk/clerk-react'
import { serviceWorkerManager, performanceMarker } from './lib/serviceWorker'

// Performance marking for app initialization
performanceMarker.mark('app-init-start');

// Register service worker for enhanced performance
if (import.meta.env.PROD) {
  serviceWorkerManager.register().then(() => {
    performanceMarker.mark('service-worker-registered');
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider>
      <App />
    </ClerkProvider>
  </StrictMode>
);

// Mark app initialization complete
performanceMarker.mark('app-init-end');
performanceMarker.measure('app-initialization', 'app-init-start', 'app-init-end');
