# ✅ Pasos Después de Crear el Workflow

## Paso 1: Agregar el Secret de OneSignal

1. Ve a tu repositorio: `https://github.com/IngNate2405/SubsNatesApps`
2. Haz clic en **Settings** (arriba en el menú)
3. En el menú lateral izquierdo, busca **"Secrets and variables"**
4. Haz clic en **"Actions"**
5. Haz clic en **"New repository secret"** (botón verde)
6. Configura:
   - **Name**: `ONESIGNAL_REST_API_KEY` (exactamente así, en mayúsculas)
   - **Secret**: Pega tu REST API Key de OneSignal
7. Haz clic en **"Add secret"**

### ¿Dónde obtener tu REST API Key?

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu App
3. Ve a **Settings** > **Keys & IDs**
4. Busca **"REST API Key"**
5. Si no tienes una, haz clic en **"Create"** o **"Generate"**
6. Copia la key completa

## Paso 2: Configurar GitHub Pages para usar Actions

1. En tu repositorio, ve a **Settings** > **Pages**
2. En la sección **"Source"**, verás opciones como:
   - Deploy from a branch
   - GitHub Actions
3. **Selecciona "GitHub Actions"** (NO "Deploy from a branch")
4. Si no aparece la opción, espera unos segundos y recarga la página
5. Guarda los cambios

## Paso 3: Ejecutar el Workflow

1. Ve a la pestaña **"Actions"** (arriba en el menú)
2. Deberías ver **"Deploy to GitHub Pages"** en la lista
3. Haz clic en **"Deploy to GitHub Pages"**
4. Haz clic en **"Run workflow"** (botón azul, arriba a la derecha)
5. Selecciona la rama **"main"**
6. Haz clic en **"Run workflow"** (botón verde)

## Paso 4: Esperar a que termine

1. Verás que el workflow empieza a ejecutarse
2. Haz clic en el workflow que está corriendo
3. Verás los pasos ejecutándose:
   - ✅ Checkout
   - ✅ Create onesignal-config-local.js
   - ✅ Setup Pages
   - ✅ Upload artifact
   - ✅ Deploy to GitHub Pages
4. Espera a que todos tengan ✅ verde (puede tardar 1-2 minutos)

## Paso 5: Verificar que funcionó

1. Cuando el workflow termine con ✅, ve a tu sitio:
   - `https://ingnate2405.github.io/SubsNatesApps/`
2. Abre la consola del navegador (F12)
3. Verifica que no hay errores relacionados con OneSignal
4. Prueba crear/editar una suscripción con notificaciones
5. Las notificaciones deberían programarse en OneSignal

## 🔍 Verificar el archivo creado

Para confirmar que el archivo se creó correctamente:

1. Ve a: `https://ingnate2405.github.io/SubsNatesApps/onesignal-config-local.js`
2. Deberías ver el contenido del archivo con tu REST API Key
3. Si ves 404, el workflow no se ejecutó correctamente

## ⚠️ Si algo sale mal

### El workflow falla:
- Verifica que el secret `ONESIGNAL_REST_API_KEY` esté configurado correctamente
- Revisa los logs del workflow en la pestaña Actions

### No aparece "GitHub Actions" en Pages:
- Asegúrate de que el workflow se creó correctamente
- Espera unos minutos y recarga

### El archivo no se crea:
- Verifica que el secret tenga el nombre exacto: `ONESIGNAL_REST_API_KEY`
- Revisa los logs del paso "Create onesignal-config-local.js"

