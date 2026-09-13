import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAnimationFrame, useOptimizedScroll } from '@/hooks/use-performance-optimizations';

interface PerformanceContextType {
  isLowEnd: boolean;
  isSlowNetwork: boolean;
  shouldReduceAnimations: boolean;
  enableHighPerformanceMode: () => void;
  disableHighPerformanceMode: () => void;
  highPerformanceMode: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
  isLowEnd: false,
  isSlowNetwork: false,
  shouldReduceAnimations: false,
  enableHighPerformanceMode: () => {},
  disableHighPerformanceMode: () => {},
  highPerformanceMode: false,
});

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [highPerformanceMode, setHighPerformanceMode] = useState(false);

  // Detect device capabilities
  useEffect(() => {
    // Check hardware capabilities
    const checkHardware = () => {
      if (typeof navigator !== 'undefined') {
        // Check device memory
        const deviceMemory = (navigator as any).deviceMemory;
        if (deviceMemory && deviceMemory < 4) {
          setIsLowEnd(true);
        }

        // Check hardware concurrency
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
          setIsLowEnd(true);
        }

        // Check connection
        const connection = (navigator as any).connection;
        if (connection) {
          const { effectiveType, downlink } = connection;
          if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
            setIsSlowNetwork(true);
          }
        }
      }
    };

    checkHardware();

    // Performance observer for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const hasLongTasks = entries.some(entry => entry.duration > 50);
        if (hasLongTasks) {
          setIsLowEnd(true);
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Longtask not supported in all browsers
      }

      return () => observer.disconnect();
    }
  }, []);

  const shouldReduceAnimations = isLowEnd || highPerformanceMode;

  const enableHighPerformanceMode = useCallback(() => {
    setHighPerformanceMode(true);
    
    // Apply global performance optimizations
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
  }, []);

  const disableHighPerformanceMode = useCallback(() => {
    setHighPerformanceMode(false);
    
    // Restore normal animations
    if (typeof document !== 'undefined') {
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--transition-duration');
    }
  }, []);

  // Optimized scroll handling
  useOptimizedScroll(() => {
    // Global scroll optimization
  });

  const value: PerformanceContextType = {
    isLowEnd,
    isSlowNetwork,
    shouldReduceAnimations,
    enableHighPerformanceMode,
    disableHighPerformanceMode,
    highPerformanceMode,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// HOC for performance-aware components
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const PerformanceOptimizedComponent: React.FC<P> = (props) => {
    const { shouldReduceAnimations, isLowEnd } = usePerformance();

    // Create optimized props based on performance context
    const optimizedProps = {
      ...props,
      // Reduce animations for low-end devices
      animate: shouldReduceAnimations ? false : (props as any).animate,
      transition: shouldReduceAnimations 
        ? { duration: 0.1 } 
        : (props as any).transition,
      // Reduce quality for low-end devices
      quality: isLowEnd ? 'low' : (props as any).quality,
    };

    return <Component {...optimizedProps} />;
  };

  PerformanceOptimizedComponent.displayName = `PerformanceOptimized(${Component.displayName || Component.name})`;
  
  return PerformanceOptimizedComponent;
};

// Performance utilities
export const performanceUtils = {
  // Throttle function calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Debounce function calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Check if animations should be reduced
  shouldReduceMotion: (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  // Get frame rate
  getFrameRate: (): Promise<number> => {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      function countFrames() {
        frames++;
        if (frames < 60) {
          requestAnimationFrame(countFrames);
        } else {
          const endTime = performance.now();
          const fps = Math.round(1000 * frames / (endTime - startTime));
          resolve(fps);
        }
      }
      
      requestAnimationFrame(countFrames);
    });
  },

  // Memory usage (if available)
  getMemoryUsage: (): any => {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },
};
