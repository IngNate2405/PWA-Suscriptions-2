#!/bin/bash

# Script para instalar Node.js (si no está) y generar VAPID keys
# Ejecutar con: bash install-and-generate.sh

echo "🚀 Instalador y Generador de VAPID Keys"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado."
    echo ""
    echo "📦 Opciones para instalar Node.js:"
    echo ""
    echo "Opción 1 - Homebrew (macOS):"
    echo "   brew install node"
    echo ""
    echo "Opción 2 - Descarga directa:"
    echo "   Ve a: https://nodejs.org/"
    echo "   Descarga e instala la versión LTS"
    echo ""
    echo "Opción 3 - nvm (Node Version Manager):"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   nvm install --lts"
    echo ""
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Instalar web-push localmente
echo "📦 Instalando web-push..."
npm install web-push

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar web-push"
    exit 1
fi

echo "✅ web-push instalado"
echo ""

# Ejecutar el script de generación
echo "🔑 Generando VAPID keys..."
node generate-and-setup-vapid.js

