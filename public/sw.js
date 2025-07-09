// Unified Service Worker for Leirisonda PWA
const CACHE_NAME = "leirisonda-v4";
const urlsToCache = ["/", "/manifest.json", "/index.html"];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      }),
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    // Clear old caches
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      }),
  );
});

// Message event for skip waiting
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Push event for notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  const options = {
    body: event.data ? event.data.text() : "Nova notificação Leirisonda",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=192",
    badge:
      "https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=96",
    tag: "leirisonda-notification",
    timestamp: Date.now(),
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "Ver Detalhes",
      },
      {
        action: "dismiss",
        title: "Dispensar",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Leirisonda", options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "view") {
    // Open or focus the app
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("leirisonda") && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("/");
        }
      }),
    );
  }
});

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      Promise.resolve().then(() => {
        console.log("Performing background sync...");
      }),
    );
  }
});

// Fetch event with smart caching strategy
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests and non-GET requests
  if (
    !event.request.url.startsWith(self.location.origin) ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Skip Firebase Auth and API requests to prevent interference
  if (
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("identitytoolkit") ||
    event.request.url.includes("firestore") ||
    event.request.url.includes("cdn.builder.io")
  ) {
    return;
  }

  // Network first for HTML files, cache first for assets
  if (event.request.headers.get("accept").includes("text/html")) {
    // Network first strategy for HTML
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        }),
    );
  } else {
    // Cache first strategy for assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      }),
    );
  }
});
