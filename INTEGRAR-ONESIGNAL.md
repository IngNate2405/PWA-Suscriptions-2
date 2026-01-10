# 🚀 Integrar OneSignal - Guía Paso a Paso

## ✅ Pasos para Configurar OneSignal

### Paso 1: Crear cuenta en OneSignal

1. Ve a https://onesignal.com/
2. Haz clic en "Sign Up Free"
3. Crea tu cuenta (no requiere tarjeta de crédito)

### Paso 2: Crear una nueva App

1. Una vez dentro del dashboard, haz clic en "New App/Website"
2. Elige "Web Push"
3. Completa:
   - **Name**: App Suscripciones (o el nombre que prefieras)
   - **Website URL**: Tu URL (ej: https://suscripciones-nate.gt.tc)
   - **Default Notification Icon**: Sube tu icono (icons/icon-192x192.png)

### Paso 3: Obtener App ID

1. Después de crear la app, verás tu **App ID**
2. Copia el App ID (algo como: `12345678-1234-1234-1234-123456789012`)

### Paso 4: Configurar en tu App

1. Abre el archivo `onesignal-config.js`
2. Reemplaza `'TU_ONESIGNAL_APP_ID'` con tu App ID real:

```javascript
const ONESIGNAL_CONFIG = {
  appId: '12345678-1234-1234-1234-123456789012', // Tu App ID aquí
  safariWebId: null
};
```

### Paso 5: Configurar Service Worker (Opcional)

OneSignal puede usar su propio service worker o integrarse con el tuyo. Por ahora, OneSignal usará su service worker automáticamente.

### Paso 6: Probar

1. Recarga tu app
2. Ve a Configuración > Notificaciones
3. Haz clic en "Suscribirse a Notificaciones Push"
4. Acepta los permisos
5. Deberías ver "✅ Suscrito a OneSignal"

### Paso 7: Enviar Notificación de Prueba

1. Ve al dashboard de OneSignal
2. Haz clic en "New Push"
3. Escribe un mensaje de prueba
4. Haz clic en "Send to All Subscribed Users"
5. Deberías recibir la notificación

---

## 📝 Programar Notificaciones Automáticas

Las notificaciones programadas se guardan en `localStorage` con la clave `onesignalScheduled`.

Para enviarlas automáticamente, puedes:

1. **Usar el dashboard de OneSignal** (manual)
2. **Crear un script backend simple** que lea `localStorage` y use la API REST de OneSignal
3. **Usar GitHub Actions** (gratis) para ejecutar un script periódicamente

---

## 🔧 API REST de OneSignal (Para Notificaciones Programadas)

Si quieres enviar notificaciones programadas automáticamente, necesitas:

1. **REST API Key** (desde OneSignal Dashboard > Settings > Keys & IDs)
2. Un script que lea las notificaciones programadas y las envíe

Ejemplo de cómo enviar una notificación:

```javascript
fetch('https://onesignal.com/api/v1/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic TU_REST_API_KEY'
  },
  body: JSON.stringify({
    app_id: 'TU_APP_ID',
    included_segments: ['All'],
    headings: { en: 'Recordatorio' },
    contents: { en: 'Tu suscripción vence pronto' },
    send_after: '2024-01-15 09:00:00 GMT-0600'
  })
});
```

---

## ✅ Ventajas de OneSignal

- ✅ 100% Gratis hasta 10,000 suscriptores
- ✅ No requiere plan de pago
- ✅ Funciona con app cerrada
- ✅ Dashboard completo
- ✅ Fácil de integrar
- ✅ Documentación excelente

---

## 🆘 Problemas Comunes

### "OneSignal no está disponible"
- Verifica que el script de OneSignal se cargue antes que `onesignal-service.js`
- Revisa la consola del navegador para errores

### "OneSignal App ID no configurado"
- Asegúrate de haber reemplazado `'TU_ONESIGNAL_APP_ID'` en `onesignal-config.js`

### "No se puede suscribir"
- Verifica que tu sitio esté en HTTPS (requerido para push notifications)
- Asegúrate de haber aceptado los permisos de notificación

---

## 📚 Recursos

- Documentación: https://documentation.onesignal.com/
- Dashboard: https://dashboard.onesignal.com/
- API REST: https://documentation.onesignal.com/reference

