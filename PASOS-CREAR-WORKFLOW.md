# 📝 Pasos para Crear el Workflow en GitHub

## ✅ Paso a Paso Visual

### Paso 1: Crear el archivo del workflow

1. Ve a tu repositorio: `https://github.com/IngNate2405/SubsNatesApps`
2. Haz clic en el botón **"Add file"** (arriba a la derecha)
3. Selecciona **"Create new file"**
4. **IMPORTANTE**: En el campo de nombre del archivo, escribe exactamente:
   ```
   .github/workflows/deploy.yml
   ```
   (GitHub creará las carpetas automáticamente)

### Paso 2: Copiar el contenido

1. Abre el archivo `.github/workflows/deploy.yml` que está en tu proyecto local
2. Copia TODO el contenido
3. Pégalo en el editor de GitHub

### Paso 3: Guardar

1. Haz scroll hacia abajo
2. Haz clic en **"Commit new file"** (botón verde)
3. Puedes dejar el mensaje por defecto o escribir: "Agregar workflow para GitHub Pages"

### Paso 4: Verificar que se creó

1. Ve a la pestaña **"Actions"** (arriba en el menú)
2. Deberías ver **"Deploy to GitHub Pages"** en la lista
3. Si aparece con un ⚠️ amarillo, es normal (aún no tiene el secret configurado)

## ⚠️ NO uses el workflow de Jekyll

- El workflow que aparece al buscar "GitHub Pages" es para sitios Jekyll
- **NO** es el que necesitas
- Crea el archivo manualmente como se indica arriba

## 🔄 Después de crear el workflow

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Crea el secret `ONESIGNAL_REST_API_KEY` con tu REST API Key
3. Ve a **Settings** > **Pages** y cambia a **"GitHub Actions"**
4. Ve a **Actions** y ejecuta el workflow manualmente

