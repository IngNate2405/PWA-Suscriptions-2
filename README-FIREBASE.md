# Configuración de Firebase

## Pasos para configurar Firebase

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa un nombre para tu proyecto (ej: "pwa-suscripciones")
4. Sigue los pasos del asistente
5. Desactiva Google Analytics si no lo necesitas (opcional)

### 2. Habilitar Authentication

1. En el menú lateral, ve a **Authentication**
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita **Email/Password**
4. Activa "Email/Password" y guarda

### 3. Crear base de datos Firestore

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (puedes cambiar las reglas después)
4. Elige una ubicación para tu base de datos (ej: us-central)
5. Haz clic en "Habilitar"

### 4. Configurar reglas de seguridad

1. En Firestore Database, ve a la pestaña "Reglas"
2. Reemplaza las reglas con estas (ajusta según tus necesidades):

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

3. Haz clic en "Publicar"

### 5. Obtener credenciales de Firebase

1. En el menú lateral, ve a **Configuración del proyecto** (ícono de engranaje)
2. Desplázate hacia abajo hasta "Tus aplicaciones"
3. Haz clic en el ícono de web (`</>`)
4. Ingresa un nombre para la app (ej: "PWA Suscripciones")
5. **NO** marques "También configura Firebase Hosting"
6. Haz clic en "Registrar app"
7. Copia los valores de configuración que aparecen

### 6. Configurar la aplicación

1. Abre el archivo `firebase-config.js` en tu proyecto
2. Reemplaza los valores con los de tu proyecto Firebase:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 7. Probar la configuración

1. Abre `login.html` en tu navegador
2. Crea una cuenta nueva
3. Inicia sesión
4. Ve a `settings.html` y haz clic en "Migrar datos a la nube"
5. Verifica que los datos se migren correctamente

## Estructura de datos en Firestore

Los datos se guardan en la colección `users` con el siguiente formato:

```
users/
  {userId}/
    subscriptions: Array
    personas: Array
    mensajesEnviados: Object
    appVersion: String
    notificationPermission: String
    selectedYear: String
    migratedAt: Timestamp
    lastUpdated: Timestamp
```

## Funcionalidades

- ✅ Autenticación con email/contraseña
- ✅ Migración de datos desde localStorage
- ✅ Sincronización bidireccional
- ✅ Respaldo automático en localStorage
- ✅ Funciona sin conexión (usa localStorage como respaldo)

## Notas importantes

- Los datos se mantienen en localStorage como respaldo
- Si Firebase no está configurado, la app funciona normalmente con localStorage
- La migración NO elimina los datos locales, solo los copia a la nube
- Puedes usar la app sin cuenta (solo local) o con cuenta (sincronizado)

## Solución de problemas

### Error: "Firebase no está configurado"
- Verifica que `firebase-config.js` tenga los valores correctos
- Asegúrate de que los scripts de Firebase se carguen antes de `firebase-config.js`

### Error: "Permission denied"
- Verifica las reglas de seguridad en Firestore
- Asegúrate de estar autenticado

### Los datos no se sincronizan
- Verifica tu conexión a internet
- Revisa la consola del navegador para errores
- Asegúrate de estar autenticado


