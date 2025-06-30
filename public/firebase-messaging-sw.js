// Firebase Messaging Service Worker para Leirisonda

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Configuração Firebase - Leirisonda Production
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

console.log("🔥 Firebase Messaging Service Worker inicializado");

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("📨 Mensagem recebida em background:", payload);

  try {
    const notificationTitle = payload.notification?.title || "Leirisonda";
    const notificationOptions = {
      body: payload.notification?.body || "Nova notificação",
      icon: "/leirisonda-icon.svg",
      badge: "/leirisonda-icon.svg",
      image: payload.notification?.image,
      data: payload.data || {},
      tag: "leirisonda-notification",
      requireInteraction: true,
      actions: [
        {
          action: "view",
          title: "Ver Detalhes",
          icon: "/leirisonda-icon.svg",
        },
        {
          action: "dismiss",
          title: "Dispensar",
          icon: "/leirisonda-icon.svg",
        },
      ],
    };

    return self.registration.showNotification(
      notificationTitle,
      notificationOptions,
    );
  } catch (error) {
    console.error("❌ Erro ao processar mensagem em background:", error);

    // Fallback: mostrar notificação básica
    return self.registration.showNotification("Leirisonda", {
      body: "Nova notificação disponível",
      icon: "/leirisonda-icon.svg",
      tag: "leirisonda-fallback",
    });
  }
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  console.log("🎯 Clique na notificação:", event);

  event.notification.close();

  if (event.action === "dismiss") {
    console.log("❌ Notificação dispensada");
    return;
  }

  // Abrir/focar na aplicação
  const urlToOpen = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // Verificar se a aplicação já está aberta
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            if (event.notification.data?.workId) {
              client.navigate(`/work/${event.notification.data.workId}`);
            } else {
              client.navigate(urlToOpen);
            }
            return;
          }
        }

        // Se não está aberta, abrir nova janela
        if (clients.openWindow) {
          const finalUrl = event.notification.data?.workId
            ? `/work/${event.notification.data.workId}`
            : urlToOpen;
          return clients.openWindow(self.location.origin + finalUrl);
        }
      }),
  );
});

// Handle push event
self.addEventListener("push", function (event) {
  console.log("📨 Push event recebido:", event);

  try {
    if (event.data) {
      const data = event.data.json();
      console.log("📄 Dados do push:", data);

      const notificationTitle = data.notification?.title || "Leirisonda";
      const notificationOptions = {
        body: data.notification?.body || "Nova notificação",
        icon: "/leirisonda-icon.svg",
        badge: "/leirisonda-icon.svg",
        data: data.data || {},
        tag: "leirisonda-notification",
        requireInteraction: true,
      };

      event.waitUntil(
        self.registration.showNotification(
          notificationTitle,
          notificationOptions,
        ),
      );
    } else {
      console.warn("⚠️ Push event sem dados");

      // Mostrar notificação genérica
      event.waitUntil(
        self.registration.showNotification("Leirisonda", {
          body: "Nova atualização disponível",
          icon: "/leirisonda-icon.svg",
          tag: "leirisonda-generic",
        }),
      );
    }
  } catch (error) {
    console.error("❌ Erro ao processar push event:", error);

    // Fallback: notificação básica
    event.waitUntil(
      self.registration.showNotification("Leirisonda", {
        body: "Erro ao processar notificação",
        icon: "/leirisonda-icon.svg",
        tag: "leirisonda-error",
      }),
    );
  }
});

// Install event
self.addEventListener("install", function (event) {
  console.log("🔧 Service Worker instalado");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", function (event) {
  console.log("✅ Service Worker ativado");
  event.waitUntil(self.clients.claim());
});
