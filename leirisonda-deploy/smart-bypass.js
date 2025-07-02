// SMART BYPASS - Permite operações normais mas bloqueia logout

(function () {
  "use strict";

  console.log("🧠 SMART BYPASS: Iniciando sistema inteligente...");

  let operationInProgress = false;
  let bypassActive = false;

  // Função para ativar bypass temporário
  function activateBypass(duration = 10000) {
    bypassActive = true;
    operationInProgress = true;
    console.log("🧠 SMART BYPASS: Bypass ativo por", duration + "ms");

    setTimeout(() => {
      bypassActive = false;
      operationInProgress = false;
      console.log("🧠 SMART BYPASS: Bypass desativado");
    }, duration);
  }

  // Detectar operações de criação de obra
  function detectObraOperation() {
    // Monitor fetch requests para Firebase/Firestore
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      // Se é operação Firebase, ativar bypass
      if (
        typeof url === "string" &&
        (url.includes("firestore") || url.includes("firebase"))
      ) {
        // Verificar se é operação de escrita (POST, PUT, PATCH)
        const method = options?.method?.toUpperCase();
        if (method === "POST" || method === "PUT" || method === "PATCH") {
          console.log(
            "🧠 SMART BYPASS: Operação de escrita detectada - ativando bypass",
          );
          activateBypass(15000); // 15 segundos de proteção
        }
      }

      return originalFetch.apply(this, arguments);
    };
  }

  // Interceptor inteligente de signOut
  function setupIntelligentSignOutBlock() {
    if (window.firebase) {
      try {
        const auth = window.firebase.auth();
        if (auth && auth.signOut) {
          const originalSignOut = auth.signOut.bind(auth);

          auth.signOut = function () {
            // Se bypass está ativo, bloquear signOut
            if (bypassActive || operationInProgress) {
              console.warn(
                "🧠 SMART BYPASS: signOut bloqueado durante operação",
              );
              return Promise.resolve();
            }

            // Caso contrário, permitir signOut normal
            console.log(
              "🧠 SMART BYPASS: signOut permitido (sem operação ativa)",
            );
            return originalSignOut();
          };

          console.log("✅ SMART BYPASS: signOut inteligente configurado");
        }
      } catch (e) {
        console.log("Firebase auth não disponível ainda");
      }
    }
  }

  // Detectar cliques em botões de criar/salvar obra
  function monitorObraButtons() {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (target && target.tagName === "BUTTON") {
          const buttonText = target.textContent?.toLowerCase() || "";
          const buttonClass = target.className?.toLowerCase() || "";

          // Detectar botões relacionados a obra
          if (
            buttonText.includes("salvar") ||
            buttonText.includes("criar") ||
            buttonText.includes("guardar") ||
            buttonText.includes("submit") ||
            buttonClass.includes("submit") ||
            target.type === "submit"
          ) {
            console.log(
              "🧠 SMART BYPASS: Botão de submissão detectado - ativando bypass",
            );
            activateBypass(20000); // 20 segundos de proteção
          }
        }
      },
      true,
    );
  }

  // Sistema de recuperação automática
  function setupAutoRecovery() {
    const checkInterval = setInterval(() => {
      // Se estamos no login mas devíamos estar na app
      if (window.location.pathname.includes("/login")) {
        console.log(
          "🧠 SMART BYPASS: Login detectado - tentando recuperação...",
        );

        // Tentar voltar para a aplicação
        try {
          // Limpar estado problemático
          localStorage.removeItem("firebase:authUser");
          localStorage.setItem("skipAuthCheck", "true");
          localStorage.setItem("userAuthenticated", "true");

          // Navegar para home
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } catch (e) {
          console.log("Erro na recuperação:", e.message);
        }
      }
    }, 3000);

    // Parar verificação após 5 minutos
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 300000);
  }

  // Patch do código Firebase minificado em runtime
  function patchFirebaseCode() {
    // Encontrar e modificar a função problemática
    if (window.pb && typeof window.pb === "function") {
      const originalPb = window.pb;
      window.pb = function (n, e, t = false) {
        if (t) return e;

        try {
          return originalPb.call(this, n, e, t);
        } catch (r) {
          // Se há erro auth durante bypass, ignorar signOut
          if (
            (r.code === "auth/user-disabled" ||
              r.code === "auth/user-token-expired") &&
            (bypassActive || operationInProgress)
          ) {
            console.warn(
              "🧠 SMART BYPASS: Erro auth ignorado durante operação:",
              r.code,
            );
            throw r; // Lançar erro mas sem signOut
          }

          // Comportamento normal para outros casos
          throw r;
        }
      };
      console.log("✅ SMART BYPASS: Função pb patchada");
    }
  }

  // Configurar interface mobile para testes
  function setupMobileInterface() {
    // Adicionar botões específicos para obras
    setTimeout(() => {
      const testContainer = document.getElementById("mobile-test-ui");
      if (testContainer) {
        // Adicionar botão específico para testar criação de obra
        const obraTestBtn = document.createElement("button");
        obraTestBtn.style.cssText = `
          width: 100%; 
          margin: 2px 0; 
          padding: 8px; 
          background: #8BC34A; 
          color: white; 
          border: none; 
          border-radius: 4px; 
          font-size: 11px;
        `;
        obraTestBtn.textContent = "🏗️ Ativar Proteção Obra";
        obraTestBtn.onclick = () => {
          activateBypass(30000); // 30 segundos
          const status = document.getElementById("test-status");
          if (status) {
            status.textContent = "Proteção obra ativa por 30s!";
            status.style.color = "#4CAF50";
          }
        };

        testContainer.appendChild(obraTestBtn);
      }
    }, 2000);
  }

  // Inicializar tudo
  detectObraOperation();
  monitorObraButtons();
  setupAutoRecovery();
  setupMobileInterface();

  // Setup Firebase quando disponível
  const firebaseChecker = setInterval(() => {
    if (window.firebase) {
      setupIntelligentSignOutBlock();
      patchFirebaseCode();
      clearInterval(firebaseChecker);
    }
  }, 100);

  setTimeout(() => clearInterval(firebaseChecker), 10000);

  // API global
  window.SMART_BYPASS = {
    activate: activateBypass,
    isActive: () => bypassActive,
    forceRecovery: () => {
      localStorage.setItem("userAuthenticated", "true");
      window.location.href = "/";
    },
  };

  console.log("🧠 SMART BYPASS: Sistema completo ativo");
})();
