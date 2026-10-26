const CACHE = "bookmarks-v2";
const PAGE = "/bookmarks/";

const cachePage = async () => {
  const response = await fetch(PAGE);
  const cache = await caches.open(CACHE);

  await cache.put(PAGE, response.clone());

  const html = await response.text();
  const assets = [...html.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)].map((match) => match[1]);

  await cache.addAll(assets);
};

self.addEventListener("install", (event) => {
  event.waitUntil(cachePage().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("bookmarks-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok || response.type === "opaque") {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }

  return response;
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true })) || caches.match(PAGE);
  }
};

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    event.request.mode === "navigate" ? networkFirst(event.request) : cacheFirst(event.request),
  );
});
