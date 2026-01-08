#!/bin/bash

# Script para incrementar automáticamente la versión
# Se ejecuta antes de cada commit para actualizar la versión

VERSION_FILE="version.js"

# Verificar que el archivo existe
if [ ! -f "$VERSION_FILE" ]; then
    echo "❌ No se encontró $VERSION_FILE"
    exit 1
fi

# Leer la versión actual usando sed (compatible con macOS y Linux)
CURRENT_VERSION=$(grep "const APP_VERSION" "$VERSION_FILE" | sed -E "s/.*const APP_VERSION = '([^']+)'.*/\1/")

if [ -z "$CURRENT_VERSION" ]; then
    echo "❌ No se encontró APP_VERSION en $VERSION_FILE"
    exit 1
fi

# Extraer las partes de la versión (X.Y.Z)
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"

if [ ${#VERSION_PARTS[@]} -ne 3 ]; then
    echo "❌ Formato de versión inválido. Debe ser X.Y.Z"
    exit 1
fi

MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Incrementar el patch version (último número)
# Si el patch llega a 99, incrementar el minor y resetear patch a 0
NEW_PATCH=$((PATCH + 1))
NEW_MINOR=$MINOR
NEW_MAJOR=$MAJOR

if [ $NEW_PATCH -gt 99 ]; then
  NEW_PATCH=0
  NEW_MINOR=$((MINOR + 1))
fi

NEW_VERSION="$NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"

# Reemplazar la versión en el archivo usando sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/const APP_VERSION = '$CURRENT_VERSION'/const APP_VERSION = '$NEW_VERSION'/" "$VERSION_FILE"
else
    # Linux
    sed -i "s/const APP_VERSION = '$CURRENT_VERSION'/const APP_VERSION = '$NEW_VERSION'/" "$VERSION_FILE"
fi

echo "✅ Versión actualizada: $CURRENT_VERSION → $NEW_VERSION"

# Agregar el archivo al staging area de Git
git add "$VERSION_FILE"

exit 0

