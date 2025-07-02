// INTERFACE DE TESTE PARA MOBILE - Botões visíveis

(function () {
  "use strict";

  console.log("📱 MOBILE TEST: Carregando interface de teste...");

  // Criar container de teste fixo
  function createTestUI() {
    // Remover UI existente se houver
    const existing = document.getElementById("mobile-test-ui");
    if (existing) existing.remove();

    const testContainer = document.createElement("div");
    testContainer.id = "mobile-test-ui";
    testContainer.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-width: 200px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    testContainer.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #4CAF50;">
        🧪 TESTE MOBILE
      </div>
      <div id="test-status" style="margin-bottom: 10px; font-size: 10px;">
        Status: Aguardando...
      </div>
      <button id="test-protections" style="width: 100%; margin: 2px 0; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; font-size: 11px;">
        ✅ Testar Proteções
      </button>
      <button id="force-protections" style="width: 100%; margin: 2px 0; padding: 8px; background: #FF9800; color: white; border: none; border-radius: 4px; font-size: 11px;">
        🛡️ Forçar Proteções
      </button>
      <button id="simulate-obra" style="width: 100%; margin: 2px 0; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 11px;">
        🏗️ Simular Obra
      </button>
      <button id="auto-login" style="width: 100%; margin: 2px 0; padding: 8px; background: #9C27B0; color: white; border: none; border-radius: 4px; font-size: 11px;">
        🔑 Auto Login
      </button>
      <button id="hide-test" style="width: 100%; margin: 2px 0; padding: 6px; background: #f44336; color: white; border: none; border-radius: 4px; font-size: 10px;">
        ❌ Esconder
      </button>
    `;

    document.body.appendChild(testContainer);

    // Função para atualizar status
    function updateStatus(message, color = "white") {
      const statusEl = document.getElementById("test-status");
      if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.color = color;
      }
    }

    // Event listeners
    document.getElementById("test-protections").onclick = () => {
      updateStatus("Testando...", "yellow");
      let count = 0;

      if (window.LEIRISONDA_PROTECTION) count++;
      if (window.ULTIMATE_PROTECTION) count++;

      if (window.firebase) {
        try {
          const auth = window.firebase.auth();
          if (auth) count++;
        } catch (e) {}
      }

      updateStatus(
        `${count} proteções ativas`,
        count > 0 ? "#4CAF50" : "#f44336",
      );
    };

    document.getElementById("force-protections").onclick = () => {
      updateStatus("Ativando...", "yellow");

      try {
        // Bloquear Firebase signOut
        if (window.firebase) {
          const auth = window.firebase.auth();
          if (auth && auth.signOut) {
            auth.signOut = function () {
              updateStatus("SignOut BLOQUEADO!", "#4CAF50");
              return Promise.resolve();
            };
          }
        }

        // Bloquear redirects
        const originalPushState = history.pushState;
        history.pushState = function (state, title, url) {
          if (url && url.includes("/login")) {
            updateStatus("Redirect bloqueado!", "#4CAF50");
            return;
          }
          return originalPushState.apply(this, arguments);
        };

        updateStatus("Proteções ativadas!", "#4CAF50");
      } catch (e) {
        updateStatus("Erro: " + e.message, "#f44336");
      }
    };

    document.getElementById("simulate-obra").onclick = () => {
      updateStatus("Simulando obra...", "yellow");

      // Primeiro ativar proteções
      document.getElementById("force-protections").click();

      setTimeout(() => {
        // Simular erro Firebase que causa logout
        try {
          if (window.firebase) {
            const auth = window.firebase.auth();
            if (auth && auth.signOut) {
              // Tentar chamar signOut - deve ser bloqueado
              auth.signOut();
            }
          }

          // Verificar se ainda estamos logados após 3 segundos
          setTimeout(() => {
            if (window.location.pathname.includes("/login")) {
              updateStatus("❌ LOGOUT ocorreu!", "#f44336");
            } else {
              updateStatus("✅ Sem logout!", "#4CAF50");
            }
          }, 3000);
        } catch (e) {
          updateStatus("Erro simulação: " + e.message, "#f44336");
        }
      }, 1000);
    };

    document.getElementById("auto-login").onclick = () => {
      updateStatus("Fazendo login...", "yellow");

      try {
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');
        const loginButton = document.querySelector('button[type="submit"]');

        if (emailInput && passwordInput && loginButton) {
          emailInput.value = "admin@leirisonda.com";
          passwordInput.value = "admin123";

          // Disparar eventos
          emailInput.dispatchEvent(new Event("input", { bubbles: true }));
          passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

          // Ativar proteções antes do login
          document.getElementById("force-protections").click();

          setTimeout(() => {
            loginButton.click();
            updateStatus("Login enviado!", "#4CAF50");
          }, 500);
        } else {
          updateStatus("Campos não encontrados", "#f44336");
        }
      } catch (e) {
        updateStatus("Erro login: " + e.message, "#f44336");
      }
    };

    document.getElementById("hide-test").onclick = () => {
      testContainer.style.display = "none";

      // Criar botão pequeno para mostrar novamente
      const showBtn = document.createElement("button");
      showBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 99999;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 16px;
      `;
      showBtn.textContent = "🧪";
      showBtn.onclick = () => {
        testContainer.style.display = "block";
        showBtn.remove();
      };
      document.body.appendChild(showBtn);
    };

    updateStatus("Interface pronta!", "#4CAF50");
  }

  // Criar UI quando DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createTestUI);
  } else {
    createTestUI();
  }

  // Recriar UI se necessário
  setTimeout(createTestUI, 2000);
})();
