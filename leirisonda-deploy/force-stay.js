// FORÇA PERMANÊNCIA - Impede redirects para login

(function () {
  "use strict";

  console.log("🔒 FORÇA PERMANÊNCIA: Iniciando...");

  // Bloquear mudanças de URL para login
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (state, title, url) {
    if (url && (url.includes("/login") || url.includes("login"))) {
      console.warn("🔒 BLOQUEADO: Tentativa de ir para login via pushState");
      console.trace();
      return;
    }
    return originalPushState.apply(this, arguments);
  };

  history.replaceState = function (state, title, url) {
    if (url && (url.includes("/login") || url.includes("login"))) {
      console.warn("🔒 BLOQUEADO: Tentativa de ir para login via replaceState");
      console.trace();
      return;
    }
    return originalReplaceState.apply(this, arguments);
  };

  // Bloquear window.location
  let currentLocation = window.location.href;

  Object.defineProperty(window, "location", {
    get: function () {
      return {
        ...location,
        href: currentLocation,
        assign: function (url) {
          if (url.includes("/login") || url.includes("login")) {
            console.warn("🔒 BLOQUEADO: location.assign para login");
            return;
          }
          location.assign(url);
        },
        replace: function (url) {
          if (url.includes("/login") || url.includes("login")) {
            console.warn("🔒 BLOQUEADO: location.replace para login");
            return;
          }
          location.replace(url);
        },
      };
    },
    set: function (url) {
      if (url.includes("/login") || url.includes("login")) {
        console.warn("🔒 BLOQUEADO: Tentativa de set location para login");
        return;
      }
      currentLocation = url;
      location.href = url;
    },
  });

  // Interceptar popstate
  window.addEventListener("popstate", function (event) {
    if (window.location.pathname.includes("/login")) {
      console.warn("🔒 BLOQUEADO: popstate para login");
      event.preventDefault();
      event.stopPropagation();
      history.pushState({}, "", "/");
    }
  });

  // Se já estamos no login, força volta para home
  if (window.location.pathname.includes("/login")) {
    console.log("🔒 FORÇA PERMANÊNCIA: Detectado login, voltando para home...");
    setTimeout(() => {
      history.replaceState({}, "", "/");
      window.location.reload();
    }, 1000);
  }

  // Monitor URL changes
  const originalOnpopstate = window.onpopstate;
  window.onpopstate = function (event) {
    if (window.location.pathname.includes("/login")) {
      console.warn("🔒 BLOQUEADO: onpopstate para login");
      history.pushState({}, "", "/");
      return false;
    }
    return originalOnpopstate?.apply(this, arguments);
  };

  console.log("✅ FORÇA PERMANÊNCIA: Configurado");
})();
