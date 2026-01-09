// Servicio para manejar Push Notifications con Firebase
// Este servicio maneja la suscripción a Push API y guarda la suscripción en Firestore

class PushNotificationService {
  constructor() {
    this.vapidPublicKey = null; // Se configurará desde Firebase Functions
    this.subscription = null;
  }

  // Convertir VAPID key de base64 a Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Obtener VAPID public key desde Firebase Functions
  async getVapidPublicKey() {
    if (this.vapidPublicKey) {
      return this.vapidPublicKey;
    }

    try {
      // Intentar obtener desde Firestore (se guardará cuando se configure)
      if (isFirebaseAvailable() && db) {
        const configDoc = await db.collection('appConfig').doc('pushConfig').get();
        if (configDoc.exists) {
          this.vapidPublicKey = configDoc.data().vapidPublicKey;
          return this.vapidPublicKey;
        }
      }

      // Si no está en Firestore, intentar desde una variable global o función
      // Esto se configurará cuando se implemente Firebase Functions
      console.warn('VAPID public key no configurada. Usando notificaciones locales.');
      return null;
    } catch (error) {
      console.error('Error al obtener VAPID key:', error);
      return null;
    }
  }

  // Suscribirse a Push API
  async subscribeToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push API no está disponible en este navegador');
      return null;
    }

    try {
      // Solicitar permisos de notificación
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Permisos de notificación denegados');
        return null;
      }

      // Obtener registro del service worker
      const registration = await navigator.serviceWorker.ready;

      // Obtener VAPID public key
      const vapidPublicKey = await this.getVapidPublicKey();
      if (!vapidPublicKey) {
        console.warn('VAPID key no disponible. Usando notificaciones locales.');
        return null;
      }

      // Verificar si ya existe una suscripción
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Crear nueva suscripción
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      this.subscription = subscription;

      // Guardar suscripción en Firestore
      await this.saveSubscriptionToFirestore(subscription);

      console.log('✅ Suscrito a Push Notifications');
      return subscription;
    } catch (error) {
      console.error('Error al suscribirse a Push API:', error);
      return null;
    }
  }

  // Guardar suscripción en Firestore
  async saveSubscriptionToFirestore(subscription) {
    if (!isFirebaseAvailable() || !auth || !db) {
      console.warn('Firebase no disponible para guardar suscripción');
      return false;
    }

    const user = auth.currentUser;
    if (!user) {
      console.warn('Usuario no autenticado');
      return false;
    }

    try {
      const subscriptionData = {
        userId: user.uid,
        subscription: subscription.toJSON(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Guardar o actualizar suscripción
      await db.collection('userPushSubscriptions')
        .doc(user.uid)
        .set(subscriptionData, { merge: true });

      console.log('✅ Suscripción guardada en Firestore');
      return true;
    } catch (error) {
      console.error('Error al guardar suscripción en Firestore:', error);
      return false;
    }
  }

  // Programar notificación en Firestore (para que Firebase Functions la envíe)
  async scheduleNotificationInFirestore(notificationData) {
    if (!isFirebaseAvailable() || !auth || !db) {
      console.warn('Firebase no disponible para programar notificación');
      return false;
    }

    const user = auth.currentUser;
    if (!user) {
      console.warn('Usuario no autenticado');
      return false;
    }

    try {
      const notificationDoc = {
        userId: user.uid,
        subscriptionId: notificationData.subscriptionId,
        title: notificationData.title,
        body: notificationData.body,
        icon: notificationData.icon || '/icons/icon-192x192.png',
        notificationDate: firebase.firestore.Timestamp.fromDate(notificationData.notificationDate),
        sent: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('scheduledNotifications').add(notificationDoc);
      console.log('✅ Notificación programada en Firestore');
      return true;
    } catch (error) {
      console.error('Error al programar notificación en Firestore:', error);
      return false;
    }
  }

  // Programar todas las notificaciones de una suscripción
  async scheduleSubscriptionNotifications(subscription) {
    if (!subscription.notifications || subscription.notifications.length === 0) {
      return 0;
    }

    const nextPayment = new Date(subscription.nextPayment);
    let scheduledCount = 0;

    for (const notification of subscription.notifications) {
      const notificationDate = this.calculateNotificationDate(nextPayment, notification);
      
      if (notificationDate && notificationDate > new Date()) {
        const notificationData = {
          subscriptionId: subscription.id,
          title: `Recordatorio: ${subscription.name}`,
          body: `Tu suscripción "${subscription.name}" vence pronto`,
          icon: subscription.icon || '/icons/icon-192x192.png',
          notificationDate: notificationDate
        };

        const success = await this.scheduleNotificationInFirestore(notificationData);
        if (success) {
          scheduledCount++;
        }
      }
    }

    return scheduledCount;
  }

  // Calcular fecha de notificación (mismo método que notification-service.js)
  calculateNotificationDate(nextPayment, notification) {
    const date = new Date(nextPayment);

    if (notification.startsWith('customdate_')) {
      const parts = notification.split('_');
      if (parts.length >= 5) {
        const year = parseInt(parts[1]);
        const month = parseInt(parts[2]) - 1;
        const day = parseInt(parts[3]);
        const time = parts[4];
        const [hours, minutes] = time.split(':');
        return new Date(year, month, day, parseInt(hours), parseInt(minutes), 0, 0);
      }
    } else if (notification.startsWith('custom_')) {
      const parts = notification.split('_');
      const days = parseInt(parts[1]);
      date.setDate(date.getDate() - days);
      if (parts.length > 2 && parts[2].includes(':')) {
        const [hours, minutes] = parts[2].split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        date.setHours(9, 0, 0, 0);
      }
    } else if (notification.startsWith('1day')) {
      date.setDate(date.getDate() - 1);
      if (notification.includes('_')) {
        const time = notification.split('_').slice(1).join('_');
        if (time.includes(':')) {
          const [hours, minutes] = time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(9, 0, 0, 0);
        }
      } else {
        date.setHours(9, 0, 0, 0);
      }
    } else if (notification.startsWith('2days')) {
      date.setDate(date.getDate() - 2);
      if (notification.includes('_')) {
        const time = notification.split('_').slice(1).join('_');
        if (time.includes(':')) {
          const [hours, minutes] = time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(9, 0, 0, 0);
        }
      } else {
        date.setHours(9, 0, 0, 0);
      }
    } else if (notification.startsWith('sameday')) {
      if (notification.includes('_')) {
        const time = notification.split('_').slice(1).join('_');
        if (time.includes(':')) {
          const [hours, minutes] = time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(9, 0, 0, 0);
        }
      } else {
        date.setHours(9, 0, 0, 0);
      }
    } else {
      return null;
    }

    return date;
  }

  // Verificar si ya está suscrito
  async isSubscribed() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Error al verificar suscripción:', error);
      return false;
    }
  }
}

// Crear instancia global
let pushNotificationService = null;
if (typeof PushNotificationService !== 'undefined') {
  pushNotificationService = new PushNotificationService();
}

