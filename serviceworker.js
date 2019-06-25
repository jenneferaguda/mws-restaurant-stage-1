const CACHE_VERSION = '2';
const STATIC_CACHE = `mws-restaurant-v${CACHE_VERSION}`;
const IMAGES_CACHE = 'image-cache-v';
const OTHERS_CACHE = 'others-cache-v';
const ALL_CACHES = [
    STATIC_CACHE,
    IMAGES_CACHE,
    OTHERS_CACHE
];

const CACHE_ASSETS = [
    '/',
    'index.html',
    'restaurant.html',
    '/css/styles.css',
    '/css/responsive.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/register.js',
    '/js/restaurant_info.js',
    'serviceworker.js',
];

self.addEventListener("install", event => {
    try {
        event.waitUntil(
            caches.open(STATIC_CACHE)
            .then(cache => {
                cache.addAll(CACHE_ASSETS);
                return;
            }));
    } catch (error) {
        console.log(`Install Error: ${error}`);
    }

});

self.addEventListener('activate', event => {
    try {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                    .map(cacheName => {
                        if (!ALL_CACHES.includes(cacheName)) {
                            console.log(`Deleting: ${cacheName}`)
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    } catch (error) {
        console.log(`Activate Error: ${error}`);
    }

});

function isImageURL(url) {
    let img_types = ['jpg', 'png', 'gif'];
    let lastThreeChars = url.substring(url.length - 3);
    let isImage = img_types.includes(lastThreeChars);
    return isImage;
}

function storeInCache(cacheName, requestClone, responseClone) {
    return caches.open(cacheName)
        .then(cache => {
            return cache.put(requestClone, responseClone);
        });
}

function isInternalResources(url) {
    return url.includes('localhost');
}

self.addEventListener('fetch', event => {
    try {
        if (event.request.method === 'GET') {
            console.log(event.request);
            if (!event.isReload) {
                event.respondWith(
                    caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        let url = event.request.url;
                        return fetch(event.request)
                            .then(response => {
                                let cacheToUse = !isInternalResources(url) ? OTHERS_CACHE : (isImageURL(url) ? IMAGES_CACHE : STATIC_CACHE);
                                storeInCache(cacheToUse, event.request, response.clone());
                                return response;
                            })
                    })
                    .catch(error => {
                        console.log('Fetching error', error);
                    })
                )
            }
        } else {
            event.respondWith(fetch(event.request));
        }
    } catch (error) {
        console.log('Fetching error: respondWith', error);
    }
})