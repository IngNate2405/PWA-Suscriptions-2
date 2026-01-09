// Generador directo de VAPID keys usando crypto nativo
// Este script genera claves VAPID válidas sin necesidad de web-push

const crypto = require('crypto');

// Generar par de claves ECDSA P-256
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1', // P-256
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Extraer las coordenadas x e y de la clave pública
const publicKeyObj = crypto.createPublicKey(publicKey);
const publicKeyDer = publicKeyObj.export({ type: 'spki', format: 'der' });

// Parsear DER para obtener x e y
// El formato es: SEQUENCE { SEQUENCE { OID, curve }, BIT STRING { 0x04, x (32 bytes), y (32 bytes) } }
let offset = 0;

// Saltar SEQUENCE
offset += 2;
// Saltar SEQUENCE interno
offset += 2;
// Saltar OID (1.2.840.10045.2.1)
offset += 11;
// Saltar curve OID (prime256v1)
offset += 10;
// Saltar BIT STRING header
offset += 2;
// Saltar el byte 0x00 antes del punto
offset += 1;
// Saltar el byte 0x04 (uncompressed)
offset += 1;

// Extraer x (32 bytes) e y (32 bytes)
const x = publicKeyDer.slice(offset, offset + 32);
const y = publicKeyDer.slice(offset + 32, offset + 64);

// Crear el punto público en formato VAPID (0x04 + x + y)
const publicKeyBytes = Buffer.concat([Buffer.from([0x04]), x, y]);

// Convertir a base64url
function toBase64URL(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const vapidPublicKey = toBase64URL(publicKeyBytes);

// Extraer la clave privada (d)
const privateKeyObj = crypto.createPrivateKey(privateKey);
const privateKeyDer = privateKeyObj.export({ type: 'pkcs8', format: 'der' });

// Parsear para obtener 'd' (el valor privado)
// Buscar el octet string que contiene 'd'
let dOffset = 0;
// Buscar el patrón del octet string con 32 bytes
for (let i = 0; i < privateKeyDer.length - 32; i++) {
  if (privateKeyDer[i] === 0x04 && privateKeyDer[i + 1] === 0x20) {
    dOffset = i + 2;
    break;
  }
}

const d = privateKeyDer.slice(dOffset, dOffset + 32);
const vapidPrivateKey = toBase64URL(d);

console.log('VAPID Public Key:', vapidPublicKey);
console.log('VAPID Private Key:', vapidPrivateKey);

// Exportar para usar
module.exports = {
  publicKey: vapidPublicKey,
  privateKey: vapidPrivateKey
};

