# 🚀 Subir App Suscripciones a GitHub Pages

## ✅ Verificación Previa

Antes de subir, verifica que tengas estos archivos:

### 📁 Archivos Principales
- ✅ `index.html` - Página principal
- ✅ `manifest.json` - Configuración PWA
- ✅ `sw.js` - Service Worker
- ✅ `.htaccess` - Configuración servidor
- ✅ `README.md` - Documentación

### 📁 Páginas de la App
- ✅ `card.html` - Detalles de suscripción
- ✅ `editar.html` - Editar/crear suscripción
- ✅ `editar-persona.html` - Editar/crear persona
- ✅ `personas.html` - Lista de personas
- ✅ `persona.html` - Detalles de persona
- ✅ `calendar.html` - Calendario de pagos
- ✅ `settings.html` - Configuración

### 📁 Iconos (PWA)
- ✅ `icons/icon-72x72.png`
- ✅ `icons/icon-96x96.png`
- ✅ `icons/icon-128x128.png`
- ✅ `icons/icon-144x144.png`
- ✅ `icons/icon-152x152.png`
- ✅ `icons/icon-192x192.png`
- ✅ `icons/icon-384x384.png`
- ✅ `icons/icon-512x512.png`

## 🎯 Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"** (botón verde)
3. Nombre del repositorio: `app-suscripciones` (o el que prefieras)
4. Descripción: `Aplicación web para gestionar suscripciones con notificaciones push`
5. **Marca como público** (necesario para GitHub Pages)
6. **NO** marques "Add a README file" (ya tienes uno)
7. Haz clic en **"Create repository"**

### 2. Subir Archivos desde tu Computadora

#### Opción A: Usando GitHub Desktop (Recomendado)
1. Descarga [GitHub Desktop](https://desktop.github.com/)
2. Instala y conéctate a tu cuenta
3. Haz clic en **"Clone a repository"**
4. Selecciona tu repositorio `app-suscripciones`
5. Elige una carpeta local
6. Copia todos los archivos de tu app a esa carpeta
7. En GitHub Desktop, verás todos los cambios
8. Escribe un mensaje: "Initial commit: App Suscripciones PWA"
9. Haz clic en **"Commit to main"**
10. Haz clic en **"Push origin"**

#### Opción B: Usando Git desde Terminal
```bash
# Navega a tu carpeta de la app
cd "D:\Documentos\App Suscripciones"

# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: App Suscripciones PWA"

# Agregar el repositorio remoto (reemplaza USERNAME y REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Subir al repositorio
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** (pestaña)
3. Baja hasta la sección **"Pages"** (menú lateral izquierdo)
4. En **"Source"**, selecciona **"Deploy from a branch"**
5. En **"Branch"**, selecciona **"main"** y **"/ (root)"**
6. Haz clic en **"Save"**
7. Espera unos minutos para que se active

### 4. Verificar que Funcione

1. Tu app estará disponible en: `https://TU-USUARIO.github.io/app-suscripciones`
2. Abre la URL en tu navegador
3. Verifica que:
   - ✅ La app cargue correctamente
   - ✅ Las notificaciones funcionen (conceder permisos)
   - ✅ El Service Worker se registre
   - ✅ Se pueda instalar como PWA

## 🔧 Configuración Adicional

### Personalizar Dominio (Opcional)
Si quieres un dominio personalizado:
1. Ve a Settings > Pages
2. En "Custom domain", escribe tu dominio
3. Agrega un archivo `CNAME` en tu repositorio con tu dominio

### Configurar HTTPS
GitHub Pages ya incluye HTTPS automáticamente, así que las notificaciones push funcionarán sin configuración adicional.

## 🐛 Solución de Problemas

### Si la app no carga:
- Verifica que todos los archivos estén subidos
- Revisa la consola del navegador para errores
- Asegúrate de que GitHub Pages esté activado

### Si las notificaciones no funcionan:
- Verifica que estés usando HTTPS
- Concede permisos de notificación
- Revisa que el Service Worker esté registrado

### Si hay errores 404:
- Verifica que las rutas en los archivos HTML sean correctas
- Asegúrate de que todos los archivos estén en la raíz del repositorio

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación estará:
- ✅ Publicada en GitHub Pages
- ✅ Accesible desde cualquier dispositivo
- ✅ Funcionando como PWA
- ✅ Con notificaciones push activas
- ✅ Lista para ser instalada en móviles

**URL de tu app:** `https://TU-USUARIO.github.io/app-suscripciones` 