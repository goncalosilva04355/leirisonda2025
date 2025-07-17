// Firebase Cloud Messaging Service Worker - CONFIGURAÇÃO CORRETA
console.log(
  "[SW] Firebase Messaging Service Worker iniciado com configuração correta",
);

// Configuração usando environment variables
const firebaseConfig = {
  apiKey: self.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: self.VITE_FIREBASE_APP_ID || "placeholder-app-id",
  measurementId: "G-Q2QWQVH60L",
};

let messaging = null;

try {
  // Carregar Firebase scripts
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
      "[SW] Firebase inicializado com configuração correta - projeto:",
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
  console.warn("[SW] Firebase não pôde ser inicializado:", error);
}

// Service Worker básico
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker ativado");
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
  "[SW] Firebase Messaging Service Worker pronto - projeto leiria-1cfc9",
);
