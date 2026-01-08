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
let storage = null;

// Función para inicializar Firebase
function initializeFirebase() {
  // Verificar que Firebase esté cargado
  if (typeof firebase === 'undefined') {
    console.warn('⚠️ Firebase SDK no está cargado. Verifica que los scripts de Firebase se carguen antes de firebase-config.js');
    return false;
  }

  // Verificar que la configuración tenga valores válidos (no placeholders)
  if (!firebaseConfig.apiKey || 
      !firebaseConfig.projectId || 
      firebaseConfig.apiKey === "TU_API_KEY" || 
      firebaseConfig.projectId === "TU_PROJECT_ID") {
    console.warn('⚠️ Firebase no configurado correctamente. Usando localStorage como respaldo.');
    return false;
  }

  try {
    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    firebaseInitialized = true;
    console.log('✅ Firebase inicializado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    return false;
  }
}

// Intentar inicializar Firebase
// Esperar a que Firebase SDK esté completamente cargado
(function initFirebaseWhenReady() {
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length === 0) {
    // Firebase está cargado y no hay apps inicializadas
    initializeFirebase();
  } else if (typeof firebase === 'undefined') {
    // Firebase aún no está cargado, esperar un poco más
    setTimeout(initFirebaseWhenReady, 50);
  }
})();

// Función para verificar si Firebase está disponible
function isFirebaseAvailable() {
  // Si aún no se ha intentado inicializar, intentarlo ahora
  if (!firebaseInitialized && typeof firebase !== 'undefined') {
    initializeFirebase();
  }
  return firebaseInitialized && db && auth && storage;
}


