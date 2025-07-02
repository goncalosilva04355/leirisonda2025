// AUTH BYPASS ONLY - Força ProtectedRoute a passar sem alterar layout

(function () {
  "use strict";

  console.log("🔐 AUTH BYPASS: Configurando bypass para ProtectedRoute...");

  function setupAuthBypass() {
    if (window.firebase) {
      try {
        const auth = window.firebase.auth();

        // 1. Configurar currentUser válido para passar verificação
        const mockUser = {
          uid: "bypass-user-123",
          email: "user@leirisonda.com",
          emailVerified: true,
          displayName: "Leirisonda User",
          getIdToken: function (forceRefresh = false) {
            return Promise.resolve("valid-token-" + Date.now());
          },
          getIdTokenResult: function () {
            return Promise.resolve({
              token: "valid-token-" + Date.now(),
              claims: { email_verified: true },
            });
          },
          toJSON: function () {
            return {
              uid: this.uid,
              email: this.email,
              emailVerified: this.emailVerified,
            };
          },
        };

        // Override currentUser property
        Object.defineProperty(auth, "currentUser", {
          get: function () {
            return mockUser;
          },
          configurable: true,
        });

        // 2. Override onAuthStateChanged para disparar callback imediatamente
        const originalOnAuth = auth.onAuthStateChanged;
        auth.onAuthStateChanged = function (
          callback,
          errorCallback,
          completed,
        ) {
          console.log("🔐 AUTH BYPASS: onAuthStateChanged interceptado");

          if (callback && typeof callback === "function") {
            // Chamar callback imediatamente com usuário válido
            setTimeout(() => {
              try {
                callback(mockUser);
                console.log(
                  "🔐 AUTH BYPASS: Callback executado com usuário válido",
                );
              } catch (e) {
                console.log("Erro no callback:", e.message);
              }
            }, 50);
          }

          // Retornar unsubscribe function
          return function () {
            console.log("🔐 AUTH BYPASS: Auth listener removido");
          };
        };

        // 3. Configurar proteção contra logout automático
        const originalSignOut = auth.signOut;
        auth.signOut = function () {
          const stack = new Error().stack;

          // Bloquear signOut automático por erros de token
          if (
            stack &&
            (stack.includes("pb(") ||
              stack.includes("auth/user-token-expired") ||
              stack.includes("auth/user-disabled"))
          ) {
            console.warn("🔐 AUTH BYPASS: signOut automático bloqueado");
            return Promise.resolve();
          }

          // Permitir signOut manual
          console.log("🔐 AUTH BYPASS: signOut manual permitido");
          return originalSignOut.apply(this, arguments);
        };

        // 4. Disparar evento auth state change manualmente
        setTimeout(() => {
          console.log("🔐 AUTH BYPASS: Disparando auth state change...");

          // Tentar disparar callbacks existentes
          if (window.authStateCallbacks) {
            window.authStateCallbacks.forEach((cb) => {
              try {
                cb(mockUser);
              } catch (e) {}
            });
          }

          // Disparar evento personalizado
          window.dispatchEvent(
            new CustomEvent("authStateChanged", {
              detail: { user: mockUser },
            }),
          );
        }, 100);

        // 5. Configurar localStorage para suporte adicional
        try {
          localStorage.setItem(
            "firebase:authUser",
            JSON.stringify({
              uid: mockUser.uid,
              email: mockUser.email,
              emailVerified: mockUser.emailVerified,
              stsTokenManager: {
                refreshToken: "mock-refresh-token",
                accessToken: "mock-access-token",
                expirationTime: Date.now() + 3600000,
              },
            }),
          );

          localStorage.setItem("authBypassActive", "true");
          localStorage.setItem("userAuthenticated", "true");
        } catch (e) {}

        console.log("✅ AUTH BYPASS: Firebase Auth configurado para bypass");
      } catch (e) {
        console.log("❌ AUTH BYPASS: Erro ao configurar:", e.message);
      }
    }
  }

  // Função para forçar re-render do ProtectedRoute
  function triggerProtectedRouteRecheck() {
    console.log("🔄 AUTH BYPASS: Forçando re-verificação do ProtectedRoute...");

    // Tentar disparar re-render do componente
    const protectedRoute = document.querySelector(
      '[data-loc="code/client/components/ProtectedRoute.tsx:37:7"]',
    );
    if (protectedRoute) {
      // Disparar eventos que podem causar re-render
      protectedRoute.dispatchEvent(
        new Event("authStateChanged", { bubbles: true }),
      );

      // Força mudança no DOM para triggerar React update
      const loadingText = document.querySelector(
        '[data-loc="code/client/components/ProtectedRoute.tsx:40:11"]',
      );
      if (loadingText) {
        loadingText.textContent = "Verificando autenticação...";

        setTimeout(() => {
          if (loadingText.textContent.includes("Verificando")) {
            loadingText.textContent = "A carregar aplicação...";
          }
        }, 1000);
      }
    }
  }

  // Executar configuração
  const initAuth = () => {
    setupAuthBypass();

    // Aguardar um pouco e forçar re-verificação
    setTimeout(() => {
      triggerProtectedRouteRecheck();
    }, 500);

    // Re-verificação adicional após 2 segundos
    setTimeout(() => {
      triggerProtectedRouteRecheck();
    }, 2000);
  };

  // Tentar configurar imediatamente
  if (window.firebase) {
    initAuth();
  } else {
    // Aguardar Firebase carregar
    const checkFirebase = setInterval(() => {
      if (window.firebase) {
        initAuth();
        clearInterval(checkFirebase);
      }
    }, 100);

    // Timeout após 10 segundos
    setTimeout(() => {
      clearInterval(checkFirebase);
    }, 10000);
  }

  console.log("✅ AUTH BYPASS ONLY: Sistema configurado");
})();
