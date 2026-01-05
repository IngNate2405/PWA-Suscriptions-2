# 🚀 Guía de Configuración Inicial

Esta guía te ayudará a configurar el proyecto después de clonarlo desde GitHub.

## 📋 Pasos Rápidos

### 1. Clonar el Repositorio

```bash
git clone https://github.com/IngNate2405/PWA-Suscriptions-2.git
cd PWA-Suscriptions-2
```

### 2. Configurar Firebase

El archivo `firebase-config.js` no está en el repositorio por seguridad. Necesitas crearlo:

1. **Copia el archivo de ejemplo:**
   ```bash
   cp firebase-config.example.js firebase-config.js
   ```

2. **Obtén tus credenciales de Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto (o crea uno nuevo)
   - Ve a **Configuración del proyecto** (ícono de engranaje)
   - Desplázate a **"Tus aplicaciones"**
   - Haz clic en el ícono de **Web** (`</>`)
   - Copia los valores de configuración

3. **Edita `firebase-config.js`:**
   - Abre `firebase-config.js` en tu editor
   - Reemplaza los valores `TU_...` con tus credenciales reales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",                    // ← Pega tu apiKey
  authDomain: "tu-proyecto.firebaseapp.com",    // ← Pega tu authDomain
  projectId: "tu-proyecto-id",                  // ← Pega tu projectId
  storageBucket: "tu-proyecto.appspot.com",     // ← Pega tu storageBucket
  messagingSenderId: "123456789",               // ← Pega tu messagingSenderId
  appId: "1:123456789:web:abcdef..."            // ← Pega tu appId
};
```

### 3. Configurar Firebase (Primera vez)

Si es la primera vez que usas Firebase con este proyecto, sigue la guía completa:

👉 **Ver `GUIA-FIREBASE.md`** para los pasos detallados de configuración de Firebase.

### 4. Probar la Aplicación

1. Abre `index.html` en tu navegador
2. O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   ```
3. Abre `http://localhost:8000` en tu navegador

### 5. Crear una Cuenta

1. Abre `login.html`
2. Crea una cuenta nueva
3. Inicia sesión
4. Ve a `settings.html` y haz clic en **"Migrar datos a la nube"**

## ✅ Verificación

Para verificar que todo funciona:

- ✅ Puedes abrir `index.html` sin errores
- ✅ Puedes crear una cuenta en `login.html`
- ✅ Puedes iniciar sesión
- ✅ Puedes migrar datos desde `settings.html`

## 🔒 Seguridad

- **NUNCA** subas `firebase-config.js` a Git
- El archivo está en `.gitignore` para proteger tus credenciales
- Si accidentalmente lo subes, sigue los pasos en la sección de solución de problemas

## ❓ Solución de Problemas

### Error: "Firebase no está configurado"
- Verifica que `firebase-config.js` existe
- Verifica que tiene tus credenciales reales (no los valores `TU_...`)
- Abre la consola del navegador (F12) para ver errores específicos

### Error: "Permission denied"
- Verifica las reglas de seguridad en Firestore
- Asegúrate de estar autenticado

### No puedo crear cuenta
- Verifica que Authentication esté habilitado en Firebase
- Verifica que Email/Password esté activado

## 📚 Documentación Adicional

- `GUIA-FIREBASE.md` - Guía completa de configuración de Firebase
- `README-FIREBASE.md` - Documentación técnica de Firebase

