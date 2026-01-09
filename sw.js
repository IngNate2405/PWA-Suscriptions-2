// Importar NotificationService
try {
  importScripts('notification-service.js');
} catch (e) {
  console.error('Error al importar notification-service.js:', e);
}

// Nombre del caché con versión
const CACHE_NAME = 'subs-app-v3';
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
  'mensajeria.html',
  'cotizar.html',
  'desuscripcion.html',
  'archivo-datos.html',
  'manifest.json',
  'sw.js',
  'notification-service.js',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png'
];

// Inicializar NotificationService si está disponible
let notificationService = null;
if (typeof NotificationService !== 'undefined') {
  notificationService = new NotificationService();
  notificationService.initDB().catch(err => console.error('Error al inicializar DB:', err));
}

self.addEventListener('install', event => {
  // Forzar actualización inmediata
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Error al cachear:', err))
  );
});

// Estrategia network-first: intentar red primero, luego caché
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Si el recurso es externo, dejar que el navegador lo maneje normalmente
  if (url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, actualizar el caché
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar desde el caché
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            return new Response('Recurso no disponible', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});

// Manejo de notificaciones push desde Firebase Cloud Functions
// Basado en: https://github.com/gokulkrishh/demo-progressive-web-app
self.addEventListener('push', event => {
  let notificationData = {
    title: 'Recordatorio de Pago',
    body: 'Tienes una suscripción por pagar',
    icon: 'icons/icon-192x192.png'
  };
  
  // Parsear datos JSON del servidor (Firebase Cloud Functions)
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || 'icons/icon-96x96.png',
        tag: data.tag || 'subscription-reminder',
        data: data.data || {}
      };
    } catch (e) {
      console.error('Error parseando datos push:', e);
    }
  }
  
  // Intentar parsear datos JSON si están disponibles
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        image: data.image,
        data: data.data || {}
      };
    } catch (e) {
      // Si no es JSON, usar como texto
      notificationData.body = event.data.text() || notificationData.body;
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: 'icons/icon-192x192.png',
    image: notificationData.image,
    vibrate: [100, 50, 100],
    tag: 'payment-reminder', // Evitar duplicados
    requireInteraction: false,
    data: {
      ...notificationData.data,
      dateOfArrival: Date.now()
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
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Manejo de clics en notificaciones (mejorado basado en ejemplo PWA)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  const urlToOpen = data && data.subscriptionId 
    ? `card.html?id=${data.subscriptionId}` 
    : 'index.html';
  
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then(clientList => {
      // Buscar si hay una ventana abierta de la aplicación
      for (let client of clientList) {
        if (client.url.includes('index.html') || client.url.includes('card.html')) {
          // Si hay una ventana abierta, enfocarla y navegar si es necesario
          if (data && data.subscriptionId && !client.url.includes(`id=${data.subscriptionId}`)) {
            return client.navigate(urlToOpen).then(() => client.focus());
          }
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Función legacy para programar notificaciones (mantener por compatibilidad)
// Ahora usa NotificationService si está disponible
async function scheduleNotifications(subscriptionsFromClient = []) {
  if (notificationService) {
    try {
      await notificationService.saveSubscriptions(subscriptionsFromClient);
      const count = await notificationService.scheduleNotifications(subscriptionsFromClient);
      console.log(`✅ ${count} notificaciones programadas`);
      // Registrar Background Sync
      try {
        await self.registration.sync.register('check-notifications');
      } catch (e) {
        console.log('Background Sync no disponible:', e);
      }
      return count;
    } catch (error) {
      console.error('Error al programar notificaciones:', error);
      return 0;
    }
  } else {
    // Fallback a método legacy si NotificationService no está disponible
    return scheduleNotificationsLegacy(subscriptionsFromClient);
  }
}

// Función legacy para programar notificaciones (mantener por compatibilidad)
async function scheduleNotificationsLegacy(subscriptionsFromClient = []) {
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
          
          // Nuevo formato: customdate_YYYY_MM_DD_HH:MM
          if (parts.length >= 5) {
            const year = parseInt(parts[1]);
            const month = parseInt(parts[2]) - 1; // Los meses en JS son 0-indexed
            const day = parseInt(parts[3]);
            const time = parts[4];
            const [hours, minutes] = time.split(':');
            
            notificationDate = new Date(year, month, day, parseInt(hours), parseInt(minutes), 0, 0);
          }
          // Formato legacy: customdate_DD_HH:MM
          else if (parts.length >= 3) {
            const day = parseInt(parts[1]);
            const time = parts[2];
            const [hours, minutes] = time.split(':');
            notificationDate.setDate(parseInt(day));
            notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          }
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
            const notificationOptions = {
              body: `Tu suscripción a ${subscription.name} vence el ${formatDate(subscription.nextPayment)}`,
              icon: subscription.logo || 'icons/icon-192x192.png',
              badge: 'icons/icon-192x192.png',
              image: subscription.logo || undefined, // Imagen grande (si está disponible)
              vibrate: [100, 50, 100],
              tag: `subscription-${subscription.id}`, // Evitar notificaciones duplicadas
              requireInteraction: false,
              silent: false,
              data: {
                subscriptionId: subscription.id,
                subscriptionName: subscription.name,
                nextPayment: subscription.nextPayment,
                dateOfArrival: Date.now()
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
            };
            
            self.registration.showNotification('Recordatorio de Pago', notificationOptions);
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

// Verificar notificaciones periódicamente (cada minuto cuando el service worker está activo)
let notificationCheckInterval = null;

function startPeriodicNotificationCheck() {
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
  }
  
  // Verificar inmediatamente
  if (notificationService) {
    notificationService.checkAndSendNotifications().catch(err => {
      console.error('Error en verificación periódica:', err);
    });
  }
  
  // Verificar cada minuto
  notificationCheckInterval = setInterval(() => {
    if (notificationService) {
      notificationService.checkAndSendNotifications().catch(err => {
        console.error('Error en verificación periódica:', err);
      });
    }
  }, 60000); // 60 segundos
}

// Limpiar cachés antiguos cuando se activa el service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpiar todos los cachés antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Eliminar todos los cachés que no sean el actual
            if (!cacheName.startsWith('subs-app-v') || cacheName !== CACHE_NAME) {
              console.log('Eliminando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control inmediatamente de todas las páginas
      self.clients.claim(),
      // Verificar notificaciones pendientes e iniciar verificación periódica
      (async () => {
        if (notificationService) {
          try {
            await notificationService.checkAndSendNotifications();
            // Registrar Background Sync
            try {
              await self.registration.sync.register('check-notifications');
            } catch (e) {
              console.log('Background Sync no disponible:', e);
            }
            // Iniciar verificación periódica
            startPeriodicNotificationCheck();
          } catch (err) {
            console.error('Error al verificar notificaciones:', err);
          }
        }
      })()
    ])
  );
});

// Escuchar mensajes del cliente para reprogramar notificaciones
self.addEventListener('message', async event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    const subscriptions = event.data.subscriptions || [];
    if (notificationService) {
      try {
        // Guardar suscripciones en IndexedDB
        await notificationService.saveSubscriptions(subscriptions);
        // Programar notificaciones
        const count = await notificationService.scheduleNotifications(subscriptions);
        console.log(`✅ ${count} notificaciones programadas`);
        // Registrar Background Sync para verificación periódica
        try {
          await self.registration.sync.register('check-notifications');
        } catch (e) {
          console.log('Background Sync no disponible:', e);
        }
      } catch (error) {
        console.error('Error al programar notificaciones:', error);
        // Fallback a método legacy
        scheduleNotificationsLegacy(subscriptions);
      }
    } else {
      // Fallback a método legacy si NotificationService no está disponible
      scheduleNotificationsLegacy(subscriptions);
    }
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

// Escuchar eventos de sync para verificar notificaciones (Background Sync)
// Basado en: https://github.com/gokulkrishh/demo-progressive-web-app
self.addEventListener('sync', event => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(
      (async () => {
        if (notificationService) {
          try {
            const count = await notificationService.checkAndSendNotifications();
            console.log(`✅ Verificadas ${count} notificaciones (Background Sync)`);
            // Reprogramar para la próxima verificación
            try {
              await self.registration.sync.register('check-notifications');
            } catch (e) {
              console.log('No se pudo reprogramar Background Sync:', e);
            }
          } catch (err) {
            console.error('Error en Background Sync:', err);
          }
        } else {
          console.log('NotificationService no disponible para Background Sync');
        }
      })()
    );
  }
});

// También escuchar cuando el service worker se activa (cuando el navegador se abre)
self.addEventListener('message', async event => {
  // Si recibimos un mensaje de "wake up", verificar notificaciones
  if (event.data && event.data.type === 'WAKE_UP_CHECK') {
    if (notificationService) {
      try {
        const count = await notificationService.checkAndSendNotifications();
        console.log(`✅ Verificadas ${count} notificaciones (wake up)`);
      } catch (err) {
        console.error('Error en wake up check:', err);
      }
    }
  }
});

// Verificar notificaciones periódicamente (cada minuto cuando el service worker está activo)
let notificationCheckInterval = null;

function startPeriodicNotificationCheck() {
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
  }
  
  // Verificar inmediatamente
  if (notificationService) {
    notificationService.checkAndSendNotifications().catch(err => {
      console.error('Error en verificación periódica:', err);
    });
  }
  
  // Verificar cada minuto
  notificationCheckInterval = setInterval(() => {
    if (notificationService) {
      notificationService.checkAndSendNotifications().catch(err => {
        console.error('Error en verificación periódica:', err);
      });
    }
  }, 60000); // 60 segundos
}

// Iniciar verificación periódica cuando el service worker se activa
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpiar todos los cachés antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Eliminar todos los cachés que no sean el actual
            if (!cacheName.startsWith('subs-app-v') || cacheName !== CACHE_NAME) {
              console.log('Eliminando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control inmediatamente
      self.clients.claim(),
      // Verificar notificaciones pendientes
      (async () => {
        if (notificationService) {
          try {
            await notificationService.checkAndSendNotifications();
            // Registrar Background Sync
            try {
              await self.registration.sync.register('check-notifications');
            } catch (e) {
              console.log('Background Sync no disponible:', e);
            }
            // Iniciar verificación periódica
            startPeriodicNotificationCheck();
          } catch (err) {
            console.error('Error al verificar notificaciones:', err);
          }
        }
      })()
    ])
  );
});


