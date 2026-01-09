# 🌐 Guía: Conectar Dominio a GitHub Pages (SIN subir archivos)

Si tu aplicación ya está funcionando en GitHub Pages, puedes conectar tu dominio personalizado **sin necesidad de subir archivos a InfinityFree**.

## 📋 Requisitos

- ✅ Aplicación funcionando en GitHub Pages (ej: `ingnate2405.github.io/PWA-Suscriptions-2`)
- ✅ Dominio registrado
- ✅ Acceso al panel de control de tu proveedor de dominio

---

## 🚀 Paso 1: Configurar Dominio en GitHub

1. **Ir a la configuración del repositorio:**
   - Ve a tu repositorio en GitHub: `https://github.com/IngNate2405/PWA-Suscriptions-2`
   - Haz clic en **"Settings"** (Configuración)

2. **Ir a GitHub Pages:**
   - En el menú lateral, busca **"Pages"** (Páginas)
   - Desplázate hasta la sección **"Custom domain"** (Dominio personalizado)

3. **Agregar tu dominio:**
   - Ingresa tu dominio (ej: `tudominio.com` o `www.tudominio.com`)
   - Haz clic en **"Save"** (Guardar)
   - ⚠️ GitHub te mostrará una advertencia de que el dominio no está configurado aún (es normal)

4. **Verificar la configuración:**
   - GitHub creará un archivo `CNAME` en tu repositorio
   - Este archivo contiene tu dominio personalizado

---

## 🔧 Paso 2: Configurar DNS en tu Proveedor de Dominio

⚠️ **IMPORTANTE:** Configuras esto en **tu proveedor de dominio** (donde compraste el dominio: GoDaddy, Namecheap, etc.), **NO en InfinityFree**.

👉 **Ver guía detallada por proveedor:** `GUIA-CNAME-PROVEEDOR-DOMINIO.md`

### Opción A: Usar CNAME (Recomendado)

1. **En tu proveedor de dominio:**
   - Ve a la sección de **DNS** o **Zona DNS**
   - Agrega un nuevo registro:

   ```
   Tipo: CNAME
   Nombre: @ (o deja en blanco, o tu dominio sin www)
   Valor: ingnate2405.github.io
   TTL: 3600 (o automático)
   ```

2. **Para el subdominio www (opcional):**
   ```
   Tipo: CNAME
   Nombre: www
   Valor: ingnate2405.github.io
   TTL: 3600
   ```

### Opción B: Usar Registros A (IPs de GitHub)

Si tu proveedor no permite CNAME en la raíz (@), usa estos registros A:

1. **Agregar registros A:**
   ```
   Tipo: A
   Nombre: @
   Valor: 185.199.108.153
   TTL: 3600
   ```

   ```
   Tipo: A
   Nombre: @
   Valor: 185.199.109.153
   TTL: 3600
   ```

   ```
   Tipo: A
   Nombre: @
   Valor: 185.199.110.153
   TTL: 3600
   ```

   ```
   Tipo: A
   Nombre: @
   Valor: 185.199.111.153
   TTL: 3600
   ```

2. **Para www, usar CNAME:**
   ```
   Tipo: CNAME
   Nombre: www
   Valor: ingnate2405.github.io
   TTL: 3600
   ```

---

## ⏰ Paso 3: Esperar la Propagación DNS

- ⏰ La propagación DNS puede tardar de **15 minutos a 48 horas**
- 🔍 Puedes verificar el estado en: https://www.whatsmydns.net/
- ✅ Cuando esté propagado, GitHub detectará automáticamente tu dominio

---

## ✅ Paso 4: Verificar que Funciona

1. **Espera a que GitHub detecte el dominio:**
   - Vuelve a **Settings → Pages** en GitHub
   - Deberías ver un checkmark verde ✅ indicando que el dominio está configurado

2. **Probar en el navegador:**
   - Visita `https://tudominio.com`
   - Deberías ver tu aplicación funcionando

3. **Verificar HTTPS:**
   - GitHub Pages proporciona SSL automáticamente
   - Tu sitio debería cargar con `https://` automáticamente

---

## 🔒 Paso 5: Forzar HTTPS (Opcional)

GitHub Pages ya proporciona HTTPS automáticamente, pero puedes forzarlo:

1. **En GitHub Pages Settings:**
   - Marca la casilla **"Enforce HTTPS"** (Forzar HTTPS)
   - Esto redirigirá automáticamente HTTP a HTTPS

---

## ❓ Solución de Problemas

### El dominio no carga
- ✅ Verifica que los DNS estén propagados: https://www.whatsmydns.net/
- ✅ Espera hasta 48 horas para la propagación completa
- ✅ Verifica que el registro CNAME o A esté correcto

### GitHub muestra "Not yet verified"
- ✅ Esto es normal, puede tardar hasta 24 horas
- ✅ Asegúrate de que los DNS estén correctamente configurados
- ✅ Verifica que el archivo `CNAME` esté en tu repositorio

### Error 404
- ✅ Verifica que GitHub Pages esté habilitado en tu repositorio
- ✅ Asegúrate de que la rama correcta esté seleccionada (main/master)
- ✅ Verifica que `index.html` esté en la raíz del repositorio

### HTTPS no funciona
- ✅ Espera a que GitHub verifique el dominio
- ✅ Marca "Enforce HTTPS" en la configuración de Pages
- ✅ Puede tardar hasta 24 horas después de la verificación del dominio

---

## 📝 Notas Importantes

- ✅ **No necesitas subir archivos a InfinityFree** - Todo sigue en GitHub
- ✅ **GitHub Pages es gratuito** y proporciona SSL automático
- ✅ **Los cambios se actualizan automáticamente** cuando haces push a GitHub
- ⚠️ **Propagación DNS:** Puede tardar hasta 48 horas
- ⚠️ **Verificación de dominio:** GitHub puede tardar hasta 24 horas en verificar

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en `https://tudominio.com` sin necesidad de subir archivos a otro servidor.

**Ventajas de esta opción:**
- ✅ No necesitas subir archivos
- ✅ Los cambios se actualizan automáticamente con cada push
- ✅ SSL gratuito proporcionado por GitHub
- ✅ Hosting gratuito y confiable

