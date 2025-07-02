// NOTIFICATION MANAGER - Sistema completo de notificações push

console.log("📱 NOTIFICATIONS: Iniciando sistema de notificações...");

(function () {
  "use strict";

  let notificationsEnabled = false;
  let subscription = null;

  // Check if notifications are supported
  function isNotificationSupported() {
    return (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    );
  }

  // Request notification permission
  async function requestNotificationPermission() {
    if (!isNotificationSupported()) {
      console.log("📱 Notificações não suportadas neste browser");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log("📱 Permissão de notificações:", permission);

      if (permission === "granted") {
        notificationsEnabled = true;
        await setupPushSubscription();
        return true;
      }

      return false;
    } catch (error) {
      console.error("📱 Erro ao pedir permissão:", error);
      return false;
    }
  }

  // Setup push subscription
  async function setupPushSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: null, // Will use browser's default
        });

        console.log("📱 Nova subscrição push criada");
      } else {
        console.log("📱 Subscrição push existente encontrada");
      }

      // Store subscription info
      localStorage.setItem(
        "pushSubscription",
        JSON.stringify(subscription.toJSON()),
      );

      return subscription;
    } catch (error) {
      console.error("📱 Erro ao configurar push subscription:", error);
      return null;
    }
  }

  // Send local notification
  function showLocalNotification(title, options = {}) {
    if (!notificationsEnabled) {
      console.log("📱 Notificações não habilitadas");
      return;
    }

    const defaultOptions = {
      body: "",
      icon: "/leirisonda-logo.svg",
      badge: "/leirisonda-logo.svg",
      tag: "leirisonda-local",
      requireInteraction: true,
      silent: false,
      timestamp: Date.now(),
    };

    const notificationOptions = { ...defaultOptions, ...options };

    if (Notification.permission === "granted") {
      new Notification(title, notificationOptions);
      console.log("📱 Notificação local enviada:", title);
    }
  }

  // Send notification to service worker (for background)
  async function sendBackgroundNotification(title, body, data = {}) {
    try {
      const registration = await navigator.serviceWorker.ready;

      if (registration.active) {
        registration.active.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
          data,
        });

        console.log("📱 Notificação background enviada");
      }
    } catch (error) {
      console.error("📱 Erro ao enviar notificação background:", error);
    }
  }

  // Monitor localStorage for notification triggers
  function monitorNotificationTriggers() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      // Check for work notifications
      if (key === "leirisonda_new_work_notification") {
        try {
          const data = JSON.parse(value);
          showLocalNotification("Nova Obra Criada", {
            body: `Obra ${data.workSheetNumber} foi criada por ${data.createdBy}`,
            tag: "new-work",
            data: { workId: data.workId },
          });
        } catch (e) {
          console.error("📱 Erro ao processar notificação de obra:", e);
        }
      }

      // Check for maintenance notifications
      if (key === "leirisonda_maintenance_notification") {
        try {
          const data = JSON.parse(value);
          showLocalNotification("Manutenção Agendada", {
            body: `Manutenção marcada para ${data.date}`,
            tag: "maintenance",
            data: { maintenanceId: data.id },
          });
        } catch (e) {
          console.error("📱 Erro ao processar notificação de manutenção:", e);
        }
      }

      // Check for user assignment notifications
      if (key === "leirisonda_assignment_notification") {
        try {
          const data = JSON.parse(value);
          showLocalNotification("Nova Atribuição", {
            body: `Foi-lhe atribuída a obra ${data.workNumber}`,
            tag: "assignment",
            data: { workId: data.workId },
          });
        } catch (e) {
          console.error("📱 Erro ao processar notificação de atribuição:", e);
        }
      }

      return originalSetItem.call(this, key, value);
    };
  }

  // Auto-request permission on interaction
  function setupAutoPermissionRequest() {
    let permissionRequested = localStorage.getItem(
      "notificationPermissionRequested",
    );

    if (!permissionRequested && isNotificationSupported()) {
      // Request on first meaningful interaction
      document.addEventListener(
        "click",
        async function requestOnce() {
          document.removeEventListener("click", requestOnce);

          setTimeout(async () => {
            const granted = await requestNotificationPermission();
            localStorage.setItem("notificationPermissionRequested", "true");

            if (granted) {
              showLocalNotification("Notificações Ativadas", {
                body: "Irá receber notificações sobre obras e manutenções",
                tag: "welcome",
              });
            }
          }, 1000);
        },
        { once: true },
      );
    }
  }

  // Expose functions globally
  window.NotificationManager = {
    isSupported: isNotificationSupported,
    requestPermission: requestNotificationPermission,
    showLocal: showLocalNotification,
    sendBackground: sendBackgroundNotification,
    isEnabled: () => notificationsEnabled,
  };

  // Initialize
  function init() {
    console.log("📱 Inicializando sistema de notificações...");

    // Check current permission
    if (isNotificationSupported() && Notification.permission === "granted") {
      notificationsEnabled = true;
      setupPushSubscription();
    }

    // Setup monitoring and auto-request
    monitorNotificationTriggers();
    setupAutoPermissionRequest();

    console.log("✅ Sistema de notificações pronto");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
