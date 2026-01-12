# 🔍 Verificar Registro de Usuarios en OneSignal

## ❌ Problema: No Aparecen Usuarios en OneSignal Dashboard

Si después de suscribirte no apareces en **Audience → Subscribers**, sigue estos pasos:

## ✅ Verificaciones Esenciales

### 1. Verificar que el Sitio Esté en HTTPS

**OneSignal REQUIERE HTTPS** para funcionar (excepto localhost).

**Verifica:**
- La URL debe empezar con `https://`
- Si estás en desarrollo local, debe ser `http://localhost` o `http://127.0.0.1`

**Si no estás en HTTPS:**
- OneSignal NO funcionará
- Los usuarios NO se registrarán

### 2. Verificar el App ID

**En tu código:**
1. Abre `onesignal-config.js`
2. Verifica que el `appId` sea correcto
3. Debe coincidir con el App ID en OneSignal Dashboard → Settings → Keys & IDs

**En OneSignal Dashboard:**
1. Ve a **Settings** → **Keys & IDs**
2. Copia el **App ID**
3. Compara con el de tu código

### 3. Verificar que OneSignal Esté Inicializado

**Después de cargar la página, en la consola deberías ver:**
```
✅ OneSignal inicializado correctamente
📋 App ID: c9a462f2-6b41-40f2-80c3-d173c255c469
```

**Si NO ves esto:**
- OneSignal no se está inicializando
- Revisa la consola para errores

### 4. Verificar Permisos del Navegador

**Después de hacer clic en "Suscribirse":**
1. El navegador debe pedir permisos
2. Debes hacer clic en **"Permitir"** o **"Allow"**
3. Si haces clic en **"Bloquear"** o **"Block", no funcionará

**Verificar permisos actuales:**
- **Chrome/Edge**: Haz clic en el candado en la barra de direcciones → Notificaciones → Debe estar en "Permitir"
- **Safari**: Configuración → Safari → Notificaciones → Tu sitio debe estar permitido

### 5. Verificar Player ID

**Después de suscribirte, en la consola deberías ver:**
```
✅ Player ID obtenido después de X segundos: ...
✅ Player ID registrado: ...
```

**Si NO ves el Player ID:**
- El usuario no se está registrando en OneSignal
- Puede ser un problema de conexión o configuración

### 6. Verificar Bloqueadores de Anuncios

**Los bloqueadores de anuncios pueden bloquear OneSignal:**
- Desactiva temporalmente el bloqueador
- O agrega tu sitio a la lista de excepciones
- Prueba en modo incógnito

### 7. Verificar Service Worker

**OneSignal necesita un Service Worker para funcionar:**
1. Abre las DevTools (F12)
2. Ve a **Application** → **Service Workers**
3. Deberías ver `OneSignalSDKWorker.js` activo

**Si NO está activo:**
- OneSignal no puede registrar usuarios
- Verifica que el archivo `OneSignalSDKWorker.js` exista en la raíz de tu sitio

## 🔧 Pasos para Diagnosticar

### Paso 1: Abrir Consola del Navegador

1. Abre tu app en Chrome/Edge (en computadora, no PWA)
2. Presiona **F12** (o Cmd+Option+I en Mac)
3. Ve a la pestaña **Console**

### Paso 2: Suscribirse y Observar Logs

1. Ve a **Configuración** → **Notificaciones**
2. Haz clic en **"Suscribirse a Notificaciones Push"**
3. Acepta los permisos
4. **Observa la consola** - deberías ver:

```
🔔 Iniciando proceso de suscripción a OneSignal...
📋 Permiso actual: default
📢 Solicitando permisos de notificación...
📋 Permiso después de solicitar: granted
✅ Permisos concedidos, esperando a que OneSignal registre al usuario...
⏳ Intento 1/10: Esperando Player ID...
✅ Player ID obtenido después de X segundos: ...
✅ Player ID registrado: ...
✅ Suscrito a OneSignal correctamente
```

### Paso 3: Verificar en OneSignal Dashboard

1. Espera 30-60 segundos después de suscribirte
2. Ve a OneSignal Dashboard → **Audience** → **Subscribers**
3. **¿Apareces ahí?**
   - **Sí**: ✅ Funcionó
   - **No**: ❌ Hay un problema

### Paso 4: Verificar con Código Manual

**En la consola, ejecuta:**

```javascript
// Verificar OneSignal
if (typeof OneSignal !== 'undefined') {
  console.log('✅ OneSignal está disponible');
  console.log('SDK Version:', OneSignal.SDK_VERSION);
  
  // Verificar Player ID
  OneSignal.User.PushSubscription.id.then(id => {
    console.log('✅ Player ID:', id);
    console.log('💡 Este ID debería aparecer en OneSignal Dashboard → Audience → Subscribers');
  }).catch(e => {
    console.error('❌ Error obteniendo Player ID:', e);
  });
  
  // Verificar permisos
  OneSignal.Notifications.permissionNative.then(permission => {
    console.log('📋 Permisos:', permission);
  });
} else {
  console.error('❌ OneSignal no está disponible');
}
```

## 🐛 Problemas Comunes

### Problema 1: "OneSignal no está disponible"

**Causa:** El SDK no se cargó correctamente

**Solución:**
1. Verifica que el script esté incluido: `<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"></script>`
2. Verifica la conexión a internet
3. Recarga la página

### Problema 2: "Permisos denegados"

**Causa:** El usuario bloqueó las notificaciones

**Solución:**
1. Ve a la configuración del navegador
2. Permite notificaciones para tu sitio
3. Recarga la página
4. Intenta suscribirte de nuevo

### Problema 3: "No se obtuvo Player ID"

**Causa:** OneSignal no está registrando al usuario

**Posibles causas:**
- El sitio no está en HTTPS
- El App ID es incorrecto
- Hay un bloqueador de anuncios
- El Service Worker no está funcionando
- Problemas de conexión

**Solución:**
1. Verifica que el sitio esté en HTTPS
2. Verifica el App ID
3. Desactiva bloqueadores de anuncios
4. Verifica el Service Worker
5. Prueba en otro navegador

## 📝 Información para Compartir

Si el problema persiste, comparte:

1. **¿Qué mensajes ves en la consola?** (después de suscribirte)
2. **¿Obtienes un Player ID?** (sí/no y el ID si lo tienes)
3. **¿El sitio está en HTTPS?** (sí/no)
4. **¿Qué navegador estás usando?** (Chrome, Safari, etc.)
5. **¿Hay errores en la consola?** (copia los mensajes de error)

## ✅ Verificación Final

Después de seguir todos los pasos:

1. **En la consola**: Debe aparecer el Player ID
2. **En OneSignal Dashboard → Audience → Subscribers**: Debes aparecer ahí
3. **Al crear un mensaje en OneSignal**: Debe mostrar "1" o más en "Estimated recipients"

