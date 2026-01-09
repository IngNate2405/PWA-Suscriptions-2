# 🌐 Guía: Configurar Dominio Personalizado en InfinityFree

Esta guía te ayudará a conectar tu dominio personalizado a tu aplicación PWA en InfinityFree.

## 📋 Requisitos Previos

- ✅ Tener un dominio registrado (ej: `tudominio.com`)
- ✅ Tener una cuenta en InfinityFree
- ✅ Acceso al panel de control de tu proveedor de dominio (donde compraste el dominio)

---

## 🔧 Paso 1: Configurar DNS en tu Proveedor de Dominio

Necesitas apuntar tu dominio a los servidores de InfinityFree. Los pasos varían según tu proveedor, pero el concepto es el mismo:

### Opción A: Usar Nameservers de InfinityFree (Recomendado)

1. **Obtener los Nameservers de InfinityFree:**
   - Inicia sesión en tu cuenta de InfinityFree
   - Ve a **"Domain"** → **"Addon Domains"** o **"Parked Domains"**
   - InfinityFree te mostrará los nameservers (algo como):
     ```
     ns1.epizy.com
     ns2.epizy.com
     ```

2. **Configurar en tu Proveedor de Dominio:**
   - Inicia sesión en el panel de tu proveedor de dominio (GoDaddy, Namecheap, etc.)
   - Busca la sección **"DNS"** o **"Nameservers"**
   - Cambia los nameservers a los de InfinityFree
   - Guarda los cambios

3. **Esperar la Propagación:**
   - ⏰ Esto puede tardar de 24 a 48 horas
   - Puedes verificar el estado en: https://www.whatsmydns.net/

### Opción B: Usar Registros DNS (A/CNAME)

Si prefieres mantener tus nameservers actuales:

1. **Obtener la IP del servidor de InfinityFree:**
   - En InfinityFree, ve a **"Domain"** → **"Addon Domains"**
   - Agrega tu dominio
   - InfinityFree te dará una IP o un subdominio

2. **Configurar registros DNS:**
   - En tu proveedor de dominio, agrega estos registros:
     ```
     Tipo: A
     Nombre: @ (o tu dominio)
     Valor: [IP que te dio InfinityFree]
     TTL: 3600
     ```
   - O si te dieron un subdominio:
     ```
     Tipo: CNAME
     Nombre: @ (o tu dominio)
     Valor: [subdominio.epizy.com]
     TTL: 3600
     ```

---

## 🚀 Paso 2: Agregar Dominio en InfinityFree

1. **Iniciar sesión en InfinityFree:**
   - Ve a https://infinityfree.net/
   - Inicia sesión en tu cuenta

2. **Agregar el dominio:**
   - Ve a **"Control Panel"** → **"Domain"** → **"Addon Domains"**
   - Ingresa tu dominio (ej: `tudominio.com`)
   - Haz clic en **"Add Domain"**
   - Espera a que InfinityFree verifique el dominio

3. **Verificar el estado:**
   - El dominio aparecerá como "Active" cuando esté configurado correctamente
   - Si aparece como "Pending", espera unas horas más

---

## 📤 Paso 3: Subir Archivos a InfinityFree

### Opción A: Usando File Manager (Panel de Control)

1. **Acceder al File Manager:**
   - En InfinityFree, ve a **"Control Panel"** → **"File Manager"**
   - Navega a la carpeta `htdocs` (esta es la carpeta raíz de tu sitio)

2. **Subir archivos:**
   - Si tu dominio está en una subcarpeta, crea una carpeta con el nombre de tu dominio
   - Sube TODOS los archivos de tu aplicación a esa carpeta
   - Asegúrate de mantener la estructura de carpetas (icons/, etc.)

### Opción B: Usando FTP

1. **Obtener credenciales FTP:**
   - En InfinityFree, ve a **"Control Panel"** → **"FTP Accounts"**
   - Crea una cuenta FTP o usa la existente
   - Anota: **Host**, **Usuario**, **Contraseña**

