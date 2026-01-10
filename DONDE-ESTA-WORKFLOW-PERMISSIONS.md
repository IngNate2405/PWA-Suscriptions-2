# 📍 Dónde Está "Workflow Permissions"

## 🔍 Buscar la Sección "Workflow Permissions"

En la misma página que estás viendo (Settings > Actions > General), **haz scroll hacia abajo**.

Después de la sección "Artifact and log retention" (donde dice "90 days"), deberías ver otra sección llamada:

## ✅ "Workflow permissions"

Esta sección controla qué permisos tienen los workflows para leer y escribir en el repositorio.

### Debe estar configurado así:

**✅ Seleccionado:**
- **"Read and write permissions"** (recomendado)
  - Permite que el workflow lea y escriba en el repositorio
  - Necesario para crear el archivo `onesignal-config-local.js` y hacer deploy

**❌ NO debe estar:**
- "Read repository contents and packages permissions" (solo lectura, no suficiente)

## 📝 Pasos para Verificarlo

1. En la página que estás viendo (Settings > Actions > General)
2. **Haz scroll hacia abajo** (pasa la sección "Artifact and log retention")
3. Busca la sección **"Workflow permissions"**
4. Verifica que esté en **"Read and write permissions"**
5. Si no lo está, cámbialo y haz clic en **"Save"**

## 🆘 Si No Ves la Sección

Si no ves la sección "Workflow permissions", puede ser porque:
- Está más abajo (haz más scroll)
- O tu cuenta/organización tiene una configuración diferente

En ese caso, el workflow debería funcionar con los permisos que ya tiene definidos en el archivo YAML.

## ✅ Verificación Final

Una vez que verifiques/configure "Workflow permissions" en "Read and write permissions":
1. Haz un cambio pequeño en tu código
2. Haz commit y push
3. Ve a **Actions** - deberías ver el workflow ejecutándose automáticamente

