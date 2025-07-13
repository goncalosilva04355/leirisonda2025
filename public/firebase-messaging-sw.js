// Firebase Cloud Messaging Service Worker - versão compatível Chrome
// Versão simplificada que não falha se Firebase não estiver disponível

console.log("[SW] Service Worker iniciado");

// Tentar carregar Firebase apenas se disponível
let firebaseLoaded = false;
let messaging = null;

try {
  // Carregar scripts Firebase
  importScripts(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
  );

  // Configuração Firebase Leiria
  const firebaseConfig = {
    apiKey: "AIzaSyBdV_hGP4_xzY5kqJLm9NzF3rQ8wXeUvAw",
    authDomain: "leiria-1cfc9.firebaseapp.com",
    databaseURL:
      "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "leiria-1cfc9",
    storageBucket: "leiria-1cfc9.firebasestorage.app",
    messagingSenderId: "947851234567",
    appId: "1:947851234567:web:abcd1234567890abcd1234",
  };

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
  firebaseLoaded = true;

  console.log("[SW] Firebase inicializado com sucesso");
} catch (error) {
  console.warn("[SW] Firebase não disponível:", error);
  firebaseLoaded = false;
}

// Handle background messages apenas se Firebase estiver disponível
if (firebaseLoaded && messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Mensagem em background:", payload);

    const notificationTitle = payload.notification?.title || "Leirisonda";
    const notificationOptions = {
      body: payload.notification?.body || "Nova notificação",
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: "leirisonda-notification",
      data: payload.data || {},
      requireInteraction: false,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notificação clicada");
  event.notification.close();

  // Abrir/focar na aplicação
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    }),
  );
});

// Basic service worker functionality para PWA
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker ativado");
  event.waitUntil(clients.claim());
});

// Handle fetch events (fallback básico)
self.addEventListener("fetch", (event) => {
  // Deixar o browser handle requests normalmente
  // Não interferir com requests para evitar problemas
});

console.log("[SW] Service Worker pronto para Chrome");
