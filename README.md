# App Suscripciones

Aplicación web para gestionar suscripciones con notificaciones push y sincronización en la nube.

<!-- Test commit para verificar workflow automático -->

## Características

- ✅ Gestión de suscripciones personales y compartidas
- ✅ Notificaciones push para recordatorios de pago
- ✅ Calendario de pagos
- ✅ Gestión de personas y perfiles
- ✅ Cálculo automático de precios y ganancias
- ✅ Soporte para diferentes ciclos de facturación
- ✅ Pruebas gratuitas
- ✅ PWA (Progressive Web App)
- ✅ **Sincronización en la nube con Firebase**
- ✅ **Autenticación de usuarios**
- ✅ **Acceso desde múltiples dispositivos**

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/IngNate2405/PWA-Suscriptions-2.git
cd PWA-Suscriptions-2
```

### 2. Configurar Firebase

**Opción A: Usar el script automático (recomendado)**
```bash
./setup.sh
```

**Opción B: Manual**
```bash
cp firebase-config.example.js firebase-config.js
```

Luego edita `firebase-config.js` con tus credenciales de Firebase.

👉 **Ver `SETUP.md`** para instrucciones detalladas de configuración.

👉 **Ver `GUIA-FIREBASE.md`** para la guía completa de Firebase paso a paso.

## 📚 Documentación

- **`SETUP.md`** - Guía de configuración inicial rápida
- **`GUIA-FIREBASE.md`** - Guía completa paso a paso para configurar Firebase
- **`README-FIREBASE.md`** - Documentación técnica de Firebase

## Instalación en Servidor

### Opción 1: Servidor Web Tradicional

1. **Sube todos los archivos** a tu servidor web (Apache, Nginx, etc.)
2. **Asegúrate de que el servidor sirva archivos estáticos** correctamente
3. **Configura HTTPS** (requerido para notificaciones push)
4. **Accede a la aplicación** desde `https://tudominio.com`

### Opción 2: GitHub Pages

1. **Crea un repositorio** en GitHub
2. **Sube todos los archivos** al repositorio
3. **Habilita GitHub Pages** en la configuración del repositorio
4. **Selecciona la rama** (main o master)
5. **Accede a la aplicación** desde `https://usuario.github.io/repositorio`

### Opción 3: Netlify

1. **Crea una cuenta** en Netlify
2. **Arrastra y suelta** la carpeta de la aplicación
3. **O conecta tu repositorio** de GitHub
4. **La aplicación se desplegará automáticamente**

### Opción 4: Vercel

1. **Crea una cuenta** en Vercel
2. **Conecta tu repositorio** de GitHub
3. **Vercel detectará automáticamente** que es una aplicación estática
4. **Se desplegará automáticamente**

## Requisitos del Servidor

- ✅ **HTTPS obligatorio** para notificaciones push
- ✅ **Servidor web** (Apache, Nginx, etc.)
- ✅ **Soporte para archivos estáticos**
- ✅ **Headers CORS** configurados correctamente

## Configuración de Headers

Para un funcionamiento óptimo, configura estos headers en tu servidor:

```apache
# Apache (.htaccess)
<IfModule mod_headers.c>
    Header set Service-Worker-Allowed "/"
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

```nginx
# Nginx
location / {
    add_header Service-Worker-Allowed "/";
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header X-XSS-Protection "1; mode=block";
}
```

## Estructura de Archivos

```
App Suscripciones/
├── index.html          # Página principal
├── card.html           # Detalles de suscripción
├── editar.html         # Editar/crear suscripción
├── editar-persona.html # Editar/crear persona
├── personas.html       # Lista de personas
├── calendar.html       # Calendario de pagos
├── settings.html       # Configuración
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
└── icons/             # Iconos de la aplicación
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## Cambios Realizados para Servidor

Se han eliminado los siguientes timers de prueba que no son necesarios en un servidor:

- ❌ Timeout de 1 segundo en Service Worker
- ❌ Timers de verificación tardía (100ms, 500ms)
- ❌ Timers de reorganización de elementos (100ms, 200ms)

## Notificaciones Push

Las notificaciones push funcionarán automáticamente cuando:

1. ✅ La aplicación esté en HTTPS
2. ✅ El usuario conceda permisos
3. ✅ El Service Worker esté registrado correctamente

## Soporte

Si tienes problemas con el despliegue:

1. **Verifica que HTTPS esté habilitado**
2. **Revisa la consola del navegador** para errores
3. **Asegúrate de que todos los archivos estén subidos**
4. **Verifica que las rutas sean correctas**

## Versión

v1.0.0 - Lista para producción 