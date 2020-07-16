'use strict';

// Update cache names 
const cacheName = 'static-cache-v1';
// const CACHE_NAME = 'static-cache-v2';
// following might be used when there is a need to store some data
const DATA_CACHE_NAME = 'data-cache-v1';

//  list of files to cache.
const FILES_TO_CACHE = [

    './index.html',
    './login.html',
    './registration.html',
    './cam.html',
    './map.html',
    // './offline.html',
    './scripts/camera.js',
    './scripts/install.js',
    './scripts/map.js',
    './scripts/other.js',
    './styles/style.css',
    './images/screen2.png',
    './images/logo.png',
    './images/favicon.ico',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd'
];

self.addEventListener('install', function(evt) {
    console.log('Service Worker Install Event');
    //the file to the cache
    evt.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('Caching Files');
            return cache.addAll(FILES_TO_CACHE);
        }).then(function() {
            return self.skipWaiting();
        }).catch(function(err) {
            console.log('Cache Failed', err);
        })
    );
});

self.addEventListener('activate', function(evt) {
    console.log('Service Worker Activated');
    evt.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('Removing Old Cache', key);
                    return caches.delete(key)
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', async function(evt) {
    console.log('Fetch Event' + evt.request.url);
    evt.respondWith(
        caches.match(evt.request).then(function(response) {
            if (evt.request.cache === 'only-if-cached' && evt.request.mode !== 'same-origin') return;
            return response || fetch(evt.request);
        })
    );
});

// fetch event handler here.
self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // if (evt.request.mode !== 'navigate')
    {
        return;
    }
    evt.respondWith(
        fetch(evt.request)
        .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.match('./offline.html');
                });
        })
    );

});