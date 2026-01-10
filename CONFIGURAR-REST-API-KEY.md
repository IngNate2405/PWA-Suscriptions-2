# 🔑 Configurar REST API Key de OneSignal

## 📍 Dónde encontrar tu REST API Key

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu App (Nate's Apps)
3. Ve a **Settings** (Configuración) en el menú lateral
4. Haz clic en **Keys & IDs**
5. Busca **REST API Key**
6. Copia el valor (algo como: `YjA2NzYxYzAtY2E4Ny00Yz...`)

## ⚙️ Configurar en tu App

1. Abre el archivo `onesignal-config.js`
2. Agrega tu REST API Key:

```javascript
const ONESIGNAL_CONFIG = {
  appId: 'c9a462f2-6b41-40f2-80c3-d173c255c469',
  safariWebId: 'web.onesignal.auto.00e855ed-5f66-45b8-ad03-54b1e142944e',
  restApiKey: 'TU_REST_API_KEY_AQUI' // ← Pega tu REST API Key aquí
};
```

## ⚠️ Importante

- **NO compartas tu REST API Key públicamente**
- **NO lo subas a GitHub** si tu repositorio es público
- Si tu repositorio es público, usa variables de entorno o un archivo `.gitignore`

## ✅ Cómo Funciona

Una vez configurado:

1. **Cuando guardas una suscripción:**
   - Se programan notificaciones locales (funcionan cuando app está abierta)
   - Se programan notificaciones en OneSignal (funcionan cuando app está cerrada)

2. **Cuando la app está abierta:**
   - Las notificaciones locales se envían automáticamente

3. **Cuando la app está cerrada:**
   - OneSignal envía las notificaciones push automáticamente a la hora programada

## 🧪 Probar

1. Configura tu REST API Key
2. Crea/edita una suscripción con notificaciones
3. Cierra la app completamente
4. Espera a la hora programada
5. Deberías recibir la notificación aunque la app esté cerrada

