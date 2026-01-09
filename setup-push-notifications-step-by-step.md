# 🚀 Guía Paso a Paso: Configurar Push Notifications

Sigue estos pasos en orden para configurar las notificaciones push.

---

## 📋 Paso 1: Instalar Node.js (si no lo tienes)

1. Ve a: https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Instala Node.js
4. Verifica la instalación:
```bash
node --version
npm --version
```

---

## 📦 Paso 2: Instalar Firebase CLI y web-push

Abre tu terminal y ejecuta:

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
npm install -g firebase-tools web-push
```

---

## 🔑 Paso 3: Generar VAPID Keys

Ejecuta el script que genera las claves:

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
node generate-vapid-keys.js
```

**O si prefieres usar el comando directo:**
```bash
web-push generate-vapid-keys
```

**Copia las dos claves que aparecen:**
- Public Key (clave pública)
- Private Key (clave privada)

---

## 🔐 Paso 4: Configurar VAPID Keys en functions/index.js

1. Abre el archivo: `functions/index.js`
2. Busca estas líneas (alrededor de la línea 15):
```javascript
const vapidKeys = {
  publicKey: 'TU_VAPID_PUBLIC_KEY_AQUI',
  privateKey: 'TU_VAPID_PRIVATE_KEY_AQUI'
};
```

3. Reemplaza con tus claves:
```javascript
const vapidKeys = {
  publicKey: 'TU_CLAVE_PUBLICA_AQUI',
  privateKey: 'TU_CLAVE_PRIVADA_AQUI'
};
```

4. Busca esta línea (alrededor de la línea 20):
```javascript
webpush.setVapidDetails(
  'mailto:tu-email@ejemplo.com', // Reemplaza con tu email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
```

5. Reemplaza `tu-email@ejemplo.com` con tu email real:
```javascript
webpush.setVapidDetails(
  'mailto:tu-email-real@gmail.com', // Tu email real
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
```

---

## 🔥 Paso 5: Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con Google.

---

## ⚙️ Paso 6: Inicializar Firebase Functions

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
firebase init functions
```

**Selecciona:**
- ✅ **JavaScript** (presiona Enter)
- ✅ **ESLint** (puedes decir "No" si quieres)
- ✅ **Instalar dependencias ahora** (di "Yes")

---

## 📦 Paso 7: Instalar Dependencias (si no se instalaron)

```bash
cd functions
npm install
cd ..
```

---

## 🚀 Paso 8: Deploy de Functions

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
firebase deploy --only functions
```

Esto puede tardar unos minutos la primera vez.

---

## ✅ Paso 9: Verificar que Funciona

1. Abre tu PWA en el navegador
2. Inicia sesión
3. Permite notificaciones cuando te lo pida
4. Crea una suscripción con notificaciones
5. Cierra el navegador completamente
6. Espera a que llegue la notificación (puede tardar hasta 1 minuto)

---

## 🔍 Ver Logs de Firebase Functions

Si quieres ver qué está pasando:

```bash
firebase functions:log
```

---

## 🐛 Problemas Comunes

### Error: "firebase: command not found"
- Asegúrate de haber instalado Firebase CLI: `npm install -g firebase-tools`

### Error: "node: command not found"
- Instala Node.js desde https://nodejs.org/

### Error: "Permission denied" al instalar globalmente
- En macOS/Linux, usa `sudo`: `sudo npm install -g firebase-tools`

### Error: "VAPID keys not set"
- Verifica que hayas reemplazado las claves en `functions/index.js`
- Asegúrate de haber hecho deploy: `firebase deploy --only functions`

### No llegan notificaciones
1. Verifica los logs: `firebase functions:log`
2. Verifica que tengas permisos de notificación en el navegador
3. Verifica que la suscripción esté guardada en Firestore (Firebase Console)

---

## 📝 Resumen de Comandos

```bash
# 1. Instalar herramientas
npm install -g firebase-tools web-push

# 2. Generar VAPID keys
web-push generate-vapid-keys

# 3. Iniciar sesión
firebase login

# 4. Inicializar functions
firebase init functions

# 5. Instalar dependencias
cd functions && npm install && cd ..

# 6. Deploy
firebase deploy --only functions
```

---

¡Listo! 🎉

