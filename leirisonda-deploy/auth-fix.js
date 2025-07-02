// ==========================================
// LEIRISONDA AUTH FIX v2.0 - ULTIMATE PROTECTION
// ==========================================
console.log("🛡️ Leirisonda Ultimate Auth Protection LOADED");

// Global state
window.LEIRISONDA_PROTECTION = {
  active: false,
  operationCount: 0,
  originalMethods: {},
  protectionEnabled: false,
};

// Enable protection immediately when script loads
function enableImmediateProtection() {
  console.log("🔒 Enabling immediate auth protection...");

  // Block error handlers that trigger logout
  const originalError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (window.LEIRISONDA_PROTECTION.active) {
      const errorStr = String(message || error);
      if (
        errorStr.includes("auth/user-token-expired") ||
        errorStr.includes("auth/user-disabled") ||
        errorStr.includes("signOut")
      ) {
        console.warn("🛡️ BLOCKED error that would cause logout:", errorStr);
        return true; // Prevent default error handling
      }
    }
    return originalError ? originalError.apply(this, arguments) : false;
  };

  // Override console.error to catch Firebase errors
  if (!window.LEIRISONDA_PROTECTION.originalMethods.consoleError) {
    window.LEIRISONDA_PROTECTION.originalMethods.consoleError = console.error;
    console.error = function (...args) {
      if (window.LEIRISONDA_PROTECTION.active) {
        const message = args.join(" ");
        if (
          message.includes("auth/user-token-expired") ||
          message.includes("signOut") ||
          message.includes("auth/user-disabled")
        ) {
          console.warn(
            "🛡️ BLOCKED console.error that would trigger logout:",
            message,
          );
          return;
        }
      }
      return window.LEIRISONDA_PROTECTION.originalMethods.consoleError.apply(
        this,
        args,
      );
    };
  }

  // Override fetch to block logout requests
  if (!window.LEIRISONDA_PROTECTION.originalMethods.fetch) {
    window.LEIRISONDA_PROTECTION.originalMethods.fetch = window.fetch;
    window.fetch = function (url, options) {
      if (window.LEIRISONDA_PROTECTION.active && typeof url === "string") {
        if (
          url.includes("signOut") ||
          url.includes("logout") ||
          (options && options.method === "POST" && url.includes("auth"))
        ) {
          console.warn(
            "🛡️ BLOCKED fetch request that would cause logout:",
            url,
          );
          return Promise.resolve(
            new Response('{"blocked_by_protection": true}'),
          );
        }
      }
      return window.LEIRISONDA_PROTECTION.originalMethods.fetch.apply(
        this,
        arguments,
      );
    };
  }
}

// Firebase-specific protection
function setupFirebaseProtection() {
  const setupFirebase = () => {
    try {
      // Multiple ways to find Firebase
      const possibleFirebase = [
        window.firebase,
        window.getFirebaseApp && window.getFirebaseApp(),
        window.initializeApp,
        document.querySelector("[data-firebase-config]"),
      ].find((f) => f);

      if (possibleFirebase && window.firebase?.auth) {
        const auth = window.firebase.auth();

        if (
          auth &&
          auth.signOut &&
          !window.LEIRISONDA_PROTECTION.originalMethods.signOut
        ) {
          window.LEIRISONDA_PROTECTION.originalMethods.signOut =
            auth.signOut.bind(auth);

          auth.signOut = function () {
            if (window.LEIRISONDA_PROTECTION.active) {
              console.warn("🛡️ BLOCKED Firebase signOut during protection");
              return Promise.resolve();
            }
            console.log("✅ Normal Firebase signOut allowed");
            return window.LEIRISONDA_PROTECTION.originalMethods.signOut();
          };

          console.log("✅ Firebase signOut successfully intercepted");
          return true;
        }
      }
    } catch (error) {
      console.log("🔍 Firebase not ready yet...", error.message);
    }
    return false;
  };

  // Try immediately
  if (setupFirebase()) return;

  // Try periodically
  const interval = setInterval(() => {
    if (setupFirebase()) {
      clearInterval(interval);
    }
  }, 100);

  // Stop trying after 20 seconds
  setTimeout(() => clearInterval(interval), 20000);
}

// Global API for the app
window.LeirisondaAuth = {
  startOperation() {
    window.LEIRISONDA_PROTECTION.active = true;
    window.LEIRISONDA_PROTECTION.operationCount++;
    console.log(
      `🔒 PROTECTION ENABLED (count: ${window.LEIRISONDA_PROTECTION.operationCount})`,
    );

    // Auto-disable after 30 seconds as safety
    setTimeout(() => {
      if (window.LEIRISONDA_PROTECTION.active) {
        console.log("⏰ Auto-disabling protection after 30 seconds");
        this.endOperation();
      }
    }, 30000);
  },

  endOperation() {
    window.LEIRISONDA_PROTECTION.operationCount = Math.max(
      0,
      window.LEIRISONDA_PROTECTION.operationCount - 1,
    );
    if (window.LEIRISONDA_PROTECTION.operationCount === 0) {
      window.LEIRISONDA_PROTECTION.active = false;
      console.log("🔓 PROTECTION DISABLED");
    } else {
      console.log(
        `🔒 Protection still active (${window.LEIRISONDA_PROTECTION.operationCount} operations)`,
      );
    }
  },

  forceDisable() {
    window.LEIRISONDA_PROTECTION.active = false;
    window.LEIRISONDA_PROTECTION.operationCount = 0;
    console.log("🚨 PROTECTION FORCE DISABLED");
  },

  forceLogout() {
    this.forceDisable();
    if (window.LEIRISONDA_PROTECTION.originalMethods.signOut) {
      window.LEIRISONDA_PROTECTION.originalMethods.signOut();
    }
  },
};

// Auto-enable protection on any form submission
document.addEventListener("submit", () => {
  console.log("📝 Form submission detected - enabling protection");
  window.LeirisondaAuth.startOperation();
});

// Auto-enable protection on specific button clicks
document.addEventListener("click", (event) => {
  const button = event.target;
  const text = (button.textContent || "").toLowerCase();

  if (
    text.includes("criar") ||
    text.includes("guardar") ||
    text.includes("save") ||
    text.includes("submit")
  ) {
    console.log("🎯 Potential obra button clicked - enabling protection");
    window.LeirisondaAuth.startOperation();
  }
});

// Initialize everything
function initialize() {
  enableImmediateProtection();
  setupFirebaseProtection();
  console.log("🎉 Ultimate Protection System READY");
}

// Initialize immediately and on DOM ready
initialize();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
}

// Show status in console
console.log(`
🛡️ LEIRISONDA PROTECTION STATUS:
✅ Error handling intercepted
✅ Fetch requests intercepted  
✅ Console.error intercepted
🔍 Waiting for Firebase...
📊 Protection active: ${window.LEIRISONDA_PROTECTION.active}
`);
