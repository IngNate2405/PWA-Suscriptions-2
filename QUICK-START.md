# ⚡ Inicio Rápido: Push Notifications

## 🎯 Lo que necesitas hacer:

### 1️⃣ Instalar Node.js (si no lo tienes)
- Ve a: https://nodejs.org/
- Descarga e instala la versión LTS

### 2️⃣ Genera las VAPID Keys:

**Opción A - Generador HTML (Más Fácil):**
1. Abre `generate-vapid-keys.html` en tu navegador
2. Haz clic en "Generar VAPID Keys"
3. Copia las dos claves (Public Key y Private Key)

**Opción B - Si tienes Node.js:**
```bash
# Ir al directorio del proyecto
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main

# Instalar web-push
npm install -g web-push

# Generar VAPID keys
web-push generate-vapid-keys
```

### 3️⃣ Edita `functions/index.js`

Abre el archivo y reemplaza:

1. **Línea ~15:** Reemplaza `TU_VAPID_PUBLIC_KEY_AQUI` con tu Public Key
2. **Línea ~16:** Reemplaza `TU_VAPID_PRIVATE_KEY_AQUI` con tu Private Key  
3. **Línea ~20:** Reemplaza `tu-email@ejemplo.com` con tu email real

### 4️⃣ Configura Firebase:

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

### 5️⃣ ¡Listo! 🎉

Abre tu PWA, inicia sesión, y las notificaciones funcionarán incluso con el navegador cerrado.

---

## 📚 Documentación Completa

Para más detalles, lee: `setup-push-notifications-step-by-step.md`

---

## ❓ ¿Necesitas ayuda?

Si algo no funciona, revisa:
- `firebase functions:log` - Ver logs de errores
- Firebase Console > Firestore - Ver si se guardan las suscripciones
- Navegador > DevTools > Application > Service Workers - Ver si está registrado

