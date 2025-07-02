// MINIMAL PROTECTION - Apenas proteção contra logout, preservar layout original

(function () {
  "use strict";

  console.log("🛡️ MINIMAL: Ativando proteção mínima...");

  function setupMinimalProtection() {
    if (window.firebase) {
      try {
        const auth = window.firebase.auth();

        // Guardar método original
        if (!window.originalSignOut) {
          window.originalSignOut = auth.signOut.bind(auth);
        }

        // Bloquear APENAS signOut automático causado por erros
        auth.signOut = function () {
          const stack = new Error().stack;

          // Verificar se é chamada automática por erro de token
          if (
            stack &&
            (stack.includes("pb(") ||
              stack.includes("auth/user-token-expired") ||
              stack.includes("auth/user-disabled"))
          ) {
            console.warn("🛡️ MINIMAL: Logout automático bloqueado");
            return Promise.resolve();
          }

          // Permitir logout manual
          console.log("🛡️ MINIMAL: Logout manual permitido");
          return window.originalSignOut();
        };

        console.log("✅ MINIMAL: Proteção contra logout automático ativa");
      } catch (e) {
        console.log("Firebase ainda não disponível");
      }
    }
  }

  // Configurar proteção quando Firebase estiver disponível
  const checkFirebase = setInterval(() => {
    if (window.firebase) {
      setupMinimalProtection();
      clearInterval(checkFirebase);
    }
  }, 100);

  // Parar verificação após 10 segundos
  setTimeout(() => {
    clearInterval(checkFirebase);
  }, 10000);

  console.log("✅ MINIMAL PROTECTION: Ativo - layout original preservado");
})();
