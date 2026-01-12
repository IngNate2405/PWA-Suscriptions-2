# 📝 Crear Workflow Manualmente en GitHub

Como el token no tiene permisos de workflow, necesitas crearlo directamente en GitHub.

## 🚀 Pasos para Crear el Workflow

### 1. Ve a tu Repositorio
1. Abre: `https://github.com/IngNate2405/SubsNatesApps`
2. Asegúrate de estar en la rama **`main`**

### 2. Crea el Archivo del Workflow
1. Haz clic en **"Add file"** (arriba a la derecha)
2. Selecciona **"Create new file"**

### 3. Escribe la Ruta del Archivo
En el campo de nombre del archivo, escribe exactamente:
```
.github/workflows/deploy.yml
```

**⚠️ IMPORTANTE**: GitHub creará automáticamente las carpetas `.github` y `workflows` si no existen.

### 4. Copia y Pega el Contenido
Copia TODO este contenido y pégalo en el editor:

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

### 5. Guarda el Archivo
1. Desplázate hacia abajo
2. En "Commit new file", escribe: `Agregar workflow de deployment automático`
3. Haz clic en **"Commit new file"** (botón verde)

### 6. Verifica que se Creó
1. Ve a la pestaña **Actions** (arriba en el repositorio)
2. Deberías ver:
   - En el menú lateral: **"Deploy to GitHub Pages"**
   - Una nueva ejecución del workflow (se activa automáticamente al crear el archivo)

### 7. Verifica que se Ejecuta Automáticamente
1. Haz un pequeño cambio en cualquier archivo (por ejemplo, agrega un espacio en blanco)
2. Haz commit y push
3. Ve a **Actions** > **Deploy to GitHub Pages**
4. Deberías ver una nueva ejecución automática

## ✅ Listo

Una vez creado, el workflow se ejecutará automáticamente en cada push a `main`.

## 🔑 Recordatorio: Configurar el Secret

Si aún no has configurado `ONESIGNAL_REST_API_KEY`:
1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Haz clic en **"New repository secret"**
3. Nombre: `ONESIGNAL_REST_API_KEY`
4. Valor: Tu REST API Key de OneSignal
5. Guarda

