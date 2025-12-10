const CACHE_NAME = 'subs-app-v1';
const urlsToCache = [
  './',
  'index.html',
  'card.html',
  'calendar.html',
  'calendar2.html',
  'editar.html',
  'editar-persona.html',
  'personas.html',
  'persona.html',
  'settings.html',
  'manifest.json',
  'sw.js',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Si el recurso es externo, dejar que el navegador lo maneje normalmente
  if (url.origin !== self.location.origin) {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          return new Response('Recurso no disponible', {
            status: 404,
            statusText: 'Not Found'
          });
        });
      })
  );
});

// Manejo de notificaciones push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Tienes una suscripción por pagar',
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: 'icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: 'icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Recordatorio de Pago', options)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Abrir la aplicación
    event.waitUntil(
      clients.openWindow('index.html')
    );
  }
});

// IDs de timeouts programados en memoria (no disponible localStorage en SW)
let scheduledNotifications = [];

// Función para programar notificaciones
async function scheduleNotifications(subscriptionsFromClient = []) {
  try {
    const subscriptions = Array.isArray(subscriptionsFromClient) ? subscriptionsFromClient : [];
    const now = new Date();
    
    // Limpiar notificaciones anteriores (en memoria)
    scheduledNotifications.forEach(notificationId => clearTimeout(notificationId));
    scheduledNotifications = [];
    
    for (const subscription of subscriptions) {
      if (!subscription.notifications || subscription.status === 'paused') continue;
      if (!subscription.nextPayment) continue;
      
      const nextPayment = new Date(subscription.nextPayment);
      
      for (const notification of subscription.notifications) {
        let notificationDate = new Date(nextPayment);
        
        // Procesar notificaciones de prueba gratuita igual que las normales
        if (notification.startsWith('customdate_') || notification.startsWith('trial_customdate_')) {
          const parts = notification.split('_');
          const day = parts[1];
          const time = parts[2];
          const [hours, minutes] = time.split(':');
          notificationDate.setDate(parseInt(day));
          notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (notification.startsWith('custom_') || notification.startsWith('trial_custom_')) {
          const days = parseInt(notification.split('_')[2] || notification.split('_')[1]);
          notificationDate.setDate(nextPayment.getDate() - days);
        } else if (notification === '1day' || notification === 'trial_1day') {
          notificationDate.setDate(nextPayment.getDate() - 1);
        } else if (notification === '2days' || notification === 'trial_2days') {
          notificationDate.setDate(nextPayment.getDate() - 2);
        } else if (notification === 'sameday' || notification === 'trial_sameday') {
          // Ya está configurado para el mismo día
        } else {
          continue;
        }
        
        // Solo programar si la fecha es futura
        if (notificationDate > now) {
          const delay = notificationDate.getTime() - now.getTime();
          
          const timeoutId = setTimeout(() => {
            self.registration.showNotification('Recordatorio de Pago', {
              body: `Tu suscripción a ${subscription.name} vence el ${formatDate(subscription.nextPayment)}`,
              icon: 'icons/icon-192x192.png',
              badge: 'icons/icon-192x192.png',
              vibrate: [100, 50, 100],
              data: {
                subscriptionId: subscription.id,
                subscriptionName: subscription.name
              },
              actions: [
                {
                  action: 'view',
                  title: 'Ver detalles',
                  icon: 'icons/icon-192x192.png'
                },
                {
                  action: 'close',
                  title: 'Cerrar',
                  icon: 'icons/icon-192x192.png'
                }
              ]
            });
          }, delay);
          
          scheduledNotifications.push(timeoutId);
        }
      }
    }
    
  } catch (error) {
    console.error('Error al programar notificaciones en SW:', error);
  }
}

// Función auxiliar para formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Programar notificaciones cuando se activa el service worker (solo limpieza de caché)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Escuchar mensajes del cliente para reprogramar notificaciones
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleNotifications(event.data.subscriptions || []);
  } else if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification(event.data.data.title, {
      body: event.data.data.body,
      icon: 'icons/icon-192x192.png',
      badge: 'icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      actions: [
        {
          action: 'view',
          title: 'Ver detalles',
          icon: 'icons/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: 'icons/icon-192x192.png'
        }
      ]
    });
  }
});

// Función para programar notificaciones usando Background Sync API
async function scheduleNotificationsWithBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('check-notifications');
    } catch (error) {
    }
  }
}

// Escuchar eventos de sync para verificar notificaciones
self.addEventListener('sync', event => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkAndSendNotifications());
  }
});

