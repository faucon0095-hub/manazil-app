// ─── Sen-Astro PWA Service Worker ────────────────────────────────────────
// Version : changer ce numéro à chaque mise à jour → force le rechargement
const VERSION = 'v6.0';
const CACHE_NAME = `manazil-senastro-${VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ─── Installation ─────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log(`[Sen-Astro SW] Installation ${VERSION}`);
  // Force l'activation immédiate sans attendre la fermeture des onglets
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache.map(url =>
        new Request(url, { cache: 'reload' })
      )).catch(err => console.log('[SW] Cache partiel:', err));
    })
  );
});

// ─── Activation — supprime TOUS les anciens caches ────────────────────────
self.addEventListener('activate', event => {
  console.log(`[Sen-Astro SW] Activation ${VERSION}`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log(`[SW] Suppression ancien cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Prend le contrôle de TOUS les onglets ouverts immédiatement
      return self.clients.claim();
    }).then(() => {
      // Envoie un message à tous les onglets pour recharger
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'NEW_VERSION',
            version: VERSION,
          });
        });
      });
    })
  );
});

// ─── Fetch — Stratégie Network First pour HTML, Cache First pour assets ───
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les APIs externes
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // Pour les fichiers HTML → Network First (toujours la version la plus récente)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request) || caches.match('/index.html'))
    );
    return;
  }

  // Pour les assets JS/CSS → Cache First avec mise à jour en arrière-plan
  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});

// ─── Message — Rechargement forcé depuis l'app ────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
