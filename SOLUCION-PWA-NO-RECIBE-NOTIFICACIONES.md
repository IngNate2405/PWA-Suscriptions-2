# 🔴 Problema: PWA Suscrita pero No Recibe Notificaciones de Prueba

## ❌ Síntoma

- ✅ Ambas (web y PWA) aparecen suscritas en OneSignal Dashboard
- ✅ Las notificaciones de prueba llegan en la web (laptop)
- ❌ Las notificaciones de prueba NO llegan en la PWA

## 🔍 Diagnóstico Paso a Paso

### 1. Verificar Service Worker de OneSignal en PWA

**En la PWA (desde la pantalla de inicio):**

1. Si puedes abrir DevTools:
   - Abre DevTools (puede ser difícil en PWA móvil)
   - Ve a **Application** → **Service Workers**
   - **¿Ves `OneSignalSDKWorker.js` activo?**
     - **Sí**: El Service Worker está funcionando
     - **No**: Hay un problema con el Service Worker

2. Si NO puedes abrir DevTools:
   - Ve a la configuración del navegador
   - Busca "Service Workers" o "Aplicaciones instaladas"
   - Verifica que la PWA tenga permisos

### 2. Verificar Permisos de Notificación en PWA

**En Android (Chrome):**
1. Abre la PWA desde la pantalla de inicio
2. Toca el menú (3 puntos) → **Configuración del sitio** (o **Información del sitio**)
3. Verifica que **Notificaciones** esté en **"Permitir"**
4. Si está en **"Bloquear"** o **"Preguntar"**:
   - Cámbialo a **"Permitir"**
   - Recarga la PWA
   - Intenta recibir una notificación de prueba de nuevo

**En iOS (Safari):**
1. Ve a **Configuración** → **Safari** → **Notificaciones**
2. Verifica que tu sitio esté permitido
3. Si no está, agrégalo

**En Windows (Edge/Chrome):**
1. Abre la PWA
2. Haz clic en el ícono de candado junto a la URL
3. Verifica que **Notificaciones** esté en **"Permitir"**

### 3. Verificar que OneSignal Esté Inicializado en PWA

**En la PWA, si puedes abrir la consola:**

Ejecuta esto:
```javascript
// Verificar OneSignal
if (typeof OneSignal !== 'undefined') {
  console.log('✅ OneSignal está disponible');
  
  // Verificar Player ID
  OneSignal.User.PushSubscription.id.then(id => {
    console.log('✅ Player ID:', id);
  }).catch(e => {
    console.error('❌ Error obteniendo Player ID:', e);
  });
  
  // Verificar permisos
  OneSignal.Notifications.permissionNative.then(permission => {
    console.log('📋 Permisos:', permission);
  });
  
  // Verificar suscripción
  OneSignal.User.PushSubscription.optedIn.then(optedIn => {
    console.log('📋 Opted In:', optedIn);
  });
} else {
  console.error('❌ OneSignal no está disponible');
}
```

**Si ves `❌ OneSignal no está disponible`:**
- OneSignal no se está cargando en la PWA
- Puede ser un problema de conexión o bloqueador

### 4. Verificar en OneSignal Dashboard

1. Ve a OneSignal Dashboard → **Audience** → **Subscribers**
2. **¿Ves DOS entradas diferentes?** (una para web, otra para PWA)
   - **Sí**: Ambas están registradas correctamente
   - **No**: Solo una está registrada

3. **¿Tienen Player IDs diferentes?**
   - **Sí**: Es normal, cada contexto tiene su propio Player ID
   - **No**: Puede haber un problema

4. **Al enviar notificación de prueba:**
   - Selecciona **"Send to Specific Users"**
   - Selecciona el Player ID de la PWA (no el de la web)
   - **¿Llega la notificación?**
     - **Sí**: El problema es que estás enviando a todos (incluyendo web)
     - **No**: Hay un problema con la PWA específicamente

### 5. Verificar Configuración del Dispositivo

**En Android:**
1. Ve a **Configuración** → **Aplicaciones** → Tu PWA
2. Verifica que **Notificaciones** esté habilitado
3. Verifica que **No molestar** no esté activo

**En iOS:**
1. Ve a **Configuración** → **Notificaciones**
2. Busca tu PWA
3. Verifica que esté permitida

**En Windows:**
1. Ve a **Configuración** → **Sistema** → **Notificaciones**
2. Verifica que las notificaciones estén habilitadas
3. Busca tu PWA en la lista
4. Verifica que esté permitida

## 🐛 Problemas Comunes y Soluciones

### Problema 1: Service Worker No Está Activo en PWA

**Síntomas:**
- OneSignal no puede recibir notificaciones push
- El Service Worker no aparece en DevTools

**Solución:**
1. Desregistra todos los Service Workers:
   - DevTools → Application → Service Workers → Unregister
2. Cierra completamente la PWA
3. Abre la PWA de nuevo desde la pantalla de inicio
4. Espera 10-15 segundos
5. Verifica que `OneSignalSDKWorker.js` esté activo

### Problema 2: Permisos Bloqueados en PWA

**Síntomas:**
- Las notificaciones no aparecen
- El estado dice "Permisos denegados"

**Solución:**
1. Ve a la configuración del navegador
2. Busca tu sitio/PWA
3. Cambia **Notificaciones** a **"Permitir"**
4. Recarga la PWA
5. Intenta recibir una notificación de prueba

### Problema 3: OneSignal No se Inicializa en PWA

**Síntomas:**
- No ves mensajes de OneSignal en la consola
- El Player ID no se obtiene

**Solución:**
1. Cierra completamente la PWA
2. Abre la PWA de nuevo desde la pantalla de inicio
3. Espera 15-20 segundos (OneSignal tarda más en PWA)
4. Ve a Configuración → Notificaciones
5. Haz clic en "Verificar Estado"
6. Si no funciona, intenta suscribirte de nuevo

### Problema 4: Bloqueador de Anuncios

**Síntomas:**
- OneSignal no se carga
- Errores en la consola relacionados con OneSignal

**Solución:**
1. Desactiva temporalmente el bloqueador de anuncios
2. O agrega `cdn.onesignal.com` a las excepciones
3. Recarga la PWA

## ✅ Verificación Final

**Para verificar que todo funciona:**

1. **PWA abierta desde la pantalla de inicio** (no desde el navegador) ✅
2. **Service Worker de OneSignal activo** ✅
3. **Permisos de notificación permitidos** ✅
4. **OneSignal inicializado** (ver en consola) ✅
5. **Player ID obtenido** (ver en consola) ✅
6. **Aparece en OneSignal Dashboard → Subscribers** ✅
7. **Notificación de prueba enviada al Player ID específico de la PWA** ✅

## 🆘 Si Aún No Funciona

**Comparte:**
1. **¿Qué dispositivo/navegador usas para la PWA?** (Android Chrome, iOS Safari, Windows Edge, etc.)
2. **¿Puedes abrir DevTools en la PWA?** (sí/no)
3. **¿Qué ves en la consola cuando abres la PWA?** (mensajes de OneSignal)
4. **¿El Service Worker de OneSignal está activo?** (sí/no)
5. **¿Los permisos están en "Permitir"?** (sí/no)
6. **¿Tienes un bloqueador de anuncios activo?** (sí/no)

## 💡 Nota Importante

**En iOS:**
- Las notificaciones push web solo funcionan si:
  - La app está agregada a la pantalla de inicio
  - La app se abre desde la pantalla de inicio (no desde Safari)
  - iOS 16.4 o superior

**En Android:**
- Las notificaciones push web funcionan normalmente
- Pero pueden estar bloqueadas por la configuración del dispositivo

