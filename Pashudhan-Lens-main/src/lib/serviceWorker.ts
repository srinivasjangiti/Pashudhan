import React from 'react';

/**
 * Service Worker Registration and Management
 * Provides advanced caching and offline functionality
 */

export interface ServiceWorkerConfig {
  enabled: boolean;
  updateInterval: number;
  cacheName: string;
  debug: boolean;
}

const DEFAULT_CONFIG: ServiceWorkerConfig = {
  enabled: true,
  updateInterval: 24 * 60 * 60 * 1000, // 24 hours
  cacheName: 'critter-cognito-v1',
  debug: process.env.NODE_ENV === 'development',
};

class ServiceWorkerManager {
  private config: ServiceWorkerConfig;
  private registration: ServiceWorkerRegistration | null = null;

  constructor(config: Partial<ServiceWorkerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Register the service worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported() || !this.config.enabled) {
      this.log('Service Worker not supported or disabled');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/',
        updateViaCache: 'imports'
      });

      this.log('Service Worker registered successfully');
      this.setupEventListeners();
      this.checkForUpdates();

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      this.log('Service Worker unregistered successfully');
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      await this.registration.update();
      this.log('Checked for Service Worker updates');
    } catch (error) {
      console.error('Service Worker update check failed:', error);
    }
  }

  /**
   * Setup event listeners for service worker events
   */
  private setupEventListeners(): void {
    if (!navigator.serviceWorker) {
      return;
    }

    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      this.log('Service Worker controller changed');
      // Reload the page to get the latest version
      if (this.config.debug) {
        console.log('New service worker took control, consider reloading');
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });

    // Set up periodic update checks
    setInterval(() => {
      this.checkForUpdates();
    }, this.config.updateInterval);
  }

  /**
   * Handle messages from service worker
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { data } = event;
    
    if (data && data.type) {
      switch (data.type) {
        case 'CACHE_UPDATED':
          this.log('Cache updated:', data.payload);
          break;
        case 'OFFLINE_READY':
          this.log('App is ready for offline use');
          break;
        case 'ERROR':
          console.error('Service Worker error:', data.payload);
          break;
        default:
          this.log('Unknown message from Service Worker:', data);
      }
    }
  }

  /**
   * Send a message to the service worker
   */
  async sendMessage(message: any): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    navigator.serviceWorker.controller.postMessage(message);
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      this.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }

  /**
   * Get cache storage estimate
   */
  async getCacheSize(): Promise<StorageEstimate | null> {
    if (!('storage' in navigator) || !navigator.storage.estimate) {
      return null;
    }

    try {
      return await navigator.storage.estimate();
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return null;
    }
  }

  /**
   * Check if service workers are supported
   */
  private isSupported(): boolean {
    return 'serviceWorker' in navigator && 'caches' in window;
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(message: string, ...args: any[]): void {
    if (this.config.debug) {
      console.log(`[ServiceWorkerManager] ${message}`, ...args);
    }
  }

  /**
   * Get the current registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * Check if the app is offline
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }
}

// Create and export a singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// React hook for service worker integration
export const useServiceWorker = (config?: Partial<ServiceWorkerConfig>) => {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    const manager = new ServiceWorkerManager(config);

    // Register service worker
    manager.register().then((registration) => {
      setIsRegistered(!!registration);
    });

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [config]);

  const clearCache = React.useCallback(async () => {
    await serviceWorkerManager.clearCaches();
  }, []);

  const checkForUpdates = React.useCallback(async () => {
    await serviceWorkerManager.checkForUpdates();
  }, []);

  return {
    isRegistered,
    isOffline,
    updateAvailable,
    clearCache,
    checkForUpdates,
  };
};

// Performance monitoring utilities
export const performanceMarker = {
  mark: (name: string) => {
    if ('performance' in window && performance.mark) {
      performance.mark(name);
      
      // Send to service worker for logging
      serviceWorkerManager.sendMessage({
        type: 'PERFORMANCE_MARK',
        name,
        timestamp: Date.now()
      });
    }
  },

  measure: (name: string, startMark: string, endMark?: string) => {
    if ('performance' in window && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          // Send to service worker for logging
          serviceWorkerManager.sendMessage({
            type: 'PERFORMANCE_MEASURE',
            name,
            duration: measure.duration,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
  }
};

// Auto-register service worker when this module is imported
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  serviceWorkerManager.register();
}
