import 'regenerator-runtime';
import CacheHelper from './utils/cache-helper';

const CACHE_NAME = 'QulinaryQuest-V1';
const assetsToCache = [
  './',
  './index.html',
  './cutlery.png',
  './heroes/hero-image_1.jpg',
  './app.bundle.js',
  './app.webmanifest',
  './sw.bundle.js',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();

  event.waitUntil(
    CacheHelper.cacheAssets(assetsToCache)
      .then(() => {
        console.log('Caching app shell');
      })
      .catch((error) => {
        console.error('Caching failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  self.clients.claim();

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (!(event.request.url.startsWith('http'))) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((fetchResponse) => {
            if (fetchResponse && fetchResponse.status === 200) {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            return new Response('Offline', { status: 404 });
          });
      })
  );
});