#!/bin/bash

# Script para configurar Push Notifications con Firebase
# Ejecutar con: bash setup-push-notifications.sh

echo "🚀 Configurando Push Notifications con Firebase..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado."
    echo "   Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Instalar Firebase CLI globalmente
echo "📦 Instalando Firebase CLI..."
npm install -g firebase-tools

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar Firebase CLI"
    exit 1
fi

echo "✅ Firebase CLI instalado"
echo ""

# Instalar web-push globalmente
echo "📦 Instalando web-push..."
npm install -g web-push

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar web-push"
    exit 1
fi

echo "✅ web-push instalado"
echo ""

# Generar VAPID keys
echo "🔑 Generando VAPID keys..."
cd "$(dirname "$0")"
node generate-vapid-keys.js > vapid-keys.txt

if [ $? -ne 0 ]; then
    echo "❌ Error al generar VAPID keys"
    echo "   Asegúrate de haber instalado las dependencias: npm install web-push"
    exit 1
fi

echo ""
echo "✅ VAPID keys generadas y guardadas en vapid-keys.txt"
echo ""
echo "📋 Siguiente paso:"
echo "   1. Abre vapid-keys.txt y copia las claves"
echo "   2. Edita functions/index.js y reemplaza:"
echo "      - TU_VAPID_PUBLIC_KEY_AQUI"
echo "      - TU_VAPID_PRIVATE_KEY_AQUI"
echo "      - tu-email@ejemplo.com (con tu email)"
echo "   3. Ejecuta: firebase login"
echo "   4. Ejecuta: firebase init functions"
echo "   5. Ejecuta: cd functions && npm install"
echo "   6. Ejecuta: cd .. && firebase deploy --only functions"
echo ""

