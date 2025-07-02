// FIREBASE SIGNOUT PATCH - SOLUÇÃO DEFINITIVA
// Este script intercepta a função específica do Firebase que causa logout automático

(function () {
  "use strict";

  console.log("🔧 Firebase Patch: Iniciando...");

  // Intercept the problematic Firebase function before it's defined
  let originalPb = null;

  // Override Object.defineProperty to catch when Firebase defines the 'pb' function
  const originalDefineProperty = Object.defineProperty;

  function patchFirebaseSignOut() {
    // Find and patch the pb function in the global scope
    if (window.pb && typeof window.pb === "function") {
      if (!originalPb) {
        originalPb = window.pb;
        window.pb = function (n, e, t = false) {
          if (t) return e;

          return originalPb.call(this, n, e, t).catch((r) => {
            // Check if this is the auth error that triggers signOut
            if (
              r instanceof Error &&
              r.code &&
              (r.code === "auth/user-disabled" ||
                r.code === "auth/user-token-expired")
            ) {
              console.warn(
                "🛡️ Firebase Patch: Bloqueado logout automático por",
                r.code,
              );
              // Don't call signOut, just throw the original error
              throw r;
            }
            throw r;
          });
        };
        console.log("✅ Firebase Patch: Função pb interceptada com sucesso");
      }
    }

    // Also patch any existing Firebase auth instances
    if (window.firebase && window.firebase.auth) {
      try {
        const auth = window.firebase.auth();
        if (auth && auth.signOut && !auth._patchedSignOut) {
          const originalSignOut = auth.signOut.bind(auth);
          auth.signOut = function () {
            console.warn("🛡️ Firebase Patch: signOut() chamado - BLOQUEADO");
            return Promise.resolve();
          };
          auth._patchedSignOut = true;
          console.log("✅ Firebase Patch: Auth signOut interceptado");
        }
      } catch (e) {
        console.log(
          "Firebase auth não ainda disponível, tentando novamente...",
        );
      }
    }
  }

  // Try to patch immediately
  patchFirebaseSignOut();

  // Monitor for Firebase loading
  let attempts = 0;
  const maxAttempts = 50;

  const firebaseWatcher = setInterval(() => {
    attempts++;

    patchFirebaseSignOut();

    if (attempts >= maxAttempts) {
      clearInterval(firebaseWatcher);
      console.log(
        "🔧 Firebase Patch: Parou de monitorizar após",
        maxAttempts,
        "tentativas",
      );
    }
  }, 100);

  // Cleanup after 10 seconds
  setTimeout(() => {
    clearInterval(firebaseWatcher);
    console.log("🔧 Firebase Patch: Limpeza após 10 segundos");
  }, 10000);

  // Also patch the minified code directly by overriding the problematic function pattern
  const originalEval = window.eval;
  window.eval = function (code) {
    if (typeof code === "string" && code.includes("await n.auth.signOut()")) {
      console.log("🛡️ Firebase Patch: Bloqueado eval com signOut automático");
      // Remove the signOut call from the code
      code = code.replace(
        /await n\.auth\.signOut\(\)/g,
        "/* signOut bloqueado */",
      );
    }
    return originalEval.call(this, code);
  };

  console.log("🔧 Firebase Patch: Configuração completa");
})();
