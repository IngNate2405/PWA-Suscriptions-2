# 🚀 Generar VAPID Keys - Instrucciones Rápidas

## ⚡ Método Más Fácil (Recomendado)

### 1. Abre tu terminal y ejecuta:

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
bash install-and-generate.sh
```

Este script:
- ✅ Verifica que Node.js esté instalado
- ✅ Instala web-push automáticamente
- ✅ Genera las VAPID keys
- ✅ Te pregunta si quieres configurarlas automáticamente
- ✅ Guarda las claves en un archivo de respaldo

---

## 📋 Si no tienes Node.js instalado:

### macOS:
```bash
# Opción 1: Con Homebrew
brew install node

# Opción 2: Descarga desde
# https://nodejs.org/
# Instala la versión LTS
```

### Después de instalar Node.js:
```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
bash install-and-generate.sh
```

---

## 🔧 Método Alternativo (Manual)

Si prefieres hacerlo paso a paso:

```bash
# 1. Instalar web-push
npm install web-push

# 2. Generar y configurar keys
node generate-and-setup-vapid.js
```

---

## ✅ Después de Generar las Claves

1. **Verifica** que las claves estén en `functions/index.js`
2. **Ejecuta:** `firebase login`
3. **Ejecuta:** `firebase init functions`
4. **Ejecuta:** `cd functions && npm install && cd ..`
5. **Ejecuta:** `firebase deploy --only functions`

---

## 📚 Más Información

- `INSTRUCCIONES-NODEJS.md` - Guía detallada
- `QUICK-START.md` - Inicio rápido completo

---

**💡 Tip:** El script guarda las claves en `vapid-keys-backup.txt` por si las necesitas después.

