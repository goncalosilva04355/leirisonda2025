// UNIVERSAL NOTIFICATION BUTTON - Botão visível para todos os dispositivos

console.log("🔔 UNIVERSAL: Criando botão universal de notificações...");

(function () {
  "use strict";

  function createUniversalButton() {
    // Remove botões existentes
    const existingButtons = document.querySelectorAll(
      "#universal-notification-btn, #mobile-test-btn, #simple-notification-test",
    );
    existingButtons.forEach((btn) => btn.remove());

    // Criar botão grande e bem visível
    const button = document.createElement("button");
    button.id = "universal-notification-btn";
    button.innerHTML = "🔔 TESTAR NOTIFICAÇÕES";

    button.style.cssText = `
      position: fixed !important;
      top: 50% !important;
      right: 20px !important;
      transform: translateY(-50%) !important;
      background: #10B981 !important;
      color: white !important;
      border: none !important;
      padding: 20px 15px !important;
      border-radius: 15px !important;
      font-size: 14px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
      z-index: 99999 !important;
      min-width: 160px !important;
      text-align: center !important;
      writing-mode: vertical-rl !important;
      text-orientation: mixed !important;
      letter-spacing: 2px !important;
      transition: all 0.3s ease !important;
    `;

    // Hover effect
    button.onmouseenter = function () {
      this.style.transform = "translateY(-50%) scale(1.05)";
      this.style.background = "#059669";
    };

    button.onmouseleave = function () {
      this.style.transform = "translateY(-50%) scale(1)";
      this.style.background = "#10B981";
    };

    button.onclick = async function () {
      console.log("🔔 UNIVERSAL: Botão clicado!");

      // Log do dispositivo
      console.log("🔔 Device info:", {
        userAgent: navigator.userAgent,
        isMobile:
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ),
        notificationSupport: "Notification" in window,
        permission:
          typeof Notification !== "undefined"
            ? Notification.permission
            : "não suportado",
      });

      // Verificar suporte
      if (!("Notification" in window)) {
        alert("❌ Este browser não suporta notificações");
        return;
      }

      // Pedir permissão se necessário
      if (Notification.permission === "default") {
        console.log("🔔 Pedindo permissão...");

        try {
          const permission = await Notification.requestPermission();
          console.log("🔔 Permissão:", permission);

          if (permission !== "granted") {
            alert(
              "❌ Permissão de notificação negada. Ative nas configurações do browser.",
            );
            return;
          }
        } catch (error) {
          console.error("🔔 Erro ao pedir permissão:", error);
          alert("❌ Erro ao pedir permissão: " + error.message);
          return;
        }
      }

      // Testar notificação
      if (Notification.permission === "granted") {
        try {
          const notification = new Notification("🔔 Teste Leirisonda", {
            body: "Se vê esta notificação, o sistema funciona!",
            icon: "/leirisonda-logo.svg",
            tag: "teste-universal",
            requireInteraction: true,
          });

          notification.onclick = function () {
            console.log("🔔 Notificação clicada!");
            window.focus();
            notification.close();
          };

          console.log("✅ Notificação enviada!");

          // Feedback visual
          this.innerHTML = "✅ NOTIFICAÇÃO ENVIADA!";
          this.style.background = "#059669";

          setTimeout(() => {
            this.innerHTML = "🔔 TESTAR NOTIFICAÇÕES";
            this.style.background = "#10B981";
          }, 3000);
        } catch (error) {
          console.error("❌ Erro ao enviar notificação:", error);
          alert("❌ Erro ao enviar notificação: " + error.message);
        }
      } else {
        alert(
          "❌ Sem permissão para notificações. Verifique as configurações do browser.",
        );
      }
    };

    document.body.appendChild(button);
    console.log("🔔 UNIVERSAL: Botão criado e posicionado na lateral direita");

    // Mostrar instruções
    setTimeout(() => {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        console.log(
          "📱 INSTRUÇÕES iOS: Para receber notificações, adicione esta página ao ecrã inicial primeiro!",
        );
      } else if (/Android/i.test(navigator.userAgent)) {
        console.log(
          "📱 INSTRUÇÕES ANDROID: Certifique-se que as notificações estão ativadas nas configurações do browser",
        );
      }
    }, 2000);
  }

  // Criar botão adicional no fundo para mobile
  function createMobileButton() {
    const mobileButton = document.createElement("button");
    mobileButton.innerHTML = "📱 TESTE MOBILE";
    mobileButton.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: #EF4444 !important;
      color: white !important;
      border: none !important;
      padding: 15px 25px !important;
      border-radius: 25px !important;
      font-size: 16px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
      z-index: 99998 !important;
      min-width: 200px !important;
    `;

    mobileButton.onclick = function () {
      // Mesmo comportamento do botão universal
      document.getElementById("universal-notification-btn").click();
    };

    document.body.appendChild(mobileButton);
    console.log("📱 Botão mobile adicional criado no fundo");
  }

  // Criar função global para teste
  window.testarNotificacoes = function () {
    document.getElementById("universal-notification-btn")?.click();
  };

  // Inicializar
  function init() {
    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
      createUniversalButton();

      // Se for mobile, criar botão adicional
      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
      ) {
        createMobileButton();
      }

      console.log("🔔 UNIVERSAL: Sistema pronto!");
      console.log("🔔 Pode também testar digitando: testarNotificacoes()");
    }, 2000);
  }

  // Executar quando DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
