// Auth Fix Script - Prevents logout during obra creation
console.log("🔧 Leirisonda Auth Fix loaded");

// Store original Firebase functions
let originalSignOut = null;
let operationInProgress = false;

// Override Firebase signOut to prevent logout during operations
function initAuthFix() {
  // Wait for Firebase to load
  const checkFirebase = setInterval(() => {
    if (window.firebase && window.firebase.auth) {
      const auth = window.firebase.auth();

      if (auth && auth.signOut && !originalSignOut) {
        originalSignOut = auth.signOut.bind(auth);

        // Override signOut
        auth.signOut = function () {
          if (operationInProgress) {
            console.warn("⚠️ Logout prevented during obra operation");
            return Promise.resolve();
          }
          console.log("✅ Normal logout allowed");
          return originalSignOut();
        };

        console.log("🔧 Firebase signOut intercepted successfully");
        clearInterval(checkFirebase);
      }
    }
  }, 100);

  // Clear interval after 10 seconds to avoid infinite loop
  setTimeout(() => clearInterval(checkFirebase), 10000);
}

// Global functions for the app to use
window.LeirisondaAuth = {
  startOperation() {
    operationInProgress = true;
    console.log("🔒 Obra operation started - logout protection ON");
  },

  endOperation() {
    operationInProgress = false;
    console.log("🔓 Obra operation ended - logout protection OFF");
  },

  forceLogout() {
    operationInProgress = false;
    if (originalSignOut) {
      originalSignOut();
    }
  },
};

// Listen for messages from other scripts
window.addEventListener("message", (event) => {
  if (event.data.type === "LEIRISONDA_OPERATION_START") {
    window.LeirisondaAuth.startOperation();
  } else if (event.data.type === "LEIRISONDA_OPERATION_END") {
    window.LeirisondaAuth.endOperation();
  }
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuthFix);
} else {
  initAuthFix();
}

// Also try to initialize immediately
initAuthFix();
