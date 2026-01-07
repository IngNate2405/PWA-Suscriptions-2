#!/bin/bash

# Script para actualizar todas las páginas HTML para usar version.js
# Este script agrega version.js y actualiza las versiones hardcodeadas

PAGES=(
  "desuscripcion.html"
  "archivo-datos.html"
  "editar-persona.html"
  "persona.html"
  "cotizar.html"
  "editar.html"
  "card.html"
  "calendar.html"
)

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    echo "Actualizando $page..."
    
    # Agregar version.js después de los otros scripts (si no existe)
    if ! grep -q "version.js" "$page"; then
      # Buscar la línea con fonts.googleapis y agregar version.js después
      if grep -q "fonts.googleapis" "$page"; then
        sed -i '' "/fonts.googleapis/a\\
  <script src=\"version.js\"></script>
" "$page"
      fi
    fi
    
    # Reemplazar funciones cargarVersion locales
    sed -i '' "s/function cargarVersion() {[^}]*'1\.0\.45'[^}]*}/\/\/ La función cargarVersion ahora está en version.js/g" "$page"
    
    # Actualizar versiones hardcodeadas en HTML
    sed -i '' "s/v1\.0\.45/v1.0.52/g" "$page"
    sed -i '' "s/'1\.0\.45'/'1.0.52'/g" "$page"
    
    echo "✅ $page actualizado"
  else
    echo "⚠️  $page no encontrado"
  fi
done

echo "✅ Todas las páginas actualizadas"

