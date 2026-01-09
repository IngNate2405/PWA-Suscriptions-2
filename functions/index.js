// Firebase Cloud Functions para enviar Push Notifications
// IMPORTANTE: Necesitas instalar dependencias: npm install web-push

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const webpush = require('web-push');

admin.initializeApp();

// ============================================
// CONFIGURAR TUS VAPID KEYS AQUÍ
// ============================================
// Genera tus VAPID keys con: web-push generate-vapid-keys
// O usa: https://web-push-codelab.glitch.me/
const vapidKeys = {
  publicKey: 'TU_VAPID_PUBLIC_KEY_AQUI',
  privateKey: 'TU_VAPID_PRIVATE_KEY_AQUI'
};

// Configurar VAPID details
webpush.setVapidDetails(
  'mailto:tu-email@ejemplo.com', // Reemplaza con tu email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Guardar VAPID public key en Firestore para que el cliente la pueda leer
async function saveVapidPublicKey() {
  const db = admin.firestore();
  await db.collection('appConfig').doc('pushConfig').set({
    vapidPublicKey: vapidKeys.publicKey,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

// Ejecutar al deploy
saveVapidPublicKey().catch(console.error);

// ============================================
// FUNCIÓN: Enviar notificación push manual
// ============================================
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { subscription, title, body, icon } = data;
  
  if (!subscription) {
    throw new functions.https.HttpsError('invalid-argument', 'Subscription es requerida');
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title: title || 'Recordatorio de Suscripción',
      body: body || 'Tienes un pago pendiente',
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      vibrate: [200, 100, 200],
      tag: 'subscription-reminder',
      requireInteraction: false
    }));
    
    return { success: true, message: 'Notificación enviada' };
  } catch (error) {
    console.error('Error enviando notificación:', error);
    
    // Si la suscripción es inválida, eliminarla de Firestore
    if (error.statusCode === 410 || error.statusCode === 404) {
      const db = admin.firestore();
      await db.collection('userPushSubscriptions')
        .where('userId', '==', context.auth.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
        });
    }
    
    throw new functions.https.HttpsError('internal', 'Error al enviar notificación', error);
  }
});

// ============================================
// FUNCIÓN PROGRAMADA: Verificar y enviar notificaciones
// ============================================
// Esta función se ejecuta cada minuto y verifica si hay notificaciones pendientes
exports.checkAndSendNotifications = functions.pubsub
  .schedule('every 1 minutes')
  .timeZone('America/Guatemala') // Ajusta a tu zona horaria
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    
    console.log(`🔍 Verificando notificaciones pendientes a las ${new Date().toISOString()}`);
    
    try {
      // Obtener todas las notificaciones programadas que ya pasaron y no se han enviado
      const notificationsRef = db.collection('scheduledNotifications');
      const snapshot = await notificationsRef
        .where('notificationDate', '<=', now)
        .where('sent', '==', false)
        .limit(50) // Limitar a 50 por ejecución para evitar timeouts
        .get();
      
      if (snapshot.empty) {
        console.log('✅ No hay notificaciones pendientes');
        return null;
      }

      console.log(`📬 Encontradas ${snapshot.size} notificaciones pendientes`);

      const promises = [];
      
      snapshot.forEach(async (doc) => {
        const notif = doc.data();
        
        try {
          // Obtener suscripción push del usuario
          const userPushSnapshot = await db.collection('userPushSubscriptions')
            .where('userId', '==', notif.userId)
            .limit(1)
            .get();
          
          if (userPushSnapshot.empty) {
            console.log(`⚠️ Usuario ${notif.userId} no tiene suscripción push. Marcando como enviada.`);
            // Marcar como enviada para no intentar de nuevo
            await doc.ref.update({ 
              sent: true, 
              sentAt: admin.firestore.FieldValue.serverTimestamp(),
              error: 'No subscription found'
            });
            return;
          }

          const userPush = userPushSnapshot.docs[0].data();
          const subscription = userPush.subscription;

          // Enviar notificación push
          try {
            await webpush.sendNotification(
              subscription,
              JSON.stringify({
                title: notif.title || 'Recordatorio de Suscripción',
                body: notif.body || 'Tienes un pago pendiente',
                icon: notif.icon || '/icons/icon-192x192.png',
                badge: '/icons/icon-96x96.png',
                vibrate: [200, 100, 200],
                tag: `subscription-${notif.subscriptionId}`,
                data: {
                  subscriptionId: notif.subscriptionId,
                  url: '/index.html'
                }
              })
            );
            
            console.log(`✅ Notificación enviada: ${doc.id}`);
            
            // Marcar como enviada
            await doc.ref.update({ 
              sent: true, 
              sentAt: admin.firestore.FieldValue.serverTimestamp()
            });
          } catch (pushError) {
            console.error(`❌ Error enviando notificación ${doc.id}:`, pushError);
            
            // Si la suscripción es inválida, eliminarla
            if (pushError.statusCode === 410 || pushError.statusCode === 404) {
              await userPushSnapshot.docs[0].ref.delete();
              console.log(`🗑️ Suscripción inválida eliminada para usuario ${notif.userId}`);
            }
            
            // Marcar como enviada con error para no intentar de nuevo
            await doc.ref.update({ 
              sent: true, 
              sentAt: admin.firestore.FieldValue.serverTimestamp(),
              error: pushError.message
            });
          }
        } catch (error) {
          console.error(`❌ Error procesando notificación ${doc.id}:`, error);
          // Marcar como enviada con error
          await doc.ref.update({ 
            sent: true, 
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            error: error.message
          });
        }
      });
      
      await Promise.all(promises);
      console.log(`✅ Procesadas ${snapshot.size} notificaciones`);
      
      return null;
    } catch (error) {
      console.error('❌ Error en checkAndSendNotifications:', error);
      return null;
    }
  });

// ============================================
// FUNCIÓN: Limpiar notificaciones antiguas
// ============================================
// Ejecutar diariamente para limpiar notificaciones enviadas hace más de 7 días
exports.cleanupOldNotifications = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('America/Guatemala')
  .onRun(async (context) => {
    const db = admin.firestore();
    const sevenDaysAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    try {
      const snapshot = await db.collection('scheduledNotifications')
        .where('sent', '==', true)
        .where('sentAt', '<', sevenDaysAgo)
        .limit(500)
        .get();

      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`🗑️ Eliminadas ${snapshot.size} notificaciones antiguas`);
      return null;
    } catch (error) {
      console.error('Error limpiando notificaciones:', error);
      return null;
    }
  });

