# 🔒 Configurar REST API Key de Forma Segura

## ⚠️ IMPORTANTE: Seguridad

**NUNCA subas tu REST API Key a GitHub o repositorios públicos.** OneSignal puede eliminar tu key si la detecta en un repositorio público.

## ✅ Solución: Archivo Local

He configurado el proyecto para que uses un archivo local que NO se sube a GitHub.

### Paso 1: Crear el archivo local

1. Copia el archivo `onesignal-config-local.js.example`
2. Renómbralo a `onesignal-config-local.js` (sin el `.example`)
3. Abre `onesignal-config-local.js`
4. Pega tu REST API Key:

```javascript
ONESIGNAL_CONFIG.restApiKey = 'TU_REST_API_KEY_AQUI';
```

### Paso 2: Verificar que está en .gitignore

El archivo `onesignal-config-local.js` ya está en `.gitignore`, por lo que NO se subirá a GitHub.

### Paso 3: Obtener una nueva REST API Key

Como OneSignal eliminó tu key anterior:

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu App
3. Ve a **Settings** > **Keys & IDs**
4. Si no hay REST API Key, haz clic en **"Create"** o **"Generate"**
5. Copia la nueva key
6. Pégala en `onesignal-config-local.js`

## 🔄 Cómo Funciona

- `onesignal-config.js` → Se sube a GitHub (sin la key)
- `onesignal-config-local.js` → NO se sube a GitHub (con tu key)
- La app carga ambos archivos, el local sobrescribe la key

## ✅ Verificar

1. Crea `onesignal-config-local.js` con tu key
2. Recarga la app
3. Las notificaciones deberían funcionar cuando la app está cerrada

## 🆘 Si OneSignal Eliminó tu Key

1. Ve al dashboard de OneSignal
2. Ve a **Settings** > **Keys & IDs**
3. Genera una nueva REST API Key
4. Úsala en `onesignal-config-local.js` (NO en `onesignal-config.js`)

