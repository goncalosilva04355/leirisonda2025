const CACHE_NAME = "leirisonda-v6-ultimate";
const urlsToCache = [
  "/",
  "/assets/index-DFdR-byQ.css",
  "/assets/index-DnEsHg1H.js",
  "/manifest.json",
];

// Flag to prevent logout during operations
let operationInProgress = false;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  // Don't interfere with Firebase Auth requests during operations
  if (operationInProgress && event.request.url.includes("firebase")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});

// Listen for messages from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "OPERATION_START") {
    operationInProgress = true;
  } else if (event.data && event.data.type === "OPERATION_END") {
    operationInProgress = false;
  }
});

// Push notification handler
self.addEventListener("push", (event) => {
  console.log("📱 SW: Push notification received");

  let notificationData = {
    title: "Leirisonda",
    body: "Nova notificação",
    icon: "/leirisonda-logo.svg",
    badge: "/leirisonda-logo.svg",
    tag: "leirisonda-notification",
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "Ver",
        icon: "/leirisonda-logo.svg",
      },
      {
        action: "dismiss",
        title: "Dispensar",
      },
    ],
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData,
    ),
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("📱 SW: Notification clicked");

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  // Open or focus the app
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }

        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow("/dashboard");
        }
      }),
  );
});
