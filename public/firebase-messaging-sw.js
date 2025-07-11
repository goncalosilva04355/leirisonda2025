// Firebase Cloud Messaging Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLXCz8h0dw0i0u8rQ4ABIB_0pU-WO6KMs",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload,
  );

  // Customize notification here
  const notificationTitle =
    payload.notification?.title || "Leirisonda - Nova Notificação";
  const notificationOptions = {
    body: payload.notification?.body || "Você tem uma nova atribuição de obra",
    icon: payload.notification?.icon || "/icon.svg",
    badge: "/icon.svg",
    tag: payload.data?.workId
      ? `work-${payload.data.workId}`
      : "leirisonda-notification",
    data: {
      ...payload.data,
      clickAction: payload.data?.clickAction || "/#obras",
    },
    actions: [
      {
        action: "view",
        title: "Ver Obra",
        icon: "/icon.svg",
      },
      {
        action: "dismiss",
        title: "Dispensar",
        icon: "/icon.svg",
      },
    ],
    requireInteraction: true,
    timestamp: Date.now(),
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received:", event);

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  // Handle view action or default click
  const clickAction = event.notification.data?.clickAction || "/#obras";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if a Window tab or Worker is already open with the target URL
        for (const client of clientList) {
          // If so, just focus it.
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.postMessage({
              type: "NOTIFICATION_CLICK",
              data: event.notification.data,
              action: event.action || "default",
            });
            return client.focus();
          }
        }

        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      }),
  );
});

// Handle push events (for custom push server)
self.addEventListener("push", (event) => {
  console.log("[firebase-messaging-sw.js] Push event received:", event);

  if (event.data) {
    try {
      const payload = event.data.json();

      const notificationTitle = payload.title || "Leirisonda";
      const notificationOptions = {
        body: payload.body || "Nova notificação",
        icon: payload.icon || "/icon.svg",
        badge: "/icon.svg",
        tag: payload.tag || "leirisonda-push",
        data: payload.data || {},
        actions: [
          {
            action: "view",
            title: "Ver",
            icon: "/icon.svg",
          },
          {
            action: "dismiss",
            title: "Dispensar",
            icon: "/icon.svg",
          },
        ],
        requireInteraction: true,
        timestamp: Date.now(),
      };

      event.waitUntil(
        self.registration.showNotification(
          notificationTitle,
          notificationOptions,
        ),
      );
    } catch (error) {
      console.error(
        "[firebase-messaging-sw.js] Error parsing push data:",
        error,
      );

      // Fallback notification
      event.waitUntil(
        self.registration.showNotification("Leirisonda", {
          body: "Nova notificação disponível",
          icon: "/icon.svg",
          badge: "/icon.svg",
          tag: "leirisonda-fallback",
        }),
      );
    }
  }
});

console.log(
  "[firebase-messaging-sw.js] Firebase Messaging Service Worker loaded",
);