// Función legacy eliminada - ahora usa NotificationService con IndexedDB

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
          
          // Nuevo formato: customdate_YYYY_MM_DD_HH:MM
          if (parts.length >= 5) {
            const year = parseInt(parts[1]);
            const month = parseInt(parts[2]) - 1; // Los meses en JS son 0-indexed
            const day = parseInt(parts[3]);
            const time = parts[4];
            const [hours, minutes] = time.split(':');
            
            notificationDate = new Date(year, month, day, parseInt(hours), parseInt(minutes), 0, 0);
          }
          // Formato legacy: customdate_DD_HH:MM
          else if (parts.length >= 3) {
            const day = parseInt(parts[1]);
            const time = parts[2];
            const [hours, minutes] = time.split(':');
            notificationDate.setDate(parseInt(day));
            notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          }
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
          const notificationOptions = {
            body: `Tu suscripción a ${subscription.name} vence el ${formatDate(subscription.nextPayment)}`,
            icon: subscription.logo || 'icons/icon-192x192.png',
            badge: 'icons/icon-192x192.png',
            image: subscription.logo || undefined,
            vibrate: [100, 50, 100],
            tag: `subscription-${subscription.id}`,
            requireInteraction: false,
            data: {
              subscriptionId: subscription.id,
              subscriptionName: subscription.name,
              nextPayment: subscription.nextPayment,
              dateOfArrival: Date.now()
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
          };
          
          await self.registration.showNotification('Recordatorio de Pago', notificationOptions);
        }
      }
    }
  } catch (error) {
  }
} 