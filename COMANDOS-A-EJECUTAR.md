# 📋 Comandos a Ejecutar (Copia y Pega)

## Paso 1: Generar VAPID Keys

**Opción A - Generador HTML Local (Recomendado):**
1. Abre el archivo `generate-vapid-keys.html` en tu navegador
2. Haz clic en "Generar VAPID Keys"
3. Copia las dos claves

**Opción B - Si tienes Node.js:**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

---

## Paso 2: Editar functions/index.js

Abre el archivo y reemplaza:
- Línea 16: `TU_VAPID_PUBLIC_KEY_AQUI` → Tu Public Key
- Línea 17: `TU_VAPID_PRIVATE_KEY_AQUI` → Tu Private Key  
- Línea 22: `tu-email@ejemplo.com` → Tu email real

---

## Paso 3: Instalar Firebase CLI (si no lo tienes)

```bash
npm install -g firebase-tools
```

---

## Paso 4: Iniciar Sesión en Firebase

```bash
firebase login
```

---

## Paso 5: Inicializar Functions

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
firebase init functions
```

**Selecciona:**
- JavaScript (Enter)
- No a ESLint (opcional)
- Yes a instalar dependencias

---

## Paso 6: Instalar Dependencias (si no se instalaron)

```bash
cd functions
npm install
cd ..
```

---

## Paso 7: Deploy

```bash
firebase deploy --only functions
```

---

## ✅ ¡Listo!

Las notificaciones ahora funcionarán incluso con el navegador cerrado.

---

## 🔍 Verificar Logs

```bash
firebase functions:log
```