2. **Conectar con un cliente FTP:**
   - Usa FileZilla, WinSCP, o cualquier cliente FTP
   - Conéctate con las credenciales
   - Navega a `htdocs` o la carpeta de tu dominio
   - Sube todos los archivos

---

## ⚙️ Paso 4: Actualizar Configuración de la Aplicación

Después de subir los archivos, necesitas actualizar algunos archivos:

### 1. Actualizar `manifest.json`

Si subiste los archivos directamente a la raíz (`htdocs`), cambia las rutas:

```json
{
  "start_url": "/index.html",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      ...
    }
  ]
}
```

Si subiste a una subcarpeta (ej: `htdocs/miapp/`), mantén las rutas relativas:

```json
{
  "start_url": "/miapp/index.html",
  "scope": "/miapp/",
  ...
}
```

### 2. Actualizar `cors.json` (si usas Firebase Storage)

Agrega tu dominio a los orígenes permitidos:

```json
[
  {
    "origin": [
      "https://tudominio.com",
      "https://www.tudominio.com",
      "https://ingnate2405.github.io",
      "http://localhost:8000"
    ],
    ...
  }
]
```

### 3. Verificar `.htaccess`

Asegúrate de que el archivo `.htaccess` esté en la carpeta raíz de tu sitio. Este archivo ya está configurado correctamente.

---

## 🔒 Paso 5: Configurar HTTPS/SSL

InfinityFree ofrece SSL gratuito:

1. **Habilitar SSL:**
   - En InfinityFree, ve a **"Control Panel"** → **"SSL"**
   - Selecciona tu dominio
   - Haz clic en **"Enable SSL"**
   - Espera unos minutos a que se active

2. **Forzar HTTPS:**
   - Una vez activo el SSL, descomenta estas líneas en `.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## 🧪 Paso 6: Probar la Aplicación

1. **Abrir en el navegador:**
   - Ve a `https://tudominio.com` (o `https://tudominio.com/miapp` si está en subcarpeta)
   - Deberías ver tu aplicación funcionando

2. **Verificar PWA:**
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña **"Application"** → **"Service Workers"**
   - Verifica que el Service Worker esté registrado

3. **Probar notificaciones:**
   - Las notificaciones push requieren HTTPS (que ya tienes)
   - Prueba crear una suscripción y configurar notificaciones

---

## 🔥 Paso 7: Actualizar Firebase (Opcional)

Si quieres usar tu dominio personalizado con Firebase:

1. **Agregar dominio autorizado en Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto
   - Ve a **"Authentication"** → **"Settings"** → **"Authorized domains"**
   - Agrega `tudominio.com` y `www.tudominio.com`

2. **Actualizar authDomain (Opcional):**
   - Si quieres usar tu dominio para autenticación, necesitarías configurar Firebase Hosting
   - Por ahora, puedes mantener `suscripciones-nate.firebaseapp.com`

---

## ❓ Solución de Problemas

### El dominio no carga
- ✅ Verifica que los DNS estén propagados: https://www.whatsmydns.net/
- ✅ Espera 24-48 horas para la propagación completa
- ✅ Verifica que el dominio esté "Active" en InfinityFree

### Error 404
- ✅ Verifica que los archivos estén en la carpeta correcta
- ✅ Asegúrate de que `index.html` esté en la raíz
- ✅ Verifica las rutas en `manifest.json`

### SSL no funciona
- ✅ Espera unos minutos después de habilitarlo
- ✅ Verifica que el dominio esté completamente propagado
- ✅ Limpia la caché del navegador

### Service Worker no se registra
- ✅ Verifica que estés usando HTTPS
- ✅ Verifica que `sw.js` esté accesible
- ✅ Revisa la consola del navegador para errores

---

## 📝 Notas Importantes

- ⚠️ **InfinityFree tiene límites:** Revisa los términos de servicio
- ⚠️ **Propagación DNS:** Puede tardar hasta 48 horas
- ✅ **SSL gratuito:** InfinityFree ofrece SSL gratuito con Let's Encrypt
- ✅ **Backup:** Haz backup de tus archivos antes de subirlos

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en `https://tudominio.com`

Si tienes problemas, revisa los logs en el panel de InfinityFree o contacta con su soporte.

