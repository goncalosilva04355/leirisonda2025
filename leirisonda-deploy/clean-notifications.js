// CLEAN NOTIFICATIONS - Sistema limpo sem botões visíveis

console.log("🔔 CLEAN: Iniciando sistema limpo de notificações...");

(function () {
  "use strict";

  let notificationsEnabled = false;

  // Verificar suporte e permissão
  function checkNotificationSupport() {
    if (!("Notification" in window)) {
      console.log("🔔 CLEAN: Notificações não suportadas");
      return false;
    }

    if (Notification.permission === "granted") {
      notificationsEnabled = true;
      console.log("🔔 CLEAN: Notificações já ativadas");
    }

    return true;
  }

  // Mostrar notificação limpa
  function showCleanNotification(title, body, options = {}) {
    if (!notificationsEnabled) return false;

    try {
      const notification = new Notification(title, {
        body: body,
        icon: "/leirisonda-logo.svg",
        badge: "/leirisonda-logo.svg",
        requireInteraction: false,
        silent: false,
        ...options,
      });

      notification.onclick = function () {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error("🔔 CLEAN: Erro ao mostrar notificação:", error);
      return false;
    }
  }

  // Monitor para obras e atribuições (limpo)
  function setupCleanMonitoring() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      // Nova obra
      if (key === "leirisonda_new_work_notification") {
        try {
          const data = JSON.parse(value);
          showCleanNotification(
            "Nova Obra Criada",
            `Obra ${data.workSheetNumber} criada por ${data.createdBy}`,
            { tag: "new-work" },
          );
        } catch (e) {
          console.error("🔔 CLEAN: Erro ao processar obra:", e);
        }
      }

      // Atribuição
      if (key === "leirisonda_assignment_notification") {
        try {
          const data = JSON.parse(value);
          showCleanNotification(
            "Obra Atribuída",
            `A obra ${data.workNumber} foi-lhe atribuída`,
            { tag: "assignment" },
          );
        } catch (e) {
          console.error("🔔 CLEAN: Erro ao processar atribuição:", e);
        }
      }

      return originalSetItem.call(this, key, value);
    };
  }

  // Funções globais para sistema de configurações
  window.requestCleanNotificationPermission = async function () {
    if (!("Notification" in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        notificationsEnabled = true;
        showCleanNotification(
          "Notificações Ativadas",
          "Sistema pronto para enviar notificações",
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("🔔 CLEAN: Erro ao pedir permissão:", error);
      return false;
    }
  };

  window.testCleanNotification = function (
    title = "Teste",
    body = "Notificação de teste",
  ) {
    return showCleanNotification(title, body);
  };

  window.getNotificationStatus = function () {
    return {
      supported: "Notification" in window,
      permission:
        typeof Notification !== "undefined"
          ? Notification.permission
          : "unknown",
      enabled: notificationsEnabled,
    };
  };

  // Inicializar sistema limpo
  function init() {
    checkNotificationSupport();
    setupCleanMonitoring();
    console.log("🔔 CLEAN: Sistema limpo de notificações ativo");
  }

  // Executar quando pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
