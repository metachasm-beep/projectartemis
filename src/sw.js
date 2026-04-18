import { precacheAndRoute } from 'workbox-precaching';

// 🛠️ PRECACHE: Automatically handle static assets injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

/**
 * 📡 PUSH EVENT LISTENER
 * Triggers when the Sovereign relay broadcast hits the browser.
 */
self.addEventListener('push', (event) => {
  let data = { title: 'New Resonance', body: 'Someone is trying to connect.' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: 'New Resonance', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-512.png',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Open Sanctuary' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * 🔗 NOTIFICATION CLICK
 * Directs the user into the specific sanctuary sector.
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url || '/');
    })
  );
});
