# 🚀 Configurar REST API Key en Producción

## ✅ Cómo Funciona

El archivo `onesignal-config-local.js` es solo para desarrollo local. Para producción, tienes varias opciones:

## Opción 1: Usar GitHub Actions (Recomendado para GitHub Pages) ✅

**He configurado GitHub Actions para crear el archivo automáticamente.**

1. **Agrega tu REST API Key como GitHub Secret:**
   - Ve a tu repositorio > **Settings** > **Secrets and variables** > **Actions**
   - Crea un nuevo secret llamado: `ONESIGNAL_REST_API_KEY`
   - Pega tu REST API Key
   - El workflow creará el archivo automáticamente en cada deploy

2. **Ver instrucciones detalladas en:** `CONFIGURAR-GITHUB-PAGES.md`

## Opción 2: Crear el archivo manualmente (Alternativa)

### Si usas GitHub Pages:

1. **NO subas `onesignal-config-local.js` a GitHub** (está en `.gitignore`)

2. **Crea el archivo directamente en GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Haz clic en "Settings" > "Pages"
   - O usa GitHub Actions para crear el archivo automáticamente

3. **O crea el archivo manualmente en tu servidor:**
   - Si tienes acceso FTP/SSH a tu servidor
   - Crea `onesignal-config-local.js` directamente en el servidor
   - Con el contenido:
   ```javascript
   ONESIGNAL_CONFIG.restApiKey = 'TU_REST_API_KEY';
   ```

### Si usas InfinityFree u otro hosting:

1. Sube todos los archivos normalmente (sin `onesignal-config-local.js`)
2. Crea `onesignal-config-local.js` directamente en el servidor usando el panel de control o FTP
3. Agrega tu REST API Key

## Opción 2: Usar Variables de Entorno (Si tienes backend)

Si tienes un backend (Node.js, PHP, etc.), puedes:
- Leer la key desde variables de entorno
- Generar el archivo `onesignal-config-local.js` dinámicamente
- Nunca exponer la key en el código

## Opción 3: Configurar directamente en el código (Solo si el repo es privado)

Si tu repositorio es **PRIVADO** (no público), puedes:
- Agregar la key directamente en `onesignal-config.js`
- GitHub no escaneará repositorios privados
- **NO recomendado** si planeas hacer el repo público después

## ⚠️ Importante

- **NUNCA** subas tu REST API Key a un repositorio público
- **SÍ** puedes tenerla en tu servidor de producción
- El archivo `onesignal-config-local.js` se carga automáticamente si existe

## 🔄 Flujo Recomendado

1. **Desarrollo local:**
   - Usa `onesignal-config-local.js` (no se sube a GitHub)
   - Funciona perfectamente en tu computadora

2. **Producción (GitHub Pages/InfinityFree):**
   - Crea `onesignal-config-local.js` directamente en el servidor
   - O configura la key de otra forma segura
   - La app la cargará automáticamente

## ✅ Verificar que Funciona

1. Crea `onesignal-config-local.js` en tu servidor
2. Recarga la app en producción
3. Crea/edita una suscripción con notificaciones
4. Las notificaciones deberían programarse en OneSignal
5. Funcionarán aunque la app esté cerrada

