// Advanced performance optimization utilities
import React, { useRef, useEffect, useCallback, useMemo } from 'react';

// Optimized RAF hook for smooth animations
export const useAnimationFrame = (callback: (time: number) => void, deps: any[] = []) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      callback(time - previousTimeRef.current);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, deps);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

// Optimized intersection observer with built-in throttling
export const useOptimizedIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
  throttleMs: number = 16
) => {
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastCallTime = useRef<number>(0);

  const throttledCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const now = performance.now();
    if (now - lastCallTime.current >= throttleMs) {
      callback(entries);
      lastCallTime.current = now;
    }
  }, [callback, throttleMs]);

  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver(throttledCallback, {
        rootMargin: '50px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ...options,
      });
      
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [throttledCallback, options]);

  return elementRef;
};

// Memory-efficient image preloader
export const useImagePreloader = (sources: string[], priority: 'high' | 'low' = 'low') => {
  const loadedImages = useRef(new Set<string>());
  const loadingPromises = useRef(new Map<string, Promise<void>>());

  const preloadImage = useCallback((src: string): Promise<void> => {
    if (loadedImages.current.has(src)) {
      return Promise.resolve();
    }

    if (loadingPromises.current.has(src)) {
      return loadingPromises.current.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Set loading attributes for better performance
      img.loading = 'lazy';
      img.decoding = 'async';
      
      // Priority hints for modern browsers
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = priority;
      }

      img.onload = () => {
        loadedImages.current.add(src);
        loadingPromises.current.delete(src);
        resolve();
      };

      img.onerror = () => {
        loadingPromises.current.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    loadingPromises.current.set(src, promise);
    return promise;
  }, [priority]);

  useEffect(() => {
    // Use requestIdleCallback for non-critical preloading
    const preloadImages = () => {
      sources.forEach(src => {
        if (!loadedImages.current.has(src)) {
          preloadImage(src).catch(() => {
            // Silently handle errors
          });
        }
      });
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadImages, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(preloadImages, 100);
      return () => clearTimeout(timer);
    }
  }, [sources, preloadImage]);

  return {
    preloadImage,
    isLoaded: (src: string) => loadedImages.current.has(src),
    preloadedCount: loadedImages.current.size,
  };
};

// Optimized scroll handler with passive events
export const useOptimizedScroll = (
  callback: (scrollY: number, direction: 'up' | 'down') => void,
  throttleMs: number = 16
) => {
  const lastScrollY = useRef(0);
  const lastCallTime = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    const now = performance.now();
    
    if (!ticking.current) {
      requestAnimationFrame(() => {
        if (now - lastCallTime.current >= throttleMs) {
          const scrollY = window.scrollY;
          const direction = scrollY > lastScrollY.current ? 'down' : 'up';
          
          callback(scrollY, direction);
          
          lastScrollY.current = scrollY;
          lastCallTime.current = now;
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [callback, throttleMs]);

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};

// Resource preloader for critical assets
export const preloadCriticalResources = () => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
};

// Memory cleanup utility
export const useMemoryCleanup = () => {
  const cleanup = useCallback(() => {
    // Force garbage collection in development
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return cleanup;
};

// Bundle splitting helper
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return React.memo<React.ComponentProps<T>>((props) => (
    <React.Suspense fallback={fallback ? React.createElement(fallback) : <div />}>
      <LazyComponent {...props} />
    </React.Suspense>
  ));
};
