# 🔑 Configurar VAPID Keys - Guía Rápida

## ⚠️ Problema
Estás recibiendo "Timeout" porque las VAPID keys no están configuradas.

## ✅ Solución Rápida (5 minutos)

### Paso 1: Generar VAPID Keys

**Opción A: Usar el generador HTML (MÁS FÁCIL)**

1. Abre el archivo `generate-vapid-keys.html` en tu navegador
2. Haz clic en el botón "Generar VAPID Keys"
3. Copia las dos claves que aparecen:
   - **Public Key** (empieza con `B...`)
   - **Private Key** (empieza con `...`)

**Opción B: Si tienes Node.js instalado**

```bash
npm install -g web-push
web-push generate-vapid-keys
```

### Paso 2: Configurar en functions/index.js

1. Abre el archivo `functions/index.js`
2. Busca estas líneas (alrededor de la línea 16-17):
   ```javascript
   const vapidKeys = {
     publicKey: 'TU_VAPID_PUBLIC_KEY_AQUI',
     privateKey: 'TU_VAPID_PRIVATE_KEY_AQUI'
   };
   ```
3. Reemplaza:
   - `'TU_VAPID_PUBLIC_KEY_AQUI'` → Tu **Public Key** (entre comillas)
   - `'TU_VAPID_PRIVATE_KEY_AQUI'` → Tu **Private Key** (entre comillas)
4. También cambia el email (línea 22):
   ```javascript
   'mailto:tu-email@ejemplo.com'  // Cambia por tu email real
   ```

### Paso 3: Desplegar Firebase Functions

**IMPORTANTE:** Necesitas desplegar las functions para que funcionen.

```bash
# 1. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Iniciar sesión
firebase login

# 3. Instalar dependencias de functions
cd functions
npm install
cd ..

# 4. Desplegar
firebase deploy --only functions
```

### Paso 4: Verificar

1. Abre tu PWA
2. Ve a Configuración > Notificaciones
3. Haz clic en "Verificar" - debería funcionar ahora
4. Haz clic en "Suscribirse" - debería funcionar sin timeout

---

## 🔍 Verificar que las keys están configuradas

Después de desplegar, verifica en Firebase Console:
1. Ve a Firestore Database
2. Busca la colección `appConfig`
3. Debe haber un documento `pushConfig` con `vapidPublicKey`

---

## ❓ ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que las keys estén entre comillas en `functions/index.js`
2. Verifica que el email esté en formato `mailto:tu-email@ejemplo.com`
3. Asegúrate de haber desplegado las functions con `firebase deploy --only functions`

