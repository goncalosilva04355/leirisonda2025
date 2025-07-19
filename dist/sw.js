// Simple fallback service worker for Leirisonda
// This runs if the Firebase messaging service worker fails to load

console.log("[sw.js] Fallback Service Worker loaded");

// Basic cache strategy for offline support
const CACHE_NAME = "leirisonda-fallback-v1";
const urlsToCache = ["/", "/icon.svg", "/manifest.json"];

self.addEventListener("install", (event) => {
  console.log("[sw.js] Install event");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[sw.js] Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("[sw.js] Cache installation failed:", error);
      }),
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error("[sw.js] Fetch failed:", error);
        // Return a basic offline page if available
        return caches.match("/");
      }),
  );
});

self.addEventListener("activate", (event) => {
  console.log("[sw.js] Activate event");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[sw.js] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Handle messages from main thread
self.addEventListener("message", (event) => {
  console.log("[sw.js] Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
