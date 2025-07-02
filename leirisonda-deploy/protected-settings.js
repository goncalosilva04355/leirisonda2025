// PROTECTED SETTINGS - Se��ão de configurações protegida por senha

console.log("⚙️ SETTINGS: Iniciando seção de configurações protegida...");

(function () {
  "use strict";

  const ADMIN_PASSWORD = "19867";
  let isSettingsUnlocked = false;
  let settingsModalOpen = false;

  // Verificar se o utilizador já desbloqueou as configurações na sessão
  function checkSessionUnlock() {
    const sessionUnlock = sessionStorage.getItem(
      "leirisonda_settings_unlocked",
    );
    if (sessionUnlock === "true") {
      isSettingsUnlocked = true;
      console.log("⚙️ SETTINGS: Configurações já desbloqueadas nesta sessão");
    }
  }

  // Pedir senha para acesso às configurações
  function requestPasswordAccess() {
    const password = prompt(
      "🔐 Introduza a senha para aceder às configurações avançadas:",
    );

    if (password === ADMIN_PASSWORD) {
      isSettingsUnlocked = true;
      sessionStorage.setItem("leirisonda_settings_unlocked", "true");
      console.log("✅ SETTINGS: Acesso às configurações concedido");
      showSettingsModal();
      return true;
    } else if (password !== null) {
      alert("❌ Senha incorreta!");
      return false;
    }
    return false;
  }

  // Mostrar modal de configurações
  function showSettingsModal() {
    if (settingsModalOpen) return;
    settingsModalOpen = true;

    const modal = document.createElement("div");
    modal.id = "settings-modal";
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 50000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      ">
        <div style="
          background: white;
          border-radius: 15px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
          ">
            <h2 style="
              margin: 0;
              color: #1E40AF;
              font-size: 24px;
              font-weight: bold;
            ">⚙️ Configurações Avançadas</h2>
            <button id="close-settings" style="
              background: #EF4444;
              color: white;
              border: none;
              border-radius: 50%;
              width: 35px;
              height: 35px;
              cursor: pointer;
              font-size: 18px;
            ">✕</button>
          </div>

          <!-- Seção Notificações -->
          <div style="margin-bottom: 30px;">
            <h3 style="
              color: #1E40AF;
              margin: 0 0 15px 0;
              font-size: 18px;
              border-left: 4px solid #10B981;
              padding-left: 10px;
            ">📱 Gestão de Notificações</h3>

            <div style="display: grid; gap: 15px;">
              <div style="
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #10B981;
              ">
                <div style="margin-bottom: 10px;">
                  <strong>Estado Atual:</strong>
                  <span id="notification-status" style="color: #10B981;">Verificando...</span>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <button id="request-notifications" style="
                    background: #10B981;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                  ">🔔 Ativar Notificações</button>

                  <button id="test-notification" style="
                    background: #3B82F6;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                  ">📨 Teste de Notificação</button>

                  <button id="test-work-notification" style="
                    background: #8B5CF6;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                  ">🏗️ Teste Obra</button>

                  <button id="test-assignment-notification" style="
                    background: #F59E0B;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                  ">👥 Teste Atribuição</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Seção Token Management -->
          <div style="margin-bottom: 30px;">
            <h3 style="
              color: #1E40AF;
              margin: 0 0 15px 0;
              font-size: 18px;
              border-left: 4px solid #EF4444;
              padding-left: 10px;
            ">🔑 Gestão de Tokens</h3>

            <div style="
              background: #fff5f5;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #EF4444;
            ">
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                  Token de Notificações Push:
                </label>
                <textarea id="push-token" readonly style="
                  width: 100%;
                  height: 80px;
                  padding: 10px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  font-family: monospace;
                  font-size: 12px;
                  background: #f9f9f9;
                " placeholder="Token será gerado após ativar notificações..."></textarea>
              </div>

              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="generate-token" style="
                  background: #EF4444;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                ">🔑 Gerar Token</button>

                <button id="copy-token" style="
                  background: #6B7280;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                ">📋 Copiar Token</button>

                <button id="refresh-token" style="
                  background: #F59E0B;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                ">🔄 Renovar Token</button>
              </div>
            </div>
          </div>

          <!-- Seção Diagnósticos -->
          <div style="margin-bottom: 20px;">
            <h3 style="
              color: #1E40AF;
              margin: 0 0 15px 0;
              font-size: 18px;
              border-left: 4px solid #8B5CF6;
              padding-left: 10px;
            ">🔧 Diagnósticos e Testes</h3>

            <div style="
              background: #faf5ff;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #8B5CF6;
            ">
              <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                <button id="test-undefined-fix" style="
                  background: #8B5CF6;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                ">🧪 Teste Undefined Fix</button>

                <button id="show-system-info" style="
                  background: #6B7280;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                ">ℹ️ Info do Sistema</button>

                <button id="clear-cache" style="
                  background: #EF4444;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                ">🗑️ Limpar Cache</button>

                <button id="total-reset" style="
                  background: #DC2626;
                  color: white;
                  border: none;
                  padding: 8px 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: bold;
                ">💥 RESET TOTAL</button>
              </div>

              <div id="diagnostics-output" style="
                background: #000;
                color: #00ff00;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                max-height: 200px;
                overflow-y: auto;
                display: none;
              "></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setupModalEventListeners();
    updateNotificationStatus();
    generatePushToken();
  }

  // Configurar event listeners do modal
  function setupModalEventListeners() {
    // Fechar modal
    document.getElementById("close-settings").onclick = function () {
      closeSettingsModal();
    };

    // Clicar fora do modal para fechar
    document.getElementById("settings-modal").onclick = function (e) {
      if (e.target === this) {
        closeSettingsModal();
      }
    };

    // Botões de notificação
    document.getElementById("request-notifications").onclick =
      async function () {
        if (window.requestCleanNotificationPermission) {
          const granted = await window.requestCleanNotificationPermission();
          updateNotificationStatus();
          if (granted) {
            generatePushToken();
          }
        } else if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          updateNotificationStatus();
        }
      };

    document.getElementById("test-notification").onclick = function () {
      if (window.testCleanNotification) {
        window.testCleanNotification(
          "Teste das Configurações",
          "Notificação de teste enviada das configurações avançadas",
        );
      } else if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("Teste das Configurações", {
          body: "Notificação de teste enviada das configurações avançadas",
          icon: "/leirisonda-logo.svg",
        });
      }
    };

    document.getElementById("test-work-notification").onclick = function () {
      const workData = {
        workId: "CONFIG_TEST_" + Date.now(),
        workSheetNumber: "OB-CONFIG-" + Math.floor(Math.random() * 1000),
        createdBy: "Administrador",
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        "leirisonda_new_work_notification",
        JSON.stringify(workData),
      );
      logOutput("✅ Notificação de obra de teste disparada");
    };

    document.getElementById("test-assignment-notification").onclick =
      function () {
        const assignmentData = {
          userId: "admin_config",
          userName: "Administrador Config",
          workId: "ASSIGN_CONFIG_" + Date.now(),
          workNumber: "OB-ASSIGN-" + Math.floor(Math.random() * 1000),
          clientName: "Cliente Teste Configurações",
          timestamp: new Date().toISOString(),
          type: "work_assignment",
        };
        localStorage.setItem(
          "leirisonda_assignment_notification",
          JSON.stringify(assignmentData),
        );
        logOutput("✅ Notificação de atribuição de teste disparada");
      };

    // Botões de token
    document.getElementById("generate-token").onclick = generatePushToken;
    document.getElementById("copy-token").onclick = copyTokenToClipboard;
    document.getElementById("refresh-token").onclick = refreshPushToken;

    // Botões de diagnóstico
    document.getElementById("test-undefined-fix").onclick = function () {
      if (window.testUndefinedRemoval) {
        window.testUndefinedRemoval();
      } else {
        logOutput("❌ Função de teste undefined não encontrada");
      }
    };

    document.getElementById("show-system-info").onclick = showSystemInfo;
    document.getElementById("clear-cache").onclick = clearApplicationCache;
    document.getElementById("total-reset").onclick = performTotalReset;
  }

  // Atualizar status das notificações
  function updateNotificationStatus() {
    const statusEl = document.getElementById("notification-status");
    if (!statusEl) return;

    if (!("Notification" in window)) {
      statusEl.textContent = "❌ Não suportado";
      statusEl.style.color = "#EF4444";
    } else {
      const permission = Notification.permission;
      switch (permission) {
        case "granted":
          statusEl.textContent = "✅ Ativado";
          statusEl.style.color = "#10B981";
          break;
        case "denied":
          statusEl.textContent = "❌ Bloqueado";
          statusEl.style.color = "#EF4444";
          break;
        default:
          statusEl.textContent = "⚠️ Pendente";
          statusEl.style.color = "#F59E0B";
      }
    }
  }

  // Gerar token push
  async function generatePushToken() {
    const tokenEl = document.getElementById("push-token");
    if (!tokenEl) return;

    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const token = JSON.stringify(subscription.toJSON(), null, 2);
          tokenEl.value = token;
          logOutput("✅ Token push gerado com sucesso");
        } else {
          const newSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: null,
          });
          const token = JSON.stringify(newSubscription.toJSON(), null, 2);
          tokenEl.value = token;
          logOutput("✅ Nova subscrição push criada e token gerado");
        }
      } else {
        tokenEl.value = "Push Manager não suportado neste browser";
        logOutput("❌ Push Manager não suportado");
      }
    } catch (error) {
      tokenEl.value = "Erro ao gerar token: " + error.message;
      logOutput("❌ Erro ao gerar token: " + error.message);
    }
  }

  // Copiar token para clipboard
  async function copyTokenToClipboard() {
    const tokenEl = document.getElementById("push-token");
    if (!tokenEl || !tokenEl.value) {
      alert("❌ Nenhum token para copiar");
      return;
    }

    try {
      await navigator.clipboard.writeText(tokenEl.value);
      logOutput("✅ Token copiado para o clipboard");
      alert("✅ Token copiado para o clipboard!");
    } catch (error) {
      // Fallback para browsers mais antigos
      tokenEl.select();
      document.execCommand("copy");
      logOutput("✅ Token copiado (fallback method)");
      alert("✅ Token copiado!");
    }
  }

  // Renovar token push
  async function refreshPushToken() {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          logOutput("🔄 Subscrição anterior removida");
        }

        await generatePushToken();
        logOutput("✅ Token renovado com sucesso");
      }
    } catch (error) {
      logOutput("❌ Erro ao renovar token: " + error.message);
    }
  }

  // Mostrar informações do sistema
  function showSystemInfo() {
    const diagnosticsEl = document.getElementById("diagnostics-output");
    if (!diagnosticsEl) return;

    const info = {
      "User Agent": navigator.userAgent,
      Platform: navigator.platform,
      Language: navigator.language,
      Online: navigator.onLine,
      "Cookies Enabled": navigator.cookieEnabled,
      "Screen Resolution": `${screen.width}x${screen.height}`,
      Viewport: `${window.innerWidth}x${window.innerHeight}`,
      "Local Storage": typeof Storage !== "undefined",
      "Session Storage": typeof sessionStorage !== "undefined",
      "Service Worker": "serviceWorker" in navigator,
      "Push Manager": "PushManager" in window,
      "Notification API": "Notification" in window,
      "Notification Permission":
        typeof Notification !== "undefined" ? Notification.permission : "N/A",
    };

    let output = "=== INFORMAÇÕES DO SISTEMA ===\n\n";
    for (const [key, value] of Object.entries(info)) {
      output += `${key}: ${value}\n`;
    }

    diagnosticsEl.textContent = output;
    diagnosticsEl.style.display = "block";
    logOutput("ℹ️ Informações do sistema mostradas");
  }

  // Limpar cache da aplicação
  async function clearApplicationCache() {
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
        logOutput(`✅ ${cacheNames.length} caches limpos`);
      }

      // Limpar localStorage específico
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("leirisonda_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      logOutput(`✅ ${keysToRemove.length} itens localStorage removidos`);

      // Limpar sessionStorage
      sessionStorage.clear();
      logOutput("✅ Session storage limpo");

      alert("✅ Cache da aplicação limpo com sucesso!");
    } catch (error) {
      logOutput("❌ Erro ao limpar cache: " + error.message);
      alert("❌ Erro ao limpar cache: " + error.message);
    }
  }

  // Log output para área de diagnósticos
  function logOutput(message) {
    const diagnosticsEl = document.getElementById("diagnostics-output");
    if (diagnosticsEl) {
      const timestamp = new Date().toLocaleTimeString();
      diagnosticsEl.textContent += `[${timestamp}] ${message}\n`;
      diagnosticsEl.scrollTop = diagnosticsEl.scrollHeight;
      diagnosticsEl.style.display = "block";
    }
    console.log("⚙️ SETTINGS:", message);
  }

  // Fechar modal de configurações
  function closeSettingsModal() {
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.remove();
      settingsModalOpen = false;
    }
  }

  // Adicionar botão de configurações ao sidebar
  function addSettingsToSidebar() {
    // Procurar pelo sidebar
    const sidebarElements = document.querySelectorAll('[data-loc*="Sidebar"]');

    for (const sidebar of sidebarElements) {
      // Procurar por botões de navegação no sidebar
      const navigationButtons = sidebar.querySelectorAll("button");

      for (const button of navigationButtons) {
        // Procurar pelo botão "Terminar Sessão"
        if (
          button.textContent &&
          button.textContent.includes("Terminar Sessão")
        ) {
          // Adicionar botão de configurações antes do botão de logout
          const settingsButton = document.createElement("button");
          settingsButton.innerHTML = `
            <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.349 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.349a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.349 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.349a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Configurações
          `;

          settingsButton.className = button.className;
          settingsButton.style.cssText = `
            width: 100%;
            justify-content: flex-start;
            color: white;
            margin-bottom: 8px;
          `;

          settingsButton.onclick = function () {
            if (isSettingsUnlocked) {
              showSettingsModal();
            } else {
              requestPasswordAccess();
            }
          };

          // Inserir antes do botão de logout
          button.parentNode.insertBefore(settingsButton, button);
          console.log("⚙️ SETTINGS: Botão adicionado ao sidebar");
          return true;
        }
      }
    }

    return false;
  }

  // Função global para acesso direto
  window.openLeirisondaSettings = function () {
    if (isSettingsUnlocked) {
      showSettingsModal();
    } else {
      requestPasswordAccess();
    }
  };

  // Inicializar
  function init() {
    checkSessionUnlock();

    // Tentar adicionar ao sidebar múltiplas vezes
    let attempts = 0;
    const maxAttempts = 20;

    const addToSidebarInterval = setInterval(() => {
      attempts++;

      if (addSettingsToSidebar() || attempts >= maxAttempts) {
        clearInterval(addToSidebarInterval);
        if (attempts >= maxAttempts) {
          console.log(
            "⚙️ SETTINGS: Não foi possível adicionar ao sidebar automaticamente",
          );
          console.log(
            "⚙️ SETTINGS: Use openLeirisondaSettings() para aceder às configurações",
          );
        }
      }
    }, 2000);

    console.log("⚙️ SETTINGS: Sistema de configurações protegidas iniciado");
    console.log("⚙️ SETTINGS: Senha de acesso: 19867");
    console.log("⚙️ SETTINGS: Comando manual: openLeirisondaSettings()");
  }

  // Inicializar quando DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // Aguardar um pouco para a aplicação carregar
    setTimeout(init, 3000);
  }
})();
