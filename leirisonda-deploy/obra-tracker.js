// ==========================================
// OBRA OPERATION TRACKER v2.0 - AGGRESSIVE MODE
// ==========================================
console.log("🚀 Enhanced Obra Tracker v2.0 LOADED");

// Monitor for obra form submissions
function trackObraOperations() {
  // Enhanced fetch monitoring - more aggressive detection
  if (!window.OBRA_FETCH_HOOKED) {
    window.OBRA_FETCH_HOOKED = true;
    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      const url = args[0];
      const options = args[1] || {};

      // More aggressive detection patterns
      const isFirebaseRequest =
        typeof url === "string" &&
        (url.includes("firestore") ||
          url.includes("firebase") ||
          url.includes("googleapis"));

      const isWriteOperation =
        options.method === "POST" ||
        options.method === "PUT" ||
        options.method === "PATCH";

      const isObraRelated =
        typeof url === "string" &&
        (url.includes("obra") ||
          url.includes("client") ||
          url.includes("project") ||
          url.includes("work") ||
          url.includes("documents"));

      if (isFirebaseRequest && (isWriteOperation || isObraRelated)) {
        console.log(
          "🚨 FIREBASE WRITE OPERATION DETECTED - MAXIMUM PROTECTION",
        );
        console.log("📍 URL:", url);
        console.log("📍 Method:", options.method);

        // Enable protection IMMEDIATELY
        if (window.LeirisondaAuth) {
          window.LeirisondaAuth.startOperation();
        }

        // Call original fetch
        const fetchPromise = originalFetch.apply(this, args);

        // Extended protection period
        fetchPromise
          .then((response) => {
            console.log("✅ Firebase operation completed:", response.status);
            setTimeout(() => {
              if (window.LeirisondaAuth) {
                window.LeirisondaAuth.endOperation();
              }
              console.log("🔓 Protection disabled after Firebase success");
            }, 10000); // 10 seconds protection
          })
          .catch((error) => {
            console.log("❌ Firebase operation failed:", error);
            setTimeout(() => {
              if (window.LeirisondaAuth) {
                window.LeirisondaAuth.endOperation();
              }
              console.log("🔓 Protection disabled after Firebase error");
            }, 3000); // 3 seconds on error
          });

        return fetchPromise;
      }

      return originalFetch.apply(this, args);
    };

    console.log("✅ Enhanced fetch monitoring active");
  }
}

// Monitor form submissions
function trackFormSubmissions() {
  document.addEventListener("submit", (event) => {
    const form = event.target;

    // Check if it's an obra form (look for common obra field names)
    const formData = new FormData(form);
    let isObraForm = false;

    for (let [key, value] of formData.entries()) {
      if (
        key.includes("client") ||
        key.includes("obra") ||
        key.includes("work") ||
        key.includes("projeto")
      ) {
        isObraForm = true;
        break;
      }
    }

    if (isObraForm) {
      console.log("📝 Obra form submission detected");
      if (window.LeirisondaAuth) {
        window.LeirisondaAuth.startOperation();
      }
    }
  });
}

// Enhanced button and interaction monitoring
function trackAllInteractions() {
  // Button clicks
  document.addEventListener("click", (event) => {
    const element = event.target;
    const text = (element.textContent || element.value || "").toLowerCase();

    // More aggressive patterns
    const actionWords = [
      "criar",
      "guardar",
      "save",
      "submit",
      "enviar",
      "confirmar",
      "adicionar",
      "novo",
    ];
    const hasActionWord = actionWords.some((word) => text.includes(word));

    if (hasActionWord || element.type === "submit") {
      console.log("🎯 ACTION BUTTON CLICKED - enabling protection");
      console.log("🎯 Element:", element.tagName, element.type, text);

      if (window.LeirisondaAuth) {
        window.LeirisondaAuth.startOperation();

        // Extended protection for button clicks
        setTimeout(() => {
          window.LeirisondaAuth.endOperation();
        }, 15000);
      }
    }
  });

  // Input changes that might trigger saves
  document.addEventListener("input", (event) => {
    const input = event.target;
    if (
      input.name &&
      (input.name.includes("client") || input.name.includes("obra"))
    ) {
      console.log("📝 Obra-related input detected - preparing protection");
      // Don't activate yet, just prepare
    }
  });

  // Key combinations (Ctrl+S, Ctrl+Enter)
  document.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey && event.key === "s") ||
      (event.ctrlKey && event.key === "Enter")
    ) {
      console.log("⌨️ Save keyboard shortcut detected");
      if (window.LeirisondaAuth) {
        window.LeirisondaAuth.startOperation();
        setTimeout(() => {
          window.LeirisondaAuth.endOperation();
        }, 10000);
      }
    }
  });

  // Focus on forms (user starting to fill obra form)
  document.addEventListener("focusin", (event) => {
    const form = event.target.closest("form");
    if (form) {
      const formData = new FormData(form);
      for (let [key] of formData.entries()) {
        if (
          key.includes("client") ||
          key.includes("obra") ||
          key.includes("work")
        ) {
          console.log("📋 Focus on obra-related form detected");
          break;
        }
      }
    }
  });
}

// Initialize comprehensive tracking
function initObraTracker() {
  trackObraOperations();
  trackFormSubmissions();
  trackAllInteractions();

  console.log("🚀 COMPREHENSIVE obra tracking initialized");
  console.log("🛡️ Protection will auto-activate on any suspicious activity");
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initObraTracker);
} else {
  initObraTracker();
}
