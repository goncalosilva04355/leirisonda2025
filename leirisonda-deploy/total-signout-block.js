// BLOQUEIO TOTAL DE SIGNOUT - VERSÃO NUCLEAR

(function () {
  "use strict";

  console.log("🚀 BLOQUEIO TOTAL: Iniciando...");

  // Lista de todas as possíveis funções que podem causar logout
  const SIGNOUT_FUNCTIONS = [
    "signOut",
    "logout",
    "logOut",
    "sign_out",
    "log_out",
  ];

  let blockedCount = 0;

  // Função para bloquear signOut
  function blockSignOut(obj, funcName) {
    if (obj && typeof obj[funcName] === "function") {
      const original = obj[funcName];
      obj[funcName] = function (...args) {
        blockedCount++;
        console.warn(
          `🛡️ BLOQUEIO TOTAL: ${funcName} bloqueado (#${blockedCount})`,
        );
        console.trace();
        return Promise.resolve();
      };
      console.log(`✅ BLOQUEIO TOTAL: ${funcName} interceptado`);
      return true;
    }
    return false;
  }

  // Monitorizar e bloquear Firebase
  function monitorFirebase() {
    if (window.firebase) {
      // Bloquear firebase.auth().signOut()
      try {
        const auth = window.firebase.auth();
        SIGNOUT_FUNCTIONS.forEach((funcName) => {
          blockSignOut(auth, funcName);
        });
      } catch (e) {
        console.log("Firebase auth não disponível ainda");
      }

      // Bloquear no prototype
      if (window.firebase.auth && window.firebase.auth.Auth) {
        SIGNOUT_FUNCTIONS.forEach((funcName) => {
          blockSignOut(window.firebase.auth.Auth.prototype, funcName);
        });
      }
    }
  }

  // Bloquear a nível global
  SIGNOUT_FUNCTIONS.forEach((funcName) => {
    // No window
    blockSignOut(window, funcName);

    // No document
    blockSignOut(document, funcName);
  });

  // Interceptar definições de propriedades
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function (obj, prop, descriptor) {
    if (
      SIGNOUT_FUNCTIONS.includes(prop) &&
      descriptor.value &&
      typeof descriptor.value === "function"
    ) {
      console.warn(`🛡️ BLOQUEIO TOTAL: Bloqueando definição de ${prop}`);
      descriptor.value = function () {
        blockedCount++;
        console.warn(
          `🛡️ BLOQUEIO TOTAL: ${prop} bloqueado via defineProperty (#${blockedCount})`,
        );
        console.trace();
        return Promise.resolve();
      };
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };

  // Monitorizar Firebase continuamente
  const firebaseWatcher = setInterval(() => {
    monitorFirebase();
  }, 100);

  // Parar depois de 30 segundos
  setTimeout(() => {
    clearInterval(firebaseWatcher);
    console.log(
      `🔧 BLOQUEIO TOTAL: Parou monitorização. Total bloqueios: ${blockedCount}`,
    );
  }, 30000);

  // Override eval para bloquear signOut
  const originalEval = window.eval;
  window.eval = function (code) {
    if (typeof code === "string") {
      SIGNOUT_FUNCTIONS.forEach((funcName) => {
        if (code.includes(funcName)) {
          console.warn(`🛡️ BLOQUEIO TOTAL: Bloqueado eval com ${funcName}`);
          code = code.replace(
            new RegExp(funcName + "\\(\\)", "g"),
            'console.warn("blocked")',
          );
        }
      });
    }
    return originalEval.call(this, code);
  };

  // Interceptar fetch para operações Firebase
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    const result = originalFetch.apply(this, arguments);

    // Se é operação Firebase, activar proteção
    if (typeof url === "string" && url.includes("firestore")) {
      console.log("🔥 OPERAÇÃO FIREBASE DETECTADA - Proteção total ativada");

      // Bloquear todos os signOut por 10 segundos
      setTimeout(() => {
        monitorFirebase();
      }, 100);
    }

    return result;
  };

  monitorFirebase();
  console.log("✅ BLOQUEIO TOTAL: Configuração completa");
})();
