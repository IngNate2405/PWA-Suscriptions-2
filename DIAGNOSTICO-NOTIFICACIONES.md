# 🔍 Diagnóstico: Notificaciones No Se Envían Cuando la App Está Cerrada

## ✅ Verificaciones Paso a Paso

### 1. Verificar que el REST API Key esté configurado

Abre la consola del navegador (F12) y ejecuta:

```javascript
console.log('REST API Key:', ONESIGNAL_CONFIG?.restApiKey ? '✅ Configurado' : '❌ No configurado');
```

**Si dice "No configurado":**
- Verifica que tengas el secret `ONESIGNAL_REST_API_KEY` en GitHub Secrets
- Verifica que el workflow de deployment lo haya creado en `onesignal-config-local.js`
- Recarga la página después del deployment

### 2. Verificar que estés suscrito a OneSignal

En la consola, ejecuta:

```javascript
if (typeof OneSignal !== 'undefined' && OneSignal.User) {
  OneSignal.User.PushSubscription.id.then(id => {
    console.log('✅ Player ID:', id);
  }).catch(e => {
    console.error('❌ Error obteniendo Player ID:', e);
  });
} else {
  console.error('❌ OneSignal no está inicializado');
}
```

**Si no obtienes un Player ID:**
- Ve a Configuración > Notificaciones
- Haz clic en "Suscribirse a Notificaciones Push"
- Acepta los permisos

### 3. Verificar que las notificaciones se estén guardando

En la consola, ejecuta:

```javascript
const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
console.log('Notificaciones programadas:', scheduled);
console.log('Total:', scheduled.length);
```

**Si está vacío:**
- Edita una suscripción y configura una hora de notificación
- Guarda la suscripción
- Vuelve a ejecutar este comando

### 4. Verificar que se estén enviando a OneSignal

Después de guardar una suscripción con notificaciones, revisa la consola. Deberías ver mensajes como:

```
📬 Iniciando programación de notificaciones con OneSignal REST API...
✅ REST API Key encontrado
📋 Notificaciones en localStorage: X
📤 Notificaciones a enviar: X
✅ Player ID obtenido: ...
📨 Programando notificación para: ...
✅ Notificación programada enviada a OneSignal: ...
```

**Si ves errores:**
- Copia el mensaje de error completo
- Compártelo para diagnosticar

### 5. Verificar en el Dashboard de OneSignal

1. Ve a: https://dashboard.onesignal.com/
2. Selecciona tu app
3. Ve a **Messages** > **History**
4. Busca notificaciones programadas recientes

**Si no aparecen notificaciones:**
- El problema está en el envío a OneSignal
- Revisa los errores en la consola

### 6. Verificar el formato de fecha

En la consola, ejecuta:

```javascript
const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
scheduled.forEach(notif => {
  const date = new Date(notif.notificationDate);
  console.log('Notificación:', notif.subscriptionName);
  console.log('  Fecha original:', notif.notificationDate);
  console.log('  Fecha parseada:', date);
  console.log('  Es válida:', !isNaN(date.getTime()));
  console.log('  Es futura:', date > new Date());
});
```

**Si alguna fecha no es válida o no es futura:**
- El problema está en cómo se calcula la fecha
- Revisa la configuración de la suscripción

## 🐛 Problemas Comunes

### Problema 1: REST API Key no configurado

**Síntomas:**
- Consola muestra: `❌ REST API Key no configurado`
- No se envían notificaciones

**Solución:**
1. Ve a GitHub → Settings → Secrets and variables → Actions
2. Verifica que exista `ONESIGNAL_REST_API_KEY`
3. Si no existe, créalo con tu REST API Key de OneSignal
4. Espera a que el workflow se ejecute automáticamente
5. Recarga la página

### Problema 2: Player ID no se obtiene

**Síntomas:**
- Consola muestra: `⚠️ No se pudo obtener Player ID`
- Las notificaciones se intentan enviar a "todos" en lugar de a ti

**Solución:**
1. Asegúrate de estar suscrito a OneSignal
2. Recarga la página
3. Espera unos segundos antes de guardar la suscripción

### Problema 3: Fechas en el pasado

**Síntomas:**
- Las notificaciones se filtran porque están en el pasado
- Consola muestra: `⏭️ Notificación omitida (fecha inválida o pasada)`

**Solución:**
- Configura una hora de notificación que sea en el futuro
- Verifica que la fecha de `nextPayment` de la suscripción sea correcta

### Problema 4: OneSignal rechaza la notificación

**Síntomas:**
- Consola muestra: `❌ Error al enviar notificación:` con detalles

**Posibles causas:**
- REST API Key incorrecto
- App ID incorrecto
- Formato de fecha incorrecto
- Player ID inválido

**Solución:**
- Revisa los detalles del error en la consola
- Verifica que el REST API Key y App ID sean correctos

## 📝 Información para Compartir

Si el problema persiste, comparte:

1. **Mensajes de la consola** después de guardar una suscripción
2. **Resultado de las verificaciones** de arriba
3. **Screenshot del Dashboard de OneSignal** (Messages > History)
4. **Configuración de la suscripción** (hora de notificación, fecha de próximo pago)

