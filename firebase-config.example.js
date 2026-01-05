// Configuración de Firebase - ARCHIVO DE EJEMPLO
// IMPORTANTE: Copia este archivo como firebase-config.js y reemplaza los valores
// Puedes obtenerlos desde: https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase solo si la configuración está completa
let firebaseInitialized = false;
let db = null;
let auth = null;

if (firebaseConfig.apiKey !== "TU_API_KEY" && firebaseConfig.projectId !== "TU_PROJECT_ID") {
  try {
    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    firebaseInitialized = true;
    console.log('✅ Firebase inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
  }
} else {
  console.warn('⚠️ Firebase no configurado. Usando localStorage como respaldo.');
}

// Función para verificar si Firebase está disponible
function isFirebaseAvailable() {
  return firebaseInitialized && db && auth;
}

