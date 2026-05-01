const CACHE_NAME = 'manazil-senastro-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation — mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Manazil PWA: cache ouvert');
      return cache.addAll(urlsToCache.map(url => {
        return new Request(url, { cache: 'reload' });
      })).catch(err => {
        console.log('Cache partiel:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activation — nettoyage anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — répondre depuis le cache si disponible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retourne le cache si disponible
      if (response) return response;
      // Sinon fetch depuis le réseau
      return fetch(event.request).then(networkResponse => {
        // Ne cache que les requêtes GET valides
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Hors ligne — retourne la page principale
        return caches.match('/index.html');
      });
    })
  );
});
