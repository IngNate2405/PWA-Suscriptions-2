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
  'icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
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

// Función para programar notificaciones
async function scheduleNotifications() {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const now = new Date();
    
    // Limpiar notificaciones anteriores
    const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    scheduledNotifications.forEach(notificationId => {
      clearTimeout(notificationId);
    });
    
    const newScheduledNotifications = [];
    
    for (const subscription of subscriptions) {
      if (!subscription.notifications || subscription.status === 'paused') continue;
      
      const nextPayment = new Date(subscription.nextPayment);
      
      for (const notification of subscription.notifications) {
        let notificationDate = new Date(nextPayment);
        
        if (notification.startsWith('customdate_')) {
          const [, day, time] = notification.split('_');
          const [hours, minutes] = time.split(':');
          notificationDate.setDate(parseInt(day));
          notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (notification.startsWith('custom_')) {
          const days = parseInt(notification.split('_')[1]);
          notificationDate.setDate(nextPayment.getDate() - days);
        } else {
          switch(notification) {
            case '1day':
              notificationDate.setDate(nextPayment.getDate() - 1);
              break;
            case '2days':
              notificationDate.setDate(nextPayment.getDate() - 2);
              break;
            case 'sameday':
              // Ya está configurado para el mismo día
              break;
            default:
              continue;
          }
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
          
          newScheduledNotifications.push(timeoutId);
        }
      }
    }
    
    // Guardar los IDs de las notificaciones programadas
    localStorage.setItem('scheduledNotifications', JSON.stringify(newScheduledNotifications));
    
  } catch (error) {
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

// Programar notificaciones cuando se activa el service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      scheduleNotifications(),
      // Limpiar caches antiguos si es necesario
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Escuchar mensajes del cliente para reprogramar notificaciones
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleNotifications();
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
        
        if (notification.startsWith('customdate_')) {
          const [, day, time] = notification.split('_');
          const [hours, minutes] = time.split(':');
          notificationDate.setDate(parseInt(day));
          notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (notification.startsWith('custom_')) {
          const days = parseInt(notification.split('_')[1]);
          notificationDate.setDate(nextPayment.getDate() - days);
        } else {
          switch(notification) {
            case '1day':
              notificationDate.setDate(nextPayment.getDate() - 1);
              break;
            case '2days':
              notificationDate.setDate(nextPayment.getDate() - 2);
              break;
            case 'sameday':
              // Ya está configurado para el mismo día
              break;
            default:
              continue;
          }
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
        
        if (notification.startsWith('customdate_')) {
          const [, day, time] = notification.split('_');
          const [hours, minutes] = time.split(':');
          notificationDate.setDate(parseInt(day));
          notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (notification.startsWith('custom_')) {
          const days = parseInt(notification.split('_')[1]);
          notificationDate.setDate(nextPayment.getDate() - days);
        } else {
          switch(notification) {
            case '1day':
              notificationDate.setDate(nextPayment.getDate() - 1);
              break;
            case '2days':
              notificationDate.setDate(nextPayment.getDate() - 2);
              break;
            case 'sameday':
              // Ya está configurado para el mismo día
              break;
            default:
              continue;
          }
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