import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { serviceWorkerManager, performanceMarker } from './lib/serviceWorker'

// Performance marking for app initialization
performanceMarker.mark('app-init-start');

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
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
