// Firebase Cloud Messaging Service Worker - versão simplificada e robusta
console.log("[SW] Firebase Messaging Service Worker iniciado");

// Configuração mínima para evitar erros
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria25.firebaseapp.com",
  projectId: "leiria25",
  storageBucket: "leiria25.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};

// Tentar carregar Firebase apenas se necessário
let messaging = null;

try {
  // Carregar Firebase scripts de forma robusta
  importScripts(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
  );

  // Inicializar Firebase apenas se scripts carregaram
  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
    console.log("[SW] Firebase inicializado com sucesso");

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
  // Service Worker continua funcionando como SW básico
}

// Service Worker básico sempre funciona
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker ativado");
  event.waitUntil(clients.claim());
});

// Handle notification clicks
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

console.log("[SW] Firebase Messaging Service Worker pronto");
