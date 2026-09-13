import { useState, useEffect } from 'react';

// Enhanced loading phases for progressive content display
export enum LoadingPhase {
  BACKGROUND = 'background',  // Only background loaded
  SKELETON = 'skeleton',      // Background + skeleton layout
  CONTENT = 'content',        // Full content loaded
}

// Hook to detect if this is a page reload vs navigation
export const usePageReloadDetection = () => {
  const [isPageReload, setIsPageReload] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if this is a page reload using Performance Navigation API
    if (typeof window !== 'undefined') {
      try {
        // Simple detection using sessionStorage
        const isReload = sessionStorage.getItem('navigationType') === 'reload';
        setIsPageReload(isReload);
        
        // Set navigation type for next check
        sessionStorage.setItem('navigationType', 'navigate');
        
        // On page unload, mark as potential reload
        const handleBeforeUnload = () => {
          sessionStorage.setItem('navigationType', 'reload');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      } catch (error) {
        // If sessionStorage fails, assume it's not a reload
        setIsPageReload(false);
      }
    }

    // Mark as not initial load after first render
    const timer = setTimeout(() => setIsInitialLoad(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    isPageReload,
    isInitialLoad,
    shouldShowLoading: !isPageReload && !isInitialLoad, // Only show loading for navigation, not reload
  };
};

// Enhanced hook to manage progressive content loading state
export const useContentLoading = (
  backgroundDelay: number = 0,
  skeletonDelay: number = 200,
  contentDelay: number = 800
) => {
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(LoadingPhase.BACKGROUND);
  const { shouldShowLoading } = usePageReloadDetection();

  useEffect(() => {
    if (!shouldShowLoading) {
      // If it's a page reload, don't show loading phases and mark content as ready immediately
      setLoadingPhase(LoadingPhase.CONTENT);
      return;
    }

    // Progressive loading phases with appropriate timings
    setLoadingPhase(LoadingPhase.BACKGROUND);

    // Schedule the skeleton phase after background is ready
    const skeletonTimer = setTimeout(() => {
      setLoadingPhase(LoadingPhase.SKELETON);
      
      // Schedule the full content phase
      const contentTimer = setTimeout(() => {
        setLoadingPhase(LoadingPhase.CONTENT);
      }, contentDelay - skeletonDelay);
      
      return () => clearTimeout(contentTimer);
    }, skeletonDelay);

    return () => clearTimeout(skeletonTimer);
  }, [backgroundDelay, skeletonDelay, contentDelay, shouldShowLoading]);

  return {
    isLoading: loadingPhase !== LoadingPhase.CONTENT && shouldShowLoading,
    loadingPhase,
    isBackgroundReady: loadingPhase !== LoadingPhase.BACKGROUND,
    isSkeletonReady: loadingPhase === LoadingPhase.SKELETON || loadingPhase === LoadingPhase.CONTENT,
    isContentReady: loadingPhase === LoadingPhase.CONTENT,
    shouldShowLoading,
  };
};
