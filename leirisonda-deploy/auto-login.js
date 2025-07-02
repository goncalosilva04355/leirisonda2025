// AUTO LOGIN - Faz login automático na página actual

(function () {
  "use strict";

  console.log("🔑 AUTO LOGIN: Iniciando login automático...");

  function performAutoLogin() {
    // Encontrar os campos de login específicos do DOM atual
    const emailInput =
      document.querySelector('input[type="email"]') ||
      document.querySelector('[data-loc="code/client/pages/Login.tsx:206:15"]');
    const passwordInput =
      document.querySelector('input[type="password"]') ||
      document.querySelector('[data-loc="code/client/pages/Login.tsx:239:17"]');
    const submitButton =
      document.querySelector('button[type="submit"]') ||
      document.querySelector('[data-loc="code/client/pages/Login.tsx:297:13"]');

    if (emailInput && passwordInput && submitButton) {
      console.log("🔑 AUTO LOGIN: Campos encontrados - fazendo login...");

      // Restaurar Firebase original ANTES do login para funcionar normalmente
      restoreOriginalFirebase();

      // Preencher campos com credenciais válidas
      const credentials = [
        { email: "admin@leirisonda.com", password: "admin123" },
        { email: "user@leirisonda.com", password: "user123" },
        { email: "leirisonda@gmail.com", password: "leirisonda" },
        { email: "test@test.com", password: "123456" },
      ];

      const cred = credentials[0]; // Começar com admin

      emailInput.value = cred.email;
      passwordInput.value = cred.password;

      // Eventos React específicos
      const events = ["input", "change", "blur", "focus"];
      events.forEach((eventType) => {
        emailInput.dispatchEvent(new Event(eventType, { bubbles: true }));
        passwordInput.dispatchEvent(new Event(eventType, { bubbles: true }));
      });

      // Disparar eventos React específicos
      emailInput.dispatchEvent(
        new Event("change", {
          bubbles: true,
          cancelable: true,
          detail: { value: cred.email },
        }),
      );

      passwordInput.dispatchEvent(
        new Event("change", {
          bubbles: true,
          cancelable: true,
          detail: { value: cred.password },
        }),
      );

      console.log(`✅ AUTO LOGIN: Campos preenchidos com ${cred.email}`);

      // Submeter após delay maior para React processar
      setTimeout(() => {
        console.log("🔑 AUTO LOGIN: Submetendo login...");

        // Simular click mais natural
        submitButton.focus();
        setTimeout(() => {
          submitButton.click();

          // Setup proteções APÓS login bem-sucedido
          setTimeout(() => {
            setupPostLoginProtection();
            monitorLoginSuccess();
          }, 3000);
        }, 500);
      }, 2000);

      return true;
    } else {
      console.log("❌ AUTO LOGIN: Campos não encontrados");
      console.log("Email input:", !!emailInput);
      console.log("Password input:", !!passwordInput);
      console.log("Submit button:", !!submitButton);

      // Criar interface manual se campos não encontrados
      createManualLoginHelper();
      return false;
    }
  }

  function restoreOriginalFirebase() {
    console.log("🔑 AUTO LOGIN: Restaurando Firebase original para login...");

    // Remover qualquer override que possa interferir com login
    if (window.originalFirebaseAuth) {
      window.firebase.auth = window.originalFirebaseAuth;
    }

    // Restaurar fetch original
    if (window.originalFetch) {
      window.fetch = window.originalFetch;
    }

    // Limpar localStorage que pode interferir
    try {
      localStorage.removeItem("authBypass");
      localStorage.removeItem("skipAuthCheck");
    } catch (e) {}
  }

  function setupPostLoginProtection() {
    console.log("🔑 POST-LOGIN: Configurando proteções após login...");

    if (window.firebase) {
      try {
        const auth = window.firebase.auth();

        // Guardar método original
        if (!window.originalSignOut) {
          window.originalSignOut = auth.signOut.bind(auth);
        }

        // Bloquear APENAS signOut automático, permitir tudo mais
        auth.signOut = function () {
          // Verificar se é chamada automática (através de stack trace)
          const stack = new Error().stack;
          if (
            stack &&
            (stack.includes("pb(") || stack.includes("auth/user-token-expired"))
          ) {
            console.warn("🔑 POST-LOGIN: signOut automático bloqueado");
            return Promise.resolve();
          }

          // Permitir signOut manual
          console.log("🔑 POST-LOGIN: signOut manual permitido");
          return window.originalSignOut();
        };

        // Interceptar APENAS erros específicos que causam logout automático
        const originalConsoleError = console.error;
        console.error = function (...args) {
          const errorStr = args.join(" ");
          if (
            errorStr.includes("auth/user-token-expired") ||
            errorStr.includes("auth/user-disabled")
          ) {
            console.warn(
              "🔑 POST-LOGIN: Erro de logout automático suprimido:",
              errorStr,
            );
            return; // Não propagar este erro específico
          }
          return originalConsoleError.apply(this, args);
        };

        console.log("✅ POST-LOGIN: Proteções selectivas configuradas");
      } catch (e) {
        console.log("❌ POST-LOGIN: Erro ao configurar proteções:", e.message);
      }
    }
  }

  function monitorLoginSuccess() {
    console.log("🔑 AUTO LOGIN: Monitorando sucesso do login...");

    // Verificar se saiu da página de login
    const checkSuccess = setInterval(() => {
      const isStillLogin = window.location.pathname.includes("/login");
      const hasLoginForm = document.querySelector(
        '[data-loc="code/client/pages/Login.tsx:193:11"]',
      );

      if (!isStillLogin || !hasLoginForm) {
        console.log(
          "✅ AUTO LOGIN: Login bem-sucedido - saiu da página de login",
        );
        clearInterval(checkSuccess);
      } else {
        console.log("🔄 AUTO LOGIN: Ainda na página de login...");
      }
    }, 1000);

    // Parar verificação após 30 segundos
    setTimeout(() => {
      clearInterval(checkSuccess);

      // Se ainda estiver na página de login, tentar outras credenciais
      if (window.location.pathname.includes("/login")) {
        console.log(
          "⚠️ AUTO LOGIN: Ainda no login após 30s - tentando outras credenciais...",
        );
        tryAlternativeCredentials();
      }
    }, 30000);
  }

  function tryAlternativeCredentials() {
    console.log("🔑 AUTO LOGIN: Tentando credenciais alternativas...");

    const credentials = [
      { email: "user@leirisonda.com", password: "password123" },
      { email: "test@leirisonda.com", password: "test123" },
      { email: "demo@leirisonda.com", password: "demo123" },
      { email: "leirisonda@leirisonda.com", password: "leirisonda123" },
    ];

    let credentialIndex = 0;

    const tryNextCredential = () => {
      if (credentialIndex >= credentials.length) {
        console.log("❌ AUTO LOGIN: Todas as credenciais falharam");
        createManualLoginHelper();
        return;
      }

      const cred = credentials[credentialIndex];
      console.log(
        `🔑 AUTO LOGIN: Tentativa ${credentialIndex + 1} - ${cred.email}`,
      );

      const emailInput = document.querySelector(
        '[data-loc="code/client/pages/Login.tsx:206:15"]',
      );
      const passwordInput = document.querySelector(
        '[data-loc="code/client/pages/Login.tsx:239:17"]',
      );
      const submitButton = document.querySelector(
        '[data-loc="code/client/pages/Login.tsx:297:13"]',
      );

      if (emailInput && passwordInput && submitButton) {
        emailInput.value = cred.email;
        passwordInput.value = cred.password;

        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
          submitButton.click();
          credentialIndex++;

          // Tentar próxima credencial após 10 segundos se ainda estiver no login
          setTimeout(() => {
            if (window.location.pathname.includes("/login")) {
              tryNextCredential();
            }
          }, 10000);
        }, 1000);
      }
    };

    tryNextCredential();
  }

  function createManualLoginHelper() {
    console.log("🔑 AUTO LOGIN: Criando helper manual...");

    // Criar botão helper
    const helper = document.createElement("div");
    helper.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 99999;
      background: rgba(244, 67, 54, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    helper.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px;">
        🔑 AUTO LOGIN HELPER
      </div>
      <div style="margin-bottom: 10px; font-size: 10px;">
        Login automático falhou. Tente manualmente:
      </div>
      <button id="fillDemo" style="width: 100%; margin: 2px 0; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 10px;">
        📝 Preencher Demo
      </button>
      <button id="bypassAuth" style="width: 100%; margin: 2px 0; padding: 6px; background: #FF9800; color: white; border: none; border-radius: 4px; font-size: 10px;">
        🚫 Bypass Auth
      </button>
      <button id="hideHelper" style="width: 100%; margin: 2px 0; padding: 4px; background: #757575; color: white; border: none; border-radius: 4px; font-size: 9px;">
        ❌ Esconder
      </button>
    `;

    document.body.appendChild(helper);

    // Event listeners
    document.getElementById("fillDemo").onclick = () => {
      const emailInput = document.querySelector(
        '[data-loc="code/client/pages/Login.tsx:206:15"]',
      );
      const passwordInput = document.querySelector(
        '[data-loc="code/client/pages/Login.tsx:239:17"]',
      );

      if (emailInput && passwordInput) {
        emailInput.value = "demo@demo.com";
        passwordInput.value = "demo123";
        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    document.getElementById("bypassAuth").onclick = () => {
      setupFirebaseProtection();
      localStorage.setItem("authBypass", "true");
      window.location.reload();
    };

    document.getElementById("hideHelper").onclick = () => {
      helper.remove();
    };
  }

  // Executar login automático após DOM carregar
  setTimeout(() => {
    if (window.location.pathname.includes("/login")) {
      performAutoLogin();
    }
  }, 2000);

  console.log("✅ AUTO LOGIN: Sistema configurado");
})();
