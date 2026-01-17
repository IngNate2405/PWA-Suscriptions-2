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
      // Guardar backup de datos locales antes de migrar
      // Solo si aún no hay un backup (primera vez que se migra)
      if (!localStorage.getItem('localDataBackup')) {
        this.saveLocalBackup();
      }

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

  // ========== BACKUP Y RESTAURACIÓN DE DATOS LOCALES ==========

  // Guardar backup de datos locales antes de cargar desde Firebase
  saveLocalBackup() {
    const backup = {
      subscriptions: localStorage.getItem('subscriptions') || '[]',
      personas: localStorage.getItem('personas') || '[]',
      mensajesEnviados: localStorage.getItem('mensajesEnviados') || '{}',
      appVersion: localStorage.getItem('appVersion') || '1.0.45',
      notificationPermission: localStorage.getItem('notificationPermission') || 'default',
      selectedYear: localStorage.getItem('selectedYear') || new Date().getFullYear().toString(),
      timestamp: Date.now()
    };
    localStorage.setItem('localDataBackup', JSON.stringify(backup));
    console.log('💾 Backup de datos locales guardado');
  }

  // Restaurar datos locales desde el backup
  restoreLocalBackup() {
    const backupStr = localStorage.getItem('localDataBackup');
    if (!backupStr) {
      console.log('⚠️ No hay backup de datos locales para restaurar');
      return false;
    }

    try {
      const backup = JSON.parse(backupStr);
      
      // Limpiar primero todos los datos actuales (incluyendo los de Firebase)
      localStorage.removeItem('subscriptions');
      localStorage.removeItem('personas');
      localStorage.removeItem('mensajesEnviados');
      localStorage.removeItem('appVersion');
      localStorage.removeItem('notificationPermission');
      localStorage.removeItem('selectedYear');
      
      // Restaurar datos locales desde el backup
      if (backup.subscriptions !== undefined) {
        localStorage.setItem('subscriptions', backup.subscriptions);
      } else {
        localStorage.setItem('subscriptions', '[]');
      }
      if (backup.personas !== undefined) {
        localStorage.setItem('personas', backup.personas);
      } else {
        localStorage.setItem('personas', '[]');
      }
      if (backup.mensajesEnviados !== undefined) {
        localStorage.setItem('mensajesEnviados', backup.mensajesEnviados);
      } else {
        localStorage.setItem('mensajesEnviados', '{}');
      }
      if (backup.appVersion !== undefined) {
        localStorage.setItem('appVersion', backup.appVersion);
      }
      if (backup.notificationPermission !== undefined) {
        localStorage.setItem('notificationPermission', backup.notificationPermission);
      }
      if (backup.selectedYear !== undefined) {
        localStorage.setItem('selectedYear', backup.selectedYear);
      }

      // Limpiar el backup después de restaurar
      localStorage.removeItem('localDataBackup');
      localStorage.setItem('dataSource', 'localStorage');
      localStorage.removeItem('firebaseUserId');
      
      console.log('✅ Datos locales restaurados desde backup. Datos de Firebase eliminados.');
      return true;
    } catch (error) {
      console.error('❌ Error al restaurar backup:', error);
      return false;
    }
  }

  // Limpiar backup si existe
  clearLocalBackup() {
    localStorage.removeItem('localDataBackup');
    console.log('🗑️ Backup de datos locales eliminado');
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
      // Guardar backup de datos locales antes de cargar desde Firebase
      // Solo si aún no hay un backup (primera vez que se carga desde Firebase)
      if (!localStorage.getItem('localDataBackup')) {
        this.saveLocalBackup();
      }

      const userId = user.uid;
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
        
        // Hacer merge inteligente de suscripciones
        if (data.subscriptions) {
          const localSubs = JSON.parse(localStorage.getItem('subscriptions') || '[]');
          const mergedSubs = this.mergeSubscriptions(localSubs, data.subscriptions);
          localStorage.setItem('subscriptions', JSON.stringify(mergedSubs));
        }
        
        // Hacer merge inteligente de personas (importante para comprobantes y pagos)
        if (data.personas) {
          const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
          const mergedPersonas = this.mergePersonas(localPersonas, data.personas);
          localStorage.setItem('personas', JSON.stringify(mergedPersonas));
        }
        
        // Hacer merge de mensajes enviados
        if (data.mensajesEnviados) {
          const localMensajes = JSON.parse(localStorage.getItem('mensajesEnviados') || '{}');
          const mergedMensajes = { ...localMensajes, ...data.mensajesEnviados };
          localStorage.setItem('mensajesEnviados', JSON.stringify(mergedMensajes));
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
        console.log('✅ Datos cargados desde Firebase (merge inteligente aplicado)');
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

  // Merge inteligente de suscripciones
  mergeSubscriptions(local, remote) {
    const merged = [];
    const processedIds = new Set();

    // Primero agregar todas las suscripciones remotas
    remote.forEach(remoteSub => {
      const localSub = local.find(l => l.id === remoteSub.id);
      if (localSub) {
        // Si existe en ambos, usar la más reciente basándose en lastModified si existe
        const localTime = localSub.lastModified ? new Date(localSub.lastModified).getTime() : 0;
        const remoteTime = remoteSub.lastModified ? new Date(remoteSub.lastModified).getTime() : 0;
        
        if (remoteTime >= localTime) {
          merged.push(remoteSub);
        } else {
          merged.push(localSub);
        }
      } else {
        // Si solo existe en remoto, agregarlo
        merged.push(remoteSub);
      }
      processedIds.add(remoteSub.id);
    });

    // Agregar suscripciones locales que no están en remoto
    local.forEach(localSub => {
      if (!processedIds.has(localSub.id)) {
        merged.push(localSub);
      }
    });

    return merged;
  }

  // Merge inteligente de personas (preserva comprobantes y pagos)
  mergePersonas(local, remote) {
    const merged = [];
    const processedIds = new Set();

    // Primero agregar todas las personas remotas
    remote.forEach(remotePersona => {
      const localPersona = local.find(l => l.id === remotePersona.id);
      if (localPersona) {
        // Si existe en ambos, hacer merge inteligente
        const mergedPersona = this.mergePersonaData(localPersona, remotePersona);
        merged.push(mergedPersona);
      } else {
        // Si solo existe en remoto, agregarlo
        merged.push(remotePersona);
      }
      processedIds.add(remotePersona.id);
    });

    // Agregar personas locales que no están en remoto
    local.forEach(localPersona => {
      if (!processedIds.has(localPersona.id)) {
        merged.push(localPersona);
      }
    });

    return merged;
  }

  // Merge inteligente de datos de una persona específica
  mergePersonaData(local, remote) {
    // Determinar cuál es más reciente
    const localTime = local.lastModified ? new Date(local.lastModified).getTime() : 0;
    const remoteTime = remote.lastModified ? new Date(remote.lastModified).getTime() : 0;
    
    // Usar la más reciente como base
    const base = remoteTime >= localTime ? { ...remote } : { ...local };
    const other = remoteTime >= localTime ? local : remote;

    // Hacer merge de plataformas (preservar cambios de ambos)
    if (base.plataformas && other.plataformas) {
      base.plataformas = this.mergePlataformas(base.plataformas, other.plataformas);
    } else if (other.plataformas) {
      base.plataformas = other.plataformas;
    }

    // Hacer merge de comprobantes (combinar arrays únicos)
    if (base.comprobantes && other.comprobantes) {
      const allComprobantes = [...base.comprobantes, ...other.comprobantes];
      // Eliminar duplicados
      base.comprobantes = [...new Set(allComprobantes)];
    } else if (other.comprobantes) {
      base.comprobantes = other.comprobantes;
    }

    // Preservar descripción de comprobantes de la más reciente
    if (base.descripcionComprobantes || other.descripcionComprobantes) {
      base.descripcionComprobantes = base.descripcionComprobantes || other.descripcionComprobantes;
    }

    // Preservar nombre de la más reciente
    if (remoteTime >= localTime) {
      base.nombre = remote.nombre;
    } else {
      base.nombre = local.nombre;
    }

    return base;
  }

  // Merge inteligente de plataformas (preserva pagos de ambos)
  mergePlataformas(basePlataformas, otherPlataformas) {
    const merged = [];
    const processedNames = new Set();

    // Agregar plataformas de la base
    basePlataformas.forEach(platform => {
      const key = `${platform.nombre}_${platform.nombrePerfil || ''}`;
      const otherPlatform = otherPlataformas.find(op => 
        op.nombre === platform.nombre && 
        (op.nombrePerfil || '') === (platform.nombrePerfil || '')
      );

      if (otherPlatform) {
        // Hacer merge de pagos (combinar arrays)
        const mergedPlatform = { ...platform };
        if (platform.pagos && otherPlatform.pagos) {
          // Combinar pagos, eliminando duplicados basándose en mes o índice
          const allPagos = [...platform.pagos, ...otherPlatform.pagos];
          // Eliminar duplicados basándose en mes (si existe) o mantener todos si no hay mes
          const uniquePagos = [];
          const seenKeys = new Set();
          
          allPagos.forEach(pago => {
            const key = pago.mes || JSON.stringify(pago);
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              uniquePagos.push(pago);
            }
          });
          
          mergedPlatform.pagos = uniquePagos;
        } else if (otherPlatform.pagos) {
          mergedPlatform.pagos = otherPlatform.pagos;
        }

        // Preservar precio de la más reciente
        if (otherPlatform.precio !== undefined) {
          mergedPlatform.precio = otherPlatform.precio;
        }

        merged.push(mergedPlatform);
        processedNames.add(key);
      } else {
        merged.push(platform);
        processedNames.add(key);
      }
    });

    // Agregar plataformas de other que no están en base
    otherPlataformas.forEach(platform => {
      const key = `${platform.nombre}_${platform.nombrePerfil || ''}`;
      if (!processedNames.has(key)) {
        merged.push(platform);
      }
    });

    return merged;
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

      // Obtener datos actuales de Firebase para hacer merge
      const doc = await userRef.get();
      const remoteData = doc.exists ? doc.data() : {};

      // Obtener datos locales
      const localSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
      const localMensajes = JSON.parse(localStorage.getItem('mensajesEnviados') || '{}');

      // Hacer merge inteligente antes de enviar
      const mergedSubscriptions = remoteData.subscriptions 
        ? this.mergeSubscriptions(localSubscriptions, remoteData.subscriptions)
        : localSubscriptions;
      
      const mergedPersonas = remoteData.personas
        ? this.mergePersonas(localPersonas, remoteData.personas)
        : localPersonas;

      const mergedMensajes = remoteData.mensajesEnviados
        ? { ...remoteData.mensajesEnviados, ...localMensajes }
        : localMensajes;

      // Agregar timestamps a personas modificadas
      const personasWithTimestamps = mergedPersonas.map(persona => {
        // Verificar si esta persona fue modificada localmente
        const localPersona = localPersonas.find(p => p.id === persona.id);
        if (localPersona && localPersona.lastModified) {
          return {
            ...persona,
            lastModified: localPersona.lastModified,
            lastModifiedBy: 'local'
          };
        }
        return persona;
      });

      const dataToSync = {
        subscriptions: mergedSubscriptions,
        personas: personasWithTimestamps,
        mensajesEnviados: mergedMensajes,
        appVersion: localStorage.getItem('appVersion') || '1.0.45',
        notificationPermission: localStorage.getItem('notificationPermission') || 'default',
        selectedYear: localStorage.getItem('selectedYear') || new Date().getFullYear().toString(),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };

      await userRef.set(dataToSync, { merge: true });
      
      // Actualizar localStorage con los datos mergeados
      localStorage.setItem('subscriptions', JSON.stringify(mergedSubscriptions));
      localStorage.setItem('personas', JSON.stringify(personasWithTimestamps));
      localStorage.setItem('mensajesEnviados', JSON.stringify(mergedMensajes));
      
      console.log('✅ Datos sincronizados con Firebase (merge inteligente aplicado)');
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

