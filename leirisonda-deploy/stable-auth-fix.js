// STABLE AUTH FIX - Previne logout sem causar conflitos visuais

console.log("🔧 STABLE: Iniciando correção estável...");

(function () {
  "use strict";

  let saveInProgress = false;

  // Configurar proteção quando Firebase estiver disponível
  function setupStableAuth() {
    if (!window.firebase) return false;

    try {
      const auth = window.firebase.auth();

      // Guardar método original se não foi guardado
      if (!window.stableAuthParts) {
        window.stableAuthParts = {
          originalSignOut: auth.signOut.bind(auth),
        };
      }

      // Override signOut apenas para prevenir logout automático durante saves
      auth.signOut = function () {
        const stack = new Error().stack;

        // Bloquear signOut automático durante operações
        if (saveInProgress) {
          console.log("🛡️ STABLE: signOut bloqueado - operação em curso");
          return Promise.resolve();
        }

        // Bloquear signOut automático por token expirado
        if (
          stack &&
          (stack.includes("pb(") ||
            stack.includes("iee(") ||
            stack.includes("auth/user-token-expired") ||
            stack.includes("auth/user-disabled"))
        ) {
          console.log("🛡️ STABLE: signOut automático bloqueado");
          return Promise.resolve();
        }

        // Permitir signOut manual
        console.log("🔓 STABLE: signOut manual permitido");
        return window.stableAuthParts.originalSignOut();
      };

      console.log("✅ STABLE: Proteção contra logout configurada");
      return true;
    } catch (e) {
      console.log("❌ STABLE: Erro:", e.message);
      return false;
    }
  }

  // Detectar operações de save para proteger
  function setupSaveDetection() {
    // Monitor cliques em botões de save
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (target && target.tagName === "BUTTON") {
          const text = target.textContent?.toLowerCase() || "";

          if (
            text.includes("guardar") ||
            text.includes("gravar") ||
            text.includes("salvar") ||
            text.includes("criar")
          ) {
            console.log("💾 STABLE: Operação de save detectada");

            saveInProgress = true;

            // Manter proteção por 10 segundos
            setTimeout(() => {
              saveInProgress = false;
              console.log("💾 STABLE: Proteção removida");
            }, 10000);
          }
        }
      },
      true,
    );

    // Monitor fetch requests para Firestore
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (typeof url === "string" && url.includes("firestore")) {
        const method = options?.method?.toUpperCase();
        if (method === "POST" || method === "PATCH") {
          console.log("💾 STABLE: Operação Firestore detectada");
          saveInProgress = true;

          setTimeout(() => {
            saveInProgress = false;
          }, 8000);
        }
      }

      return originalFetch.apply(this, arguments);
    };

    console.log("✅ STABLE: Detecção de save ativa");
  }

  // Aguardar Firebase carregar
  const firebaseWaiter = setInterval(() => {
    if (setupStableAuth()) {
      clearInterval(firebaseWaiter);
    }
  }, 100);

  // Configurar detecção de save
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSaveDetection);
  } else {
    setupSaveDetection();
  }

  // Cleanup após 30 segundos
  setTimeout(() => {
    clearInterval(firebaseWaiter);
  }, 30000);

  console.log("✅ STABLE: Sistema estável ativo");
})();
