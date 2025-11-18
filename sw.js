// sw.js — Manejo de caché para PWA práctica

// Nombre y versión del caché
const CACHE_NAME = 'pwa-practica-v2';

// Archivos que se guardarán en caché (los "críticos")
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/icons/icon-512.png' // si tienes uno local, si no, ignora este
];

//  1. Evento INSTALL → Guardar archivos en caché
self.addEventListener('install', event => {
  console.log('🛠️ Instalando Service Worker y cacheando recursos...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Archivos cacheados correctamente');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => console.error('❌ Error al cachear:', err))
  );
});

// 🧹 2. Evento ACTIVATE → Limpiar cachés viejos
self.addEventListener('activate', event => {
  console.log('♻️ Activando nuevo Service Worker');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ Borrando caché viejo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// 🌐 3. Evento FETCH → Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en caché, se usa
        if (response) {
          console.log('📦 Sirviendo desde caché:', event.request.url);
          return response;
        }
        // Si no, se obtiene de la red
        console.log('🌍 Recurso de la red:', event.request.url);
        return fetch(event.request);
      })
  );
});

self.addEventListener('install', () => {
  console.log('🛠️ Service Worker instalado');
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
