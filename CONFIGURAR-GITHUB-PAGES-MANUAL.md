# 🚀 Configurar REST API Key en GitHub Pages (Manual)

## ⚠️ Problema con GitHub Actions

GitHub requiere permisos especiales para crear workflows automáticamente. Te muestro cómo hacerlo manualmente.

## 📋 Opción 1: Crear el Workflow Manualmente (Recomendado)

### Paso 1: Crear el archivo del workflow

1. Ve a tu repositorio en GitHub: `https://github.com/IngNate2405/SubsNatesApps`
2. Haz clic en **"Add file"** > **"Create new file"**
3. Escribe la ruta: `.github/workflows/deploy.yml`
4. Pega este contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Create onesignal-config-local.js
        run: |
          if [ -n "${{ secrets.ONESIGNAL_REST_API_KEY }}" ]; then
            echo "// Configuración local de OneSignal (generado automáticamente)" > onesignal-config-local.js
            echo "// Este archivo se crea durante el deploy usando GitHub Secrets" >> onesignal-config-local.js
            echo "" >> onesignal-config-local.js
            echo "if (typeof ONESIGNAL_CONFIG === 'undefined') {" >> onesignal-config-local.js
            echo "  var ONESIGNAL_CONFIG = {};" >> onesignal-config-local.js
            echo "}" >> onesignal-config-local.js
            echo "" >> onesignal-config-local.js
            echo "ONESIGNAL_CONFIG.restApiKey = '${{ secrets.ONESIGNAL_REST_API_KEY }}';" >> onesignal-config-local.js
            echo "✅ Archivo onesignal-config-local.js creado"
          else
            echo "⚠️ ONESIGNAL_REST_API_KEY no configurado en GitHub Secrets"
            echo "⚠️ Las notificaciones cuando la app está cerrada no funcionarán"
          fi

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Haz clic en **"Commit new file"**

### Paso 2: Agregar el Secret

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Haz clic en **"New repository secret"**
3. Configura:
   - **Name**: `ONESIGNAL_REST_API_KEY`
   - **Secret**: Pega tu REST API Key de OneSignal
4. Haz clic en **"Add secret"**

### Paso 3: Habilitar GitHub Pages

1. Ve a **Settings** > **Pages**
2. En **Source**, selecciona:
   - **GitHub Actions** (no "Deploy from a branch")
3. Guarda

### Paso 4: Ejecutar el Workflow

1. Ve a la pestaña **Actions**
2. Deberías ver "Deploy to GitHub Pages"
3. Haz clic en **"Run workflow"** > **"Run workflow"**

## 📋 Opción 2: Crear el Archivo Manualmente (Más Simple)

Si prefieres no usar GitHub Actions:

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Add file"** > **"Create new file"**
3. Nombre: `onesignal-config-local.js`
4. Contenido:

```javascript
// Configuración local de OneSignal
if (typeof ONESIGNAL_CONFIG === 'undefined') {
  var ONESIGNAL_CONFIG = {};
}

ONESIGNAL_CONFIG.restApiKey = 'TU_REST_API_KEY_AQUI'; // Pega tu key aquí
```

5. **⚠️ IMPORTANTE**: Esto expondrá tu key públicamente. Solo hazlo si:
   - Tu repositorio es PRIVADO, O
   - Entiendes que la key será visible públicamente

## ✅ Verificar

1. Espera a que el workflow termine
2. Ve a tu sitio: `https://ingnate2405.github.io/SubsNatesApps/`
3. Abre: `https://ingnate2405.github.io/SubsNatesApps/onesignal-config-local.js`
4. Deberías ver el archivo con tu key (si usaste la Opción 2, será público)

## 🔒 Recomendación

**Usa la Opción 1 (GitHub Actions + Secrets)** para mantener tu key segura.

