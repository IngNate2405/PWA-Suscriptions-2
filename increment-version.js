#!/usr/bin/env node

// Script para incrementar automáticamente la versión
// Se ejecuta antes de cada commit para actualizar la versión

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, 'version.js');

try {
  // Leer el archivo version.js
  let content = fs.readFileSync(versionFile, 'utf8');
  
  // Buscar la línea con APP_VERSION
  const versionRegex = /const APP_VERSION = ['"]([\d.]+)['"]/;
  const match = content.match(versionRegex);
  
  if (!match) {
    console.error('❌ No se encontró APP_VERSION en version.js');
    process.exit(1);
  }
  
  const currentVersion = match[1];
  const parts = currentVersion.split('.');
  
  if (parts.length !== 3) {
    console.error('❌ Formato de versión inválido. Debe ser X.Y.Z');
    process.exit(1);
  }
  
  // Incrementar el patch version (último número)
  const major = parseInt(parts[0]) || 1;
  const minor = parseInt(parts[1]) || 0;
  const patch = parseInt(parts[2]) || 0;
  
  const newPatch = patch + 1;
  const newVersion = `${major}.${minor}.${newPatch}`;
  
  // Reemplazar la versión en el archivo
  const newContent = content.replace(versionRegex, `const APP_VERSION = '${newVersion}'`);
  
  // Escribir el archivo actualizado
  fs.writeFileSync(versionFile, newContent, 'utf8');
  
  console.log(`✅ Versión actualizada: ${currentVersion} → ${newVersion}`);
  
  // Agregar el archivo al staging area de Git
  const { execSync } = require('child_process');
  try {
    execSync(`git add ${versionFile}`, { stdio: 'inherit' });
  } catch (error) {
    // Si no está en un repositorio Git, no hacer nada
  }
  
} catch (error) {
  console.error('❌ Error al incrementar versión:', error.message);
  process.exit(1);
}

