// Rural Sahayak — Service Worker
// Cache-first for static assets, network-first for API calls

const CACHE_VERSION = 'rural-sahayak-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

// App shell files to pre-cache on install
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/favicon.svg',
];

// Offline fallback HTML
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rural Sahayak — Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f4f6f4;
      color: #1b5e20;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
    }
    .offline-card {
      background: #fff;
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border: 1px solid #c8e6c9;
    }
    .offline-icon { font-size: 3rem; margin-bottom: 16px; }
    h1 { font-size: 1.4rem; margin-bottom: 8px; color: #1b5e20; }
    h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 16px; color: #2e7d32; }
    p { font-size: 0.95rem; color: #4a5568; line-height: 1.6; margin-bottom: 20px; }
    button {
      background: #1b5e20; color: #fff; border: none; border-radius: 24px;
      padding: 12px 32px; font-size: 1rem; font-weight: 600; cursor: pointer;
    }
    button:hover { background: #2e7d32; }
  </style>
</head>
<body>
  <div class="offline-card">
    <div class="offline-icon">📡</div>
    <h1>Rural Sahayak</h1>
    <h2>ग्रामीण सहायक</h2>
    <p>You are currently offline. Please check your internet connection and try again. Cached content may still be available.</p>
    <p>आप वर्तमान में ऑफ़लाइन हैं। कृपया अपना इंटरनेट कनेक्शन जाँचें और पुनः प्रयास करें।</p>
    <button onclick="location.reload()">Retry / पुनः प्रयास करें</button>
  </div>
</body>
</html>`;

// ─── Install: Pre-cache app shell ───
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    }).then(() => {
      // Store offline fallback page
      return caches.open(STATIC_CACHE).then((cache) => {
        return cache.put(
          new Request('/_offline'),
          new Response(OFFLINE_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: Clean old caches ───
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch strategies ───
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  // Network-first for API calls
  if (url.pathname.startsWith('/api/v1/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Cache-first for static assets
  event.respondWith(cacheFirstStrategy(request));
});

// ─── Network-first: try network, fall back to cache ───
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    // Return a JSON error for API calls when completely offline
    return new Response(
      JSON.stringify({ error: 'You are offline and no cached response is available.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// ─── Cache-first: try cache, fall back to network ───
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // For navigation requests, show offline page
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/_offline');
      if (offlinePage) return offlinePage;
    }
    return new Response('Offline', { status: 503 });
  }
}
