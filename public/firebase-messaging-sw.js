// SERVICE WORKER SIMPLES SEM FIREBASE SDK
console.log("[SW] Service Worker iniciado - sem Firebase SDK");

// Basic service worker for Leirisonda
const CACHE_NAME = "leirisonda-sw-v1";
const urlsToCache = ["/", "/manifest.json", "/icon.svg"];

// Install event
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cache aberto");
      return cache.addAll(urlsToCache);
    }),
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker ativado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Cache antigo removido:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  event.waitUntil(clients.claim());
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached resource or fetch from network
      return response || fetch(event.request);
    }),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    }),
  );
});

console.log("[SW] Service Worker pronto - sem Firebase SDK");
