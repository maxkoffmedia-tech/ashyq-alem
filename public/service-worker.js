self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("ashyq-alem-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/ru",
        "/kz",
        "/images/backgrounds/steppe_day.png",
        "/images/backgrounds/steppe_sunset.png",
        "/images/backgrounds/steppe_night.png",
        "/addictions/alcohol.png",
        "/addictions/drug.png",
        "/addictions/gambling.png",
        "/addictions/smoking.png",
        "/kazakh-music.mp3",
        "/images/icons/icon-192x192.png",
        "/images/icons/icon-512x512.png",
        "/manifest.json",
        "/images/game/board.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});