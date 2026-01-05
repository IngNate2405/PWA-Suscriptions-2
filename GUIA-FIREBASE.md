# 🔥 Guía Completa: Configurar Firebase para tu PWA

Esta guía te llevará paso a paso para configurar Firebase y poder sincronizar tus datos en la nube.

---

## 📋 Paso 1: Crear un Proyecto en Firebase

1. **Ve a Firebase Console**
   - Abre tu navegador y ve a: https://console.firebase.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crear nuevo proyecto**
   - Haz clic en el botón **"Agregar proyecto"** o **"Crear un proyecto"**
   - Ingresa un nombre para tu proyecto (ej: `pwa-suscripciones` o `mi-app-suscripciones`)
   - Haz clic en **"Continuar"**

3. **Configurar Google Analytics (Opcional)**
   - Firebase te preguntará si quieres habilitar Google Analytics
   - Puedes elegir **"Habilitar"** o **"Deshabilitar"** (recomiendo deshabilitarlo si no lo necesitas)
   - Si eliges habilitarlo, selecciona una cuenta de Analytics o crea una nueva
   - Haz clic en **"Crear proyecto"**

4. **Esperar a que se cree el proyecto**
   - Firebase creará tu proyecto (esto puede tardar unos segundos)
   - Cuando termine, haz clic en **"Continuar"**

---

## 🔐 Paso 2: Habilitar Authentication (Autenticación)

1. **Ir a Authentication**
   - En el menú lateral izquierdo, busca y haz clic en **"Authentication"** (o "Autenticación")
   - Si es la primera vez, haz clic en **"Comenzar"**

2. **Habilitar Email/Password**
   - En la parte superior, haz clic en la pestaña **"Sign-in method"** (Métodos de inicio de sesión)
   - Verás una lista de proveedores. Busca **"Correo electrónico/Contraseña"** o **"Email/Password"**
   - Haz clic en **"Correo electrónico/Contraseña"**

3. **Activar el método**
   - Activa el toggle que dice **"Habilitar"** o **"Enable"**
   - Deja las opciones por defecto (no necesitas cambiar nada más)
   - Haz clic en **"Guardar"**

✅ **Listo**: Ya tienes autenticación habilitada

---

## 💾 Paso 3: Crear Base de Datos Firestore

1. **Ir a Firestore Database**
   - En el menú lateral izquierdo, busca **"Firestore Database"** (Base de datos de Firestore)
   - Haz clic en **"Crear base de datos"**

2. **Elegir modo de inicio**
   - Firebase te preguntará en qué modo quieres empezar
   - Selecciona **"Comenzar en modo de prueba"** (Start in test mode)
   - ⚠️ **Importante**: Después configuraremos las reglas de seguridad
   - Haz clic en **"Siguiente"**

3. **Elegir ubicación**
   - Selecciona una ubicación para tu base de datos
   - Recomendación: Elige la más cercana a tu ubicación (ej: `us-central` para América, `europe-west` para Europa)
   - Haz clic en **"Habilitar"**

4. **Esperar a que se cree**
   - Firebase creará tu base de datos (puede tardar unos minutos)
   - Cuando termine, verás la interfaz de Firestore

---

## 🔒 Paso 4: Configurar Reglas de Seguridad

1. **Ir a la pestaña Reglas**
   - En Firestore Database, haz clic en la pestaña **"Reglas"** (Rules) en la parte superior

2. **Reemplazar las reglas**
   - Verás un editor de código con reglas por defecto
   - **Borra todo** el contenido actual
   - **Copia y pega** estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo el usuario autenticado puede leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. **Publicar las reglas**
   - Haz clic en el botón **"Publicar"** (Publish)
   - Espera a que se publiquen (aparecerá un mensaje de confirmación)

✅ **Listo**: Tus datos están protegidos. Solo tú puedes acceder a tus propios datos.

---

## 📱 Paso 5: Obtener las Credenciales de Firebase

1. **Ir a Configuración del Proyecto**
   - En el menú lateral izquierdo, haz clic en el **ícono de engranaje** ⚙️
   - Selecciona **"Configuración del proyecto"** (Project settings)

2. **Desplazarse a "Tus aplicaciones"**
   - Desplázate hacia abajo hasta encontrar la sección **"Tus aplicaciones"** (Your apps)
   - Verás varios íconos (iOS, Android, Web, etc.)

