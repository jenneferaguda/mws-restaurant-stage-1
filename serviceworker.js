const cacheName = 'mws-restaurant-v1';
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

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            return cache.addAll(cacheAssets)
                .catch(function(error) {})
        }));
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                .map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
        .then(function(response) {
            let responseClone = response.clone();
            caches
                .open(cacheName)
                .then(function(cache) {
                    cache.put(event.request, responseClone);
                });
            return response;
        })
        .catch(function(error) {
            caches.match(event.request);
        })
    )
});