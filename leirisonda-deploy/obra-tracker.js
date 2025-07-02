// ==========================================
// OBRA OPERATION TRACKER v2.0 - AGGRESSIVE MODE
// ==========================================
console.log("🚀 Enhanced Obra Tracker v2.0 LOADED");

// Monitor for obra form submissions
function trackObraOperations() {
  // Monitor fetch requests to Firebase
  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    const url = args[0];

    // Check if it's a Firestore request for creating obra
    if (
      typeof url === "string" &&
      (url.includes("firestore") || url.includes("firebase")) &&
      (url.includes("obra") || args[1]?.method === "POST")
    ) {
      console.log("🏗️ Obra operation detected - enabling protection");

      // Enable protection
      if (window.LeirisondaAuth) {
        window.LeirisondaAuth.startOperation();
      }

      // Call original fetch
      const fetchPromise = originalFetch.apply(this, args);

      // Disable protection after operation completes
      fetchPromise
        .then(() => {
          setTimeout(() => {
            if (window.LeirisondaAuth) {
              window.LeirisondaAuth.endOperation();
            }
            console.log("✅ Obra operation completed - protection disabled");
          }, 5000); // Keep protection for 5 seconds after completion
        })
        .catch(() => {
          setTimeout(() => {
            if (window.LeirisondaAuth) {
              window.LeirisondaAuth.endOperation();
            }
            console.log("❌ Obra operation failed - protection disabled");
          }, 1000);
        });

      return fetchPromise;
    }

    return originalFetch.apply(this, args);
  };
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
