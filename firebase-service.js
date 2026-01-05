// Servicio para manejar operaciones de Firebase
// Este archivo maneja la sincronización entre Firebase y localStorage

class FirebaseService {
  constructor() {
    this.isOnline = isFirebaseAvailable();
    this.currentUser = null;
    this.syncInProgress = false;
  }

  // ========== AUTENTICACIÓN ==========

  async signUp(email, password) {
    if (!this.isOnline) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      console.log('✅ Usuario registrado:', this.currentUser.email);
      return this.currentUser;
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    if (!this.isOnline) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      console.log('✅ Usuario autenticado:', this.currentUser.email);
      return this.currentUser;
    } catch (error) {
      console.error('❌ Error al autenticar usuario:', error);
      throw error;
    }
  }

  async signOut() {
    if (!this.isOnline) {
      return;
    }

    try {
      await auth.signOut();
      this.currentUser = null;
      console.log('✅ Usuario desconectado');
    } catch (error) {
      console.error('❌ Error al desconectar usuario:', error);
      throw error;
    }
  }

  getCurrentUser() {
    if (!this.isOnline) {
      return null;
    }
    return auth.currentUser;
  }

  onAuthStateChanged(callback) {
    if (!this.isOnline) {
      return () => {};
    }
    return auth.onAuthStateChanged(callback);
  }

  // ========== MIGRACIÓN DE DATOS ==========

  async migrateToFirebase() {
    if (!this.isOnline) {
      throw new Error('Firebase no está configurado');
    }

    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Debes estar autenticado para migrar datos');
    }

    if (this.syncInProgress) {
      throw new Error('Ya hay una migración en progreso');
    }

    this.syncInProgress = true;

    try {
      const userId = user.uid;
      const userRef = db.collection('users').doc(userId);

      // Obtener todos los datos de localStorage
      const dataToMigrate = {
        subscriptions: JSON.parse(localStorage.getItem('subscriptions') || '[]'),
        personas: JSON.parse(localStorage.getItem('personas') || '[]'),
        mensajesEnviados: JSON.parse(localStorage.getItem('mensajesEnviados') || '{}'),
        appVersion: localStorage.getItem('appVersion') || '1.0.45',
        notificationPermission: localStorage.getItem('notificationPermission') || 'default',
        selectedYear: localStorage.getItem('selectedYear') || new Date().getFullYear().toString(),
        migratedAt: firebase.firestore.FieldValue.serverTimestamp(),
        migratedFrom: 'localStorage'
      };

      // Guardar en Firestore
      await userRef.set(dataToMigrate, { merge: true });

      // Marcar que los datos están en la nube
      localStorage.setItem('dataSource', 'firebase');
      localStorage.setItem('firebaseUserId', userId);

      console.log('✅ Datos migrados a Firebase correctamente');
      this.syncInProgress = false;
      return true;
    } catch (error) {
      console.error('❌ Error al migrar datos:', error);
      this.syncInProgress = false;
      throw error;
    }
  }

  // ========== LECTURA DE DATOS ==========

  async loadFromFirebase() {
    if (!this.isOnline) {
      return false;
    }

    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }

    try {
      const userId = user.uid;
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
        
        // Cargar datos en localStorage (para compatibilidad)
        if (data.subscriptions) {
          localStorage.setItem('subscriptions', JSON.stringify(data.subscriptions));
        }
        if (data.personas) {
          localStorage.setItem('personas', JSON.stringify(data.personas));
        }
        if (data.mensajesEnviados) {
          localStorage.setItem('mensajesEnviados', JSON.stringify(data.mensajesEnviados));
        }
        if (data.appVersion) {
          localStorage.setItem('appVersion', data.appVersion);
        }
        if (data.notificationPermission) {
          localStorage.setItem('notificationPermission', data.notificationPermission);
        }
        if (data.selectedYear) {
          localStorage.setItem('selectedYear', data.selectedYear);
        }

        localStorage.setItem('dataSource', 'firebase');
        console.log('✅ Datos cargados desde Firebase');
        return true;
      } else {
        console.log('⚠️ No hay datos en Firebase para este usuario');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al cargar datos desde Firebase:', error);
      return false;
    }
  }

  // ========== GUARDAR DATOS ==========

  async saveToFirebase(dataType, data) {
    if (!this.isOnline) {
      // Si Firebase no está disponible, guardar solo en localStorage
      if (dataType === 'subscriptions') {
        localStorage.setItem('subscriptions', JSON.stringify(data));
      } else if (dataType === 'personas') {
        localStorage.setItem('personas', JSON.stringify(data));
      } else if (dataType === 'mensajesEnviados') {
        localStorage.setItem('mensajesEnviados', JSON.stringify(data));
      }
      return false;
    }

    const user = this.getCurrentUser();
    if (!user) {
      // Si no hay usuario, guardar solo en localStorage
      if (dataType === 'subscriptions') {
        localStorage.setItem('subscriptions', JSON.stringify(data));
      } else if (dataType === 'personas') {
        localStorage.setItem('personas', JSON.stringify(data));
      } else if (dataType === 'mensajesEnviados') {
        localStorage.setItem('mensajesEnviados', JSON.stringify(data));
      }
      return false;
    }

    try {
      const userId = user.uid;
      const userRef = db.collection('users').doc(userId);
      
      const updateData = {
        [dataType]: data,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };

      await userRef.set(updateData, { merge: true });
      console.log(`✅ ${dataType} guardado en Firebase`);
      return true;
    } catch (error) {
      console.error(`❌ Error al guardar ${dataType} en Firebase:`, error);
      // Guardar en localStorage como respaldo
      if (dataType === 'subscriptions') {
        localStorage.setItem('subscriptions', JSON.stringify(data));
      } else if (dataType === 'personas') {
        localStorage.setItem('personas', JSON.stringify(data));
      } else if (dataType === 'mensajesEnviados') {
        localStorage.setItem('mensajesEnviados', JSON.stringify(data));
      }
      return false;
    }
  }

  // ========== SINCRONIZACIÓN AUTOMÁTICA ==========

  async syncToFirebase() {
    if (!this.isOnline) {
      return false;
    }

    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }

    // Solo sincronizar si los datos están en Firebase
    if (localStorage.getItem('dataSource') !== 'firebase') {
      return false;
    }

    try {
      const userId = user.uid;
      const userRef = db.collection('users').doc(userId);

      const dataToSync = {
        subscriptions: JSON.parse(localStorage.getItem('subscriptions') || '[]'),
        personas: JSON.parse(localStorage.getItem('personas') || '[]'),
        mensajesEnviados: JSON.parse(localStorage.getItem('mensajesEnviados') || '{}'),
        appVersion: localStorage.getItem('appVersion') || '1.0.45',
        notificationPermission: localStorage.getItem('notificationPermission') || 'default',
        selectedYear: localStorage.getItem('selectedYear') || new Date().getFullYear().toString(),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };

      await userRef.set(dataToSync, { merge: true });
      console.log('✅ Datos sincronizados con Firebase');
      return true;
    } catch (error) {
      console.error('❌ Error al sincronizar con Firebase:', error);
      return false;
    }
  }

  // ========== LISTENER EN TIEMPO REAL ==========

  setupRealtimeListener(callback) {
    if (!this.isOnline) {
      return () => {};
    }

    const user = this.getCurrentUser();
    if (!user) {
      return () => {};
    }

    const userId = user.uid;
    const userRef = db.collection('users').doc(userId);

    return userRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        callback(data);
      }
    }, (error) => {
      console.error('❌ Error en listener de Firebase:', error);
    });
  }
}

// Instancia global del servicio
const firebaseService = new FirebaseService();

