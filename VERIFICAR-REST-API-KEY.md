# 🔑 Verificar REST API Key de OneSignal

## ❌ Problema

Estás registrado en OneSignal pero las notificaciones no llegan cuando la app está cerrada.

## 🔍 Verificación del REST API Key

### Paso 1: Verificar en GitHub Secrets

1. Ve a tu repositorio: `https://github.com/IngNate2405/SubsNatesApps`
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Busca `ONESIGNAL_REST_API_KEY`
4. **¿Existe?**
   - **Sí**: Continúa con el paso 2
   - **No**: Necesitas crearlo

### Paso 2: Obtener tu REST API Key de OneSignal

1. Ve a https://dashboard.onesignal.com/
2. Selecciona tu app
3. Ve a **Settings** → **Keys & IDs**
4. Busca **REST API Key**
5. **Copia el valor** (algo como: `ODUxYz...`)

### Paso 3: Configurar en GitHub Secrets

1. Ve a GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Si NO existe `ONESIGNAL_REST_API_KEY`:
   - Haz clic en **"New repository secret"**
   - Nombre: `ONESIGNAL_REST_API_KEY`
   - Valor: Pega tu REST API Key de OneSignal
   - Haz clic en **"Add secret"**

3. Si YA existe:
   - Haz clic en **"Update"**
   - Verifica que el valor sea correcto
   - Guarda

### Paso 4: Verificar que el Workflow Cree el Archivo

1. Ve a tu repositorio → **Actions**
2. Busca el último workflow ejecutado
3. Haz clic en él
4. Busca el paso **"Create onesignal-config-local.js"**
5. **¿Dice "✅ Archivo onesignal-config-local.js creado"?**
   - **Sí**: El workflow está funcionando
   - **No**: Hay un problema con el workflow

### Paso 5: Verificar en la App

**Después del deployment:**

1. Recarga la app completamente
2. Abre la consola del navegador (si puedes)
3. Guarda una suscripción con notificaciones
4. Busca en la consola:
   - `✅ REST API Key encontrado: ...`
   - `📬 Programando notificaciones con OneSignal REST API...`
   - `✅ Player ID obtenido: ...`
   - `✅ Notificación programada enviada a OneSignal`

**Si ves `❌ REST API Key no configurado`:**
- El secret no está configurado o el workflow no lo está creando
- Sigue los pasos de arriba

## 🐛 Problemas Comunes

### Problema 1: "REST API Key no configurado"

**Causa:** El secret no está en GitHub o el workflow no lo está usando

**Solución:**
1. Verifica que `ONESIGNAL_REST_API_KEY` exista en GitHub Secrets
2. Verifica que el workflow tenga el paso "Create onesignal-config-local.js"
3. Espera a que el workflow termine
4. Recarga la app

### Problema 2: "Player ID no obtenido"

**Causa:** OneSignal no está inicializado cuando se intenta programar

**Solución:**
1. Asegúrate de estar suscrito en la PWA
2. Espera unos segundos después de suscribirte
3. Guarda la suscripción de nuevo

### Problema 3: "Notificación omitida (muy lejana)"

**Causa:** La notificación está programada para más de 1 hora en el futuro

**Solución:**
- Configura una hora de notificación más cercana (dentro de 1 hora)
- O espera a que la hora se acerque

## ✅ Verificación Final

**Para verificar que todo funciona:**

1. **REST API Key configurado en GitHub Secrets** ✅
2. **Workflow crea onesignal-config-local.js** ✅
3. **En la consola ves "✅ REST API Key encontrado"** ✅
4. **Al guardar suscripción ves "✅ Notificación programada enviada a OneSignal"** ✅
5. **En OneSignal Dashboard → Messages → History ves la notificación programada** ✅

## 📝 Código de Verificación Rápida

**Ejecuta esto en la consola después de guardar una suscripción:**

```javascript
// Verificar REST API Key
console.log('REST API Key:', ONESIGNAL_CONFIG?.restApiKey ? '✅ Configurado' : '❌ No configurado');

// Verificar notificaciones programadas
const scheduled = JSON.parse(localStorage.getItem('onesignalScheduled') || '[]');
console.log('Notificaciones programadas:', scheduled.length);
scheduled.forEach(n => {
  console.log(`  - ${n.subscriptionName}: ${n.notificationDate} (enviada: ${n.sent})`);
});

// Verificar Player ID
if (typeof OneSignal !== 'undefined' && OneSignal.User) {
  OneSignal.User.PushSubscription.id.then(id => {
    console.log('✅ Player ID:', id);
  }).catch(e => {
    console.error('❌ Error:', e);
  });
}
```

