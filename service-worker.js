
// 缓存名称，带版本号以便更新时区分
const CACHE_NAME = 'movie-list-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  // 如果有单独的CSS/JS文件，可以在这里添加
  // './styles.css',
  // './app.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 监听 install 事件，进行预缓存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  console.log('Service Worker: install 成功');
});

// 监听 activate 事件，清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker: activate');
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(name => {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
      })
    ))
  );
});

// 监听 fetch 事件，拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 如果缓存中有，就直接用，否则再从网络拉取
      return cachedResponse || fetch(event.request);
    })
  );
});