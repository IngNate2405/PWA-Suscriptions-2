# 🔄 Cómo Funciona el Workflow de GitHub Actions

## ✅ Ejecución Automática

Una vez que crees el workflow en GitHub, **se ejecutará automáticamente** en cada push a la rama `main`. **NO necesitas ejecutarlo manualmente**.

### ¿Cuándo se ejecuta automáticamente?

1. **Cada vez que haces push a `main`**:
   - Haces cambios en tu código
   - Haces `git push origin main`
   - El workflow se ejecuta automáticamente
   - Crea el archivo `onesignal-config-local.js` con tu REST API Key
   - Despliega a GitHub Pages

2. **También puedes ejecutarlo manualmente** (opcional):
   - Ve a la pestaña **Actions** en GitHub
   - Selecciona **"Deploy to GitHub Pages"**
   - Haz clic en **"Run workflow"**
   - Útil si quieres redeployar sin hacer cambios

## 📋 Configuración del Workflow

El workflow está configurado para ejecutarse en:
- **Push a `main`**: Automático
- **Workflow dispatch**: Manual (opcional)

## 🔍 Verificar que Funciona

1. Haz un cambio pequeño en tu código
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "Test workflow"
   git push origin main
   ```
3. Ve a la pestaña **Actions** en GitHub
4. Deberías ver el workflow ejecutándose automáticamente
5. Espera a que termine (1-2 minutos)
6. Tu sitio se actualizará automáticamente

## ⚠️ Importante

- El workflow **NO** se ejecuta si no está creado en GitHub
- Una vez creado, se ejecuta automáticamente en cada push
- No necesitas hacer nada manual después de crearlo

## 🆘 Si el Workflow No se Ejecuta

1. Verifica que el archivo `.github/workflows/deploy.yml` existe en GitHub
2. Verifica que estás haciendo push a la rama `main`
3. Revisa la pestaña **Actions** para ver si hay errores
4. Verifica que GitHub Pages esté configurado para usar **GitHub Actions**

