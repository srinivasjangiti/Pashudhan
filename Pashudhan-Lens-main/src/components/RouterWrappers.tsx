import React, { memo, useCallback, Suspense, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { SpeciesIdentification } from '@/services/geminiApi';
import { RouterNavigationBreadcrumb } from './RouterNavigationBreadcrumb';
import { StablePageWrapper } from '@/components/ui/simple-loading';
import { useContentLoading, LoadingPhase } from '@/hooks/use-content-loading';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { EnhancedSkeleton, ContentWithSkeleton } from '@/components/EnhancedSkeleton';

// Prefetch components on mount to optimize subsequent navigation
const prefetchComponent = (importFn: () => Promise<any>) => {
  const prefetcher = document.createElement('link');
  prefetcher.rel = 'prefetch';
  prefetcher.as = 'script';
  prefetcher.href = importFn.toString().match(/import\(['"](.*)['"]\)/)?.[1] || '';
  document.head.appendChild(prefetcher);
};

// Lazy load pages with preloading hints
const Home = React.lazy(() => 
  import('../pages/Home').then(module => {
    // Preload critical routes
    import('../pages/Upload');
    return module;
  })
);
const About = React.lazy(() => import('../pages/About'));
const Upload = React.lazy(() => 
  import('../pages/Upload').then(module => {
    // Preload results page for faster transitions
    import('../pages/Results');
    return module;
  })
);
const Results = React.lazy(() => import('../pages/Results'));
const Library = React.lazy(() => import('../pages/Library'));

// Helper to generate skeleton placeholder based on route
const getRouteSkeleton = (route: string) => {
  // Common layout with route-specific skeleton content
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 space-y-6">
      {/* Header area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="space-y-3 w-full sm:w-2/3">
          <EnhancedSkeleton variant="text" width="60%" height="38px" />
          <EnhancedSkeleton variant="text" width="90%" lines={2} />
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <EnhancedSkeleton variant="button" width="120px" />
          <EnhancedSkeleton variant="button" width="120px" />
        </div>
      </div>
      
      {/* Main content area - customized per route */}
      {route === 'home' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <EnhancedSkeleton height="240px" className="w-full" />
            <EnhancedSkeleton variant="text" width="80%" lines={3} />
          </div>
          <div className="space-y-4">
            <EnhancedSkeleton height="180px" className="w-full" />
            <EnhancedSkeleton variant="text" width="90%" lines={2} />
            <div className="flex gap-3">
              <EnhancedSkeleton variant="button" width="140px" />
              <EnhancedSkeleton variant="button" width="140px" />
            </div>
          </div>
        </div>
      )}
      
      {route === 'about' && (
        <div className="space-y-6">
          <EnhancedSkeleton height="200px" className="w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="space-y-3">
                <EnhancedSkeleton height="120px" className="w-full" />
                <EnhancedSkeleton variant="text" width="60%" />
                <EnhancedSkeleton variant="text" width="90%" lines={2} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {route === 'upload' && (
        <div className="space-y-6">
          <EnhancedSkeleton height="260px" className="w-full rounded-xl" />
          <div className="flex justify-center">
            <EnhancedSkeleton variant="button" width="200px" />
          </div>
        </div>
      )}
      
      {route === 'library' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="space-y-3">
              <EnhancedSkeleton height="180px" className="w-full" />
              <EnhancedSkeleton variant="text" width="70%" />
              <EnhancedSkeleton variant="text" width="90%" />
            </div>
          ))}
        </div>
      )}
      
      {route === 'results' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EnhancedSkeleton height="400px" className="w-full rounded-xl" />
          <div className="space-y-4">
            <EnhancedSkeleton variant="text" width="60%" />
            <EnhancedSkeleton variant="text" width="90%" lines={3} />
            <div className="mt-6 space-y-4">
              <EnhancedSkeleton height="80px" className="w-full rounded-lg" />
              <EnhancedSkeleton height="80px" className="w-full rounded-lg" />
              <EnhancedSkeleton height="80px" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper for Home page with natural loading patterns
export const HomeWrapper = memo(() => {
  const { 
    loadingPhase, 
    isContentReady, 
    isSkeletonReady 
  } = useContentLoading(0, 200, 1000); // BG instantly, skeleton after 200ms, content after 1s
  
  const navigate = useNavigate();

  // Prefetch components on mount for better navigation performance
  useEffect(() => {
    // Prefetch upload page for the common "Get Started" action
    prefetchComponent(() => import('../pages/Upload'));
  }, []);

  const handleGetStarted = useCallback(() => {
    navigate('/upload');
  }, [navigate]);

  const handleNavigateAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  const handleNavigateLibrary = useCallback(() => {
    navigate('/library');
  }, [navigate]);

  // Show appropriate background based on loading phase
  return (
    <StablePageWrapper 
      isLoading={!isContentReady} 
      loadingMessage="Loading Home..."
      glassVariant="light"
      background="default"
      className="transition-all duration-500"
    >
      <RouterNavigationBreadcrumb />
      
      {/* Show skeleton when ready but content not yet loaded */}
      {isSkeletonReady && !isContentReady && (
        getRouteSkeleton('home')
      )}
      
      {/* Show actual content when fully loaded */}
      <ContentWithSkeleton
        isLoading={!isContentReady}
        skeleton={<div />} // Empty div as we're handling skeleton separately
        className="transition-opacity duration-500"
      >
        <Suspense fallback={<div />}>
          <Home 
            onGetStarted={handleGetStarted} 
            onNavigateAbout={handleNavigateAbout}
            onNavigateLibrary={handleNavigateLibrary}
          />
        </Suspense>
      </ContentWithSkeleton>
    </StablePageWrapper>
  );
});

HomeWrapper.displayName = 'HomeWrapper';

// Wrapper for About page with progressive loading
export const AboutWrapper = memo(() => {
  const { 
    loadingPhase, 
    isContentReady, 
    isSkeletonReady 
  } = useContentLoading(0, 200, 800); // BG instantly, skeleton after 200ms, content after 800ms
  
  const navigate = useNavigate();

  // Prefetch components for better navigation performance
  useEffect(() => {
    prefetchComponent(() => import('../pages/Upload'));
  }, []);

  const handleGetStarted = useCallback(() => {
    navigate('/upload');
  }, [navigate]);

  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleNavigateLibrary = useCallback(() => {
    navigate('/library');
  }, [navigate]);

  return (
    <StablePageWrapper 
      isLoading={!isContentReady} 
      loadingMessage="Loading About..."
      glassVariant="light"
      background="default"
      className="transition-all duration-500"
    >
      <RouterNavigationBreadcrumb />
      
      {/* Show skeleton when ready but content not yet loaded */}
      {isSkeletonReady && !isContentReady && (
        getRouteSkeleton('about')
      )}
      
      {/* Show actual content when fully loaded */}
      <ContentWithSkeleton
        isLoading={!isContentReady}
        skeleton={<div />} // Empty div as we're handling skeleton separately
        className="transition-opacity duration-500"
      >
        <Suspense fallback={<div />}>
          <SignedIn>
            <About 
              onGetStarted={handleGetStarted} 
              onNavigateHome={handleNavigateHome}
              onNavigateLibrary={handleNavigateLibrary}
            />
          </SignedIn>
          <SignedOut>
            <About 
              onGetStarted={handleGetStarted} 
              onNavigateHome={handleNavigateHome}
              onNavigateLibrary={handleNavigateLibrary}
            />
          </SignedOut>
        </Suspense>
      </ContentWithSkeleton>
    </StablePageWrapper>
  );
});

AboutWrapper.displayName = 'AboutWrapper';

// Wrapper for Upload page with natural loading patterns  
const UploadWrapperContent = memo(() => {
  const { isLoading } = useContentLoading(700); // Natural timing
  const navigate = useNavigate();
  // Page transitions are not implemented
  
  return (
    <div className="upload-wrapper">
      <StablePageWrapper 
        isLoading={isLoading} 
        loadingMessage="Loading Upload..."
        glassVariant="dark"
      >
        <RouterNavigationBreadcrumb />
        <Suspense fallback={<div />}>
          <Upload />
        </Suspense>
      </StablePageWrapper>
    </div>
  );
});

UploadWrapperContent.displayName = 'UploadWrapperContent';

export const UploadWrapper = memo(() => (
  <UploadWrapperContent />
));

UploadWrapper.displayName = 'UploadWrapper';

// Wrapper for Results page with smart loading detection and performance optimizations
const ResultsWrapperContent = memo(() => {
  const { isLoading } = useContentLoading(200);
  const navigate = useNavigate();
  const { state, clearResults } = useAppContext();
  
  const handleBack = useCallback(() => {
    navigate('/upload');
  }, [navigate]);

  const handleNewUpload = useCallback(() => {
    clearResults();
    navigate('/upload');
  }, [clearResults, navigate]);

  const handleGoHome = useCallback(() => {
    clearResults();
    navigate('/');
  }, [clearResults, navigate]);

  // Redirect to upload if no results data
  React.useEffect(() => {
    if (!state.resultsData) {
      navigate('/upload');
    }
  }, [state.resultsData, navigate]);

  if (!state.resultsData) {
    return (
      <div className="results-wrapper-redirect">
        <StablePageWrapper 
          isLoading={true} 
          loadingMessage="Redirecting..."
          glassVariant="light"
        >
          <div />
        </StablePageWrapper>
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      <StablePageWrapper 
        isLoading={isLoading} 
        loadingMessage="Loading Results..."
        glassVariant="light"
      >
        <RouterNavigationBreadcrumb onNewUpload={handleNewUpload} />
        <Suspense fallback={<div />}>
          <Results 
            imageUrl={state.resultsData.imageUrl}
            results={state.resultsData.results}
            onBack={handleBack}
            onNewUpload={handleNewUpload}
            onHome={handleGoHome}
          />
        </Suspense>
      </StablePageWrapper>
    </div>
  );
});

ResultsWrapperContent.displayName = 'ResultsWrapperContent';

export const ResultsWrapper = memo(() => (
  <ResultsWrapperContent />
));

ResultsWrapper.displayName = 'ResultsWrapper';

// Wrapper for Library page with smart loading detection and performance optimizations
export const LibraryWrapper = memo(() => {
  const { isLoading } = useContentLoading(300);
  const navigate = useNavigate();
  
  return (
    <>
      <StablePageWrapper 
        isLoading={isLoading} 
        loadingMessage="Loading Library..."
        glassVariant="light"
      >
        <RouterNavigationBreadcrumb />
        <Suspense fallback={<div />}>
          <Library />
        </Suspense>
      </StablePageWrapper>
    </>
  );
});

LibraryWrapper.displayName = 'LibraryWrapper';
