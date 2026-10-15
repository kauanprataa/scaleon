// Scaleon service worker — notificações push
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; }
  catch(_) { d = { title: 'Scaleon', body: (e.data ? e.data.text() : '') }; }
  var title = d.title || 'Scaleon';
  var opts = {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: d.tag || undefined,
    renotify: d.tag ? false : undefined,
    data: { url: d.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        if ('focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

