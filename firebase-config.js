// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Puedes obtenerlos desde: https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "AIzaSyBOJKuHva_eoyl9kjc1fkbjunjdD8hnOgI",
  authDomain: "suscripciones-nate.firebaseapp.com",
  projectId: "suscripciones-nate",
  storageBucket: "suscripciones-nate.firebasestorage.app",
  messagingSenderId: "953601412684",
  appId: "1:953601412684:web:35cbac6c954cea1682aee9"
};

// Inicializar Firebase solo si la configuración está completa
let firebaseInitialized = false;
let db = null;
let auth = null;

if (firebaseConfig.apiKey !== "AIzaSyBOJKuHva_eoyl9kjc1fkbjunjdD8hnOgI" && firebaseConfig.projectId !== "TU_PROJECT_ID") {
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