// Función para verificar y enviar notificaciones
async function checkAndSendNotifications() {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const now = new Date();
    
    for (const subscription of subscriptions) {
      if (!subscription.notifications || subscription.status === 'paused') continue;
      
      const nextPayment = new Date(subscription.nextPayment);
      
      for (const notification of subscription.notifications) {
        let notificationDate = new Date(nextPayment);
        
        // Procesar notificaciones de prueba gratuita igual que las normales
        if (notification.startsWith('customdate_') || notification.startsWith('trial_customdate_')) {
          const parts = notification.split('_');
          const day = parts[1];
          const time = parts[2];
          const [hours, minutes] = time.split(':');
          notificationDate.setDate(parseInt(day));
          notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (notification.startsWith('custom_') || notification.startsWith('trial_custom_')) {
          const days = parseInt(notification.split('_')[2] || notification.split('_')[1]);
          notificationDate.setDate(nextPayment.getDate() - days);
        } else if (notification === '1day' || notification === 'trial_1day') {
          notificationDate.setDate(nextPayment.getDate() - 1);
        } else if (notification === '2days' || notification === 'trial_2days') {
          notificationDate.setDate(nextPayment.getDate() - 2);
        } else if (notification === 'sameday' || notification === 'trial_sameday') {
          // Ya está configurado para el mismo día
        } else {
          continue;
        }
        
        // Verificar si es hora de enviar la notificación
        const timeDiff = Math.abs(notificationDate.getTime() - now.getTime());
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // Enviar notificación si estamos dentro de los 5 minutos de la hora programada
        if (minutesDiff <= 5 && notificationDate > now) {
          await self.registration.showNotification('Recordatorio de Pago', {
            body: `Tu suscripción a ${subscription.name} vence el ${formatDate(subscription.nextPayment)}`,
            icon: 'icons/icon-192x192.png',
            badge: 'icons/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: {
              subscriptionId: subscription.id,
              subscriptionName: subscription.name
            },
            actions: [
              {
                action: 'view',
                title: 'Ver detalles',
                icon: 'icons/icon-192x192.png'
              },
              {
                action: 'close',
                title: 'Cerrar',
                icon: 'icons/icon-192x192.png'
              }
            ]
          });
        }
      }
    }
  } catch (error) {
  }
}

// Función para recargar notificaciones desde localStorage
async function reloadNotifications() {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const now = new Date();
    
    for (const subscription of subscriptions) {
      if (!subscription.notifications || subscription.status === 'paused') continue;
      
      const nextPayment = new Date(subscription.nextPayment);
      
      for (const notification of subscription.notifications) {
        let notificationDate = new Date(nextPayment);
        
        // Procesar notificaciones de prueba gratuita igual que las normales
        if (notification.startsWith('customdate_') || notification.startsWith('trial_customdate_')) {
          const parts = notification.split('_');
          const day = parts[1];
          const time = parts[2];
          const [hours, minutes] = time.split(':');
          notificationDate.setDate(parseInt(day));
          notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (notification.startsWith('custom_') || notification.startsWith('trial_custom_')) {
          const days = parseInt(notification.split('_')[2] || notification.split('_')[1]);
          notificationDate.setDate(nextPayment.getDate() - days);
        } else if (notification === '1day' || notification === 'trial_1day') {
          notificationDate.setDate(nextPayment.getDate() - 1);
        } else if (notification === '2days' || notification === 'trial_2days') {
          notificationDate.setDate(nextPayment.getDate() - 2);
        } else if (notification === 'sameday' || notification === 'trial_sameday') {
          // Ya está configurado para el mismo día
        } else {
          continue;
        }
        
        // Verificar si es hora de enviar la notificación
        const timeDiff = Math.abs(notificationDate.getTime() - now.getTime());
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // Enviar notificación si estamos dentro de los 5 minutos de la hora programada
        if (minutesDiff <= 5 && notificationDate > now) {
          await self.registration.showNotification('Recordatorio de Pago', {
            body: `Tu suscripción a ${subscription.name} vence el ${formatDate(subscription.nextPayment)}`,
            icon: 'icons/icon-192x192.png',
            badge: 'icons/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: {
              subscriptionId: subscription.id,
              subscriptionName: subscription.name
            },
            actions: [
              {
                action: 'view',
                title: 'Ver detalles',
                icon: 'icons/icon-192x192.png'
              },
              {
                action: 'close',
                title: 'Cerrar',
                icon: 'icons/icon-192x192.png'
              }
            ]
          });
        }
      }
    }
  } catch (error) {
  }
} 