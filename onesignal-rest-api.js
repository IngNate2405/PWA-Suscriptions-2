// Servicio para enviar notificaciones programadas usando OneSignal REST API
// Esto permite que las notificaciones funcionen cuando la app está cerrada

class OneSignalRESTService {
  constructor() {
    // Obtener estas credenciales desde el dashboard de OneSignal
    // Settings > Keys & IDs > REST API Key
    this.appId = ONESIGNAL_CONFIG?.appId || 'c9a462f2-6b41-40f2-80c3-d173c255c469';
    // El REST API Key se carga desde onesignal-config-local.js (no se sube a GitHub)
    // Si no existe, intentar leer desde ONESIGNAL_CONFIG (para desarrollo)
    this.restApiKey = ONESIGNAL_CONFIG?.restApiKey || null;
    this.apiUrl = 'https://onesignal.com/api/v1/notifications';
    
    // Log para diagnóstico
    if (this.restApiKey) {
      console.log('✅ OneSignal REST API Key cargado:', this.restApiKey.substring(0, 8) + '...');
    } else {
      console.warn('⚠️ OneSignal REST API Key no encontrado. Verifica que esté en GitHub Secrets o onesignal-config-local.js');
    }
  }
  
  // Método para actualizar el REST API Key (por si se carga después)
  updateRestApiKey() {
    const newKey = ONESIGNAL_CONFIG?.restApiKey || null;
    if (newKey && newKey !== this.restApiKey) {
      this.restApiKey = newKey;
      console.log('✅ OneSignal REST API Key actualizado:', this.restApiKey.substring(0, 8) + '...');
    }
    return this.restApiKey;
  }

