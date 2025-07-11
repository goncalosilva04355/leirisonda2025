// Chrome Debug Helper for Leirisonda PWA
console.log("🔍 Chrome Debug Helper loaded");

// Check browser compatibility
const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const isIncognito =
  window.webkitRequestFileSystem || window.webkitResolveLocalFileSystemURL;

console.log("Browser info:", {
  userAgent: navigator.userAgent,
  isChrome,
  isIncognito: !isIncognito,
  serviceWorkerSupported: "serviceWorker" in navigator,
  cacheSupported: "caches" in window,
  storageQuota: navigator.storage ? "supported" : "not supported",
});

// Check for service worker issues
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log("Current service worker registrations:", registrations);
    registrations.forEach((reg, index) => {
      console.log(`SW ${index}:`, {
        scope: reg.scope,
        active: reg.active ? reg.active.scriptURL : "none",
        waiting: reg.waiting ? reg.waiting.scriptURL : "none",
        installing: reg.installing ? reg.installing.scriptURL : "none",
      });
    });
  });
}

// Check cache status
if ("caches" in window) {
  caches.keys().then((cacheNames) => {
    console.log("Available caches:", cacheNames);
    cacheNames.forEach((cacheName) => {
      caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
          console.log(
            `Cache ${cacheName}:`,
            keys.map((k) => k.url),
          );
        });
      });
    });
  });
}

// Check localStorage
try {
  console.log("LocalStorage status:", {
    available: typeof Storage !== "undefined",
    itemCount: localStorage.length,
    quota: navigator.storage ? "checking..." : "unknown",
  });

  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then((estimate) => {
      console.log("Storage estimate:", estimate);
    });
  }
} catch (error) {
  console.error("LocalStorage error:", error);
}

// Monitor for errors
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error, e.filename, e.lineno);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

console.log("🔍 Chrome Debug Helper setup complete");
