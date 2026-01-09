# 🚀 Guía Completa: Notificaciones Push con Firebase

Esta guía te permitirá recibir notificaciones **incluso cuando el navegador está cerrado**.

---

## 📋 Requisitos

1. ✅ Firebase configurado (ya lo tienes)
2. ✅ Node.js instalado
3. ✅ Firebase CLI instalado

---

## 🔧 Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Inicia sesión:
```bash
firebase login
```

---

## 🔑 Paso 2: Generar VAPID Keys

Las VAPID keys son necesarias para autenticar las notificaciones push.

### Opción A: Herramienta Online (Más Fácil)
1. Ve a: https://web-push-codelab.glitch.me/
2. Haz clic en **"Generate VAPID Keys"**
3. Copia las dos claves:
   - **Public Key** (la necesitarás)
   - **Private Key** (la necesitarás)

### Opción B: Desde Terminal
```bash
npm install -g web-push
web-push generate-vapid-keys
```

**⚠️ IMPORTANTE:** Guarda estas claves en un lugar seguro.

---

## 📁 Paso 3: Configurar Firebase Functions

1. **Inicializar Firebase Functions:**
```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
firebase init functions
```

2. **Selecciona:**
   - ✅ JavaScript
   - ✅ ESLint (opcional, puedes decir "No")
   - ✅ Instalar dependencias ahora (Sí)

3. **Si no instalaste dependencias, instálalas ahora:**
```bash
cd functions
npm install
```

---

## ⚙️ Paso 4: Configurar VAPID Keys

1. **Edita el archivo `functions/index.js`**
2. **Busca estas líneas:**
```javascript
const vapidKeys = {
  publicKey: 'TU_VAPID_PUBLIC_KEY_AQUI',
  privateKey: 'TU_VAPID_PRIVATE_KEY_AQUI'
};
```

3. **Reemplaza con tus claves:**
```javascript
const vapidKeys = {
  publicKey: 'TU_CLAVE_PUBLICA_AQUI',
  privateKey: 'TU_CLAVE_PRIVADA_AQUI'
};
```

4. **Reemplaza el email:**
```javascript
webpush.setVapidDetails(
  'mailto:tu-email-real@gmail.com', // Tu email real
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
```

---

## 📤 Paso 5: Deploy de Functions

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
firebase deploy --only functions
```

Esto puede tardar unos minutos la primera vez.

---

## ✅ Paso 6: Probar

1. **Abre tu PWA en el navegador**
2. **Inicia sesión con tu cuenta**
3. **Permite notificaciones** cuando te lo pida
4. **Crea una suscripción** con notificaciones
5. **Cierra completamente el navegador**
6. **Espera a que llegue la notificación** (puede tardar hasta 1 minuto)

---

## 🔍 Verificar que Funciona

### Ver logs de Firebase Functions:
```bash
firebase functions:log
```

### Ver suscripciones en Firestore:
1. Ve a Firebase Console
2. Firestore Database
3. Busca la colección `userPushSubscriptions`
4. Deberías ver tu suscripción con tu `userId`

### Ver notificaciones programadas:
1. En Firestore, busca la colección `scheduledNotifications`
2. Deberías ver las notificaciones programadas con sus fechas

---

## 🐛 Troubleshooting

### Error: "VAPID keys not set"
- Verifica que hayas configurado las VAPID keys en `functions/index.js`
- Asegúrate de haber hecho deploy: `firebase deploy --only functions`

### Error: "Permission denied" en Firestore
- Ve a Firebase Console > Firestore Database > Reglas
- Asegúrate de que las reglas permitan lectura/escritura para usuarios autenticados

### No llegan notificaciones
1. Verifica que el service worker esté registrado (DevTools > Application > Service Workers)
2. Verifica que tengas permisos de notificación (DevTools > Application > Notifications)
3. Revisa los logs: `firebase functions:log`
4. Verifica que la suscripción esté guardada en Firestore

### Error: "functions not found"
- Asegúrate de haber ejecutado `firebase init functions`
- Verifica que el directorio `functions/` exista

---

## 💰 Costos

- **Firebase Cloud Functions**: Gratis hasta 2 millones de invocaciones/mes
- **Cloud Scheduler**: Gratis hasta 3 jobs programados
- **Firestore**: Gratis hasta 50K lecturas/día y 20K escrituras/día

**Total: GRATIS para uso personal** 🎉

---

## 📝 Archivos Creados/Modificados

1. ✅ `push-notification-service.js` - Servicio para manejar Push API
2. ✅ `functions/index.js` - Cloud Functions para enviar notificaciones
3. ✅ `functions/package.json` - Dependencias de Functions
4. ✅ `index.html` - Actualizado para suscribirse a Push API
5. ✅ `editar.html` - Actualizado para programar en Firestore
6. ✅ `sw.js` - Actualizado para recibir push notifications

---

## 🎯 Cómo Funciona

1. **Usuario se suscribe**: El cliente se suscribe a Push API usando VAPID public key
2. **Suscripción guardada**: Se guarda en Firestore (`userPushSubscriptions`)
3. **Notificación programada**: Al crear/editar suscripción, se programa en Firestore (`scheduledNotifications`)
4. **Firebase Functions verifica**: Cada minuto, una función verifica notificaciones pendientes
5. **Notificación enviada**: Si hay notificaciones pendientes, se envían usando `web-push`
6. **Service Worker recibe**: El service worker recibe el push y muestra la notificación

---

## 🚀 Próximos Pasos

1. Configura las VAPID keys
2. Haz deploy de las functions
3. Prueba creando una suscripción
4. Cierra el navegador y espera la notificación

¡Listo! 🎉

