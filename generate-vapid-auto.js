#!/usr/bin/env node

// Script automático para generar VAPID keys y configurarlas
// No requiere interacción del usuario

const fs = require('fs');
const path = require('path');

// Intentar cargar web-push
let webpush;
try {
  webpush = require('web-push');
} catch (error) {
  console.error('❌ Error: web-push no está instalado.');
  console.log('📦 Instalando web-push...\n');
  
  const { execSync } = require('child_process');
  try {
    execSync('npm install web-push', { stdio: 'inherit', cwd: __dirname });
    webpush = require('web-push');
    console.log('\n✅ web-push instalado correctamente\n');
  } catch (installError) {
    console.error('❌ Error al instalar web-push.');
    console.log('Ejecuta manualmente: npm install web-push');
    process.exit(1);
  }
}

async function main() {
  console.log('🔑 Generando VAPID Keys automáticamente...\n');
  
  // Generar VAPID keys
  const vapidKeys = webpush.generateVAPIDKeys();
  
  console.log('✅ VAPID Keys generadas:\n');
  console.log('📋 Public Key:');
  console.log(vapidKeys.publicKey);
  console.log('\n🔐 Private Key:');
  console.log(vapidKeys.privateKey);
  console.log('\n');
  
  // Configurar automáticamente
  const functionsPath = path.join(__dirname, 'functions', 'index.js');
  
  if (!fs.existsSync(functionsPath)) {
    console.error(`❌ Error: No se encontró ${functionsPath}`);
    process.exit(1);
  }
  
  // Leer el archivo
  let content = fs.readFileSync(functionsPath, 'utf8');
  
  // Reemplazar las claves
  content = content.replace(
    /publicKey: 'TU_VAPID_PUBLIC_KEY_AQUI'/,
    `publicKey: '${vapidKeys.publicKey}'`
  );
  content = content.replace(
    /privateKey: 'TU_VAPID_PRIVATE_KEY_AQUI'/,
    `privateKey: '${vapidKeys.privateKey}'`
  );
  
  // Usar un email por defecto (el usuario puede cambiarlo después)
  // Buscar si ya hay un email configurado
  if (content.includes("mailto:tu-email@ejemplo.com")) {
    // Mantener el placeholder, el usuario lo cambiará
    console.log('⚠️  Recuerda cambiar tu-email@ejemplo.com por tu email real en functions/index.js');
  }
  
  // Guardar el archivo
  fs.writeFileSync(functionsPath, content, 'utf8');
  
  console.log('✅ ¡Configuración completada automáticamente!');
  console.log(`   Archivo actualizado: ${functionsPath}`);
  console.log('\n📝 IMPORTANTE:');
  console.log('   1. Edita functions/index.js y reemplaza "tu-email@ejemplo.com" con tu email real');
  console.log('   2. Ejecuta: firebase login');
  console.log('   3. Ejecuta: firebase init functions');
  console.log('   4. Ejecuta: cd functions && npm install && cd ..');
  console.log('   5. Ejecuta: firebase deploy --only functions');
  console.log('\n');
  
  // Guardar las claves en un archivo de respaldo
  const backupPath = path.join(__dirname, 'vapid-keys-backup.txt');
  const backupContent = `VAPID Keys generadas el ${new Date().toISOString()}\n\n` +
    `Public Key:\n${vapidKeys.publicKey}\n\n` +
    `Private Key:\n${vapidKeys.privateKey}\n\n` +
    `⚠️ IMPORTANTE: Guarda este archivo en un lugar seguro. No lo subas a GitHub.\n`;
  
  fs.writeFileSync(backupPath, backupContent, 'utf8');
  console.log(`💾 Claves guardadas en: ${backupPath}`);
  console.log('   ⚠️  Este archivo NO se subirá a GitHub (está en .gitignore)\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

