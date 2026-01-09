# 🔧 Guía: Cómo Agregar CNAME en tu Proveedor de Dominio

Si vas a conectar tu dominio a GitHub Pages, necesitas configurar el CNAME en **tu proveedor de dominio** (donde compraste el dominio), **NO en InfinityFree**.

## 📍 ¿Dónde compraste tu dominio?

### Si compraste en GoDaddy:

1. **Inicia sesión** en GoDaddy
2. Ve a **"Mis Productos"** → **"Dominios"**
3. Haz clic en tu dominio
4. Ve a la pestaña **"DNS"** o **"Zona DNS"**
5. Haz clic en **"Agregar"** o **"Añadir registro"**
6. Configura:
   ```
   Tipo: CNAME
   Nombre: @ (o deja en blanco)
   Valor: ingnate2405.github.io
   TTL: 600 (o automático)
   ```
7. Guarda los cambios

---

### Si compraste en Namecheap:

1. **Inicia sesión** en Namecheap
2. Ve a **"Domain List"**
3. Haz clic en **"Manage"** al lado de tu dominio
4. Ve a la pestaña **"Advanced DNS"**
5. Haz clic en **"Add New Record"**
6. Configura:
   ```
   Type: CNAME Record
   Host: @
   Value: ingnate2405.github.io
   TTL: Automatic
   ```
7. Guarda los cambios

---

### Si compraste en Google Domains:

1. **Inicia sesión** en Google Domains
2. Selecciona tu dominio
3. Ve a **"DNS"** en el menú lateral
4. Desplázate a **"Custom resource records"**
5. Agrega:
   ```
   Name: @
   Type: CNAME
   Data: ingnate2405.github.io
   TTL: 3600
   ```
6. Guarda los cambios

---

### Si compraste en Cloudflare:

1. **Inicia sesión** en Cloudflare
2. Selecciona tu dominio
3. Ve a **"DNS"** → **"Records"**
4. Haz clic en **"Add record"**
5. Configura:
   ```
   Type: CNAME
   Name: @ (o tu dominio)
   Target: ingnate2405.github.io
   Proxy status: DNS only (nube gris)
   TTL: Auto
   ```
6. Guarda los cambios

---

### Si compraste en otro proveedor:

Busca la sección de **"DNS"**, **"Zona DNS"**, **"DNS Records"** o **"Name Servers"** y agrega:

```
Tipo: CNAME
Nombre: @ (o deja en blanco para la raíz)
Valor/Destino: ingnate2405.github.io
TTL: 3600 (o automático)
```

---

## ⚠️ Nota Importante sobre CNAME en la Raíz (@)

Algunos proveedores **NO permiten** CNAME en la raíz (@). En ese caso, usa **Registros A** con las IPs de GitHub:

```
Tipo: A
Nombre: @
Valor: 185.199.108.153
TTL: 3600
```

Repite esto para estas 4 IPs:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

Y para www, usa CNAME:
```
Tipo: CNAME
Nombre: www
Valor: ingnate2405.github.io
TTL: 3600
```

---

## ✅ Después de Configurar

1. **Espera 15 minutos a 48 horas** para la propagación DNS
2. **Verifica el estado** en: https://www.whatsmydns.net/
3. **En GitHub:** Settings → Pages → Custom domain → Ingresa tu dominio
4. **Espera a que GitHub verifique** el dominio (puede tardar hasta 24 horas)

---

## ❓ ¿Necesitas ayuda con tu proveedor específico?

Si tu proveedor no está en la lista, busca en Google:
- "[Nombre del proveedor] cómo agregar registro CNAME"
- "[Nombre del proveedor] DNS configuration"

O comparte el nombre de tu proveedor y te ayudo con los pasos específicos.

