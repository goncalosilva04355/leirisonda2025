// TEST NOTIFICATIONS - Utilitário para testar notificações

console.log("🧪 TEST: Carregando teste de notificações...");

(function () {
  "use strict";

  function createTestUI() {
    // Remove existing test UI
    const existing = document.getElementById("notification-test-ui");
    if (existing) existing.remove();

    const testUI = document.createElement("div");
    testUI.id = "notification-test-ui";
    testUI.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1E40AF;
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <h3 style="margin: 0 0 15px 0; font-size: 16px;">📱 Teste de Notificações</h3>

        <div style="margin-bottom: 15px;">
          <div style="margin-bottom: 8px; font-size: 14px;">
            Status: <span id="notification-status">Verificando...</span>
          </div>
          <div style="margin-bottom: 8px; font-size: 14px;">
            Permissão: <span id="notification-permission">-</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="request-permission" style="
            background: #10B981;
            border: none;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          ">🔔 Ativar Notificações</button>

          <button id="test-local" style="
            background: #3B82F6;
            border: none;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          ">📨 Teste Local</button>

          <button id="test-work" style="
            background: #8B5CF6;
            border: none;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          ">🏗️ Simular Nova Obra</button>

          <button id="test-assignment" style="
            background: #F59E0B;
            border: none;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          ">👥 Simular Atribuição</button>

          <button id="close-test" style="
            background: #EF4444;
            border: none;
            color: white;
            padding: 8px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          ">✕ Fechar</button>
        </div>

        <div id="test-log" style="
          margin-top: 15px;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 5px;
          font-size: 12px;
          max-height: 150px;
          overflow-y: auto;
        "></div>
      </div>
    `;

    document.body.appendChild(testUI);

    // Update status
    updateStatus();

    // Event listeners
    document.getElementById("request-permission").onclick = async () => {
      logMessage("Pedindo permissão...");
      const granted = await window.NotificationManager?.requestPermission();
      logMessage(granted ? "✅ Permissão concedida" : "❌ Permissão negada");
      updateStatus();
    };

    document.getElementById("test-local").onclick = () => {
      logMessage("Enviando notificação teste...");
      if (window.NotificationManager?.isEnabled()) {
        window.NotificationManager.showLocal("Teste de Notificação", {
          body: "Esta é uma notificação de teste do Leirisonda",
          tag: "test",
        });
        logMessage("✅ Notificação enviada");
      } else {
        logMessage("❌ Notificações não ativadas");
      }
    };

    document.getElementById("test-work").onclick = () => {
      logMessage("Simulando nova obra...");
      const workData = {
        workId: "TEST_" + Date.now(),
        workSheetNumber: "OB-" + Math.floor(Math.random() * 1000),
        createdBy: "Utilizador Teste",
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        "leirisonda_new_work_notification",
        JSON.stringify(workData),
      );
      logMessage("✅ Obra simulada criada");
    };

    document.getElementById("test-assignment").onclick = () => {
      logMessage("Simulando atribuição de obra...");
      const assignmentData = {
        userId: "user_test",
        userName: "Utilizador Teste",
        workId: "ASSIGN_" + Date.now(),
        workNumber: "OB-" + Math.floor(Math.random() * 1000),
        clientName: "Cliente Teste Lda",
        timestamp: new Date().toISOString(),
        type: "work_assignment",
      };

      localStorage.setItem(
        "leirisonda_assignment_notification",
        JSON.stringify(assignmentData),
      );
      logMessage("✅ Atribuição simulada");
    };

    document.getElementById("close-test").onclick = () => {
      testUI.remove();
    };
  }

  function updateStatus() {
    const statusEl = document.getElementById("notification-status");
    const permissionEl = document.getElementById("notification-permission");

    if (statusEl && permissionEl) {
      const isSupported = window.NotificationManager?.isSupported();
      const isEnabled = window.NotificationManager?.isEnabled();

      statusEl.textContent = isSupported
        ? isEnabled
          ? "✅ Ativado"
          : "⚠️ Disponível"
        : "❌ Não suportado";

      permissionEl.textContent = Notification.permission || "unknown";
    }
  }

  function logMessage(message) {
    const logEl = document.getElementById("test-log");
    if (logEl) {
      const time = new Date().toLocaleTimeString();
      logEl.innerHTML += `<div>${time}: ${message}</div>`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log("🧪 TEST:", message);
  }

  // Auto-create UI on Ctrl+N
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "n") {
      e.preventDefault();
      createTestUI();
    }
  });

  // Create UI button in bottom corner
  function createQuickButton() {
    const button = document.createElement("button");
    button.innerHTML = "📱";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: #1E40AF;
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 9999;
    `;

    button.onclick = createTestUI;
    button.title = "Testar Notificações (Ctrl+N)";

    document.body.appendChild(button);
  }

  // Initialize when ready
  setTimeout(() => {
    if (window.NotificationManager) {
      createQuickButton();
      console.log("🧪 Teste de notificações pronto (Ctrl+N ou botão 📱)");
    }
  }, 2000);
})();
