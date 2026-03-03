# 🚀 MongoDB Migration - Quick Start Guide

## Lo que sucedió

Tu backend pasó de guardar datos en **archivos JSON** (que se perdían) a **MongoDB** (que persiste permanentemente).

---

## ⚡ 3 pasos para activar la persistencia

### Paso 1: Entra a Railway
- Dirección: https://railway.app/dashboard
- Abre tu proyecto de inventario

### Paso 2: Agrega MongoDB
1. Haz clic en **"+ New"** (botón de agregar servicio)
2. Busca **"MongoDB"** 
3. Haz clic en **"Deploy"**
4. Espera 1-2 minutos mientras se configura

### Paso 3: Configura la conexión
1. Cuando MongoDB esté listo, haz clic en él
2. Ve a la pestaña **"Connect"**
3. Copia la URL completa (Mongo URL)
4. Ve a tu servicio Node.js → "Variables"
5. Agrega una nueva variable:
   - **Key**: `MONGO_URL`
   - **Value**: Pega la URL de MongoDB
6. El servidor se reiniciará automáticamente

---

## ✅ Verificar que funcionó

Después de que el servidor se reinicie:

1. **Revisa los logs** - Deberías ver:
   ```
   ✅ Conectado a MongoDB
   ```

2. **Prueba crear un cliente**:
   - Ve a la app → "Clientes" → "+ NUEVO CLIENTE"
   - Ingresa un nombre
   - Haz clic en crear

3. **Reinicia el servidor**:
   - En Railway, haz clic en tu servicio Node.js
   - Haz clic en el botón de "más opciones" → "Redeploy"
   - Espera a que se reinicie

4. **Verifica la persistencia**:
   - Carga la aplicación nuevamente
   - El cliente que creaste debe estar ahí ✅

---

## 🎯 Qué cambió en el código

### Para usuarios (frontend)
- **Nada**: La aplicación sigue funcionando igual
- Los datos ahora se guardan en MongoDB en lugar de JSON

### Para desarrolladores (backend)
- Las funciones ahora usan `async/await`
- Se usan modelos de Mongoose en lugar de archivos JSON
- Los IDs cambian de strings a ObjectIds de MongoDB

---

## 📝 Archivos importantes

### Nuevo:
- `src/models/Cliente.js` - Esquema de clientes
- `src/models/Producto.js` - Esquema de productos
- `src/models/Venta.js` - Esquema de ventas
- `src/models/DetalleVenta.js` - Esquema de detalles de venta
- `MONGODB_SETUP.md` - Instrucciones detalladas
- `MIGRATION_SUMMARY.md` - Resumen técnico completo

### Modificado:
- `package.json` - Agregado mongoose
- `server.js` - Agregada conexión a MongoDB
- `src/services/clienteService.js` - Ahora usa MongoDB
- `src/services/productoService.js` - Ahora usa MongoDB
- `src/services/ventaService.js` - Ahora usa MongoDB
- `src/routes/*.js` - Todas ahora usan async/await

---

## ❓ Preguntas frecuentes

**P: ¿Se pierden los datos viejos en JSON?**
R: Sí, los datos JSON no se migran. Empiezas fresco con MongoDB.

**P: ¿Cuánto cuesta MongoDB en Railway?**
R: Railway ofrece 5GB gratis. Para un inventario pequeño, es más que suficiente.

**P: ¿Qué pasa si no configuro MONGO_URL?**
R: El servidor intentará conectar a localhost (no funcionará en Railway). Verás errores en los logs.

**P: ¿Puedo usar la app sin MongoDB?**
R: No, todas las rutas protegidas necesitan autenticación. Sin MongoDB, no puedes hacer login porque los usuarios están en MongoDB.

**P: ¿Cómo veo los datos en MongoDB?**
R: Puedes usar:
- Railway UI (haz clic en MongoDB service)
- MongoDB Compass (app desktop)
- Cualquier cliente de MongoDB

---

## 🐛 Troubleshooting rápido

### Problema: "❌ Error al conectar MongoDB"
**Solución**:
1. Abre Railway
2. Copia la URL de MongoDB correcta
3. Pégala en la variable `MONGO_URL`
4. Espera a que se reinicie

### Problema: "Puedo crear clientes pero desaparecen"
**Solución**:
1. Verifica que MongoDB esté "deployed" (bola verde)
2. Revisa que MONGO_URL esté configurada
3. Abre el servidor de nuevo: debería estar los datos

### Problema: "La app está lenta"
**Nota normal**: MongoDB es un poco más lento que JSON para la primera conexión. Es normal esperar 1-2 segundos.

---

## 📞 Próximos pasos

Una vez que MongoDB esté funcionando:

1. **Crea datos de prueba**:
   - Al menos 2-3 clientes
   - Al menos 3-5 productos
   - Una venta de prueba

2. **Prueba la persistencia**:
   - Redeploy el servidor
   - Verifica que todo siga ahí

3. **Ahora estás listo**:
   - Tu sistema tiene persistencia permanente
   - Puedes usar la app con confianza en Railway

---

## 📚 Recursos

- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Instrucciones paso a paso
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Detalles técnicos completos
- [Railway Docs](https://railway.app/docs/) - Documentación oficial

---

**¿Listo para empezar? ¡Dirígete al Paso 1!**
