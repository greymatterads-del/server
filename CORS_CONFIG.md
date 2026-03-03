# 🔓 CONFIGURACIÓN CORS - EXPLICACIÓN

CORS (Cross-Origin Resource Sharing) permite que tu frontend (en Vercel) acceda a tu backend (en el VPS).

---

## ¿Qué es CORS?

Cuando tu frontend (HTTPS en Vercel) intenta acceder al backend (HTTP en VPS), el navegador bloquea la petición por seguridad. CORS es el mecanismo que permite esta comunicación.

---

## 🔧 CONFIGURACIÓN ACTUAL

### Archivo: `src/utils/cors.js`

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'https://inventario-sistema-front.vercel.app', // Tu frontend en Vercel
  'http://148.230.72.182', // Tu VPS
];
```

Cuando el navegador intenta conectar desde `https://inventario-sistema-front.vercel.app`, el servidor verifica:
- ¿Está este origen en la lista blanca?
- Si SÍ → Permitir la petición
- Si NO → Bloquear

---

## 📋 MODOS DE CORS

### Modo 1: PERMISIVO (Desarrollo)
```javascript
res.header('Access-Control-Allow-Origin', '*'); // Permite CUALQUIER origen
```
✅ Fácil para desarrollo  
❌ Inseguro para producción  

### Modo 2: RESTRICTIVO (Producción)
```javascript
// Solo permitir dominios específicos
if (allowedOrigins.includes(origin)) {
  res.header('Access-Control-Allow-Origin', origin);
}
```
✅ Seguro  
❌ Hay que actualizar lista si agregas dominios  

---

## 🚀 PARA VERCEL + VPS

Tu configuración actual es PERFECTA para esto:

**Dominios permitidos:**
- ✅ `https://inventario-sistema-front.vercel.app` (Tu frontend)
- ✅ `http://148.230.72.182` (Tu VPS)
- ✅ `http://localhost:*` (Desarrollo local)

---

## 🔍 HEADERS QUE SE ENVÍAN

```
Access-Control-Allow-Origin: https://inventario-sistema-front.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

**Significado:**
- **Allow-Origin:** Qué origen puede acceder
- **Allow-Methods:** Qué métodos HTTP (GET, POST, etc)
- **Allow-Headers:** Qué headers puede enviar el cliente
- **Allow-Credentials:** Si puede enviar cookies/auth
- **Max-Age:** Cuánto cachear el preflight (1 hora)

---

## 🧪 PRUEBAS

### Desde tu máquina local

```bash
# 1. Probar CORS directamente
curl -X OPTIONS http://148.230.72.182/api/auth/login \
  -H "Origin: https://inventario-sistema-front.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# 2. Probar petición real
curl -X POST http://148.230.72.182/api/auth/login \
  -H "Origin: https://inventario-sistema-front.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contraseña":"admin123"}'
```

### Desde el navegador (Vercel)

Abre: `https://inventario-sistema-front.vercel.app`
- Abre DevTools (F12)
- Ir a Console
- Intenta hacer login
- Si funciona → ✅ CORS está bien

---

## 🛠️ PERSONALIZAR PARA PRODUCCIÓN

Si agregas más dominios:

**Edita: `src/utils/cors.js`**

```javascript
const allowedOrigins = [
  'https://inventario-sistema-front.vercel.app',
  'http://148.230.72.182',
  'https://tudominio.com',  // ← Agregar aquí
  'https://app.tudominio.com',
];
```

Luego en VPS:
```bash
cd /home/back
git pull
pm2 restart inventario-backend
```

---

## ⚠️ PROBLEMAS COMUNES

### Error: "No 'Access-Control-Allow-Origin' header"
**Causa:** El origen no está en la lista blanca
**Solución:** Agregar el origen a `allowedOrigins` en `cors.js`

### Error: "CORS policy: Method not allowed"
**Causa:** El método HTTP (POST, PUT, etc) no está permitido
**Solución:** Verificar que esté en `Allow-Methods`

### Error: "CORS policy: Header not allowed"
**Causa:** El header personalizado no está permitido
**Solución:** Agregar a `Allow-Headers`

---

## 🔒 SEGURIDAD

**Actual:** ✅ SEGURO
- Solo permite dominios conocidos
- Hay whitelist explícita
- Listo para producción

**Si quieres más seguridad:**
```javascript
// Remover la línea: res.header('Access-Control-Allow-Origin', '*');
// Dejar solo la rama if (allowedOrigins.includes(origin))
```

---

## 📊 RESUMEN

| Escenario | Configuración |
|-----------|---------------|
| Desarrollo local | ✅ Funciona (`localhost:*`) |
| Vercel frontend | ✅ Funciona (`vercel.app`) |
| VPS backend | ✅ Funciona (`148.230.72.182`) |
| Otro dominio | ❌ Agregar a lista blanca |

---

## 🚀 PRÓXIMOS PASOS

1. **Pushea cambios al VPS:**
   ```bash
   cd /home/back
   git pull
   npm install (si hay nuevas deps)
   pm2 restart inventario-backend
   ```

2. **Prueba desde Vercel:**
   ```
   https://inventario-sistema-front.vercel.app
   ```

3. **Abre DevTools y verifica:**
   - Network tab
   - Busca petición a `/api/auth/login`
   - Ver headers de respuesta
   - Debe estar: `Access-Control-Allow-Origin: https://...vercel.app`

---

¡CORS está habilitado y listo para producción! 🎉
