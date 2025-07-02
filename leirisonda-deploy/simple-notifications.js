// SIMPLE NOTIFICATIONS - Sistema simplificado e direto de notificações

console.log("🔔 SIMPLE: Iniciando notificações simplificadas...");

(function () {
  "use strict";

  let permissionGranted = false;

  // Verificar se notificações são suportadas
  function checkSupport() {
    if (!("Notification" in window)) {
      console.error("🔔 SIMPLE: Notificações não suportadas");
      return false;
    }

    console.log("🔔 SIMPLE: Notificações suportadas");
    console.log("🔔 SIMPLE: Permissão atual:", Notification.permission);
    return true;
  }

  // Pedir permissão de forma simples
  async function requestPermission() {
    if (!checkSupport()) return false;

    try {
      const permission = await Notification.requestPermission();
      console.log("🔔 SIMPLE: Nova permissão:", permission);

      if (permission === "granted") {
        permissionGranted = true;
        console.log("✅ SIMPLE: Permissão concedida!");

        // Teste imediato
        showNotification(
          "Notificações Ativadas!",
          "Sistema pronto para enviar notificações",
        );
        return true;
      } else {
        console.error("❌ SIMPLE: Permissão negada:", permission);
        return false;
      }
    } catch (error) {
      console.error("❌ SIMPLE: Erro ao pedir permissão:", error);
      return false;
    }
  }

  // Mostrar notificação simples
  function showNotification(title, body, options = {}) {
    if (!checkSupport()) {
      console.error("🔔 SIMPLE: Tentativa de notificação sem suporte");
      return false;
    }

    if (Notification.permission !== "granted") {
      console.error("🔔 SIMPLE: Tentativa de notificação sem permissão");
      return false;
    }

    try {
      const defaultOptions = {
        body: body,
        icon: "/leirisonda-logo.svg",
        badge: "/leirisonda-logo.svg",
        tag: "leirisonda-simple",
        requireInteraction: false,
        silent: false,
      };

      const finalOptions = { ...defaultOptions, ...options };

      const notification = new Notification(title, finalOptions);

      notification.onclick = function () {
        console.log("🔔 SIMPLE: Notificação clicada");
        window.focus();
        notification.close();
      };

      notification.onshow = function () {
        console.log("✅ SIMPLE: Notificação mostrada:", title);
      };

      notification.onerror = function (error) {
        console.error("❌ SIMPLE: Erro na notificação:", error);
      };

      console.log("📤 SIMPLE: Notificação enviada:", title);
      return true;
    } catch (error) {
      console.error("❌ SIMPLE: Erro ao criar notificação:", error);
      return false;
    }
  }

  // Auto-pedir permissão no primeiro clique
  function setupAutoPermission() {
    let hasRequested = false;

    document.addEventListener(
      "click",
      async function () {
        if (!hasRequested && Notification.permission === "default") {
          hasRequested = true;
          console.log("🔔 SIMPLE: Pedindo permissão no primeiro clique...");
          await requestPermission();
        }
      },
      { once: true },
    );
  }

  // Detectar criação de obras
  function monitorWorkCreation() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      // Nova obra
      if (key === "leirisonda_new_work_notification") {
        try {
          const data = JSON.parse(value);
          showNotification(
            "Nova Obra Criada",
            `Obra ${data.workSheetNumber} criada por ${data.createdBy}`,
            { tag: "new-work" },
          );
        } catch (e) {
          console.error("🔔 SIMPLE: Erro ao processar obra:", e);
        }
      }

      // Atribuição
      if (key === "leirisonda_assignment_notification") {
        try {
          const data = JSON.parse(value);
          showNotification(
            "Obra Atribuída",
            `A obra ${data.workNumber} foi-lhe atribuída`,
            { tag: "assignment" },
          );
        } catch (e) {
          console.error("🔔 SIMPLE: Erro ao processar atribuição:", e);
        }
      }

      return originalSetItem.call(this, key, value);
    };

    console.log("🔔 SIMPLE: Monitor de obras ativo");
  }

  // Criar botão de teste simples
  function createTestButton() {
    // Remover botão existente
    const existing = document.getElementById("simple-notification-test");
    if (existing) existing.remove();

    const button = document.createElement("button");
    button.id = "simple-notification-test";
    button.innerHTML = "🔔";
    button.style.cssText = `
      position: fixed;
      bottom: 140px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: #10B981;
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 9997;
    `;

    button.title = "Teste Simples de Notificação";

    button.onclick = async function () {
      console.log("🔔 SIMPLE: Botão teste clicado");

      if (Notification.permission === "granted") {
        showNotification("Teste Simples", "Esta é uma notificação de teste");
      } else {
        const granted = await requestPermission();
        if (granted) {
          showNotification(
            "Teste Simples",
            "Permissão concedida e notificação de teste enviada",
          );
        }
      }
    };

    document.body.appendChild(button);
    console.log("🔔 SIMPLE: Botão de teste criado");
  }

  // Função de teste global
  window.testSimpleNotification = function (
    title = "Teste Manual",
    body = "Notificação de teste manual",
  ) {
    return showNotification(title, body);
  };

  // Função de permissão global
  window.requestNotificationPermission = requestPermission;

  // Inicializar com proteção contra erros
  function init() {
    try {
      console.log("🔔 SIMPLE: Iniciando init...");

      if (!checkSupport()) {
        console.warn("🔔 SIMPLE: Suporte limitado, continuando...");
      }

      // Se já tem permissão, ativar
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        permissionGranted = true;
        console.log("✅ SIMPLE: Permissão já concedida");
      }

      setupAutoPermission();
      monitorWorkCreation();

      // Criar botão após 2 segundos
      setTimeout(() => {
        try {
          createTestButton();
        } catch (e) {
          console.error("🔔 SIMPLE: Erro ao criar botão:", e);
        }
      }, 2000);

      console.log("✅ SIMPLE: Sistema simples de notificações ativo");
    } catch (error) {
      console.error("❌ SIMPLE: Erro na inicialização:", error);
    }
  }

  // Executar quando DOM estiver pronto com proteção
  function safeInit() {
    try {
      init();
    } catch (error) {
      console.error("❌ SIMPLE: Erro crítico:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit);
  } else {
    // Aguardar um pouco antes de inicializar
    setTimeout(safeInit, 100);
  }
})();
