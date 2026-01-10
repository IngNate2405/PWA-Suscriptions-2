# 🚀 Configurar REST API Key en GitHub Pages

## ✅ Solución Automática con GitHub Secrets

He configurado GitHub Actions para crear automáticamente el archivo `onesignal-config-local.js` durante el deploy, usando un **GitHub Secret** para mantener tu REST API Key segura.

## 📋 Pasos para Configurar

### Paso 1: Obtener tu REST API Key

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu App
3. Ve a **Settings** > **Keys & IDs**
4. Si no tienes una REST API Key, haz clic en **"Create"** o **"Generate"**
5. Copia la key completa

### Paso 2: Agregar el Secret en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/IngNate2405/SubsNatesApps`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, ve a **Secrets and variables** > **Actions**
4. Haz clic en **"New repository secret"**
5. Configura:
   - **Name**: `ONESIGNAL_REST_API_KEY`
   - **Secret**: Pega tu REST API Key aquí
6. Haz clic en **"Add secret"**

### Paso 3: Habilitar GitHub Pages (si no está habilitado)

1. En tu repositorio, ve a **Settings** > **Pages**
2. En **Source**, selecciona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Haz clic en **Save**

### Paso 4: Activar el Workflow

1. Ve a la pestaña **Actions** en tu repositorio
2. Deberías ver el workflow "Deploy to GitHub Pages"
3. Si no se ejecutó automáticamente, haz clic en **"Run workflow"** > **"Run workflow"**

## ✅ Verificar que Funciona

1. Espera a que el workflow termine (verás una ✅ verde)
2. Ve a tu sitio en GitHub Pages: `https://ingnate2405.github.io/SubsNatesApps/`
3. Abre la consola del navegador (F12)
4. Deberías ver que `onesignal-config-local.js` se cargó correctamente
5. Crea/edita una suscripción con notificaciones
6. Las notificaciones deberían programarse en OneSignal

## 🔒 Seguridad

- ✅ Tu REST API Key está en **GitHub Secrets** (encriptado)
- ✅ El archivo se crea automáticamente durante el deploy
- ✅ La key **NUNCA** aparece en el código del repositorio
- ✅ Solo tú y los colaboradores con acceso pueden ver los secrets

## 🆘 Si No Funciona

### Verificar el Secret:
1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Verifica que `ONESIGNAL_REST_API_KEY` existe
3. Si no existe, créalo siguiendo el Paso 2

### Verificar el Workflow:
1. Ve a la pestaña **Actions**
2. Haz clic en el último workflow ejecutado
3. Revisa los logs para ver si hay errores
4. Busca el mensaje: `✅ Archivo onesignal-config-local.js creado`

### Verificar el Archivo en Producción:
1. Ve a tu sitio: `https://ingnate2405.github.io/SubsNatesApps/onesignal-config-local.js`
2. Deberías ver el contenido del archivo (con tu key)
3. Si ves 404, el workflow no se ejecutó correctamente

## 🔄 Actualizar la Key

Si necesitas cambiar tu REST API Key:

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Haz clic en `ONESIGNAL_REST_API_KEY`
3. Haz clic en **"Update"**
4. Pega la nueva key
5. Haz clic en **"Update secret"**
6. Ve a **Actions** y ejecuta el workflow manualmente o haz un push

## 📝 Notas

- El archivo `onesignal-config-local.js` se crea automáticamente en cada deploy
- Si no configuras el secret, la app funcionará pero las notificaciones cuando está cerrada no funcionarán
- El archivo local (`onesignal-config-local.js` en tu computadora) sigue siendo útil para desarrollo

