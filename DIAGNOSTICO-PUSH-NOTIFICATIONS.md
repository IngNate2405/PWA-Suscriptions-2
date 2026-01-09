# 🔍 Diagnóstico: Push Notifications No Funcionan

## ✅ Checklist de Verificación

### 1. VAPID Keys Configuradas

**Verifica en `functions/index.js`:**
- [ ] Línea 16: `publicKey` NO debe decir `TU_VAPID_PUBLIC_KEY_AQUI`
- [ ] Línea 17: `privateKey` NO debe decir `TU_VAPID_PRIVATE_KEY_AQUI`
- [ ] Línea 22: `mailto:` debe tener tu email real

**Si no están configuradas:**
1. Abre `generate-vapid-keys.html` en tu navegador
2. Genera las claves
3. Cópialas a `functions/index.js`

---

### 2. Firebase Functions Desplegado

**Verifica:**
```bash
firebase functions:list
```

**Si no están desplegadas:**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

### 3. Suscripción Push API

**Abre la consola del navegador (F12) y verifica:**

1. **¿Se suscribió a Push API?**
   - Busca: `✅ Suscrito a Push Notifications`
   - O: `✅ Suscripción guardada en Firestore`

2. **¿Hay errores?**
   - Busca errores relacionados con `push`, `VAPID`, o `Firebase`

**Verifica en Firebase Console:**
- Ve a Firestore Database
- Busca la colección `userPushSubscriptions`
- Debe haber un documento con tu `userId`

---

### 4. Notificaciones Programadas en Firestore

**Verifica en Firebase Console:**
- Ve a Firestore Database
- Busca la colección `scheduledNotifications`
- Debe haber documentos con `sent: false` y fechas futuras

---

### 5. Firebase Functions Ejecutándose

**Verifica logs:**
```bash
firebase functions:log
```

**Busca:**
- `🔍 Verificando notificaciones pendientes`
- `📬 Encontradas X notificaciones pendientes`
- `✅ Notificación enviada`

**Si no ves nada:**
- La función puede no estar desplegada
- O puede haber un error en la función

---

## 🐛 Problemas Comunes

### Error: "VAPID keys not set"
**Solución:** Configura las VAPID keys en `functions/index.js`

### Error: "Permission denied" en Firestore
**Solución:** Verifica las reglas de Firestore en Firebase Console

### No se suscribe a Push API
**Solución:** 
- Verifica que tengas permisos de notificación
- Verifica que estés autenticado en Firebase
- Revisa la consola del navegador para errores

### Notificaciones no se programan en Firestore
**Solución:**
- Verifica que estés autenticado
- Verifica que `pushNotificationService` esté disponible
- Revisa la consola del navegador

### Firebase Functions no envía notificaciones
**Solución:**
- Verifica que las functions estén desplegadas
- Verifica los logs: `firebase functions:log`
- Verifica que las VAPID keys estén correctas

---

## 🔧 Pasos para Solucionar

1. **Configura VAPID keys** (si no lo has hecho)
2. **Despliega Firebase Functions** (si no lo has hecho)
3. **Abre la app y verifica en la consola** que se suscriba a Push API
4. **Crea/edita una suscripción** con notificaciones
5. **Verifica en Firestore** que se programen las notificaciones
6. **Verifica los logs** de Firebase Functions
7. **Espera 1-2 minutos** y verifica si llega la notificación

---

## 📝 Verificación Rápida

Ejecuta esto en la consola del navegador (F12):

```javascript
// Verificar si está suscrito
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    if (sub) {
      console.log('✅ Suscrito a Push API');
      console.log('Subscription:', sub.toJSON());
    } else {
      console.log('❌ NO está suscrito a Push API');
    }
  });
});

// Verificar Firebase
if (typeof isFirebaseAvailable === 'function' && isFirebaseAvailable()) {
  console.log('✅ Firebase disponible');
  if (auth && auth.currentUser) {
    console.log('✅ Usuario autenticado:', auth.currentUser.email);
  } else {
    console.log('❌ Usuario NO autenticado');
  }
} else {
  console.log('❌ Firebase NO disponible');
}
```

---

## 💡 Si Nada Funciona

1. **Limpia el caché del navegador**
2. **Desinstala y reinstala la PWA**
3. **Verifica que tengas permisos de notificación**
4. **Revisa los logs de Firebase Functions**
5. **Verifica que las VAPID keys sean correctas**

