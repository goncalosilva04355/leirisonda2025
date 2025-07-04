// Service Worker for Push Notifications
const CACHE_NAME = "leirisonda-v1";

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});

// Push event for notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  const options = {
    body: event.data ? event.data.text() : "Nova notificação Leirisonda",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=192",
    badge:
      "https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=96",
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
      // Perform background sync operations
      Promise.resolve().then(() => {
        console.log("Performing background sync...");
      }),
    );
  }
});

// Fetch event for caching (optional)
self.addEventListener("fetch", (event) => {
  // Basic caching strategy for offline support
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      }),
    );
  }
});
