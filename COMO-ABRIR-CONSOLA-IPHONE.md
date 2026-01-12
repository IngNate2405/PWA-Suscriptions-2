# 📱 Cómo Abrir la Consola en Safari del iPhone

## 🎯 Método: Usar Safari en Mac (Recomendado)

Para abrir la consola de desarrollo en Safari del iPhone, necesitas usar **Safari en una Mac** y conectar tu iPhone.

### Paso 1: Habilitar el Menú de Desarrollo en Safari (Mac)

1. Abre **Safari** en tu Mac
2. Ve a **Safari** → **Preferencias** (o **Configuración** en macOS Ventura+)
3. Ve a la pestaña **"Avanzado"** (o **"Avanzadas"**)
4. Marca la casilla **"Mostrar el menú de desarrollo en la barra de menú"**
5. Cierra las preferencias

### Paso 2: Conectar tu iPhone a la Mac

1. Conecta tu iPhone a tu Mac con un cable USB
2. En tu iPhone, aparecerá un mensaje: **"¿Confiar en este equipo?"**
3. Toca **"Confiar"**
4. Ingresa tu código de acceso del iPhone si se solicita

### Paso 3: Habilitar Inspección Web en el iPhone

1. En tu iPhone, ve a **Configuración** → **Safari**
2. Desplázate hacia abajo hasta **"Avanzado"**
3. Activa **"Inspección Web"** (Web Inspector)

### Paso 4: Abrir la Consola

1. En tu Mac, abre **Safari**
2. En la barra de menú, verás **"Desarrollar"** (Development)
3. Haz clic en **"Desarrollar"**
4. Verás tu iPhone en la lista
5. Selecciona tu iPhone → **Tu PWA** (o la pestaña que quieras inspeccionar)
6. Se abrirá una ventana de Web Inspector con la consola

### Paso 5: Usar la Consola

En la ventana de Web Inspector:
- Ve a la pestaña **"Consola"** (Console)
- Aquí puedes ver los mensajes de `console.log()`
- Puedes ejecutar código JavaScript
- Puedes ver errores y advertencias

## 🔍 Alternativa: Usar Safari en Windows (Safari Technology Preview)

Si no tienes Mac, puedes usar **Safari Technology Preview** en Windows (si está disponible), pero el método más confiable es usar un Mac.

## 📱 Alternativa: Usar Chrome Remote Debugging (Android)

Si estás usando Android en lugar de iPhone:

1. Conecta tu Android a tu computadora con USB
2. En tu Android, activa **"Opciones de desarrollador"** → **"Depuración USB"**
3. En Chrome en tu computadora, ve a `chrome://inspect`
4. Verás tu dispositivo y podrás inspeccionar

## 💡 Comandos Útiles en la Consola

Una vez que tengas la consola abierta, puedes ejecutar:

```javascript
// Verificar OneSignal
if (typeof OneSignal !== 'undefined') {
  console.log('✅ OneSignal está disponible');
  
  // Verificar Player ID
  OneSignal.User.PushSubscription.id.then(id => {
    console.log('✅ Player ID:', id);
  }).catch(e => {
    console.error('❌ Error:', e);
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

## 🐛 Si No Puedes Conectar

**Problema:** No aparece el iPhone en el menú "Desarrollar"

**Soluciones:**
1. Asegúrate de que el cable USB funcione (prueba con otro cable)
2. Asegúrate de que "Inspección Web" esté activada en el iPhone
3. Desconecta y vuelve a conectar el iPhone
4. Reinicia Safari en la Mac
5. Reinicia el iPhone

**Problema:** "Inspección Web" no aparece en Configuración → Safari → Avanzado

**Solución:**
- Asegúrate de que el iPhone esté conectado a la Mac
- A veces solo aparece cuando está conectado

## 📝 Nota Importante

- **Solo funciona con Safari**: Chrome y otros navegadores no tienen esta funcionalidad para iPhone
- **Necesitas un Mac**: No puedes hacer esto desde Windows (a menos que uses Safari Technology Preview)
- **Cable USB requerido**: No funciona por Wi-Fi para la primera conexión

## 🆘 Si No Tienes Mac

Si no tienes acceso a una Mac, puedes:

1. **Usar la consola del navegador en la computadora** para probar la versión web
2. **Agregar más `console.log()` en el código** y verificar los mensajes en la versión web
3. **Usar herramientas de depuración remotas** si tienes acceso a un servidor de desarrollo

## ✅ Verificación Rápida

Una vez que tengas la consola abierta:

1. **Recarga la PWA en el iPhone**
2. **Observa los mensajes en la consola**
3. **Busca mensajes de OneSignal:**
   - `✅ OneSignal inicializado`
   - `✅ Player ID obtenido`
   - `✅ Suscrito a OneSignal`
4. **Ejecuta los comandos de verificación de arriba**

