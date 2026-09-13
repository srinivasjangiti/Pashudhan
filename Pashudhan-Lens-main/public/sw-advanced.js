// Service Worker for Advanced Performance Optimizations
// Implements caching strategies for maximum performance

const CACHE_NAME = 'critter-cognito-v1';
const STATIC_CACHE = 'critter-static-v1';
const DYNAMIC_CACHE = 'critter-dynamic-v1';
const IMAGE_CACHE = 'critter-images-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/assets/hero-wildlife.jpg',
  '/src/assets/3.jpg',
];

// Network-first routes (always try network first)
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/upload',
  '/results'
];

// Cache-first routes (for static assets)
const CACHE_FIRST_ROUTES = [
  '/src/assets/',
  '/src/components/',
  '.js',
  '.css',
  '.woff2',
  '.woff',
  '.ttf'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (isNetworkFirstRoute(request.url)) {
    event.respondWith(handleNetworkFirst(request));
  } else if (isCacheFirstRoute(request.url)) {
    event.respondWith(handleCacheFirst(request));
  } else {
    event.respondWith(handleStaleWhileRevalidate(request));
  }
});

// Image caching strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Return cached image immediately
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Service Worker: Image fetch failed:', error);
    // Return a fallback image if available
    return cache.match('/src/assets/placeholder.svg') || new Response('Image not available');
  }
}

// Network-first strategy (for dynamic content)
async function handleNetworkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Update cache with fresh content
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache-first strategy (for static assets)
async function handleCacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Service Worker: Cache-first fetch failed:', error);
    throw error;
  }
}

// Stale-while-revalidate strategy (for app shell)
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  // Always try to fetch fresh content in the background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch((error) => {
    console.log('Service Worker: Background fetch failed:', error);
  });

  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Helper functions
function isNetworkFirstRoute(url) {
  return NETWORK_FIRST_ROUTES.some(route => url.includes(route));
}

function isCacheFirstRoute(url) {
  return CACHE_FIRST_ROUTES.some(route => url.includes(route));
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Service Worker: Running background sync');
  // Implement background sync logic here
  // For example, sync pending uploads when back online
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/src/assets/favicon.ico',
    badge: '/src/assets/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Critter Cognito', options)
  );
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    // Log performance marks for monitoring
    console.log('Service Worker: Performance mark:', event.data);
  }
});
