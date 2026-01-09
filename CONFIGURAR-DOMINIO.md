# 🚀 Configuración Rápida de Dominio

## 🤔 ¿Dónde está tu aplicación actualmente?

### Opción A: Ya está en GitHub Pages (Recomendado - NO subes archivos)
Si tu app ya funciona en `ingnate2405.github.io`, puedes conectar tu dominio **sin subir archivos**:

👉 **Ver: `GUIA-DOMINIO-GITHUB-PAGES.md`**

**Pasos rápidos:**
1. En GitHub: Settings → Pages → Custom domain → Ingresa tu dominio
2. En tu proveedor de dominio: Agrega CNAME apuntando a `ingnate2405.github.io`
3. Espera 15 minutos a 48 horas
4. ¡Listo! Tu dominio funcionará sin subir nada

---

### Opción B: Quieres usar InfinityFree como hosting (SÍ subes archivos)
Si prefieres usar InfinityFree como servidor, necesitas subir los archivos:

👉 **Ver: `GUIA-DOMINIO-INFINITYFREE.md`**

**Pasos rápidos:**
1. Configura DNS en tu proveedor de dominio (nameservers de InfinityFree)
2. Agrega el dominio en InfinityFree (Panel → Domain → Addon Domains)
3. Sube TODOS los archivos a `htdocs` (File Manager o FTP)
4. Habilita SSL en InfinityFree
5. Prueba en `https://tudominio.com`

---

## ⚠️ Importante

- El `manifest.json` ya está configurado con rutas relativas (`./`) para que funcione en cualquier dominio
- El `.htaccess` ya tiene la redirección HTTPS activada
- Si usas Firebase Storage, agrega tu dominio a `cors.json`

