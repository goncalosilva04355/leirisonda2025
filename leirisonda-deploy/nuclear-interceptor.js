// INTERCEPTOR NUCLEAR - Bloqueia TUDO relacionado a logout

(function () {
  "use strict";

  console.log("☢️ NUCLEAR: Iniciando interceptor total...");

  // 1. Override ALL possible logout functions at window level
  const logoutMethods = [
    "signOut",
    "logout",
    "logOut",
    "sign_out",
    "log_out",
    "clearAuthState",
    "clearSession",
    "endSession",
  ];

  logoutMethods.forEach((method) => {
    Object.defineProperty(window, method, {
      value: function () {
        console.warn(`☢️ NUCLEAR: Bloqueado ${method} no window`);
        return Promise.resolve();
      },
      writable: false,
      configurable: false,
    });
  });

  // 2. Override fetch to intercept Firebase auth requests
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (typeof url === "string") {
      // Block Firebase auth signout requests
      if (
        url.includes("signOut") ||
        url.includes("logout") ||
        (url.includes("firebase") && url.includes("auth"))
      ) {
        console.warn("☢️ NUCLEAR: Bloqueado fetch Firebase auth:", url);
        return Promise.resolve(
          new Response('{"blocked": true}', {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
    }
    return originalFetch.apply(this, arguments);
  };

  // 3. Override XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (
      typeof url === "string" &&
      (url.includes("signOut") || url.includes("logout"))
    ) {
      console.warn("☢️ NUCLEAR: Bloqueado XHR para:", url);
      // Redirect to a dummy endpoint
      return originalXHROpen.call(this, method, "/manifest.json");
    }
    return originalXHROpen.apply(this, arguments);
  };

  // 4. Override history methods to prevent navigation to login
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (state, title, url) {
    if (url && url.includes("/login")) {
      console.warn("☢️ NUCLEAR: Bloqueado pushState para login");
      return;
    }
    return originalPushState.apply(this, arguments);
  };

  history.replaceState = function (state, title, url) {
    if (url && url.includes("/login")) {
      console.warn("☢️ NUCLEAR: Bloqueado replaceState para login");
      return;
    }
    return originalReplaceState.apply(this, arguments);
  };

  // 5. Override location.href setter
  let isSettingLocation = false;
  Object.defineProperty(window, "location", {
    get: function () {
      return location;
    },
    set: function (value) {
      if (typeof value === "string" && value.includes("/login")) {
        console.warn("☢️ NUCLEAR: Bloqueado location.href para login");
        return;
      }
      if (!isSettingLocation) {
        isSettingLocation = true;
        location.href = value;
        isSettingLocation = false;
      }
    },
  });

  // 6. Monitor and override Firebase when it loads
  let firebaseOverridden = false;

  function overrideFirebase() {
    if (window.firebase && !firebaseOverridden) {
      try {
        // Override auth() method
        const originalAuth = window.firebase.auth;
        window.firebase.auth = function () {
          const authInstance = originalAuth.apply(this, arguments);

          // Override signOut on the instance
          if (authInstance && authInstance.signOut) {
            authInstance.signOut = function () {
              console.warn("☢️ NUCLEAR: Bloqueado Firebase auth().signOut()");
              return Promise.resolve();
            };
          }

          return authInstance;
        };

        // Also override existing instances
        try {
          const auth = originalAuth();
          if (auth && auth.signOut) {
            auth.signOut = function () {
              console.warn("☢️ NUCLEAR: Bloqueado Firebase signOut existente");
              return Promise.resolve();
            };
          }
        } catch (e) {}

        firebaseOverridden = true;
        console.log("☢️ NUCLEAR: Firebase completamente bloqueado");
      } catch (e) {
        console.log("☢️ NUCLEAR: Erro ao override Firebase:", e.message);
      }
    }
  }

  // Check for Firebase immediately and periodically
  overrideFirebase();
  const firebaseChecker = setInterval(() => {
    overrideFirebase();
    if (firebaseOverridden) {
      clearInterval(firebaseChecker);
    }
  }, 100);

  // Stop checking after 30 seconds
  setTimeout(() => {
    clearInterval(firebaseChecker);
  }, 30000);

  // 7. Override common logout patterns in any eval'd code
  const originalEval = window.eval;
  window.eval = function (code) {
    if (typeof code === "string") {
      // Replace logout patterns in eval'd code
      code = code.replace(
        /\.signOut\s*\(/g,
        '.console.warn("blocked signOut")(',
      );
      code = code.replace(/\.logout\s*\(/g, '.console.warn("blocked logout")(');
      code = code.replace(
        /location\.href\s*=.*login/g,
        'console.warn("blocked login redirect")',
      );
    }
    return originalEval.call(this, code);
  };

  // 8. Block error handlers that might trigger logout
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function (type, listener, options) {
    if (type === "error" && typeof listener === "function") {
      const originalListener = listener;
      listener = function (event) {
        // Check if this error handler might cause logout
        const handlerString = originalListener.toString();
        if (
          handlerString.includes("signOut") ||
          handlerString.includes("logout")
        ) {
          console.warn(
            "☢️ NUCLEAR: Bloqueado error handler que pode causar logout",
          );
          return;
        }
        return originalListener.apply(this, arguments);
      };
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  console.log(
    "☢️ NUCLEAR: Interceptor completo - TODOS os caminhos de logout bloqueados",
  );

  // Make methods available globally for testing
  window.NUCLEAR_INTERCEPTOR = {
    enabled: true,
    overrideFirebase: overrideFirebase,
    test: function () {
      console.log("☢️ NUCLEAR: Testando...");
      if (window.firebase) {
        try {
          window.firebase.auth().signOut();
        } catch (e) {
          console.log("Erro esperado:", e.message);
        }
      }
    },
  };
})();
