/* maimai Alarm — service worker
   Sole purpose: make lockscreen / background notifications work, and route
   a notification tap back to the open PWA window (or launch it if none is
   open). Deliberately no fetch caching — the app is one small HTML file
   the user is expected to reload freely during development. */

self.addEventListener('install', (event) => {
  // Take over immediately on first install so alarm notifications can
  // fire on the very first session.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A tap on the alarm notification focuses the running PWA, or opens
// alarm.html if the tab was closed.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if ('focus' in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow('./alarm.html');
  })());
});
