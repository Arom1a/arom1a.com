const addResourcesToCache = async (resources) => {
  const cache = await caches.open("bookmark-cache-v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/bookmarks",
      // "/bookmarks/index.html",
      "/bookmarks/bookmarks",
      // "/bookmarks/bookmarks/index.html",
      "/bookmarks/ehe",
      // "/bookmarks/ehe/index.html",
    ])
  );
});

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  return fetch(request);
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
