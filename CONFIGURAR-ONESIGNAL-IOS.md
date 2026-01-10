# 📱 Configurar OneSignal para iOS Web Push

## ✅ Configuración en el Dashboard de OneSignal

### Paso 1: Verificar Configuración de Web Push

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu App
3. Ve a **Settings** > **Platforms** > **Web Push**
4. Verifica que esté configurado:
   - **Website URL**: `https://suscripciones.natesapps.gt.tc` (tu dominio)
   - **Default Notification Icon**: Debe tener un icono subido
   - **Safari Web Push ID**: Debe estar configurado (se genera automáticamente)

### Paso 2: Obtener Safari Web ID (si no lo tienes)

1. En el dashboard, ve a **Settings** > **Platforms** > **Web Push**
2. Busca la sección **"Safari Web Push ID"**
3. Copia el ID (algo como: `web.onesignal.auto.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. Actualiza `onesignal-config.js` con este ID:

```javascript
const ONESIGNAL_CONFIG = {
  appId: 'c9a462f2-6b41-40f2-80c3-d173c255c469',
  safariWebId: 'web.onesignal.auto.00e855ed-5f66-45b8-ad03-54b1e142944e' // Tu Safari Web ID aquí
};
```

### Paso 3: Verificar que el Manifest esté Accesible

1. Abre en tu navegador: `https://suscripciones.natesapps.gt.tc/manifest.json`
2. Debe mostrar el contenido del manifest sin errores
3. Si hay errores, verifica que el archivo esté en la raíz del proyecto

### Paso 4: Verificar OneSignalSDKWorker.js

1. Abre en tu navegador: `https://suscripciones.natesapps.gt.tc/OneSignalSDKWorker.js`
2. Debe mostrar el contenido del Service Worker sin errores
3. Si hay errores 404, verifica que el archivo esté en la raíz del proyecto

## ⚠️ Importante para iOS

**NO necesitas configurar:**
- ❌ Certificados APNs de Apple
- ❌ Claves de autenticación de Apple
- ❌ Configuración de iOS nativo

**SÍ necesitas:**
- ✅ Safari Web Push ID (ya lo tienes configurado)
- ✅ Manifest.json accesible (ya está configurado)
- ✅ OneSignalSDKWorker.js accesible (ya está creado)
- ✅ HTTPS (ya lo tienes)
- ✅ App agregada a la pantalla de inicio (el usuario debe hacerlo)

## 🧪 Probar en iOS

1. Abre la app en Safari/Chrome/Edge en iOS 16.4+
2. Agrega a la pantalla de inicio
3. Abre desde la pantalla de inicio (no desde el navegador)
4. Ve a Configuración > Notificaciones
5. Haz clic en "Suscribirse a Notificaciones Push"
6. Acepta los permisos

## 📝 Notas

- Las notificaciones web push en iOS funcionan diferente a las apps nativas
- No requieren certificados de Apple
- Solo funcionan cuando la app está agregada a la pantalla de inicio
- Solo funcionan cuando se abre desde la pantalla de inicio (no desde el navegador)

