const CACHE = "aeq-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // 네비게이션 요청은 index.html로 대체(오프라인 진입 보장)
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("./index.html").then(r => r || fetch(req))
    );
    return;
  }
  // 정적 파일: 캐시 우선
  e.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );
});