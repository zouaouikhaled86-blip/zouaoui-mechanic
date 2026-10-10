// Service worker: يستقبل الإشعارات ويفتح صفحة الإدارة عند الضغط عليها
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) {}
  const title = d.title || 'حجز جديد';
  const opts = {
    body: d.body || 'وصلك حجز جديد',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'booking',
    renotify: true,
    lang: 'ar',
    dir: 'rtl',
    vibrate: [200, 100, 200],
    data: { url: d.url || 'admin.html' }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || 'admin.html', self.registration.scope).href;
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope) && 'focus' in c) {
        await c.focus();
        if ('navigate' in c) { try { await c.navigate(target); } catch (e) {} }
        return;
      }
    }
    await self.clients.openWindow(target);
  })());
});
