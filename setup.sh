#!/bin/bash

# Script de configuración inicial para PWA Suscripciones
# Este script ayuda a configurar el proyecto después de clonarlo

echo "🚀 Configurando PWA Suscripciones..."
echo ""

# Verificar si firebase-config.js ya existe
if [ -f "firebase-config.js" ]; then
    echo "⚠️  firebase-config.js ya existe."
    read -p "¿Deseas sobrescribirlo? (s/n): " respuesta
    if [ "$respuesta" != "s" ] && [ "$respuesta" != "S" ]; then
        echo "✅ Manteniendo el archivo existente."
        exit 0
    fi
fi

# Copiar el archivo de ejemplo
if [ -f "firebase-config.example.js" ]; then
    cp firebase-config.example.js firebase-config.js
    echo "✅ Archivo firebase-config.js creado desde el ejemplo."
    echo ""
    echo "📝 IMPORTANTE: Ahora debes editar firebase-config.js con tus credenciales de Firebase."
    echo ""
    echo "Para obtener tus credenciales:"
    echo "1. Ve a https://console.firebase.google.com/"
    echo "2. Selecciona tu proyecto"
    echo "3. Ve a Configuración del proyecto (ícono de engranaje)"
    echo "4. Desplázate a 'Tus aplicaciones'"
    echo "5. Haz clic en el ícono de Web (</>)"
    echo "6. Copia los valores y pégalos en firebase-config.js"
    echo ""
    echo "📚 Para más detalles, consulta SETUP.md o GUIA-FIREBASE.md"
else
    echo "❌ Error: No se encontró firebase-config.example.js"
    exit 1
fi

