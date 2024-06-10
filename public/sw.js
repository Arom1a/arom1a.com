const addResourcesToCache = async (resources) => {
  const cache = await caches.open("bookmarks-cache-v1");
  // console.log("Opened cache");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(["/bookmarks/", "/bookmarks/bookmarks"]));
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

const networkFirst = async ({ request, preloadResponsePromise }) => {
  try {
    // try fetch
    const responseFromNetwork = await fetch(request);

    // success -> put in cache
    putInCache(request, responseFromNetwork.clone());

    // success -> respond
    return responseFromNetwork;
  } catch (error) {
    console.warn("Network request failed; trying to serve from cache:", error);

    // fail -> respond with cache
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }

    // If the resource is not in the cache, return a fallback (could be an error response or a fallback resource)
    return new Response("Network error", { status: 408 });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    networkFirst({ request: event.request, preloadResponsePromise: event.preloadResponse })
  );
});
