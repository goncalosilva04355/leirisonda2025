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

// Monitor button clicks that might create obras
function trackButtonClicks() {
  document.addEventListener("click", (event) => {
    const button = event.target;
    const text = button.textContent?.toLowerCase() || "";

    if (
      text.includes("criar") ||
      text.includes("guardar") ||
      text.includes("save") ||
      text.includes("submit")
    ) {
      // Check if we're in a form or modal that might be creating an obra
      const form = button.closest("form");
      const modal =
        button.closest('[role="dialog"]') || button.closest(".modal");

      if (form || modal) {
        console.log("🎯 Potential obra creation button clicked");

        // Enable protection temporarily
        if (window.LeirisondaAuth) {
          window.LeirisondaAuth.startOperation();

          // Disable after 10 seconds if no other triggers
          setTimeout(() => {
            window.LeirisondaAuth.endOperation();
          }, 10000);
        }
      }
    }
  });
}

// Initialize tracking
function initObraTracker() {
  trackObraOperations();
  trackFormSubmissions();
  trackButtonClicks();

  console.log("✅ Obra tracking initialized");
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initObraTracker);
} else {
  initObraTracker();
}
