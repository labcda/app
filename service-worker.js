const CACHE_NAME = 'pwa-cache-v4'; // Incrementado para forçar atualização
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './tabela_preco.xlsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// URLs que NUNCA devem passar pelo cache: APIs dinâmicas (disponibilidade de
// horários, registros na planilha, IA). Servir isso do cache faria o paciente
// ver horários "livres" que já foram ocupados.
function ehRequisicaoDinamica(url) {
  return url.includes('script.google.com') ||
         url.includes('script.googleusercontent.com') ||
         url.includes('workers.dev') ||
         url.includes('api.anthropic.com');
}

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usando addAll mas com catch individual para evitar que um erro pare tudo
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.warn('Falha ao cachear:', url, err)))
      );
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia Stale-While-Revalidate: Serve do cache e atualiza em background
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;
  // APIs dinâmicas vão direto para a rede, sem cache
  if (ehRequisicaoDinamica(e.request.url)) return;

  // exames.json usa cache-busting (?v=timestamp) — normaliza a chave do cache
  // para não acumular uma entrada nova a cada visita.
  const ehExamesJson = e.request.url.includes('exames.json');
  const cacheKey = ehExamesJson ? e.request.url.split('?')[0] : e.request;

  e.respondWith(
    caches.match(cacheKey).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback para o index principal se a rede falhar e não houver cache
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      // exames.json: prioriza a rede (dados de preço atualizados), cache é só fallback
      if (ehExamesJson) return fetchPromise.then(r => r || cachedResponse).catch(() => cachedResponse);
      return cachedResponse || fetchPromise;
    })
  );
});
