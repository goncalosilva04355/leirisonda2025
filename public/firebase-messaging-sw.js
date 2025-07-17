// Firebase Cloud Messaging Service Worker - CONFIGURAÇÃO SEGURA
console.log(
  "[SW] Firebase Messaging Service Worker iniciado com configuração segura",
);

// Configuração será carregada dinamicamente do manifesto ou endpoint
let firebaseConfig = null;
let messaging = null;

// Função para carregar configuração de forma segura
async function loadFirebaseConfig() {
  try {
    // Tentar carregar configuração do arquivo de manifesto ou endpoint
    const response = await fetch("/firebase-config.json");
    if (response.ok) {
      firebaseConfig = await response.json();
      console.log("[SW] Configuração carregada de /firebase-config.json");
      return firebaseConfig;
    }
  } catch (error) {
    console.warn("[SW] Não foi possível carregar firebase-config.json:", error);
  }

  // Fallback: usar configuração mínima apenas com projectId
  firebaseConfig = {
    apiKey: "", // Será preenchido dinamicamente pela aplicação principal
    authDomain: "",
    projectId: "leiria-1cfc9", // Único valor que pode ser público
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  };

  console.log("[SW] Usando configuração fallback mínima");
  return firebaseConfig;
}

// Função para inicializar Firebase quando a configuração estiver disponível
async function initializeFirebase() {
  try {
    // Carregar Firebase scripts
    importScripts(
      "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
    );
    importScripts(
      "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
    );

    const config = await loadFirebaseConfig();

    if (typeof firebase !== "undefined" && config) {
      firebase.initializeApp(config);
      messaging = firebase.messaging();
      console.log(
        "[SW] Firebase inicializado com configuração segura - projeto:",
        config.projectId,
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
}

// Inicializar Firebase quando o Service Worker for instalado
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  event.waitUntil(initializeFirebase());
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

// Listener para receber configuração da aplicação principal
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    firebaseConfig = event.data.config;
    console.log("[SW] Configuração Firebase recebida da aplicação principal");

    // Re-inicializar com a nova configuração se necessário
    if (!messaging) {
      initializeFirebase();
    }
  }
});

console.log(
  "[SW] Firebase Messaging Service Worker pronto - configuração segura",
);
