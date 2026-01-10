// Servicio para manejar Push Notifications con OneSignal
// OneSignal es 100% gratuito hasta 10,000 suscriptores

class OneSignalService {
  constructor() {
    this.initialized = false;
    this.subscribed = false;
    this.safariWebId = null;
  }

  // Esperar a que OneSignal SDK esté cargado usando OneSignalDeferred
  async waitForOneSignal() {
    // Verificar si OneSignalDeferred está disponible (método recomendado por OneSignal)
    if (typeof window !== 'undefined' && window.OneSignalDeferred) {
      return true;
    }

    // Verificar si OneSignal ya está disponible directamente
    if (typeof OneSignal !== 'undefined' && OneSignal.init) {
      return true;
    }

    if (typeof window !== 'undefined' && window.OneSignal) {
      return true;
    }

    // Esperar hasta 15 segundos a que OneSignal se cargue
    const maxWait = 15000; // 15 segundos
    const checkInterval = 200; // Verificar cada 200ms
    let elapsed = 0;

    while (elapsed < maxWait) {
      // Verificar OneSignalDeferred (método recomendado)
      if (typeof window !== 'undefined' && window.OneSignalDeferred) {
        return true;
      }

      // Verificar OneSignal directamente
      if (typeof OneSignal !== 'undefined' && OneSignal.init) {
        return true;
      }
      
      if (typeof window !== 'undefined' && window.OneSignal) {
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }

    console.error('OneSignal SDK no disponible después de esperar. Verificando script...');
    
    // Verificar si el script está en el DOM
    const scripts = document.querySelectorAll('script[src*="onesignal"]');
    if (scripts.length === 0) {
      console.error('❌ No se encontró el script de OneSignal en el DOM. Verifica que esté incluido en el HTML.');
    } else {
      console.log('✅ Script de OneSignal encontrado en el DOM:', scripts[0].src);
      console.log('⚠️ Pero OneSignal aún no está disponible.');
      console.log('💡 Posibles causas:');
      console.log('   1. Bloqueador de anuncios está bloqueando OneSignal');
      console.log('   2. Error de red al cargar el script');
      console.log('   3. El script se está cargando muy lento');
    }

    return false;
  }

  // Inicializar OneSignal
  async initialize(appId) {
    if (this.initialized) {
      return true;
    }

    // Esperar a que OneSignal SDK esté cargado
    const sdkLoaded = await this.waitForOneSignal();
    if (!sdkLoaded) {
      console.error('❌ OneSignal SDK no se cargó después de 10 segundos. Verifica que el script esté incluido correctamente.');
      return false;
    }

    if (typeof OneSignal === 'undefined') {
      console.error('❌ OneSignal SDK no está disponible.');
      return false;
    }

    // Validar App ID
    if (!appId || appId === 'TU_ONESIGNAL_APP_ID' || appId.trim() === '') {
      console.error('❌ App ID de OneSignal no configurado. Configura tu App ID en onesignal-config.js');
      return false;
    }

    try {
      // Verificar si OneSignal ya está inicializado
      if (OneSignal.SDK_VERSION) {
        console.log('OneSignal SDK versión:', OneSignal.SDK_VERSION);
      }

      // Inicializar OneSignal usando el método correcto para v16
      await OneSignal.init({
        appId: appId,
        safari_web_id: ONESIGNAL_CONFIG.safariWebId || appId, // Para Safari
        notifyButton: {
          enable: false, // No mostrar botón automático
        },
        allowLocalhostAsSecureOrigin: true, // Para desarrollo local
      });

      // Esperar un momento para asegurar que la inicialización se complete
      await new Promise(resolve => setTimeout(resolve, 500));

      this.initialized = true;
      console.log('✅ OneSignal inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar OneSignal:', error);
      console.error('Detalles del error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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

    const OneSignalInstance = window.OneSignal || OneSignal;
    
    if (!OneSignalInstance) {
      return false;
    }

    try {
      // Verificar permisos
      const permission = await OneSignalInstance.Notifications.permissionNative;
      if (permission !== 'granted') {
        return false;
      }
      
      // Verificar si hay un player ID (indica que está suscrito)
      const userId = await OneSignalInstance.User.PushSubscription.id;
      return userId !== null && userId !== undefined;
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      // Si falla, verificar al menos los permisos
      try {
        const permission = await OneSignalInstance.Notifications.permissionNative;
        return permission === 'granted';
      } catch (e) {
        return false;
      }
    }
  }
  
  // Obtener información del usuario
  async getUserInfo() {
    if (!this.initialized) {
      return null;
    }

    const OneSignalInstance = window.OneSignal || OneSignal;
    
    if (!OneSignalInstance) {
      return null;
    }

    try {
      const userId = await OneSignalInstance.User.PushSubscription.id;
      const permission = await OneSignalInstance.Notifications.permissionNative;
      return {
        userId: userId,
        permission: permission,
        subscribed: permission === 'granted' && userId !== null
      };
    } catch (error) {
      console.error('Error obteniendo info del usuario:', error);
      return null;
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

