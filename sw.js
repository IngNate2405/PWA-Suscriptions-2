// Service Worker: Solo para OneSignal y caché
// Las notificaciones cuando la app está cerrada se manejan con OneSignal REST API

// Importar Service Worker de OneSignal (para notificaciones push cuando la app está cerrada)
// CRÍTICO: Esto debe estar ANTES de nuestros event listeners para que OneSignal pueda manejar push
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
  console.log('✅ Service Worker de OneSignal importado correctamente');
} catch (e) {
  console.log('⚠️ No se pudo importar el Service Worker de OneSignal:', e);
  console.log('💡 Las notificaciones push cuando la app está cerrada pueden no funcionar');
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
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png'
];

// Notificaciones locales eliminadas - solo usamos OneSignal REST API para notificaciones externas

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

// OneSignal maneja automáticamente todas las notificaciones push
// No necesitamos un listener de 'push' personalizado

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

// Notificaciones locales eliminadas - solo usamos OneSignal REST API
// Función legacy eliminada (ya no se usa)
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

// Verificación periódica de notificaciones locales eliminada
// Solo usamos OneSignal REST API para notificaciones cuando la app está cerrada

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
      self.clients.claim()
    ])
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', async event => {
  // Notificaciones locales eliminadas - solo usamos OneSignal REST API
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
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

// Background Sync y verificación periódica eliminados
// Solo usamos OneSignal REST API para notificaciones cuando la app está cerrada


// Funciones de notificaciones locales eliminadas
// Solo usamos OneSignal REST API

// Función legacy eliminada (ya no se usa)
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