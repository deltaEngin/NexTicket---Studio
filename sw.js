const CACHE_NAME = 'nexticket-studio-v2';

const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',

  // CDN
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1',

  // Fonts
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',

  // icons
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',

  '/images/ticket_background.jpg'
];


// INSTALL
self.addEventListener('install', event => {

  console.log('[SW] Installation');

  event.waitUntil(

    caches.open(CACHE_NAME).then(async cache => {

      await Promise.allSettled(

        filesToCache.map(async url => {

          try {

            const response = await fetch(url, { mode: 'no-cors' });

            await cache.put(url, response);

          } catch (err) {

            console.warn('[SW] Erreur cache', url);

          }

        })

      );

      return self.skipWaiting();

    })

  );

});


// ACTIVATE
self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys().then(names => {

      return Promise.all(

        names.map(name => {

          if (name !== CACHE_NAME) {

            return caches.delete(name);

          }

        })

      );

    })

  );

  return self.clients.claim();

});


// FETCH
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(

    caches.match(event.request).then(cached => {

      if (cached) return cached;

      return fetch(event.request)
        .then(response => {

          if (response && response.status === 200) {

            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));

          }

          return response;

        })
        .catch(() => {

          if (event.request.mode === 'navigate') {

            return caches.match('/index.html');

          }

        });

    })

  );

});
