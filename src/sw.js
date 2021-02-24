const VERSION = "v20";

log("Installing Service Worker");

self.addEventListener("install", (event) =>
  event.waitUntil(installServiceWorker())
);

/*

    These are the files that we want to download and install on the background

        '/',
        '/polyfills.bundle.js',
        '/inline.bundle.js',
        '/styles.bundle.js',
        '/vendor.bundle.js',
        '/main.bundle.js',
        '/assets/bundle.css',
        '/assets/angular-pwa-course.png',
        '/assets/main-page-logo-small-hat.png'
*/

async function installServiceWorker() {
  log("Service Worker installation started ");

  const cache = await caches.open(getCacheName());

  self.skipWaiting();

  return cache.addAll([
    "/",
    "/polyfills.js",
    "/styles.js",
    "/vendor.js",
    "/runtime.js",
    "/main.js",
    "/assets/bundle.css",
    "/assets/angular-pwa-course.png",
    "/assets/main-page-logo-small-hat.png",
  ]);
}

self.addEventListener("activate", () => activateSW());

self.addEventListener("fetch", (event) =>
  event.respondWith(cacheThenNetwork(event))
);

function getCacheName() {
  return "app-cache-" + VERSION;
}

async function activateSW() {
  log("Service Worker activated");

  const cachedKeys = await caches.keys();
  cachedKeys.forEach((cachedKey) => {
    if (cachedKey !== getCacheName()) {
      caches.delete(cachedKey);
    }
  });

  return clients.claim();
}

async function cacheThenNetwork(event) {
  const cache = await caches.open(getCacheName());
  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    log("Serving from cache: " + event.request.url);
    return cachedResponse;
  }

  const networkResponse = await fetch(event.request);
  log("Serving from network: " + event.request.url);
  return networkResponse;
}

function log(message, ...data) {
  if (data.length > 0) {
    console.log(VERSION, message, data);
  } else {
    console.log(VERSION, message);
  }
}
