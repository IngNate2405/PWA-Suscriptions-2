// Sistema centralizado de versiones
// Este archivo maneja la versión de la aplicación en todas las páginas

// Versión base del código (actualizar cuando haya cambios importantes)
const APP_VERSION = '1.0.47';

// Función para comparar versiones (retorna 1 si v1 > v2, -1 si v1 < v2, 0 si iguales)
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

// Función para cargar y actualizar la versión
function cargarVersion() {
  const versionElement = document.getElementById('app-version') || document.getElementById('versionNumber');
  if (!versionElement) return;
  
  const versionHTML = APP_VERSION;
  const savedVersion = localStorage.getItem('appVersion');
  
  // Comparar versiones
  if (savedVersion) {
    const comparacion = compareVersions(versionHTML, savedVersion);
    
    if (comparacion > 0) {
      // La versión del HTML es mayor (nueva versión detectada)
      versionElement.textContent = `v${versionHTML}`;
      localStorage.setItem('appVersion', versionHTML);
      console.log(`🆕 Nueva versión detectada: ${savedVersion} → ${versionHTML}`);
    } else if (comparacion < 0) {
      // La versión guardada es mayor (actualización manual previa)
      versionElement.textContent = `v${savedVersion}`;
    } else {
      // Son iguales
      versionElement.textContent = `v${versionHTML}`;
      localStorage.setItem('appVersion', versionHTML);
    }
  } else {
    // Primera vez: guardar la versión del HTML
    versionElement.textContent = `v${versionHTML}`;
    localStorage.setItem('appVersion', versionHTML);
    console.log(`📦 Versión inicial: ${versionHTML}`);
  }
}

// Función para obtener la versión actual
function getCurrentVersion() {
  return localStorage.getItem('appVersion') || APP_VERSION;
}

// Función para verificar si hay una nueva versión disponible
function checkForNewVersion() {
  const savedVersion = localStorage.getItem('appVersion') || APP_VERSION;
  const comparacion = compareVersions(APP_VERSION, savedVersion);
  
  if (comparacion > 0) {
    console.log(`🆕 Nueva versión disponible: ${savedVersion} → ${APP_VERSION}`);
    return true;
  }
  
  return false;
}

