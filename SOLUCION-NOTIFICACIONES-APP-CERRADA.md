# 🔔 Solución: Notificaciones cuando la App está Cerrada

## ⚠️ Problema Actual

Las notificaciones locales programadas solo funcionan cuando:
- ✅ La app está abierta
- ✅ El Service Worker está activo

**NO funcionan cuando:**
- ❌ La app está completamente cerrada
- ❌ El navegador está cerrado

## ✅ Solución: Usar OneSignal API REST

Para que las notificaciones funcionen cuando la app está cerrada, necesitas usar la **API REST de OneSignal** para enviar notificaciones programadas desde un servidor.

### Opción 1: GitHub Actions (Gratis)

1. **Crear un script que lea las notificaciones programadas y las envíe vía OneSignal API**

2. **Configurar GitHub Actions para ejecutar el script cada hora**

3. **El script:**
   - Lee `onesignalScheduled` del localStorage (o de una base de datos)
   - Verifica cuáles notificaciones deben enviarse
   - Usa la API REST de OneSignal para enviarlas

### Opción 2: Backend Simple (Gratis)

Usar servicios gratuitos como:
- **Vercel Serverless Functions** (gratis)
- **Netlify Functions** (gratis)
- **Cloudflare Workers** (gratis)

### Opción 3: Usar el Dashboard de OneSignal (Manual)

1. Ve al dashboard de OneSignal
2. Crea notificaciones programadas manualmente
3. Envíalas a todos los suscriptores

## 📝 Implementación Recomendada

### Paso 1: Obtener REST API Key de OneSignal

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu App
3. Ve a **Settings** > **Keys & IDs**
4. Copia tu **REST API Key**

### Paso 2: Crear Script para Enviar Notificaciones

El script debe:
1. Leer las notificaciones programadas (desde localStorage o base de datos)
2. Verificar cuáles deben enviarse ahora
3. Enviarlas usando la API REST de OneSignal

### Ejemplo de Código (Node.js)

```javascript
const fetch = require('node-fetch');

const ONESIGNAL_APP_ID = 'c9a462f2-6b41-40f2-80c3-d173c255c469';
const ONESIGNAL_REST_API_KEY = 'TU_REST_API_KEY';

async function sendScheduledNotifications() {
  // Leer notificaciones programadas (desde base de datos o archivo)
  const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
  const now = new Date();
  
  const toSend = scheduled.filter(notif => {
    const notifDate = new Date(notif.notificationDate);
    return notifDate <= now && notifDate > new Date(now.getTime() - 60000); // Último minuto
  });
  
  for (const notif of toSend) {
    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          included_segments: ['All'], // O usar player_ids específicos
          headings: { en: notif.title },
          contents: { en: notif.body },
          send_after: notif.notificationDate // Programar para la hora exacta
        })
      });
      
      const result = await response.json();
      console.log('Notificación enviada:', result);
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }
}

sendScheduledNotifications();
```

## 🔄 Flujo Actual (Mejorado)

1. **Cuando guardas una suscripción:**
   - Se programan notificaciones locales (funcionan cuando app está abierta)
   - Se guardan en `localStorage` como `onesignalScheduled` (para backend)

2. **Cuando la app está abierta:**
   - El Service Worker verifica cada 30 segundos
   - Envía notificaciones locales si es la hora

3. **Cuando la app está cerrada:**
   - Un backend (GitHub Actions, Vercel, etc.) lee `onesignalScheduled`
   - Envía notificaciones vía OneSignal API REST
   - Las notificaciones llegan aunque la app esté cerrada

## ⚡ Solución Temporal

Por ahora, las notificaciones funcionan cuando la app está abierta. Para que funcionen cuando está cerrada, necesitas implementar el backend que use la API REST de OneSignal.

¿Quieres que te ayude a crear el script y configurar GitHub Actions?

