// Servicio de Notificaciones Mejorado
// Basado en: https://github.com/gokulkrishh/demo-progressive-web-app

class NotificationService {
  constructor() {
    this.dbName = 'SubsAppDB';
    this.dbVersion = 1;
    this.db = null;
  }

  // Inicializar IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Crear store para suscripciones
        if (!db.objectStoreNames.contains('subscriptions')) {
          const subscriptionStore = db.createObjectStore('subscriptions', { keyPath: 'id' });
          subscriptionStore.createIndex('nextPayment', 'nextPayment', { unique: false });
          subscriptionStore.createIndex('status', 'status', { unique: false });
        }
        
        // Crear store para notificaciones programadas
        if (!db.objectStoreNames.contains('scheduledNotifications')) {
          const notificationStore = db.createObjectStore('scheduledNotifications', { keyPath: 'id', autoIncrement: true });
          notificationStore.createIndex('subscriptionId', 'subscriptionId', { unique: false });
          notificationStore.createIndex('notificationDate', 'notificationDate', { unique: false });
        }
      };
    });
  }

  // Guardar suscripciones en IndexedDB
  async saveSubscriptions(subscriptions) {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['subscriptions'], 'readwrite');
      const store = transaction.objectStore('subscriptions');
      
      // Limpiar todas las suscripciones
      store.clear();
      
      // Agregar todas las suscripciones
      const promises = subscriptions.map(sub => {
        return new Promise((res, rej) => {
          const request = store.add(sub);
          request.onsuccess = () => res();
          request.onerror = () => rej(request.error);
        });
      });
      
      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }

  // Obtener suscripciones de IndexedDB
  async getSubscriptions() {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['subscriptions'], 'readonly');
      const store = transaction.objectStore('subscriptions');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Programar notificaciones
  async scheduleNotifications(subscriptions) {
    if (!this.db) await this.initDB();
    
    const now = new Date();
    const scheduled = [];
    
    for (const subscription of subscriptions) {
      if (!subscription.notifications || subscription.status === 'paused' || !subscription.nextPayment) {
        continue;
      }
      
      const nextPayment = new Date(subscription.nextPayment);
      
      for (const notification of subscription.notifications) {
        let notificationDate = this.calculateNotificationDate(nextPayment, notification);
        
        if (notificationDate && notificationDate > now) {
          scheduled.push({
            subscriptionId: subscription.id,
            subscriptionName: subscription.name,
            subscriptionLogo: subscription.logo,
            notificationDate: notificationDate.toISOString(),
            notificationType: notification,
            nextPayment: subscription.nextPayment
          });
        }
      }
    }
    
    // Guardar notificaciones programadas
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['scheduledNotifications'], 'readwrite');
      const store = transaction.objectStore('scheduledNotifications');
      
      // Limpiar notificaciones anteriores
      store.clear();
      
      // Agregar nuevas notificaciones
      const promises = scheduled.map(notif => {
        return new Promise((res, rej) => {
          const request = store.add(notif);
          request.onsuccess = () => res();
          request.onerror = () => rej(request.error);
        });
      });
      
      Promise.all(promises)
        .then(() => resolve(scheduled.length))
        .catch(reject);
    });
  }

  // Calcular fecha de notificación
  calculateNotificationDate(nextPayment, notification) {
    const date = new Date(nextPayment);
    
    if (notification.startsWith('customdate_')) {
      const parts = notification.split('_');
      
      // Nuevo formato: customdate_YYYY_MM_DD_HH:MM
      if (parts.length >= 5) {
        const year = parseInt(parts[1]);
        const month = parseInt(parts[2]) - 1; // Los meses en JS son 0-indexed
        const day = parseInt(parts[3]);
        const time = parts[4];
        const [hours, minutes] = time.split(':');
        
        // Crear fecha usando hora local para evitar problemas de zona horaria
        const notificationDate = new Date(year, month, day, parseInt(hours), parseInt(minutes), 0, 0);
        return notificationDate;
      } 
      // Formato legacy: customdate_DD_HH:MM (usar día del mes del próximo pago)
      else if (parts.length >= 3) {
        const day = parseInt(parts[1]);
        const time = parts[2];
        const [hours, minutes] = time.split(':');
        
        // Usar el día especificado del mes del próximo pago
        const nextPaymentDate = new Date(nextPayment);
        const notificationDate = new Date(
          nextPaymentDate.getFullYear(),
          nextPaymentDate.getMonth(),
          day,
          parseInt(hours),
          parseInt(minutes),
          0,
          0
        );
        
        // Si la fecha calculada es después del próximo pago, usar el mes anterior
        if (notificationDate > nextPaymentDate) {
          notificationDate.setMonth(notificationDate.getMonth() - 1);
        }
        
        return notificationDate;
      }
    } else if (notification.startsWith('custom_')) {
      const parts = notification.split('_');
      const days = parseInt(parts[1]);
      date.setDate(date.getDate() - days);
      // Si hay hora incluida
      if (parts.length > 2 && parts[2].includes(':')) {
        const [hours, minutes] = parts[2].split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
    } else if (notification.startsWith('1day')) {
      date.setDate(date.getDate() - 1);
      // Extraer hora si está incluida
      if (notification.includes('_')) {
        const time = notification.split('_').slice(1).join('_');
        if (time.includes(':')) {
          const [hours, minutes] = time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(9, 0, 0, 0); // Default
        }
      } else {
        date.setHours(9, 0, 0, 0); // Default
      }
    } else if (notification.startsWith('2days')) {
      date.setDate(date.getDate() - 2);
      // Extraer hora si está incluida
      if (notification.includes('_')) {
        const time = notification.split('_').slice(1).join('_');
        if (time.includes(':')) {
          const [hours, minutes] = time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(9, 0, 0, 0); // Default
        }
      } else {
        date.setHours(9, 0, 0, 0); // Default
      }
    } else if (notification.startsWith('sameday')) {
      // Mismo día
      // Extraer hora si está incluida
      if (notification.includes('_')) {
        const time = notification.split('_').slice(1).join('_');
        if (time.includes(':')) {
          const [hours, minutes] = time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(9, 0, 0, 0); // Default
        }
      } else {
        date.setHours(9, 0, 0, 0); // Default
      }
    } else {
      return null;
    }
    
    return date;
  }

  // Verificar y enviar notificaciones pendientes
  async checkAndSendNotifications() {
    if (!this.db) await this.initDB();
    
    const now = new Date();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['scheduledNotifications'], 'readwrite');
      const store = transaction.objectStore('scheduledNotifications');
      const index = store.index('notificationDate');
      
      // Obtener notificaciones que deben enviarse (dentro de los próximos 5 minutos)
      const range = IDBKeyRange.upperBound(new Date(now.getTime() + 5 * 60 * 1000).toISOString());
      const request = index.getAll(range);
      
      request.onsuccess = async () => {
        const notifications = request.result || [];
        const toSend = notifications.filter(n => {
          const notifDate = new Date(n.notificationDate);
          return notifDate <= now;
        });
        
        const sent = [];
        for (const notif of toSend) {
          try {
            await this.sendNotification(notif);
            sent.push(notif.id);
          } catch (error) {
            console.error('Error al enviar notificación:', error);
          }
        }
        
        // Eliminar notificaciones enviadas
        for (const id of sent) {
          store.delete(id);
        }
        
        resolve(sent.length);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Enviar notificación
  async sendNotification(notificationData) {
    const registration = await navigator.serviceWorker.ready;
    
    const options = {
      body: `Tu suscripción a ${notificationData.subscriptionName} vence el ${this.formatDate(notificationData.nextPayment)}`,
      icon: notificationData.subscriptionLogo || 'icons/icon-192x192.png',
      badge: 'icons/icon-192x192.png',
      image: notificationData.subscriptionLogo || undefined,
      vibrate: [100, 50, 100],
      tag: `subscription-${notificationData.subscriptionId}`,
      requireInteraction: false,
      data: {
        subscriptionId: notificationData.subscriptionId,
        subscriptionName: notificationData.subscriptionName,
        nextPayment: notificationData.nextPayment,
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
    
    return registration.showNotification('Recordatorio de Pago', options);
  }

  // Formatear fecha
  formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Registrar Background Sync
  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('check-notifications');
        console.log('✅ Background Sync registrado');
        return true;
      } catch (error) {
        console.error('Error al registrar Background Sync:', error);
        return false;
      }
    }
    return false;
  }
}

// Exportar para uso en service worker
if (typeof self !== 'undefined') {
  self.NotificationService = NotificationService;
}

