import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, memo, useEffect, useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { EnhancedSkeleton } from "@/components/EnhancedSkeleton";
import { AppProvider } from "@/contexts/AppContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { SimpleLoadingOverlay } from "@/components/ui/simple-loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/clerk-react";

// Preload critical background images
const preloadBackgroundImages = () => {
  const imageUrls = [
    '/src/assets/upload_bg.png', 
    '/src/assets/library_bg.jpeg'
  ];
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
    img.fetchPriority = 'high';
  });
};

// Lazy load components for better code splitting and progressive loading
const NotFound = lazy(() => import("./pages/NotFound"));
const HomeWrapper = lazy(() => import("./components/RouterWrappers").then(module => ({ default: module.HomeWrapper })));
const AboutWrapper = lazy(() => import("./components/RouterWrappers").then(module => ({ default: module.AboutWrapper })));
const UploadWrapper = lazy(() => import("./components/RouterWrappers").then(module => ({ default: module.UploadWrapper })));
const ResultsWrapper = lazy(() => import("./components/RouterWrappers").then(module => ({ default: module.ResultsWrapper })));
const LibraryWrapper = lazy(() => import("./components/RouterWrappers").then(module => ({ default: module.LibraryWrapper })));

// Optimized Query Client configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce refetch frequency for better performance
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Improved loading fallback with stable background
const LoadingFallback = memo(() => (
  <div className="min-h-screen relative">
    {/* Always show a background first */}
    <PageBackground variant="default" priority={true} />
    
    {/* Then show a simple centered loading indicator */}
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <SimpleLoadingOverlay isLoading={true} message="Loading application..." />
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Route-based background selector
const BackgroundSelector = memo(() => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  
  // Determine which background to show based on route
  const getBackgroundVariant = () => {
    if (currentPath === '/upload') return 'upload';
    if (currentPath === '/results') return 'results';
    if (currentPath === '/library') return 'library';
    return 'default';
  };
  
  // Update path with a small delay to allow for transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPath(location.pathname);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return <PageBackground variant={getBackgroundVariant()} priority={true} />;
});

BackgroundSelector.displayName = 'BackgroundSelector';

const App = memo(() => {
  // Preload critical assets on mount
  useEffect(() => {
    preloadBackgroundImages();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PerformanceProvider>
          <TooltipProvider delayDuration={100}>
            <Toaster />
            <Sonner 
              richColors 
              position="top-right"
              expand={false}
              visibleToasts={3}
            />
            <BrowserRouter>
              <AppProvider>
                {/* Background is always shown immediately - prevents flicker */}
                <BackgroundSelector />
                
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomeWrapper />} />
                    <Route path="/home" element={<HomeWrapper />} />
                    <Route path="/about" element={<AboutWrapper />} />
                    <Route path="/upload" element={<UploadWrapper />} />
                    <Route path="/library" element={<LibraryWrapper />} />
                    <Route path="/results" element={<ResultsWrapper />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AppProvider>
            </BrowserRouter>
          </TooltipProvider>
        </PerformanceProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
