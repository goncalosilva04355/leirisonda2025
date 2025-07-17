// Firebase Cloud Messaging Service Worker - Environment Variables Template
console.log(
  "[SW] Firebase Messaging Service Worker starting with secure configuration",
);

// Configuration will be injected at build time
const firebaseConfig = {
  apiKey: "demo-value-set-for-production",
  authDomain: "demo-value-set-for-production",
  databaseURL: "demo-value-set-for-production",
  projectId: "demo-value-set-for-production",
  storageBucket: "demo-value-set-for-production",
  messagingSenderId: "demo-value-set-for-production",
  appId: "demo-value-set-for-production",
  measurementId: "demo-value-set-for-production",
};

let messaging = null;

try {
  // Load Firebase scripts
  importScripts(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
  );

  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
    console.log(
      "[SW] Firebase initialized with secure configuration - project:",
      firebaseConfig.projectId,
    );

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
      console.log("[SW] Background message:", payload);

      const title = payload.notification?.title || "Leirisonda";
      const options = {
        body: payload.notification?.body || "Nova notificação",
        icon: "/icon.svg",
        badge: "/icon.svg",
        tag: "leirisonda-notification",
      };

      return self.registration.showNotification(title, options);
    });
  }
} catch (error) {
  console.warn("[SW] Firebase could not be initialized:", error);
}

// Service Worker basics
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activated");
  event.waitUntil(clients.claim());
});

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

console.log(
  "[SW] Firebase Messaging Service Worker ready - project:",
  firebaseConfig.projectId,
);
