// Firebase Cloud Messaging Service Worker - Environment Variables Template
console.log(
  "[SW] Firebase Messaging Service Worker starting with secure configuration",
);

// Configuration will be injected at build time
const firebaseConfig = {
  apiKey: "{{VITE_FIREBASE_API_KEY}}",
  authDomain: "{{VITE_FIREBASE_AUTH_DOMAIN}}",
  databaseURL: "{{VITE_FIREBASE_DATABASE_URL}}",
  projectId: "{{VITE_FIREBASE_PROJECT_ID}}",
  storageBucket: "{{VITE_FIREBASE_STORAGE_BUCKET}}",
  messagingSenderId: "{{VITE_FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{VITE_FIREBASE_APP_ID}}",
  measurementId: "{{VITE_FIREBASE_MEASUREMENT_ID}}",
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
