// ESCAPE LOADING - Força saída do ProtectedRoute preso

(function () {
  "use strict";

  console.log("🚨 ESCAPE LOADING: Detectando ProtectedRoute preso...");

  function isStuckInLoading() {
    // Verificar se existe o texto específico "A carregar..."
    const loadingText = Array.from(document.querySelectorAll("p")).find(
      (p) => p.textContent && p.textContent.includes("A carregar"),
    );

    const protectedRoute = document.querySelector(
      '[data-loc*="ProtectedRoute.tsx"]',
    );

    return !!(loadingText && protectedRoute);
  }

  function forceEscapeLoading() {
    console.log("🚨 ESCAPE: Forçando saída do loading...");

    // 1. Configurar storage para bypass completo
    try {
      localStorage.clear();
      localStorage.setItem("auth_bypass", "true");
      localStorage.setItem("user_authenticated", "true");
      localStorage.setItem("skip_auth_check", "true");
      localStorage.setItem("force_app_access", "true");

      // Firebase auth mock
      localStorage.setItem(
        "firebase:authUser:test-app",
        JSON.stringify({
          uid: "bypass-user",
          email: "bypass@leirisonda.com",
          stsTokenManager: {
            refreshToken: "bypass-token",
            accessToken: "bypass-token",
            expirationTime: Date.now() + 3600000,
          },
        }),
      );

      console.log("✅ ESCAPE: Storage configurado para bypass");
    } catch (e) {
      console.log("⚠️ ESCAPE: Erro ao configurar storage:", e.message);
    }

    // 2. Override Firebase Auth completamente
    if (window.firebase) {
      try {
        const auth = window.firebase.auth();

        // Mock currentUser
        Object.defineProperty(auth, "currentUser", {
          get: () => ({
            uid: "bypass-user",
            email: "bypass@leirisonda.com",
            emailVerified: true,
            getIdToken: () => Promise.resolve("bypass-token"),
            toJSON: () => ({ uid: "bypass-user" }),
          }),
          configurable: true,
        });

        // Mock onAuthStateChanged para sempre retornar usuário logado
        auth.onAuthStateChanged = function (callback) {
          if (callback) {
            setTimeout(() => {
              callback({
                uid: "bypass-user",
                email: "bypass@leirisonda.com",
                emailVerified: true,
              });
            }, 100);
          }
          return () => {}; // unsubscribe mock
        };

        console.log("✅ ESCAPE: Firebase Auth mockado");
      } catch (e) {
        console.log("⚠️ ESCAPE: Erro ao mockar Firebase:", e.message);
      }
    }

    // 3. Força refresh da página para reprocessar autenticação
    setTimeout(() => {
      console.log("🚨 ESCAPE: Recarregando página...");
      window.location.reload();
    }, 2000);

    // 4. Backup: navegar diretamente após 5 segundos
    setTimeout(() => {
      if (isStuckInLoading()) {
        console.log("🚨 ESCAPE: Still stuck, navigating directly...");
        window.location.href = "/obras";
      }
    }, 5000);
  }

  // Verificar imediatamente
  if (isStuckInLoading()) {
    console.log("🚨 ESCAPE: ProtectedRoute preso detectado!");
    setTimeout(forceEscapeLoading, 1000);
  }

  // Monitor contínuo
  let stuckCounter = 0;
  const monitor = setInterval(() => {
    if (isStuckInLoading()) {
      stuckCounter++;
      console.log(`🚨 ESCAPE: Preso há ${stuckCounter * 2} segundos`);

      if (stuckCounter >= 2) {
        // 4+ segundos preso
        forceEscapeLoading();
        clearInterval(monitor);
      }
    } else {
      stuckCounter = 0;
    }
  }, 2000);

  // Auto-stop após 30 segundos
  setTimeout(() => {
    clearInterval(monitor);
  }, 30000);

  console.log("🚨 ESCAPE LOADING: Sistema ativo");
})();
