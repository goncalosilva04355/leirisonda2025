// BLOQUEADOR DE PÁGINA DE LOGIN - Força sempre redirect para app principal

(function () {
  "use strict";

  console.log("🚫 LOGIN BLOCKER: Iniciando...");

  // Função para detectar se estamos na página de login
  function isLoginPage() {
    return (
      window.location.pathname.includes("/login") ||
      document.querySelector('[data-loc*="Login.tsx"]') ||
      (document.querySelector('input[type="email"]') &&
        document.querySelector('input[type="password"]'))
    );
  }

  // Função para forçar redirect para app principal
  function forceRedirectToApp() {
    console.log("🚫 LOGIN BLOCKER: Forçando redirect para app...");

    // Limpar qualquer estado de auth que possa estar causando problema
    try {
      localStorage.removeItem("firebase:authUser");
      localStorage.removeItem("firebase:host");
      sessionStorage.clear();
    } catch (e) {}

    // Definir um estado de "logado" fake se necessário
    try {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("skipAuthCheck", "true");
    } catch (e) {}

    // Múltiplas tentativas de redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 100);

    setTimeout(() => {
      window.location.replace("/");
    }, 200);

    setTimeout(() => {
      history.pushState({}, "", "/");
      window.location.reload();
    }, 300);
  }

  // Verificar imediatamente se estamos no login
  if (isLoginPage()) {
    console.log("🚫 LOGIN BLOCKER: Login detectado - redirecionando...");
    forceRedirectToApp();
  }

  // Monitor contínuo para bloquear login
  const loginBlocker = setInterval(() => {
    if (isLoginPage()) {
      console.log(
        "🚫 LOGIN BLOCKER: Login detectado durante monitor - redirecionando...",
      );
      forceRedirectToApp();
    }
  }, 500);

  // Observer para detectar mudanças no DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Verificar se adicionaram elementos de login
          if (
            node.querySelector &&
            (node.querySelector('[data-loc*="Login.tsx"]') ||
              node.querySelector('input[type="email"]'))
          ) {
            console.log(
              "🚫 LOGIN BLOCKER: Elementos de login detectados no DOM - redirecionando...",
            );
            forceRedirectToApp();
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Override React createElement para bloquear componentes de Login
  if (window.React && window.React.createElement) {
    const originalCreateElement = window.React.createElement;
    window.React.createElement = function (type, props, ...children) {
      // Bloquear componentes que parecem ser de login
      if (
        typeof type === "string" ||
        (typeof type === "function" && type.name)
      ) {
        const componentName = typeof type === "string" ? type : type.name;
        if (
          componentName &&
          (componentName.includes("Login") ||
            componentName.includes("login") ||
            componentName.includes("Auth"))
        ) {
          console.log(
            "🚫 LOGIN BLOCKER: Bloqueado componente React:",
            componentName,
          );
          // Retornar componente que força redirect
          return originalCreateElement(
            "div",
            {
              style: { display: "none" },
              ref: (el) => {
                if (el) {
                  setTimeout(forceRedirectToApp, 100);
                }
              },
            },
            "Redirecionando...",
          );
        }
      }
      return originalCreateElement.apply(this, arguments);
    };
    console.log("🚫 LOGIN BLOCKER: React.createElement interceptado");
  }

  // Bloquear popstate que pode levar ao login
  window.addEventListener(
    "popstate",
    (event) => {
      if (window.location.pathname.includes("/login")) {
        console.log("🚫 LOGIN BLOCKER: Popstate para login bloqueado");
        event.preventDefault();
        event.stopImmediatePropagation();
        forceRedirectToApp();
      }
    },
    true,
  );

  // Override de métodos de navegação
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (state, title, url) {
    if (url && url.includes("/login")) {
      console.log("🚫 LOGIN BLOCKER: pushState para login bloqueado");
      return originalPushState.call(this, state, title, "/");
    }
    return originalPushState.apply(this, arguments);
  };

  history.replaceState = function (state, title, url) {
    if (url && url.includes("/login")) {
      console.log("🚫 LOGIN BLOCKER: replaceState para login bloqueado");
      return originalReplaceState.call(this, state, title, "/");
    }
    return originalReplaceState.apply(this, arguments);
  };

  // Interceptar qualquer tentativa de mudar location
  Object.defineProperty(window, "location", {
    get: function () {
      return location;
    },
    set: function (value) {
      if (typeof value === "string" && value.includes("/login")) {
        console.log("🚫 LOGIN BLOCKER: location.href para login bloqueado");
        location.href = "/";
        return;
      }
      location.href = value;
    },
  });

  // Parar monitor após 60 segundos
  setTimeout(() => {
    clearInterval(loginBlocker);
    observer.disconnect();
    console.log("🚫 LOGIN BLOCKER: Monitor parado após 60s");
  }, 60000);

  console.log(
    "🚫 LOGIN BLOCKER: Configurado - página de login será sempre bloqueada",
  );

  // Função de teste disponível globalmente
  window.LOGIN_BLOCKER = {
    enabled: true,
    forceRedirect: forceRedirectToApp,
    isLoginPage: isLoginPage,
    test: function () {
      console.log("🚫 LOGIN BLOCKER: Teste - is login page?", isLoginPage());
      if (isLoginPage()) {
        forceRedirectToApp();
      }
    },
  };
})();
