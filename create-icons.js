const fs = require('fs');
const { createCanvas } = require('canvas');

// Crear la carpeta icons si no existe
if (!fs.existsSync('./icons')) {
    fs.mkdirSync('./icons');
}

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1B1930');
    gradient.addColorStop(1, '#3f2a6f');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Borde redondeado (simulado con círculo)
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Símbolo de suscripción (dólar estilizado)
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', size / 2, size / 2);
    
    // Círculo decorativo
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.35, 0, 2 * Math.PI);
    ctx.stroke();
    
    return canvas;
}

console.log('🎨 Generando iconos para App Suscripciones...');

iconSizes.forEach(size => {
    const canvas = generateIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = `icons/icon-${size}x${size}.png`;
    
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Generado: ${filename}`);
});

console.log('\n🎉 ¡Todos los iconos han sido generados exitosamente!');
console.log('📁 Los iconos están en la carpeta "icons/"');
console.log('🚀 Tu PWA ahora tendrá iconos personalizados'); 