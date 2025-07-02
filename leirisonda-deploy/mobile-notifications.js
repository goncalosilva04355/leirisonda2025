// MOBILE NOTIFICATIONS - Sistema específico para dispositivos móveis

console.log("📱 MOBILE: Iniciando notificações para mobile...");

(function () {
  "use strict";

  let isMobile = false;
  let isIOS = false;
  let isStandalone = false;

  // Detectar dispositivo móvel
  function detectMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
      userAgent,
    );
    isIOS = /iphone|ipad|ipod/.test(userAgent);
    isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://");

    console.log("📱 MOBILE: Device info:", {
      isMobile,
      isIOS,
      isStandalone,
      userAgent: userAgent.substring(0, 100),
    });

    return isMobile;
  }

  // Verificar se pode usar notificações no mobile
  function checkMobileNotificationSupport() {
    if (!("Notification" in window)) {
      console.error("📱 MOBILE: Notification API não suportada");
      return false;
    }

    if (!("serviceWorker" in navigator)) {
      console.warn(
        "📱 MOBILE: Service Worker não suportado - notificações limitadas",
      );
    }

    console.log("📱 MOBILE: Support check:", {
      notification: "Notification" in window,
      serviceWorker: "serviceWorker" in navigator,
      permission: Notification.permission,
      pushManager: "PushManager" in window,
    });

    return true;
  }

  // Request permission específico para mobile
  async function requestMobilePermission() {
    if (!checkMobileNotificationSupport()) {
      showMobileAlert("❌ Notificações não suportadas neste dispositivo");
      return false;
    }

    try {
      // Para iOS, mostrar instruções específicas
      if (isIOS && !isStandalone) {
        showMobileAlert(
          "📱 iOS: Para receber notificações, adicione esta página ao ecrã inicial primeiro!",
        );
        return false;
      }

      console.log("📱 MOBILE: Pedindo permissão...");
      const permission = await Notification.requestPermission();

      console.log("📱 MOBILE: Permissão recebida:", permission);

      if (permission === "granted") {
        showMobileAlert("✅ Notificações ativadas!");

        // Teste imediato
        setTimeout(() => {
          showMobileNotification(
            "Teste Mobile",
            "Notificações funcionam no seu dispositivo!",
          );
        }, 1000);

        return true;
      } else {
        showMobileAlert(
          "❌ Permissão de notificação negada. Ative nas configurações do browser.",
        );
        return false;
      }
    } catch (error) {
      console.error("📱 MOBILE: Erro ao pedir permissão:", error);
      showMobileAlert("❌ Erro: " + error.message);
      return false;
    }
  }

  // Mostrar notificação específica para mobile
  function showMobileNotification(title, body, options = {}) {
    if (!checkMobileNotificationSupport()) {
      showMobileAlert(title + ": " + body);
      return false;
    }

    if (Notification.permission !== "granted") {
      console.warn("📱 MOBILE: Sem permissão para notificação");
      showMobileAlert("❌ Ative as notificações primeiro!");
      return false;
    }

    try {
      const defaultOptions = {
        body: body,
        icon: "/leirisonda-logo.svg",
        badge: "/leirisonda-logo.svg",
        tag: "leirisonda-mobile",
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200], // Vibração para mobile
        ...options,
      };

      const notification = new Notification(title, defaultOptions);

      notification.onclick = function () {
        console.log("📱 MOBILE: Notificação clicada");
        window.focus();
        notification.close();
      };

      notification.onshow = function () {
        console.log("✅ MOBILE: Notificação mostrada:", title);
      };

      notification.onerror = function (error) {
        console.error("❌ MOBILE: Erro na notificação:", error);
        showMobileAlert("Erro na notificação: " + title);
      };

      return true;
    } catch (error) {
      console.error("❌ MOBILE: Erro ao criar notificação:", error);
      showMobileAlert("Erro: " + error.message);
      return false;
    }
  }

  // Alert visual para mobile (fallback)
  function showMobileAlert(message) {
    console.log("📱 MOBILE ALERT:", message);

    // Criar alert visual no topo da tela
    const alertDiv = document.createElement("div");
    alertDiv.innerHTML = message;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1E40AF;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 90%;
      text-align: center;
    `;

    document.body.appendChild(alertDiv);

    // Remove após 5 segundos
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 5000);

    // Vibrar se suportado
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  // Criar botão de teste específico para mobile
  function createMobileTestButton() {
    if (!isMobile) return;

    const button = document.createElement("button");
    button.innerHTML = "📱 TESTE MOBILE";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #10B981;
      color: white;
      border: none;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 9999;
      min-width: 200px;
    `;

    button.onclick = async function () {
      console.log("📱 MOBILE: Botão teste clicado");

      if (Notification.permission === "granted") {
        showMobileNotification(
          "Teste Mobile",
          "Esta é uma notificação de teste para o seu dispositivo móvel!",
        );
      } else {
        await requestMobilePermission();
      }
    };

    document.body.appendChild(button);
    console.log("📱 MOBILE: Botão de teste criado");
  }

  // Instruções específicas para cada plataforma
  function showPlatformInstructions() {
    if (!isMobile) return;

    let instructions = "";

    if (isIOS) {
      instructions = `
        📱 INSTRUÇÕES iOS:
        1. Clique no botão de partilha (🔗) no Safari
        2. Escolha "Adicionar ao ecrã inicial"
        3. Abra a app a partir do ecrã inicial
        4. Teste as notificações novamente
      `;
    } else {
      instructions = `
        📱 INSTRUÇÕES ANDROID:
        1. Clique nos 3 pontos (⋮) no Chrome
        2. Escolha "Adicionar ao ecrã inicial"
        3. Ou clique em "Instalar app" se aparecer
        4. Abra a app instalada
        5. Teste as notificações
      `;
    }

    console.log(instructions);

    // Mostrar instruções após um delay
    setTimeout(() => {
      if (!isStandalone) {
        showMobileAlert(instructions);
      }
    }, 3000);
  }

  // Monitor para obras e atribuições (mobile)
  function setupMobileWorkMonitor() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      if (key === "leirisonda_new_work_notification") {
        try {
          const data = JSON.parse(value);
          showMobileNotification(
            "🏗️ Nova Obra",
            `Obra ${data.workSheetNumber} criada`,
            { tag: "new-work" },
          );
        } catch (e) {
          console.error("📱 MOBILE: Erro ao processar obra:", e);
        }
      }

      if (key === "leirisonda_assignment_notification") {
        try {
          const data = JSON.parse(value);
          showMobileNotification(
            "👥 Obra Atribuída",
            `Obra ${data.workNumber} foi-lhe atribuída`,
            { tag: "assignment" },
          );
        } catch (e) {
          console.error("📱 MOBILE: Erro ao processar atribuição:", e);
        }
      }

      return originalSetItem.call(this, key, value);
    };
  }

  // Funções globais para mobile
  window.testMobileNotification = function () {
    return showMobileNotification(
      "Teste Manual",
      "Teste manual de notificação mobile",
    );
  };

  window.requestMobileNotificationPermission = requestMobilePermission;

  // Inicializar sistema mobile
  function initMobile() {
    detectMobile();

    if (isMobile) {
      console.log(
        "📱 MOBILE: Dispositivo móvel detectado - configurando sistema específico",
      );

      setupMobileWorkMonitor();
      showPlatformInstructions();

      // Criar botão após delay
      setTimeout(createMobileTestButton, 2000);

      // Auto-request se já em standalone mode
      if (isStandalone && Notification.permission === "default") {
        setTimeout(requestMobilePermission, 3000);
      }
    } else {
      console.log(
        "📱 MOBILE: Dispositivo desktop detectado - sistema mobile não necessário",
      );
    }
  }

  // Executar quando pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobile);
  } else {
    initMobile();
  }
})();
