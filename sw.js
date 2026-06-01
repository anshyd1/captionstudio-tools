/*
 * CaptionStudio — Service Worker Cleanup
 * --------------------------------------------------------------
 * Purpose: Unregister this SW + ALL previously-installed SWs
 * (especially the rogue Monetag/5gvci.com worker that was
 *  silently breaking fetch() calls — including the search bar
 *  loading data/blog.json on slow / adblocked connections).
 *
 * How it works:
 *   1. As soon as a returning user visits the site, their browser
 *      auto-checks /sw.js for an update.
 *   2. This new file replaces the old one, then immediately
 *      unregisters itself + nukes every Cache Storage entry.
 *   3. Open tabs are force-reloaded so the user gets a clean
 *      session with no SW intercepting fetch() anymore.
 *
 * After every active user has visited once, you may safely
 * delete this file AND remove the navigator.serviceWorker.register
 * call from index.html. Until then, KEEP THIS FILE LIVE.
 * --------------------------------------------------------------
 */

self.addEventListener('install', (event) => {
  // Skip waiting so this cleanup SW activates immediately,
  // replacing any previously-installed Monetag worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // 1. Delete every cache this origin has ever created
      //    (Monetag, old precaches, anything else).
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    } catch (e) { /* ignore */ }

    try {
      // 2. Unregister THIS service worker so nothing intercepts
      //    fetch() calls on future page loads.
      await self.registration.unregister();
    } catch (e) { /* ignore */ }

    try {
      // 3. Force-reload every open tab so the user gets a fresh,
      //    SW-free session without having to refresh manually.
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        try { client.navigate(client.url); } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
  })());
});

// Defensive: if anything still triggers a fetch through this SW
// during the brief window before unregister completes, just pass
// it straight to the network — no caching, no interception.
self.addEventListener('fetch', (event) => {
  // Let the browser handle it natively. Do NOT call respondWith.
  return;
});
