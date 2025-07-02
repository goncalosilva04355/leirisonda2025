// EMERGENCY OBRA PROTECTION - Proteção de emergência para saves de obra

console.log("🚨 EMERGENCY: Ativando proteção de emergência para obras...");

(function () {
  "use strict";

  let emergencyMode = false;
  let protectionTimer = null;

  // Ativar modo de emergência
  function activateEmergencyMode(reason) {
    console.warn("🚨 EMERGENCY MODE ATIVADO:", reason);
    emergencyMode = true;

    // Limpar timer anterior
    if (protectionTimer) {
      clearTimeout(protectionTimer);
    }

    // Proteção por 30 segundos
    protectionTimer = setTimeout(() => {
      emergencyMode = false;
      console.log("🚨 EMERGENCY MODE desativado");
    }, 30000);

    // Forçar configuração Firebase
    forceFirebaseProtection();
  }

  // Forçar proteção Firebase imediatamente
  function forceFirebaseProtection() {
    if (!window.firebase) return;

    try {
      const auth = window.firebase.auth();

      // Override signOut com proteção absoluta
      const emergencySignOut = function () {
        if (emergencyMode) {
          console.error(
            "🚨 EMERGENCY: signOut BLOQUEADO - modo emergência ativo",
          );
          return Promise.resolve();
        }

        const stack = new Error().stack;
        if (
          stack &&
          (stack.includes("pb(") ||
            stack.includes("iee(") ||
            stack.includes("firebase") ||
            stack.includes("auth/"))
        ) {
          console.error("🚨 EMERGENCY: signOut automático BLOQUEADO");
          return Promise.resolve();
        }

        // Verificar se é realmente intencional
        console.warn(
          "🚨 EMERGENCY: Permitindo signOut (verificar se é intencional)",
        );
        return (window.originalEmergencySignOut || (() => Promise.resolve()))();
      };

      // Guardar original se não foi guardado
      if (!window.originalEmergencySignOut) {
        window.originalEmergencySignOut = auth.signOut.bind(auth);
      }

      // Aplicar override
      auth.signOut = emergencySignOut;

      console.log("🚨 EMERGENCY: Firebase protegido");
    } catch (e) {
      console.error("🚨 EMERGENCY: Erro ao proteger Firebase:", e);
    }
  }

  // Detectores de operação de obra
  function setupObraDetectors() {
    // 1. Monitor palavras-chave nos elementos
    const keywordMonitor = setInterval(() => {
      const elements = document.querySelectorAll("*");

      for (let el of elements) {
        const text = el.textContent?.toLowerCase() || "";
        const placeholder = el.placeholder?.toLowerCase() || "";

        if (
          text.includes("obra") ||
          text.includes("guardar obra") ||
          text.includes("criar obra") ||
          placeholder.includes("obra")
        ) {
          // Se elemento é visível e interativo
          if (
            el.offsetParent !== null &&
            (el.tagName === "BUTTON" ||
              el.tagName === "INPUT" ||
              el.tagName === "FORM")
          ) {
            if (!el.hasEmergencyListener) {
              el.addEventListener("click", () => {
                activateEmergencyMode(
                  "Interação com elemento de obra: " + text.substring(0, 50),
                );
              });

              if (el.tagName === "FORM") {
                el.addEventListener("submit", () => {
                  activateEmergencyMode("Submit de form de obra");
                });
              }

              el.hasEmergencyListener = true;
            }
          }
        }
      }
    }, 3000);

    // 2. Monitor específico para botões de guardar
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (target && target.tagName === "BUTTON") {
          const text = target.textContent?.toLowerCase() || "";

          if (
            text.includes("guardar") ||
            text.includes("gravar") ||
            text.includes("save") ||
            text.includes("criar")
          ) {
            // Verificar se está numa página/modal de obra
            const pageContent = document.body.textContent?.toLowerCase() || "";
            if (
              pageContent.includes("obra") ||
              pageContent.includes("trabalho") ||
              pageContent.includes("project")
            ) {
              activateEmergencyMode(
                "Botão guardar em contexto de obra: " + text,
              );
            }
          }
        }
      },
      true,
    );

    // 3. Monitor para URLs de obra
    const currentURL = window.location.href.toLowerCase();
    if (
      currentURL.includes("obra") ||
      currentURL.includes("work") ||
      currentURL.includes("project")
    ) {
      console.log("🚨 EMERGENCY: Página de obra detectada - modo preventivo");
      activateEmergencyMode("URL de obra detectada");
    }

    // 4. Monitor para localStorage de obra
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      if (
        key.toLowerCase().includes("obra") ||
        key.toLowerCase().includes("work") ||
        value.toLowerCase().includes("obra")
      ) {
        activateEmergencyMode("localStorage de obra: " + key);
      }

      return originalSetItem.call(this, key, value);
    };

    // Parar monitor após 2 minutos
    setTimeout(() => {
      clearInterval(keywordMonitor);
    }, 120000);

    console.log("🚨 EMERGENCY: Detectores de obra ativos");
  }

  // Monitor contínuo de Firebase
  function monitorFirebase() {
    const firebaseMonitor = setInterval(() => {
      if (window.firebase) {
        forceFirebaseProtection();
      }
    }, 5000);

    // Parar após 10 minutos
    setTimeout(() => {
      clearInterval(firebaseMonitor);
    }, 600000);
  }

  // Inicializar
  function init() {
    // Ativar proteção imediata se Firebase já existe
    if (window.firebase) {
      forceFirebaseProtection();
    }

    setupObraDetectors();
    monitorFirebase();

    console.log("🚨 EMERGENCY: Sistema de proteção de emergência ativo");
  }

  // Executar quando DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Aguardar Firebase
  const firebaseWaiter = setInterval(() => {
    if (window.firebase) {
      forceFirebaseProtection();
      clearInterval(firebaseWaiter);
    }
  }, 100);

  setTimeout(() => {
    clearInterval(firebaseWaiter);
  }, 30000);
})();