  // Enviar notificación programada a un usuario específico
  async sendScheduledNotification(notificationData, playerId) {
    if (!this.restApiKey) {
      console.error('❌ REST API Key no configurado. Ve a OneSignal Dashboard > Settings > Keys & IDs');
      return false;
    }

    if (!playerId) {
      console.error('❌ Player ID no proporcionado');
      return false;
    }

    // Asegurar que la fecha esté en formato ISO 8601 correcto
    let sendAfterDate = notificationData.notificationDate;
    if (typeof sendAfterDate === 'string') {
      // Convertir a Date y luego a ISO string para asegurar formato correcto
      const date = new Date(sendAfterDate);
      if (!isNaN(date.getTime())) {
        sendAfterDate = date.toISOString();
      } else {
        console.error('❌ Fecha inválida:', sendAfterDate);
        return false;
      }
    }

    try {
      const payload = {
        app_id: this.appId,
        include_player_ids: [playerId], // Enviar a un usuario específico
        headings: { en: notificationData.title || 'Recordatorio de Suscripción' },
        contents: { en: notificationData.body || 'Tu suscripción vence pronto' },
        send_after: sendAfterDate, // Programar para la hora exacta (formato ISO 8601)
        data: {
          subscriptionId: notificationData.subscriptionId,
          subscriptionName: notificationData.subscriptionName,
          nextPayment: notificationData.nextPayment
        }
      };

      console.log('📤 Enviando a OneSignal:', {
        app_id: this.appId,
        player_id: playerId.substring(0, 8) + '...',
        send_after: sendAfterDate,
        title: payload.headings.en
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.restApiKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Notificación programada enviada a OneSignal:', result);
        return true;
      } else {
        console.error('❌ Error al enviar notificación:', result);
        console.error('📋 Detalles del error:', JSON.stringify(result, null, 2));
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
    console.log('📬 Iniciando programación de notificaciones con OneSignal REST API...');
    
    // Intentar actualizar el REST API Key por si se cargó después del constructor
    this.updateRestApiKey();
    
    // Verificar que el REST API Key esté disponible
    if (!this.restApiKey) {
      console.error('❌ REST API Key no configurado. Verifica que esté en GitHub Secrets o en onesignal-config-local.js');
      console.error('💡 Para verificar:');
      console.error('   1. Ve a GitHub → Settings → Secrets and variables → Actions');
      console.error('   2. Verifica que exista ONESIGNAL_REST_API_KEY');
      console.error('   3. Espera a que el workflow de deployment termine');
      console.error('   4. Recarga la página');
      return 0;
    }
    console.log('✅ REST API Key encontrado:', this.restApiKey.substring(0, 8) + '...');

    // Leer notificaciones programadas desde localStorage
    const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
    console.log(`📋 Notificaciones en localStorage: ${scheduled.length}`);
    
    const now = new Date();
    
    // Filtrar notificaciones que deben enviarse:
    // 1. Que no hayan sido enviadas ya (sent !== true)
    // 2. Que la fecha sea válida
    // 3. Que la fecha esté en el pasado o muy cerca (hasta 1 hora en el futuro para permitir programación)
    const toSend = scheduled.filter(notif => {
      // Omitir si ya fue enviada
      if (notif.sent === true) {
        return false;
      }
      
      if (!notif.notificationDate) {
        console.log(`⏭️ Notificación omitida (sin fecha): ${notif.id || 'sin ID'}`);
        return false;
      }
      
      const notifDate = new Date(notif.notificationDate);
      if (isNaN(notifDate.getTime())) {
        console.log(`⏭️ Notificación omitida (fecha inválida): ${notif.notificationDate}`);
        return false;
      }
      
      // Permitir enviar si la fecha ya pasó o está muy cerca (hasta 1 hora en el futuro)
      const timeDiff = notifDate.getTime() - now.getTime();
      const isValid = timeDiff <= 3600000; // 1 hora en el futuro máximo
      
      if (!isValid) {
        console.log(`⏭️ Notificación omitida (muy lejana): ${notif.notificationDate} (${Math.round(timeDiff / 60000)} minutos)`);
      }
      
      return isValid;
    });

    console.log(`📤 Notificaciones a enviar: ${toSend.length}`);

    if (toSend.length === 0) {
      console.log('ℹ️ No hay notificaciones programadas para enviar');
      return 0;
    }

    // Obtener el Player ID del usuario actual de OneSignal
    let playerId = null;
    try {
      if (typeof OneSignal !== 'undefined') {
        // Intentar diferentes formas de obtener el Player ID según la versión de OneSignal
        if (OneSignal.User && OneSignal.User.PushSubscription) {
          playerId = await OneSignal.User.PushSubscription.id;
        } else if (OneSignal.getUserId) {
          // Método alternativo para versiones anteriores
          playerId = await OneSignal.getUserId();
        } else if (OneSignal.isPushNotificationsEnabled && await OneSignal.isPushNotificationsEnabled()) {
          // Si está habilitado, intentar obtener el ID de otra forma
          const subscription = await OneSignal.getSubscription();
          if (subscription && subscription.id) {
            playerId = subscription.id;
          }
        }
        
        if (playerId) {
          console.log(`✅ Player ID obtenido: ${playerId.substring(0, 8)}...`);
        } else {
          console.warn('⚠️ No se pudo obtener Player ID');
        }
      } else {
        console.warn('⚠️ OneSignal SDK no está disponible');
      }
    } catch (e) {
      console.error('❌ Error al obtener Player ID:', e);
    }

    let sentCount = 0;
    const updatedScheduled = [...scheduled]; // Copia para actualizar
    
    for (const notif of toSend) {
      console.log(`📨 Programando notificación para: ${notif.subscriptionName} - ${notif.notificationDate}`);
      
      let sent = false;
      
      if (playerId) {
        // Enviar a usuario específico
        sent = await this.sendScheduledNotification(notif, playerId);
        if (sent) {
          sentCount++;
          console.log(`✅ Notificación programada exitosamente`);
        } else {
          console.error(`❌ Error al programar notificación para ${notif.subscriptionName}`);
        }
      } else {
        // Si no hay Player ID, enviar a todos (para pruebas)
        console.warn('⚠️ No hay Player ID, enviando a todos los suscriptores');
        sent = await this.sendToAll(notif);
        if (sent) {
          sentCount++;
          console.log(`✅ Notificación programada para todos`);
        }
      }
      
      // Marcar como enviada en la copia
      if (sent) {
        const index = updatedScheduled.findIndex(n => n.id === notif.id);
        if (index !== -1) {
          updatedScheduled[index].sent = true;
          updatedScheduled[index].sentAt = new Date().toISOString();
        }
      }
    }
    
    // Actualizar localStorage con las notificaciones marcadas como enviadas
    // Mantener las enviadas por un tiempo (30 días) para referencia, luego limpiar
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const cleanedScheduled = updatedScheduled.filter(notif => {
      // Mantener si no ha sido enviada
      if (!notif.sent) return true;
      // Mantener si fue enviada hace menos de 30 días
      if (notif.sentAt) {
        const sentDate = new Date(notif.sentAt);
        return sentDate > thirtyDaysAgo;
      }
      return true;
    });
    
    localStorage.setItem('onesignalScheduled', JSON.stringify(cleanedScheduled));
    console.log(`💾 localStorage actualizado: ${cleanedScheduled.length} notificaciones (${cleanedScheduled.filter(n => !n.sent).length} pendientes)`);

    console.log(`✅ Total de notificaciones programadas: ${sentCount}/${toSend.length}`);
    return sentCount;
  }
}

// Crear instancia global
const oneSignalRESTService = new OneSignalRESTService();

