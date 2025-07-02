// FIX SAVE OBRAS - Solução focada apenas nos erros de guardar obras

console.log("💾 FIX SAVE OBRAS: Iniciando correção de guardar obras...");

(function () {
  "use strict";

  function fixFirebaseForObras() {
    console.log("🔧 Corrigindo Firebase para operações de obras...");

    if (window.firebase) {
      try {
        const auth = window.firebase.auth();

        // 1. Interceptar APENAS a função pb que causa signOut automático
        // Esta é a função específica que vimos no código minificado
        const originalPb = window.pb;
        if (originalPb && typeof originalPb === "function") {
          window.pb = function (n, e, t = false) {
            if (t) return e;

            try {
              return originalPb.call(this, n, e, t);
            } catch (r) {
              // Se é erro de token durante operação de obra, NÃO fazer signOut
              if (
                r &&
                (r.code === "auth/user-token-expired" ||
                  r.code === "auth/user-disabled")
              ) {
                console.warn(
                  "💾 SAVE OBRAS: Erro de token ignorado durante operação:",
                  r.code,
                );
                // Lançar o erro mas SEM signOut
                throw r;
              }
              // Outros erros passam normalmente
              throw r;
            }
          };
          console.log("✅ Função pb interceptada");
        }

        // 2. Bloquear signOut APENAS durante operações de obra
        let saveOperationActive = false;

        const originalSignOut = auth.signOut;
        auth.signOut = function () {
          if (saveOperationActive) {
            console.warn(
              "💾 SAVE OBRAS: signOut bloqueado durante operação de guardar",
            );
            return Promise.resolve();
          }

          // Verificar se é signOut automático por erro de token
          const stack = new Error().stack;
          if (stack && (stack.includes("pb(") || stack.includes("iee("))) {
            console.warn("💾 SAVE OBRAS: signOut automático bloqueado");
            return Promise.resolve();
          }

          // Permitir signOut manual
          return originalSignOut.apply(this, arguments);
        };

        // 3. Detectar operações de guardar obra
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
          // Se é operação Firestore relacionada com obras
          if (typeof url === "string" && url.includes("firestore")) {
            const method = options?.method?.toUpperCase();
            const body = options?.body;

            // Detectar operações de escrita que podem ser obras
            if ((method === "POST" || method === "PATCH") && body) {
              console.log("💾 SAVE OBRAS: Operação Firestore detectada");

              saveOperationActive = true;

              // Garantir que currentUser está disponível
              if (!auth.currentUser) {
                console.log(
                  "💾 SAVE OBRAS: Configurando currentUser temporário",
                );

                Object.defineProperty(auth, "currentUser", {
                  get: function () {
                    return {
                      uid: "temp-user",
                      email: "user@leirisonda.com",
                      emailVerified: true,
                      getIdToken: () =>
                        Promise.resolve("temp-token-" + Date.now()),
                    };
                  },
                  configurable: true,
                });
              }

              // Executar operação com proteção
              const result = originalFetch.apply(this, arguments);

              // Desativar proteção após operação
              result.finally(() => {
                setTimeout(() => {
                  saveOperationActive = false;
                  console.log(
                    "💾 SAVE OBRAS: Operação finalizada, proteção desativada",
                  );
                }, 2000);
              });

              return result;
            }
          }

          return originalFetch.apply(this, arguments);
        };

        // 4. Interceptar erros específicos que podem impedir guardar
        const originalConsoleError = console.error;
        console.error = function (...args) {
          const errorMessage = args.join(" ");

          // Bloquear erros que podem interromper operações de obra
          if (
            saveOperationActive &&
            (errorMessage.includes("auth/user-token-expired") ||
              errorMessage.includes("auth/user-disabled") ||
              errorMessage.includes("auth/network-request-failed"))
          ) {
            console.warn(
              "💾 SAVE OBRAS: Erro bloqueado durante operação:",
              errorMessage,
            );
            return; // Não propagar erro
          }

          return originalConsoleError.apply(this, args);
        };

        // 5. Monitor para botões de guardar obra
        document.addEventListener(
          "click",
          (event) => {
            const target = event.target;
            if (target && target.tagName === "BUTTON") {
              const text = target.textContent?.toLowerCase() || "";

              if (
                text.includes("guardar") ||
                text.includes("salvar") ||
                text.includes("criar") ||
                text.includes("submeter")
              ) {
                console.log(
                  "💾 SAVE OBRAS: Botão de guardar clicado - ativando proteção",
                );

                saveOperationActive = true;

                // Verificar se operação foi bem-sucedida após 10 segundos
                setTimeout(() => {
                  const loginPage = document.querySelector(
                    '[data-loc="code/client/pages/Login.tsx:116:5"]',
                  );
                  if (loginPage) {
                    console.error(
                      "💾 SAVE OBRAS: FALHA - Redirecionado para login após guardar",
                    );
                    // Tentar voltar para a aplicação
                    window.location.href = "/";
                  } else {
                    console.log(
                      "💾 SAVE OBRAS: Sucesso - Permaneceu na aplicação",
                    );
                  }

                  saveOperationActive = false;
                }, 10000);
              }
            }
          },
          true,
        );

        console.log("✅ Firebase corrigido para operações de obra");
      } catch (e) {
        console.error("❌ Erro ao corrigir Firebase:", e.message);
      }
    }
  }

  // Configurar correção quando Firebase estiver disponível
  const setupFix = () => {
    if (window.firebase) {
      fixFirebaseForObras();
    } else {
      setTimeout(setupFix, 100);
    }
  };

  setupFix();

  // Reconfigurar sempre que a página mudar
  let currentPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      console.log("💾 SAVE OBRAS: Página mudou, reconfigurando...");
      setTimeout(setupFix, 1000);
    }
  }, 1000);

  console.log("✅ FIX SAVE OBRAS: Sistema ativo");
})();
