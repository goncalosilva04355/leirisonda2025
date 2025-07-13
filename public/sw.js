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

  let notificationData = {
    title: "Leirisonda",
    body: "Nova notificação",
    icon: "/icon.svg",
    badge: "/icon.svg",
    data: {},
  };

  // Parse notification data if available
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      console.warn("Could not parse notification data:", error);
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || "/icon.svg",
    badge: notificationData.badge || "/icon.svg",
    tag: notificationData.data?.type || "leirisonda-notification",
    timestamp: Date.now(),
    requireInteraction: true,
    data: notificationData.data,
    actions: [
      {
        action: "view",
        title: "Ver Obra",
      },
      {
        action: "dismiss",
        title: "Dispensar",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "dismiss") {
    return; // Just close the notification
  }

  // Handle view action or default click
  const notificationData = event.notification.data || {};
  let targetUrl = "/";

  // Navigate to specific work if available
  if (notificationData.workId) {
    targetUrl = `/#obras`; // Navigate to obras section
  } else if (notificationData.url) {
    targetUrl = notificationData.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          // Focus existing window and navigate if needed
          client.postMessage({
            type: "NOTIFICATION_CLICK",
            data: notificationData,
            targetUrl: targetUrl,
          });
          return client.focus();
        }
      }

      // Open new window if none is open
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
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
