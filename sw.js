const CACHE_NAME = 'chache-v2';
self.addEventListener('install', event => {
    console.log('install', event);
    event.waitUntil(caches.open(CACHE_NAME)
        .then(cache => {
            cache.addAll([
                '/',
                './index.css'
            ]);
        }));
});
self.addEventListener('activate', event => {
    console.log('activate', event);
    event.waitUntil(caches.keys()
        .then( cacheNames => {
            return Promise.all(cacheNames.map( cacheNames => {
                if(cacheNames !== CACHE_NAME) {
                    return caches.delete(cacheNames);
                }
            }));
        }));
});

self.addEventListener('fetch', event => {
    console.log('fetch', event);
    event.responseWith(caches.open(CACHE_NAME)
        .then(cache => {
            return cache.match(event.request)
                .then(response => {
                    if(response) {
                        return response;
                    }

                    return fetch(event.request)
                        .then(response => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                });
        }));
});
