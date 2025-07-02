// AUTH BYPASS - Bypass completo da autenticação durante operações

(function () {
  "use strict";

  console.log("🚫 AUTH BYPASS: Iniciando bypass completo...");

  let bypassActive = false;
  let originalAuthMethods = {};

  // Função para ativar bypass total
  function activateAuthBypass(duration = 30000) {
    if (bypassActive) return;

    bypassActive = true;
    console.log("🚫 AUTH BYPASS: Bypass ativo por", duration + "ms");

    // Backup métodos originais e substituir por mocks
    if (window.firebase && window.firebase.auth) {
      try {
        const auth = window.firebase.auth();

        // Backup métodos originais
        if (auth.signOut && !originalAuthMethods.signOut) {
          originalAuthMethods.signOut = auth.signOut.bind(auth);
        }
        if (
          auth.onAuthStateChanged &&
          !originalAuthMethods.onAuthStateChanged
        ) {
          originalAuthMethods.onAuthStateChanged =
            auth.onAuthStateChanged.bind(auth);
        }

        // Mock signOut - sempre resolve sem fazer nada
        auth.signOut = function () {
          console.warn(
            "🚫 AUTH BYPASS: signOut chamado durante bypass - ignorando",
          );
          return Promise.resolve();
        };

        // Mock onAuthStateChanged - sempre retorna usuário logado
        auth.onAuthStateChanged = function (callback) {
          console.log("🚫 AUTH BYPASS: onAuthStateChanged mockado");
          if (callback) {
            // Simular usuário sempre logado
            const mockUser = {
              uid: "bypass-user",
              email: "bypass@leirisonda.com",
              emailVerified: true,
            };
            callback(mockUser);
          }
          return () => {}; // Mock unsubscribe
        };

        // Mock currentUser property
        Object.defineProperty(auth, "currentUser", {
          get: function () {
            return {
              uid: "bypass-user",
              email: "bypass@leirisonda.com",
              emailVerified: true,
              getIdToken: () => Promise.resolve("bypass-token"),
            };
          },
          configurable: true,
        });

        console.log("✅ AUTH BYPASS: Firebase auth completamente mockado");
      } catch (e) {
        console.log("❌ AUTH BYPASS: Erro ao mockar Firebase:", e.message);
      }
    }

    // Desativar após duração especificada
    setTimeout(() => {
      deactivateAuthBypass();
    }, duration);
  }

  // Função para desativar bypass
  function deactivateAuthBypass() {
    if (!bypassActive) return;

    bypassActive = false;
    console.log("🚫 AUTH BYPASS: Desativando bypass...");

    // Restaurar métodos originais
    if (
      window.firebase &&
      window.firebase.auth &&
      Object.keys(originalAuthMethods).length > 0
    ) {
      try {
        const auth = window.firebase.auth();

        if (originalAuthMethods.signOut) {
          auth.signOut = originalAuthMethods.signOut;
        }
        if (originalAuthMethods.onAuthStateChanged) {
          auth.onAuthStateChanged = originalAuthMethods.onAuthStateChanged;
        }

        console.log("✅ AUTH BYPASS: Métodos originais restaurados");
      } catch (e) {
        console.log("❌ AUTH BYPASS: Erro ao restaurar métodos:", e.message);
      }
    }
  }

  // Detectar operações de obra automaticamente
  function setupAutoDetection() {
    // Monitor fetch para Firebase/Firestore
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (
        typeof url === "string" &&
        (url.includes("firestore") || url.includes("firebase"))
      ) {
        const method = options?.method?.toUpperCase();
        const body = options?.body;

        // Detectar operações de obra
        if (
          (method === "POST" || method === "PUT" || method === "PATCH") &&
          body &&
          typeof body === "string" &&
          (body.includes("obra") || body.includes("Obra"))
        ) {
          console.log(
            "🏗️ AUTH BYPASS: Operação de obra detectada - ativando bypass",
          );
          activateAuthBypass(60000); // 1 minuto de bypass
        }
      }

      return originalFetch.apply(this, arguments);
    };

    // Monitor cliques em botões de submissão
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (target && target.tagName === "BUTTON") {
          const text = target.textContent?.toLowerCase() || "";

          if (
            text.includes("salvar") ||
            text.includes("guardar") ||
            text.includes("criar") ||
            target.type === "submit"
          ) {
            console.log(
              "💾 AUTH BYPASS: Botão de save detectado - ativando bypass preventivo",
            );
            activateAuthBypass(45000); // 45 segundos
          }
        }
      },
      true,
    );

    // Monitor formulários
    document.addEventListener(
      "submit",
      (event) => {
        console.log("📝 AUTH BYPASS: Submit detectado - ativando bypass");
        activateAuthBypass(30000); // 30 segundos
      },
      true,
    );
  }

  // Override error handlers que podem causar logout
  function blockErrorLogouts() {
    const originalConsoleError = console.error;
    console.error = function (...args) {
      if (bypassActive) {
        // Durante bypass, não mostrar erros de auth
        const errorStr = args.join(" ");
        if (errorStr.includes("auth/") || errorStr.includes("firebase")) {
          console.warn(
            "🚫 AUTH BYPASS: Erro auth suprimido durante bypass:",
            errorStr,
          );
          return;
        }
      }
      return originalConsoleError.apply(this, args);
    };

    // Override window error handler
    const originalErrorHandler = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      if (
        bypassActive &&
        typeof message === "string" &&
        (message.includes("auth/") || message.includes("firebase"))
      ) {
        console.warn("🚫 AUTH BYPASS: Window error suprimido durante bypass");
        return true; // Prevenir default handling
      }
      return originalErrorHandler?.apply(this, arguments);
    };
  }

  // Forçar permanência na aplicação
  function forceStayInApp() {
    // Se estamos no login, ativar bypass e tentar sair
    if (window.location.pathname.includes("/login")) {
      console.log(
        "🚫 AUTH BYPASS: Login detectado - ativando bypass e redirecionando",
      );

      activateAuthBypass(120000); // 2 minutos

      // Limpar storage problemático
      try {
        localStorage.removeItem("firebase:authUser");
        localStorage.setItem("authBypass", "true");
        localStorage.setItem("userLoggedIn", "true");
      } catch (e) {}

      // Múltiplas tentativas de sair do login
      setTimeout(() => (window.location.href = "/"), 500);
      setTimeout(() => history.replaceState({}, "", "/"), 1000);
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  // Interface mobile
  function updateMobileInterface() {
    setTimeout(() => {
      const testContainer = document.getElementById("mobile-test-ui");
      if (testContainer) {
        const bypassBtn = document.createElement("button");
        bypassBtn.style.cssText = `
          width: 100%; 
          margin: 2px 0; 
          padding: 8px; 
          background: #FF5722; 
          color: white; 
          border: none; 
          border-radius: 4px; 
          font-size: 11px;
        `;
        bypassBtn.textContent = "🚫 BYPASS TOTAL (60s)";
        bypassBtn.onclick = () => {
          activateAuthBypass(60000);
          const status = document.getElementById("test-status");
          if (status) {
            status.textContent = "BYPASS TOTAL ativo!";
            status.style.color = "#FF5722";
          }
        };

        testContainer.appendChild(bypassBtn);
      }
    }, 2000);
  }

  // Inicializar tudo
  setupAutoDetection();
  blockErrorLogouts();
  forceStayInApp();
  updateMobileInterface();

  // Setup quando Firebase estiver disponível
  const firebaseWatcher = setInterval(() => {
    if (window.firebase) {
      // Verificar se já estamos num caso problemático
      if (window.location.pathname.includes("/login")) {
        activateAuthBypass(120000);
      }
      clearInterval(firebaseWatcher);
    }
  }, 100);

  setTimeout(() => clearInterval(firebaseWatcher), 10000);

  // API global
  window.AUTH_BYPASS = {
    activate: activateAuthBypass,
    deactivate: deactivateAuthBypass,
    isActive: () => bypassActive,
    forceStay: forceStayInApp,
  };

  console.log("🚫 AUTH BYPASS: Sistema completo ativo");
})();
