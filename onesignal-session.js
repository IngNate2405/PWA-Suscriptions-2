// Sistema de sesión global para OneSignal
// Evita re-inicializaciones innecesarias entre navegaciones

class OneSignalSession {
  constructor() {
    this.initialized = false;
    this.initializing = false;
    this.lastCheck = null;
    this.checkInterval = 60000; // Verificar cada 60 segundos como máximo
    this.status = null; // 'subscribed', 'denied', 'not_subscribed', null
    this.initializationPromise = null;
  }

  // Verificar si OneSignal ya está inicializado globalmente
  isInitialized() {
    // Verificar en memoria
    if (this.initialized) {
      return true;
    }

    // Verificar si oneSignalService está inicializado
    if (typeof oneSignalService !== 'undefined' && oneSignalService && oneSignalService.initialized) {
      this.initialized = true;
      return true;
    }

    // Verificar si OneSignal SDK está inicializado
    if (typeof OneSignal !== 'undefined' && OneSignal.SDK_VERSION) {
      try {
        if (OneSignal.User && OneSignal.User.PushSubscription) {
          this.initialized = true;
          return true;
        }
      } catch (e) {
        // Continuar
      }
    }

    return false;
  }

  // Inicializar OneSignal solo una vez
  async initializeOnce(appId, safariWebId) {
    // Si ya está inicializado, retornar inmediatamente
    if (this.isInitialized()) {
      return true;
    }

    // Si ya se está inicializando, esperar a que termine
    if (this.initializing && this.initializationPromise) {
      return this.initializationPromise;
    }

    // Marcar como inicializando
    this.initializing = true;

    // Crear promesa de inicialización
    this.initializationPromise = (async () => {
      try {
        if (typeof oneSignalService === 'undefined' || !oneSignalService) {
          console.warn('⚠️ oneSignalService no disponible');
          return false;
        }

        // Inicializar OneSignal
        const result = await oneSignalService.initialize(appId, safariWebId);
        
        if (result) {
          this.initialized = true;
          console.log('✅ OneSignal inicializado en sesión global');
        }
        
        return result;
      } catch (error) {
        console.error('❌ Error inicializando OneSignal en sesión:', error);
        return false;
      } finally {
        this.initializing = false;
      }
    })();

    return this.initializationPromise;
  }

  // Verificar estado de OneSignal (con caché)
  async checkStatus(force = false) {
    // Si no está inicializado, no verificar
    if (!this.isInitialized()) {
      return null;
    }

    // Si no es forzado y la última verificación fue reciente, retornar estado en caché
    if (!force && this.lastCheck && this.status) {
      const timeSinceLastCheck = Date.now() - this.lastCheck;
      if (timeSinceLastCheck < this.checkInterval) {
        return this.status;
      }
    }

    try {
      if (typeof oneSignalService === 'undefined' || !oneSignalService) {
        return null;
      }

      const userInfo = await oneSignalService.getUserInfo();
      
      if (userInfo && userInfo.subscribed) {
        this.status = 'subscribed';
      } else if (userInfo && userInfo.permission === 'denied') {
        this.status = 'denied';
      } else {
        this.status = 'not_subscribed';
      }

      this.lastCheck = Date.now();
      return this.status;
    } catch (error) {
      console.error('Error verificando estado de OneSignal:', error);
      return this.status; // Retornar último estado conocido
    }
  }

  // Obtener estado sin verificar (usar caché)
  getCachedStatus() {
    return this.status;
  }

  // Resetear sesión (útil para debugging)
  reset() {
    this.initialized = false;
    this.initializing = false;
    this.lastCheck = null;
    this.status = null;
    this.initializationPromise = null;
  }
}

// Crear instancia global
window.oneSignalSession = new OneSignalSession();

