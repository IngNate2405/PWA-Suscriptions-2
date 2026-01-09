#!/usr/bin/env node

// Script para generar VAPID keys y configurarlas automáticamente
// Ejecutar con: node generate-and-setup-vapid.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Intentar cargar web-push
let webpush;
try {
  webpush = require('web-push');
} catch (error) {
  console.error('❌ Error: web-push no está instalado.');
  console.log('\n📦 Instalando web-push...\n');
  
  // Intentar instalar
  const { execSync } = require('child_process');
  try {
    execSync('npm install web-push', { stdio: 'inherit', cwd: __dirname });
    webpush = require('web-push');
    console.log('\n✅ web-push instalado correctamente\n');
  } catch (installError) {
    console.error('❌ Error al instalar web-push. Por favor, ejecuta manualmente:');
    console.log('   npm install web-push');
    process.exit(1);
  }
}

// Función para hacer preguntas al usuario
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  console.log('🔑 Generador de VAPID Keys para Push Notifications\n');
  
  // Generar VAPID keys
  console.log('Generando VAPID keys...');
  const vapidKeys = webpush.generateVAPIDKeys();
  
  console.log('\n✅ VAPID Keys generadas:\n');
  console.log('📋 Public Key:');
  console.log(vapidKeys.publicKey);
  console.log('\n🔐 Private Key:');
  console.log(vapidKeys.privateKey);
  console.log('\n');
  
  // Preguntar si quiere configurar automáticamente
  const autoSetup = await askQuestion('¿Quieres configurar estas claves automáticamente en functions/index.js? (s/n): ');
  
  if (autoSetup.toLowerCase() === 's' || autoSetup.toLowerCase() === 'y' || autoSetup.toLowerCase() === 'si' || autoSetup.toLowerCase() === 'yes') {
    const functionsPath = path.join(__dirname, 'functions', 'index.js');
    
    if (!fs.existsSync(functionsPath)) {
      console.error(`❌ Error: No se encontró el archivo ${functionsPath}`);
      console.log('   Asegúrate de que el directorio functions/ existe.');
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
    
    // Preguntar por el email
    const email = await askQuestion('📧 Ingresa tu email para VAPID (ejemplo: tu-email@gmail.com): ');
    
    if (email && email.trim() !== '') {
      content = content.replace(
        /'mailto:tu-email@ejemplo.com'/,
        `'mailto:${email.trim()}'`
      );
    }
    
    // Guardar el archivo
    fs.writeFileSync(functionsPath, content, 'utf8');
    
    console.log('\n✅ ¡Configuración completada!');
    console.log(`   Archivo actualizado: ${functionsPath}`);
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Verifica que las claves estén correctas en functions/index.js');
    console.log('   2. Ejecuta: firebase login');
    console.log('   3. Ejecuta: firebase init functions');
    console.log('   4. Ejecuta: cd functions && npm install && cd ..');
    console.log('   5. Ejecuta: firebase deploy --only functions');
    console.log('\n');
  } else {
    console.log('\n📝 Instrucciones manuales:');
    console.log('   1. Abre el archivo functions/index.js');
    console.log('   2. Reemplaza TU_VAPID_PUBLIC_KEY_AQUI con tu Public Key');
    console.log('   3. Reemplaza TU_VAPID_PRIVATE_KEY_AQUI con tu Private Key');
    console.log('   4. Reemplaza tu-email@ejemplo.com con tu email real');
    console.log('\n');
  }
  
  // Guardar las claves en un archivo de respaldo
  const backupPath = path.join(__dirname, 'vapid-keys-backup.txt');
  const backupContent = `VAPID Keys generadas el ${new Date().toISOString()}\n\n` +
    `Public Key:\n${vapidKeys.publicKey}\n\n` +
    `Private Key:\n${vapidKeys.privateKey}\n\n` +
    `⚠️ IMPORTANTE: Guarda este archivo en un lugar seguro. No lo subas a GitHub.\n`;
  
  fs.writeFileSync(backupPath, backupContent, 'utf8');
  console.log(`💾 Claves guardadas en: ${backupPath}`);
  console.log('   ⚠️  No subas este archivo a GitHub (ya está en .gitignore)\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

