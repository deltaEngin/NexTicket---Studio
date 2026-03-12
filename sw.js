// Nom du cache
const CACHE_NAME = 'NexTicket-Studio V1.0';

// Tous les fichiers à mettre en cache (100% locaux)
const filesToCache = [
  // Pages
  './',
  './index.html',
  
  // Configuration
  './manifest.json',
  './sw.js',
  
  // CSS et JS
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1',
  
  // Icônes
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  
  // Polices
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  
  // Images
  './images/ticket_backgroun.jpg'
];

// Installation
self.addEventListener('install', event => {
  console.log('[SW] Installation v4');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache des fichiers');
        // Ajouter chaque fichier individuellement pour mieux gérer les erreurs
        return Promise.allSettled(
          filesToCache.map(url => 
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                throw new Error(`Failed to fetch ${url}: ${response.status}`);
              })
              .catch(error => {
                console.warn(`[SW] Échec mise en cache ${url}:`, error.message);
              })
          )
        ).then(() => {
          console.log('[SW] Installation terminée');
          return self.skipWaiting();
        });
      })
  );
});

// Activation
self.addEventListener('activate', event => {
  console.log('[SW] Activation v4');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Interception - STRATÉGIE SIMPLE ET FIABLE
self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes non-GET
  if (event.request.method !== 'GET') return;
  
  // Ne pas intercepter les requêtes Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. Si en cache, retourner
        if (cachedResponse) {
          console.log('[SW] Depuis cache:', event.request.url);
          return cachedResponse;
        }
        
        // 2. Sinon, aller sur le réseau
        return fetch(event.request)
          .then(networkResponse => {
            // Si c'est une réponse valide, mettre en cache
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('[SW] Réseau indisponible pour:', event.request.url);
            
            // Fallback pour navigation
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html')
                .then(indexPage => indexPage || new Response('Page hors ligne', {
                  headers: { 'Content-Type': 'text/html' }
                }));
            }
            
            // Fallback pour icônes
            if (event.request.url.includes('favicon.ico')) {
              return caches.match('./icons/icon-192x192.png');
            }
            
            // Pour les scripts, retourner une réponse vide plutôt que 503
            if (event.request.url.includes('.js')) {
              return new Response('// Script non disponible hors ligne', {
                headers: { 'Content-Type': 'application/javascript' }
              });
            }
            
            return new Response('Ressource non disponible hors ligne', {
              status: 404,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});