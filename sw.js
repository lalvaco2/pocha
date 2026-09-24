/* La Pocha — service worker
   Sube VERSION en cada despliegue para que los móviles recojan los cambios. */
const VERSION = 'pocha-v2';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts.css',
  './fonts/bevan-400.woff2',
  './fonts/inter-var.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.allSettled(ARCHIVOS.map(f => c.add(f)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // El documento: red primero (para recoger versiones nuevas), caché si no hay conexión.
  if (req.mode === 'navigate'){
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        const c = await caches.open(VERSION); c.put('./index.html', r.clone());
        return r;
      } catch {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // El resto: caché primero, y si no está, red (guardándolo).
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r && r.ok){ const c = await caches.open(VERSION); c.put(req, r.clone()); }
      return r;
    } catch { return Response.error(); }
  })());
});
