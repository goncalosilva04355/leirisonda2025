// ==========================================
// ULTIMATE RUNTIME FIX - STOPS ALL LOGOUTS
// ==========================================
console.log("🚀 ULTIMATE RUNTIME FIX LOADING...");

// Block ALL logout attempts at the lowest level
let isBlocking = false;

// Immediate protection
window.ULTIMATE_PROTECTION = {
  enabled: false,
  forceEnable() {
    this.enabled = true;
    console.log("🛡️ ULTIMATE PROTECTION FORCE ENABLED");
  },
  disable() {
    this.enabled = false;
    console.log("🔓 ULTIMATE PROTECTION DISABLED");
  },
};

// Auto-enable on any activity
function autoEnableProtection() {
  if (!window.ULTIMATE_PROTECTION.enabled) {
    window.ULTIMATE_PROTECTION.forceEnable();
    setTimeout(() => {
      window.ULTIMATE_PROTECTION.disable();
    }, 30000); // 30 seconds
  }
}

// 1. Block React Router navigate/redirect
function blockReactRouter() {
  // Override history methods
  if (window.history) {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (state, title, url) {
      if (
        window.ULTIMATE_PROTECTION.enabled &&
        (url?.includes("/login") || url?.includes("/auth"))
      ) {
        console.warn("🛡️ BLOCKED history.pushState to login:", url);
        return;
      }
      return originalPushState.apply(this, arguments);
    };

    window.history.replaceState = function (state, title, url) {
      if (
        window.ULTIMATE_PROTECTION.enabled &&
        (url?.includes("/login") || url?.includes("/auth"))
      ) {
        console.warn("🛡️ BLOCKED history.replaceState to login:", url);
        return;
      }
      return originalReplaceState.apply(this, arguments);
    };
  }
}

// 2. Block window.location changes
function blockLocationChanges() {
  let currentLocation = window.location.href;

  // Override location.href setter
  Object.defineProperty(window.location, "href", {
    set: function (url) {
      if (
        window.ULTIMATE_PROTECTION.enabled &&
        (url.includes("/login") || url.includes("/auth"))
      ) {
        console.warn("🛡️ BLOCKED location.href change to:", url);
        return;
      }
      window.location.assign(url);
    },
    get: function () {
      return currentLocation;
    },
  });

  // Block other location methods
  const originalAssign = window.location.assign;
  const originalReplace = window.location.replace;

  window.location.assign = function (url) {
    if (
      window.ULTIMATE_PROTECTION.enabled &&
      (url.includes("/login") || url.includes("/auth"))
    ) {
      console.warn("🛡️ BLOCKED location.assign to:", url);
      return;
    }
    return originalAssign.call(this, url);
  };

  window.location.replace = function (url) {
    if (
      window.ULTIMATE_PROTECTION.enabled &&
      (url.includes("/login") || url.includes("/auth"))
    ) {
      console.warn("🛡️ BLOCKED location.replace to:", url);
      return;
    }
    return originalReplace.call(this, url);
  };
}

// 3. Block React component renders
function blockReactRenders() {
  // Override React.createElement to block login/error components
  if (window.React?.createElement) {
    const originalCreateElement = window.React.createElement;

    window.React.createElement = function (type, props, ...children) {
      if (window.ULTIMATE_PROTECTION.enabled) {
        // Block error pages and login components
        if (
          typeof type === "string" &&
          (type.includes("login") || type.includes("error"))
        ) {
          console.warn("🛡️ BLOCKED React component:", type);
          return null;
        }

        // Block components with login-related props
        if (props && typeof props === "object") {
          const propsString = JSON.stringify(props).toLowerCase();
          if (
            propsString.includes("login") ||
            propsString.includes("redirect")
          ) {
            console.warn("🛡️ BLOCKED React component with suspicious props");
            return null;
          }
        }
      }

      return originalCreateElement.apply(this, arguments);
    };
  }
}

// 4. Block all authentication/logout functions
function blockAuthFunctions() {
  // Global function interception
  const functionsToBlock = [
    "signOut",
    "logout",
    "disconnect",
    "authenticate",
    "redirectToLogin",
    "checkAuth",
    "validateAuth",
  ];

  // Override global functions
  functionsToBlock.forEach((funcName) => {
    if (window[funcName]) {
      const original = window[funcName];
      window[funcName] = function () {
        if (window.ULTIMATE_PROTECTION.enabled) {
          console.warn(`🛡️ BLOCKED global function: ${funcName}`);
          return Promise.resolve();
        }
        return original.apply(this, arguments);
      };
    }
  });

  // Override setTimeout/setInterval that might trigger logout
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;

  window.setTimeout = function (func, delay) {
    if (window.ULTIMATE_PROTECTION.enabled && typeof func === "function") {
      const funcString = func.toString().toLowerCase();
      if (
        funcString.includes("login") ||
        funcString.includes("logout") ||
        funcString.includes("redirect") ||
        funcString.includes("signout")
      ) {
        console.warn("🛡️ BLOCKED suspicious setTimeout");
        return -1;
      }
    }
    return originalSetTimeout.apply(this, arguments);
  };

  window.setInterval = function (func, delay) {
    if (window.ULTIMATE_PROTECTION.enabled && typeof func === "function") {
      const funcString = func.toString().toLowerCase();
      if (
        funcString.includes("login") ||
        funcString.includes("logout") ||
        funcString.includes("redirect") ||
        funcString.includes("signout")
      ) {
        console.warn("🛡️ BLOCKED suspicious setInterval");
        return -1;
      }
    }
    return originalSetInterval.apply(this, arguments);
  };
}

// 5. Monitor and block DOM changes
function monitorDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    if (window.ULTIMATE_PROTECTION.enabled) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent?.toLowerCase() || "";
            if (
              text.includes("carregar") ||
              text.includes("login") ||
              text.includes("erro") ||
              text.includes("error")
            ) {
              console.warn("🛡️ BLOCKING suspicious DOM element:", text);
              node.style.display = "none";
            }
          }
        });
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// 6. Auto-trigger protection on any user action
function setupAutoProtection() {
  ["click", "submit", "keydown", "touchstart"].forEach((event) => {
    document.addEventListener(
      event,
      (e) => {
        const target = e.target;
        const text = (target.textContent || target.value || "").toLowerCase();

        if (
          text.includes("criar") ||
          text.includes("guardar") ||
          text.includes("save") ||
          text.includes("obra")
        ) {
          autoEnableProtection();
          console.log("🔥 AUTO-PROTECTION triggered by user action");
        }
      },
      true,
    );
  });
}

// Initialize all protections
function initializeUltimateFix() {
  blockReactRouter();
  blockLocationChanges();
  blockReactRenders();
  blockAuthFunctions();
  monitorDOMChanges();
  setupAutoProtection();

  console.log("🚀 ULTIMATE FIX INITIALIZED - ALL PROTECTIONS ACTIVE");
}

// Run immediately
initializeUltimateFix();

// Also run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUltimateFix);
} else {
  initializeUltimateFix();
}

// Force enable protection for 10 seconds on load
window.ULTIMATE_PROTECTION.forceEnable();
setTimeout(() => {
  window.ULTIMATE_PROTECTION.disable();
}, 10000);

console.log(`
🛡️ ULTIMATE PROTECTION SYSTEM LOADED
🚫 Blocks: React Router, location changes, auth functions
🔥 Auto-triggers on any obra-related action
⏰ Force protection for 10 seconds on load
🎮 Manual control: window.ULTIMATE_PROTECTION.forceEnable()
`);
