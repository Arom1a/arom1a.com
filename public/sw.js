const addResourcesToCache = async (resources) => {
  const cache = await caches.open("bookmarks-cache-v1");
  // console.log("Opened ccache");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(["/bookmarks", "/bookmarks/bookmarks", "/bookmarks/ehe"]));
  // console.log("Service Worker finished installing");
});

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});

const putInCache = async (request, response) => {
  const cache = await caches.open("bookmarks-cache-v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  const refsponseFromCache = await caches.match(request);
  if (refsponseFromCache) {
    return refsponseFromCache;
  }

  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({ request: event.request, preloadResponsePromise: event.preloadResponse })
  );
});
