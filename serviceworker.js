const cacheName = 'mws-restaurant-v6';
const cacheAssets = [
    'index.html',
    'restaurant.html',
    '/css/styles.css',
    '/css/responsive.css',
    '/img/*',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(cacheAssets)
                .catch(error => {})
        }));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                .map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
        .then(response => {
            let responseClone = response.clone();
            caches
                .open(cacheName)
                .then(cache => {
                    cache.put(event.request, responseClone);
                });
            return response;
        })
        .catch(error => {
            caches.match(event.request);
        })
    )
});