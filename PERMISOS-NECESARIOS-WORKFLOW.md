# 🔐 Permisos Necesarios para el Workflow

## ✅ Permisos en Settings > Actions > General

### 1. Actions Permissions (Lo que estás viendo)

**✅ Debe estar seleccionado:**
- **"Allow all actions and reusable workflows"** ← Esto es lo que tienes, está correcto ✅

**❌ NO debe estar:**
- "Disable actions" (deshabilitaría todo)
- "Allow IngNate2405 actions and reusable workflows" (muy restrictivo)

### 2. Workflow Permissions (Más abajo en la misma página)

Busca la sección **"Workflow permissions"** (debe estar más abajo en la misma página):

**✅ Debe estar seleccionado:**
- **"Read and write permissions"** (recomendado)
  - Permite que el workflow lea y escriba en el repositorio
  - Necesario para crear el archivo `onesignal-config-local.js` y hacer deploy

**❌ NO debe estar:**
- "Read repository contents and packages permissions" (solo lectura, no suficiente)

## ✅ Permisos en el Workflow (deploy.yml)

El workflow ya tiene los permisos correctos:

```yaml
permissions:
  contents: read      # Leer el código
  pages: write        # Escribir en GitHub Pages (hacer deploy)
  id-token: write     # Autenticación para GitHub Pages
```

**Estos permisos están correctos, no necesitas cambiarlos.**

## ✅ Permisos en Settings > Pages

1. Ve a **Settings** > **Pages**
2. Verifica que esté en **"GitHub Actions"** (no "Deploy from a branch")
3. Esto ya lo tienes configurado ✅

## 🔍 Verificar Permisos Completos

### Paso 1: Verificar Actions Permissions

1. Ve a **Settings** > **Actions** > **General**
2. Verifica que tengas:
   - ✅ **"Allow all actions and reusable workflows"** seleccionado
   - ✅ **"Read and write permissions"** en Workflow permissions

### Paso 2: Verificar que el Workflow Tiene Permisos

El archivo `.github/workflows/deploy.yml` debe tener:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**Ya lo tiene correcto** ✅

### Paso 3: Verificar Permisos del Repositorio

1. Ve a **Settings** > **General**
2. En la sección **"Features"**, verifica que:
   - ✅ **"Issues"** esté habilitado (si aplica)
   - ✅ **"Projects"** esté habilitado (si aplica)
   - ✅ **"Actions"** esté habilitado (debe estar)

## 🆘 Si el Workflow No se Ejecuta Automáticamente

### Verificar en Actions

1. Ve a la pestaña **Actions**
2. ¿Ves workflows ejecutándose cuando haces push?
   - **Sí**: El problema no es de permisos, es de configuración
   - **No**: Puede ser un problema de permisos

### Verificar Logs

1. Ve a **Actions** > **Deploy to GitHub Pages**
2. Haz clic en el último workflow ejecutado
3. Revisa los logs:
   - Si ves errores de permisos, compártelos
   - Si no hay errores, el problema es otro

## ✅ Resumen de Permisos Necesarios

1. **Settings > Actions > General:**
   - ✅ "Allow all actions and reusable workflows"
   - ✅ "Read and write permissions" en Workflow permissions

2. **Workflow (deploy.yml):**
   - ✅ `contents: read`
   - ✅ `pages: write`
   - ✅ `id-token: write`

3. **Settings > Pages:**
   - ✅ "GitHub Actions" como source

## 🔍 Si Sigue Sin Funcionar

Comparte:
1. ¿Qué ves en **Actions** cuando haces push? (¿aparece un workflow?)
2. ¿Hay algún error en los logs del workflow?
3. ¿Qué dice en **Settings > Actions > General** en "Workflow permissions"?

