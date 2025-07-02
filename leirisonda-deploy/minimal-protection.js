// MINIMAL PROTECTION - Proteção mínima sem interferir com navegação

console.log("🛡️ MINIMAL: Iniciando proteção mínima...");

(function () {
  "use strict";

  let saveInProgress = false;

  // Proteção básica do Firebase apenas durante saves
  function setupBasicProtection() {
    if (!window.firebase) return;

    try {
      const auth = window.firebase.auth();

      if (!window.originalSignOut) {
        window.originalSignOut = auth.signOut.bind(auth);
      }

      auth.signOut = function () {
        const stack = new Error().stack;

        // Só bloquear durante saves
        if (saveInProgress) {
          console.log("🛡️ MINIMAL: signOut bloqueado durante save");
          return Promise.resolve();
        }

        // Bloquear signOut automático do Firebase
        if (stack && stack.includes("pb(")) {
          console.log("🛡️ MINIMAL: signOut automático bloqueado");
          return Promise.resolve();
        }

        // Permitir logout manual
        console.log("🛡️ MINIMAL: Logout manual permitido");
        return window.originalSignOut();
      };
    } catch (e) {
      console.error("🛡️ MINIMAL: Erro:", e);
    }
  }

  // Detectar saves simples
  function detectSaves() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "BUTTON") {
        const text = target.textContent?.toLowerCase() || "";

        if (
          text.includes("guardar") ||
          text.includes("gravar") ||
          text.includes("criar")
        ) {
          console.log("🛡️ MINIMAL: Save detectado");
          saveInProgress = true;

          setTimeout(() => {
            saveInProgress = false;
          }, 10000);
        }
      }
    });
  }

  // Configurar proteção quando Firebase carregar
  const firebaseWaiter = setInterval(() => {
    if (window.firebase) {
      setupBasicProtection();
      clearInterval(firebaseWaiter);
    }
  }, 500);

  // Parar waiter após 30 segundos
  setTimeout(() => {
    clearInterval(firebaseWaiter);
  }, 30000);

  detectSaves();

  console.log("🛡️ MINIMAL: Proteção mínima ativa");
})();
