const CACHE_NAME = "leirisonda-v4";
const urlsToCache = [
  "/",
  "/assets/index-DFdR-byQ.css",
  "/assets/index-DnEsHg1H.js",
  "/manifest.json",
];

// Flag to prevent logout during operations
let operationInProgress = false;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  // Don't interfere with Firebase Auth requests during operations
  if (operationInProgress && event.request.url.includes("firebase")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});

// Listen for messages from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "OPERATION_START") {
    operationInProgress = true;
  } else if (event.data && event.data.type === "OPERATION_END") {
    operationInProgress = false;
  }
});
