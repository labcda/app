const CACHE_NAME = 'pwa-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
</script>