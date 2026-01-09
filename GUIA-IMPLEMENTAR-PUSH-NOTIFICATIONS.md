# 🚀 Guía: Implementar Notificaciones Push con Firebase Cloud Functions

Esta guía te permitirá recibir notificaciones **incluso cuando el navegador está cerrado**.

---

## 📋 Requisitos Previos

1. ✅ Firebase ya configurado (ya lo tienes)
2. ✅ Node.js instalado en tu computadora
3. ✅ Cuenta de GitHub (para deploy automático)

---

## 🔧 Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Luego inicia sesión:
```bash
firebase login
```

---

## 🔑 Paso 2: Generar VAPID Keys

Las VAPID keys son necesarias para autenticar las notificaciones push.

### Opción A: Usar herramienta online
1. Ve a: https://web-push-codelab.glitch.me/
2. Haz clic en "Generate VAPID Keys"
3. Copia las dos claves (pública y privada)

### Opción B: Usar Node.js
```bash
npm install -g web-push
web-push generate-vapid-keys
```

**Guarda estas claves**, las necesitarás más adelante.

---

## 📁 Paso 3: Configurar Firebase Functions

1. **Inicializar Firebase en tu proyecto:**
```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
firebase init functions
```

2. **Selecciona:**
   - ✅ JavaScript
   - ✅ ESLint (opcional)
   - ✅ Instalar dependencias ahora

3. **Instalar web-push:**
```bash
cd functions
npm install web-push
cd ..
```

---

## 💻 Paso 4: Crear Cloud Function

Crea el archivo `functions/index.js` con este código:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const webpush = require('web-push');

admin.initializeApp();

// Configurar VAPID keys (reemplaza con tus claves)
const vapidKeys = {
  publicKey: 'TU_VAPID_PUBLIC_KEY',
  privateKey: 'TU_VAPID_PRIVATE_KEY'
};

webpush.setVapidDetails(
  'mailto:tu-email@ejemplo.com', // Tu email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Función para enviar notificación push
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  const { subscription, title, body, icon } = data;
  
  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title: title || 'Recordatorio de Suscripción',
      body: body || 'Tienes un pago pendiente',
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      vibrate: [200, 100, 200]
    }));
    
    return { success: true };
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return { success: false, error: error.message };
  }
});

// Función programada para verificar y enviar notificaciones
exports.checkAndSendNotifications = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = new Date();
    
    // Obtener todas las notificaciones programadas
    const notificationsRef = db.collection('scheduledNotifications');
    const snapshot = await notificationsRef
      .where('notificationDate', '<=', now)
      .where('sent', '==', false)
      .get();
    
    const promises = [];
    
    snapshot.forEach(async (doc) => {
      const notif = doc.data();
      
      // Obtener suscripción push del usuario
      const userPushRef = db.collection('userPushSubscriptions')
        .where('userId', '==', notif.userId)
        .limit(1)
        .get();
      
      const userPush = await userPushRef;
      
      if (!userPush.empty) {
        const subscription = userPush.docs[0].data().subscription;
        
        // Enviar notificación
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: notif.title,
              body: notif.body,
              icon: notif.icon || '/icons/icon-192x192.png'
            })
          );
          
          // Marcar como enviada
          await doc.ref.update({ sent: true, sentAt: admin.firestore.FieldValue.serverTimestamp() });
        } catch (error) {
          console.error(`Error enviando notificación ${doc.id}:`, error);
        }
      }
    });
    
    await Promise.all(promises);
    return null;
  });
```

---

## 🔐 Paso 5: Configurar VAPID Keys

1. Edita `functions/index.js`
2. Reemplaza `TU_VAPID_PUBLIC_KEY` y `TU_VAPID_PRIVATE_KEY` con tus claves
3. Reemplaza `tu-email@ejemplo.com` con tu email

---

## 📤 Paso 6: Deploy de Functions

```bash
firebase deploy --only functions
```

---

## 🌐 Paso 7: Actualizar Cliente (PWA)

Ya actualicé el código del cliente para:
1. Suscribirse a Push API
2. Guardar suscripción en Firestore
3. Programar notificaciones en Firestore

---

## ✅ Paso 8: Probar

1. Abre tu PWA
2. Permite notificaciones cuando te lo pida
3. Crea una suscripción con notificación
4. Cierra completamente el navegador
5. Espera a que llegue la notificación

---

## 💰 Costos

- **Firebase Cloud Functions**: Gratis hasta 2 millones de invocaciones/mes
- **Cloud Scheduler**: Gratis hasta 3 jobs
- **Firestore**: Gratis hasta 50K lecturas/día

**Total: GRATIS para uso personal** 🎉

---

## 🐛 Troubleshooting

### Error: "VAPID keys not set"
- Verifica que hayas configurado las VAPID keys en `functions/index.js`

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de que el usuario esté autenticado

### No llegan notificaciones
- Verifica que el service worker esté registrado
- Revisa la consola del navegador
- Verifica los logs de Firebase Functions

---

¿Quieres que implemente esto ahora?

