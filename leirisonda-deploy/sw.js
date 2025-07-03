const CACHE_NAME = "leirisonda-v2";
const urlsToCache = [
  "/",
  "/assets/index-DHnQ0z6C.css",
  "/assets/index-Cf1crVxO.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
