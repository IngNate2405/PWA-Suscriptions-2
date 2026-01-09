# 🔧 Instrucciones: Generar VAPID Keys con Node.js

## 🎯 Opción 1: Script Automático (RECOMENDADO)

### Paso 1: Instalar Node.js (si no lo tienes)

**macOS con Homebrew:**
```bash
brew install node
```

**O descarga desde:**
- https://nodejs.org/
- Instala la versión LTS

### Paso 2: Ejecutar el script

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
bash install-and-generate.sh
```

El script:
- ✅ Verifica que Node.js esté instalado
- ✅ Instala web-push automáticamente
- ✅ Genera las VAPID keys
- ✅ Te pregunta si quieres configurarlas automáticamente en `functions/index.js`
- ✅ Guarda las claves en un archivo de respaldo

---

## 🎯 Opción 2: Manual

### Paso 1: Instalar Node.js
Igual que la Opción 1

### Paso 2: Instalar web-push

```bash
cd /Users/rutgiron/Downloads/PWA-Suscriptions-2-main
npm install web-push
```

### Paso 3: Generar y configurar keys

```bash
node generate-and-setup-vapid.js
```

El script te preguntará:
- ¿Quieres configurar automáticamente? (s/n)
- Tu email para VAPID

---

## 🎯 Opción 3: Comandos Manuales

Si prefieres hacerlo todo manualmente:

```bash
# 1. Instalar web-push globalmente
npm install -g web-push

# 2. Generar las claves
web-push generate-vapid-keys

# 3. Copia las claves que aparecen

# 4. Edita functions/index.js manualmente:
#    - Línea 16: Reemplaza TU_VAPID_PUBLIC_KEY_AQUI
#    - Línea 17: Reemplaza TU_VAPID_PRIVATE_KEY_AQUI
#    - Línea 22: Reemplaza tu-email@ejemplo.com
```

---

## ✅ Después de Generar las Claves

1. **Verifica** que las claves estén en `functions/index.js`
2. **Ejecuta:** `firebase login`
3. **Ejecuta:** `firebase init functions`
4. **Ejecuta:** `cd functions && npm install && cd ..`
5. **Ejecuta:** `firebase deploy --only functions`

---

## 🔍 Verificar Instalación

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar web-push (después de instalar)
npm list -g web-push
```

---

## 🐛 Problemas Comunes

### Error: "node: command not found"
- Node.js no está instalado o no está en el PATH
- Instala Node.js desde https://nodejs.org/

### Error: "npm: command not found"
- npm viene con Node.js, reinstala Node.js

### Error: "Permission denied" al instalar globalmente
- En macOS/Linux, usa `sudo`: `sudo npm install -g web-push`
- O instala localmente: `npm install web-push` (sin -g)

---

## 📝 Notas

- Las claves se guardan en `vapid-keys-backup.txt` (no se sube a GitHub)
- Guarda este archivo en un lugar seguro
- Las claves son únicas, no las compartas públicamente

