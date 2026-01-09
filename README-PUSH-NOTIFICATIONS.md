# 🚀 Push Notifications - Guía Completa

Esta guía te permitirá recibir notificaciones **incluso cuando el navegador está cerrado**.

---

## 📋 Requisitos

1. ✅ Firebase configurado (ya lo tienes)
2. ✅ Node.js instalado
3. ✅ Firebase CLI instalado

---

## 🔧 Paso 1: Instalar Node.js (si no lo tienes)

**macOS:**
```bash
brew install node
```

**O descarga desde:** https://nodejs.org/ (versión LTS)

---

## 🔑 Paso 2: Generar VAPID Keys

### Opción A: Generador HTML (Recomendado)

1. Abre `generate-vapid-keys.html` en tu navegador
2. Haz clic en "Generar VAPID Keys"
3. Copia las dos claves (Public Key y Private Key)

### Opción B: Con Node.js

```bash
npm install -g web-push
web-push generate-vapid-keys
```

---

## ⚙️ Paso 3: Configurar VAPID Keys

1. Abre `functions/index.js`
2. Reemplaza:
   - Línea 16: `TU_VAPID_PUBLIC_KEY_AQUI` → Tu Public Key
   - Línea 17: `TU_VAPID_PRIVATE_KEY_AQUI` → Tu Private Key
   - Línea 22: `tu-email@ejemplo.com` → Tu email real

---

## 🔥 Paso 4: Configurar Firebase

```bash
# Iniciar sesión
firebase login

# Inicializar functions
firebase init functions
# Selecciona: JavaScript, No a ESLint, Yes a instalar dependencias

# Si no se instalaron dependencias:
cd functions && npm install && cd ..

# Deploy
firebase deploy --only functions
```

---

## ✅ Paso 5: Probar

1. Abre tu PWA
2. Inicia sesión
3. Permite notificaciones
4. Crea una suscripción con notificaciones
5. Cierra el navegador
6. Espera la notificación (puede tardar hasta 1 minuto)

---

## 🔍 Verificar Logs

```bash
firebase functions:log
```

---

## 💰 Costos

- **Firebase Cloud Functions**: Gratis hasta 2 millones de invocaciones/mes
- **Cloud Scheduler**: Gratis hasta 3 jobs programados
- **Firestore**: Gratis hasta 50K lecturas/día

**Total: GRATIS para uso personal** 🎉

---

## 🐛 Troubleshooting

### Error: "VAPID keys not set"
- Verifica que hayas configurado las claves en `functions/index.js`
- Asegúrate de haber hecho deploy: `firebase deploy --only functions`

### No llegan notificaciones
1. Verifica los logs: `firebase functions:log`
2. Verifica permisos de notificación en el navegador
3. Verifica que la suscripción esté guardada en Firestore (Firebase Console)

---

## 📝 Cómo Funciona

1. **Usuario se suscribe**: El cliente se suscribe a Push API usando VAPID public key
2. **Suscripción guardada**: Se guarda en Firestore (`userPushSubscriptions`)
3. **Notificación programada**: Al crear/editar suscripción, se programa en Firestore (`scheduledNotifications`)
4. **Firebase Functions verifica**: Cada minuto, una función verifica notificaciones pendientes
5. **Notificación enviada**: Si hay notificaciones pendientes, se envían usando `web-push`
6. **Service Worker recibe**: El service worker recibe el push y muestra la notificación

---

¡Listo! 🎉
