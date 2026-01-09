// Script para generar VAPID keys
// Ejecutar con: node generate-vapid-keys.js

const webpush = require('web-push');

console.log('🔑 Generando VAPID keys...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID Keys generadas:\n');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n📝 Copia estas claves y úsalas en functions/index.js\n');

