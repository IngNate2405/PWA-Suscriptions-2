// Servicio para manejar Push Notifications con OneSignal
// OneSignal es 100% gratuito hasta 10,000 suscriptores

class OneSignalService {
  constructor() {
    this.initialized = false;
    this.subscribed = false;
  }

  // Inicializar OneSignal
  async initialize(appId) {
    if (this.initialized) {
      return true;
    }

    if (typeof OneSignal === 'undefined') {
      console.error('❌ OneSignal SDK no está cargado. Asegúrate de incluir el script de OneSignal.');
      return false;
    }

    try {
      await OneSignal.init({
        appId: appId,
        safari_web_id: appId, // Para Safari
        notifyButton: {
          enable: false, // No mostrar botón automático
        },
        allowLocalhostAsSecureOrigin: true, // Para desarrollo local
      });

      this.initialized = true;
      console.log('✅ OneSignal inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar OneSignal:', error);
      return false;
    }
  }

  // Suscribirse a notificaciones push
  async subscribe() {
    if (!this.initialized) {
      console.error('❌ OneSignal no está inicializado');
      return false;
    }

    try {
      // Verificar permisos actuales
      let permission = await OneSignal.Notifications.permissionNative;
      
      // Si no están concedidos, solicitarlos
      if (permission !== 'granted') {
        permission = await OneSignal.Notifications.requestPermission();
      }
      
      if (permission === 'granted') {
        this.subscribed = true;
        console.log('✅ Suscrito a OneSignal correctamente');
        return true;
      } else {
        console.warn('⚠️ Permisos de notificación denegados');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al suscribirse a OneSignal:', error);
      return false;
    }
  }

  // Verificar si está suscrito
  async isSubscribed() {
    if (!this.initialized) {
      return false;
    }

    try {
      const permission = await OneSignal.Notifications.permissionNative;
      return permission === 'granted';
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      return false;
    }
  }

  // Enviar notificación programada (usando OneSignal REST API)
  async scheduleNotification(notificationData) {
    // Las notificaciones programadas se envían desde el servidor
    // usando la API REST de OneSignal
    // Esto se hará desde un backend simple o usando su API
    
    console.log('📬 Notificación programada para OneSignal:', notificationData);
    
    // Guardar en localStorage para que un script backend pueda enviarla
    // O usar la API REST de OneSignal directamente desde el cliente
    // (aunque no es recomendado por seguridad, funciona para uso personal)
    
    return true;
  }

  // Programar notificaciones de una suscripción
  async scheduleSubscriptionNotifications(subscription) {
    if (!subscription.notifications || subscription.notifications.length === 0) {
      return 0;
    }

    if (!subscription.nextPayment) {
      return 0;
    }

    const nextPayment = new Date(subscription.nextPayment);
    let scheduledCount = 0;
    const now = new Date();

    for (const notification of subscription.notifications) {
      const notificationDate = this.calculateNotificationDate(nextPayment, notification);
      
      if (notificationDate && notificationDate > now) {
        const notificationData = {
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          title: `Recordatorio: ${subscription.name}`,
          body: `Tu suscripción "${subscription.name}" vence pronto`,
          icon: subscription.icon || '/icons/icon-192x192.png',
          notificationDate: notificationDate.toISOString(),
          userId: isFirebaseAvailable() && auth && auth.currentUser ? auth.currentUser.uid : null
        };

        // Guardar en localStorage para procesar después
        const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
        scheduled.push(notificationData);
        localStorage.setItem('onesignalScheduled', JSON.stringify(scheduled));
        
        scheduledCount++;
      }
    }

    return scheduledCount;
  }

  // Calcular fecha de notificación (mismo método que notification-service.js)
  calculateNotificationDate(nextPayment, notification) {
    const date = new Date(nextPayment);
    
    if (notification.startsWith('1day_')) {
      const time = notification.split('_')[1] || '09:00';
      const [hours, minutes] = time.split(':');
      date.setDate(date.getDate() - 1);
      date.setHours(parseInt(hours) || 9, parseInt(minutes) || 0, 0, 0);
    } else if (notification.startsWith('3days_')) {
      const time = notification.split('_')[1] || '09:00';
      const [hours, minutes] = time.split(':');
      date.setDate(date.getDate() - 3);
      date.setHours(parseInt(hours) || 9, parseInt(minutes) || 0, 0, 0);
    } else if (notification.startsWith('7days_')) {
      const time = notification.split('_')[1] || '09:00';
      const [hours, minutes] = time.split(':');
      date.setDate(date.getDate() - 7);
      date.setHours(parseInt(hours) || 9, parseInt(minutes) || 0, 0, 0);
    } else if (notification.startsWith('custom_')) {
      const parts = notification.split('_');
      const days = parseInt(parts[1]);
      const time = parts[2] || '09:00';
      const [hours, minutes] = time.split(':');
      date.setDate(date.getDate() - days);
      date.setHours(parseInt(hours) || 9, parseInt(minutes) || 0, 0, 0);
    } else if (notification.startsWith('customdate_')) {
      const parts = notification.split('_');
      if (parts.length === 5) {
        const year = parseInt(parts[1]);
        const month = parseInt(parts[2]) - 1;
        const day = parseInt(parts[3]);
        const time = parts[4];
        const [hours, minutes] = time.split(':');
        return new Date(year, month, day, parseInt(hours) || 9, parseInt(minutes) || 0, 0, 0);
      }
    } else {
      return null;
    }

    return date;
  }
}

// Crear instancia global
let oneSignalService = null;
if (typeof OneSignalService !== 'undefined') {
  oneSignalService = new OneSignalService();
}