3. **Agregar aplicación web**
   - Haz clic en el ícono de **Web** (`</>`)
   - Ingresa un nombre para tu app (ej: `PWA Suscripciones`)
   - ⚠️ **NO marques** la casilla "También configura Firebase Hosting"
   - Haz clic en **"Registrar app"**

4. **Copiar las credenciales**
   - Firebase te mostrará un código de configuración
   - Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

   - **Copia estos valores** (los necesitarás en el siguiente paso)

---

## ⚙️ Paso 6: Configurar tu Aplicación

1. **Abrir el archivo de configuración**
   - En tu proyecto, abre el archivo `firebase-config.js`
   - Está en la raíz del proyecto

2. **Reemplazar los valores**
   - Verás valores como `"TU_API_KEY"` y `"TU_PROJECT_ID"`
   - Reemplázalos con los valores que copiaste en el paso anterior:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← Pega tu apiKey aquí
  authDomain: "tu-proyecto.firebaseapp.com",      // ← Pega tu authDomain aquí
  projectId: "tu-proyecto-id",                    // ← Pega tu projectId aquí
  storageBucket: "tu-proyecto.appspot.com",       // ← Pega tu storageBucket aquí
  messagingSenderId: "123456789012",              // ← Pega tu messagingSenderId aquí
  appId: "1:123456789012:web:abcdef1234567890"   // ← Pega tu appId aquí
};
```

3. **Guardar el archivo**
   - Guarda el archivo `firebase-config.js`

✅ **¡Listo!** Firebase está configurado en tu aplicación.

---

## 🧪 Paso 7: Probar la Configuración

1. **Abrir la aplicación**
   - Abre `login.html` en tu navegador
   - Deberías ver la pantalla de login

2. **Crear una cuenta**
   - Haz clic en "Regístrate aquí"
   - Ingresa un email y contraseña (mínimo 6 caracteres)
   - Haz clic en "Crear Cuenta"
   - Si todo está bien, te redirigirá a la app principal

3. **Migrar tus datos**
   - Ve a `settings.html`
   - Busca la sección **"Sincronización en la Nube"**
   - Deberías ver el estado "Conectado" en verde
   - Haz clic en **"Migrar datos a la nube"**
   - Espera a que termine (verás un mensaje de éxito)

4. **Verificar en Firebase**
   - Vuelve a Firebase Console
   - Ve a **Firestore Database**
   - Deberías ver una colección llamada `users`
   - Dentro verás un documento con tu `userId`
   - Al hacer clic, verás todos tus datos (subscriptions, personas, etc.)

✅ **¡Perfecto!** Tus datos están en la nube.

---

## 🔍 Verificación Final

Para asegurarte de que todo funciona:

1. ✅ Puedes crear una cuenta en `login.html`
2. ✅ Puedes iniciar sesión
3. ✅ Puedes migrar datos desde `settings.html`
4. ✅ Los datos aparecen en Firestore Database
5. ✅ Puedes sincronizar datos manualmente

---

## ❓ Solución de Problemas

### Error: "Firebase no está configurado"
- Verifica que `firebase-config.js` tenga todos los valores correctos
- Asegúrate de que no haya espacios extra o comillas mal cerradas
- Verifica que los scripts de Firebase se carguen antes de `firebase-config.js`

### Error: "Permission denied" al migrar
- Ve a Firestore Database → Reglas
- Verifica que las reglas sean exactamente las que te di
- Asegúrate de hacer clic en "Publicar"

### No puedo crear cuenta
- Verifica que Authentication esté habilitado
- Asegúrate de que Email/Password esté activado
- La contraseña debe tener al menos 6 caracteres

### Los datos no aparecen en Firestore
- Espera unos segundos (puede haber un pequeño retraso)
- Recarga la página de Firestore
- Verifica que la migración haya terminado correctamente

---

## 📝 Notas Importantes

- 🔒 **Seguridad**: Tus datos están protegidos. Solo tú puedes acceder a ellos con tu cuenta.
- 💾 **Respaldo**: Los datos se mantienen en localStorage como respaldo.
- 🔄 **Sincronización**: Puedes sincronizar manualmente cuando quieras desde `settings.html`.
- 📱 **Multi-dispositivo**: Puedes acceder desde cualquier dispositivo con tu cuenta.

---

## 🎉 ¡Listo!

Ya tienes Firebase configurado y funcionando. Ahora puedes:
- Acceder desde cualquier dispositivo
- Sincronizar tus datos automáticamente
- Tener un respaldo en la nube

Si tienes algún problema, revisa la sección de "Solución de Problemas" o verifica la consola del navegador (F12) para ver errores.

