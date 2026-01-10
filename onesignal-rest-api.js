// Servicio para enviar notificaciones programadas usando OneSignal REST API
// Esto permite que las notificaciones funcionen cuando la app está cerrada

class OneSignalRESTService {
  constructor() {
    // Obtener estas credenciales desde el dashboard de OneSignal
    // Settings > Keys & IDs > REST API Key
    this.appId = ONESIGNAL_CONFIG?.appId || 'c9a462f2-6b41-40f2-80c3-d173c255c469';
    this.restApiKey = ONESIGNAL_CONFIG?.restApiKey || null; // Debes configurar esto
    this.apiUrl = 'https://onesignal.com/api/v1/notifications';
  }

  // Enviar notificación programada a un usuario específico
  async sendScheduledNotification(notificationData, playerId) {
    if (!this.restApiKey) {
      console.error('❌ REST API Key no configurado. Ve a OneSignal Dashboard > Settings > Keys & IDs');
      return false;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.restApiKey}`
        },
        body: JSON.stringify({
          app_id: this.appId,
          include_player_ids: [playerId], // Enviar a un usuario específico
          headings: { en: notificationData.title || 'Recordatorio de Suscripción' },
          contents: { en: notificationData.body || 'Tu suscripción vence pronto' },
          send_after: notificationData.notificationDate, // Programar para la hora exacta
          data: {
            subscriptionId: notificationData.subscriptionId,
            subscriptionName: notificationData.subscriptionName,
            nextPayment: notificationData.nextPayment
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Notificación programada enviada a OneSignal:', result);
        return true;
      } else {
        console.error('❌ Error al enviar notificación:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
      return false;
    }
  }

  // Enviar notificación a todos los suscriptores (para pruebas)
  async sendToAll(notificationData) {
    if (!this.restApiKey) {
      console.error('❌ REST API Key no configurado');
      return false;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.restApiKey}`
        },
        body: JSON.stringify({
          app_id: this.appId,
          included_segments: ['All'], // Enviar a todos
          headings: { en: notificationData.title || 'Recordatorio de Suscripción' },
          contents: { en: notificationData.body || 'Tu suscripción vence pronto' },
          send_after: notificationData.notificationDate,
          data: {
            subscriptionId: notificationData.subscriptionId,
            subscriptionName: notificationData.subscriptionName
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Notificación programada enviada a todos:', result);
        return true;
      } else {
        console.error('❌ Error al enviar notificación:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
      return false;
    }
  }

  // Programar todas las notificaciones pendientes
  async scheduleAllPendingNotifications() {
    // Leer notificaciones programadas desde localStorage
    const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
    const now = new Date();
    
    // Filtrar notificaciones que deben enviarse ahora o en el futuro
    const toSend = scheduled.filter(notif => {
      const notifDate = new Date(notif.notificationDate);
      return notifDate > now; // Solo las futuras
    });

    if (toSend.length === 0) {
      console.log('ℹ️ No hay notificaciones programadas para enviar');
      return 0;
    }

    // Obtener el Player ID del usuario actual de OneSignal
    let playerId = null;
    try {
      if (typeof OneSignal !== 'undefined' && OneSignal.User) {
        const subscription = await OneSignal.User.PushSubscription.id;
        playerId = subscription;
      }
    } catch (e) {
      console.log('No se pudo obtener Player ID:', e);
    }

    let sentCount = 0;
    
    for (const notif of toSend) {
      if (playerId) {
        // Enviar a usuario específico
        const sent = await this.sendScheduledNotification(notif, playerId);
        if (sent) sentCount++;
      } else {
        // Si no hay Player ID, enviar a todos (para pruebas)
        console.warn('⚠️ No hay Player ID, enviando a todos los suscriptores');
        const sent = await this.sendToAll(notif);
        if (sent) sentCount++;
      }
    }

    return sentCount;
  }
}

// Crear instancia global
const oneSignalRESTService = new OneSignalRESTService();

