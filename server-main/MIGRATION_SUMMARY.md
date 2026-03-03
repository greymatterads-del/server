# ✅ Migración MongoDB Completada

## Resumen de cambios realizados

Se ha migrado completamente el backend de **JSON a MongoDB** usando Mongoose ODM. El sistema ahora tiene persistencia de datos permanente en Railway.

---

## 📦 Dependencias actualizadas

### package.json
- ✅ Agregado: `"mongoose": "^7.0.0"`
- Todas las demás dependencias se mantienen iguales

---

## 🗂️ Modelos MongoDB creados

### 1. **Cliente.js** (`src/models/Cliente.js`)
```
- _id: ObjectId (automático)
- nombre: String (único, requerido, lowercase)
- email: String (único, requerido)
- telefono: String
- direccion: String
- ciudad: String
- deuda_total: Number (default: 0)
- total_pagado: Number (default: 0)
- activo: Boolean (default: true)
- fecha_registro: Date (default: now)
- timestamps: createdAt, updatedAt
```

### 2. **Producto.js** (`src/models/Producto.js`)
```
- _id: ObjectId (automático)
- nombre: String (único, requerido, lowercase)
- costo: Number (requerido, min: 0)
- precio_venta: Number (requerido, min: costo)
- stock_actual: Number (default: 0)
- stock_minimo: Number (requerido)
- unidad: String (default: "unidad")
- activo: Boolean (default: true)
- descuento_aplicado: Number (default: 0)
- fecha_ingreso: Date (default: now)
- timestamps: createdAt, updatedAt
```

### 3. **Venta.js** (`src/models/Venta.js`)
```
- _id: ObjectId (automático)
- cliente: ObjectId (ref: Cliente, requerido)
- cliente_nombre: String
- fecha: Date (default: now)
- subtotal: Number
- descuento: Number
- total: Number
- estado: String (enum: pendiente, confirmada, anulada)
- referencia: String
- items_cantidad: Number
- ganancia_total: Number
- tipo_pago: String (enum: efectivo, deuda, parcial)
- monto_pagado: Number
- deuda_generada: Number
- fecha_confirmacion: Date
- fecha_anulacion: Date
- timestamps: createdAt, updatedAt
```

### 4. **DetalleVenta.js** (`src/models/DetalleVenta.js`)
```
- _id: ObjectId (automático)
- venta: ObjectId (ref: Venta, requerido)
- producto: ObjectId (ref: Producto, requerido)
- producto_nombre: String
- cantidad: Number (min: 1)
- precio_unitario: Number
- costo_unitario: Number
- subtotal: Number
- descuento_porcentaje: Number
- descuento_monto: Number
- subtotal_con_descuento: Number
- ganancia: Number
- fecha_registro: Date (default: now)
- timestamps: createdAt, updatedAt
```

---

## 🔧 Servicios actualizados

### clienteService.js
**Cambios:**
- ✅ Reemplazado `leerJSON`/`escribirJSON` con Mongoose methods
- ✅ Todas las funciones ahora son `async`
- ✅ Usa `Cliente.find()`, `Cliente.findById()`, `Cliente.findByIdAndDelete()` etc.
- ✅ Validación de nombres duplicados con `$regex`
- ✅ Auto-generación de email: `cliente.${Date.now()}@temporal.com`

**Funciones:**
```javascript
- async obtenerClientes(filtros)
- async obtenerClientePorId(id)
- async crearCliente(nombre, email, telefono, direccion, ciudad)
- async actualizarDeuda(idCliente, monto, tipo)
- async actualizarCliente(idCliente, datosActualizados)
- async pagarDeuda(idCliente, monto)
- async eliminarCliente(idCliente)
```

### productoService.js
**Cambios:**
- ✅ Reemplazado sistema de archivos con Mongoose
- ✅ Todas las funciones son `async`
- ✅ Usa `Producto.find()`, `Producto.findById()` etc.
- ✅ Mejor validación de stock

**Funciones:**
```javascript
- async obtenerProductos(filtros)
- async obtenerProductoPorId(id)
- async obtenerProductoPorNombre(nombre) [NUEVA]
- async crearProducto(nombre, costo, precio_venta, stock_minimo, unidad)
- async actualizarStock(idProducto, cantidad, tipo)
- async devolverStock(idProducto, cantidad)
- async aplicarDescuentoProducto(idProducto, porcentaje)
- async eliminarProducto(idProducto)
```

### ventaService.js
**Cambios:**
- ✅ Usa modelos `Venta` y `DetalleVenta`
- ✅ Todas las funciones son `async`
- ✅ Relaciones entre Venta → Cliente y DetalleVenta → Producto
- ✅ Mejor manejo de estados de venta

**Funciones:**
```javascript
- async obtenerVentas(filtros)
- async obtenerVentaPorId(idVenta)
- async crearVenta(idCliente, referencia, tipoPago, montoPagado, deuda)
- async agregarItemVenta(idVenta, idProducto, cantidad, precioUnitario, descuentoItem)
- calcularPrecioConDescuento(precioOriginal, porcentajeDescuento)
- async confirmarVenta(idVenta)
- async anularVenta(idVenta)
- async devolverProductoVenta(idDetalle)
```

---

## 📡 Rutas actualizadas

### clients.js (`src/routes/clients.js`)
- ✅ GET /api/clientes - Ahora `async`
- ✅ GET /api/clientes/:id - Ahora `async`
- ✅ POST /api/clientes - Ahora `async`
- ✅ POST /api/clientes/:id/pagar-deuda - Ahora `async`
- ✅ DELETE /api/clientes/:id - Ahora `async`
- ✅ Error handling mejorado

### products.js (`src/routes/products.js`)
- ✅ GET /api/productos - Ahora `async`
- ✅ GET /api/productos/:id - Ahora `async`
- ✅ POST /api/productos - Ahora `async`
- ✅ POST /api/productos/:id/stock - Ahora `async`
- ✅ POST /api/productos/:id/descuento - Ahora `async`

### sales.js (`src/routes/sales.js`)
- ✅ GET /api/ventas - Ahora `async`
- ✅ GET /api/ventas/:id - Ahora `async`
- ✅ POST /api/ventas - Ahora `async`
- ✅ POST /api/ventas/:id/items - Ahora `async`
- ✅ POST /api/ventas/:id/confirmar - Ahora `async`
- ✅ POST /api/ventas/:id/anular - Ahora `async`
- ✅ POST /api/ventas/detalle/:id/devolver - Ahora `async`
- ✅ POST /api/ventas/calcular-descuento - Ahora `async`

---

## 🖥️ Configuración del servidor

### server.js
**Cambios realizados:**
```javascript
// Conexión a MongoDB
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/inventario';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => {
  console.error('❌ Error al conectar MongoDB:', err);
  process.exit(1);
});
```

**Variable de entorno requerida:**
- `MONGO_URL`: URL de conexión a MongoDB (será configurada en Railway)

---

## 🚀 Próximos pasos

### 1. Configurar MongoDB en Railway
Ver archivo `MONGODB_SETUP.md` para instrucciones detalladas:
1. Agregar servicio MongoDB a tu proyecto Railway
2. Obtener la URL de conexión
3. Configurar la variable `MONGO_URL` en el servicio Node.js

### 2. Deploy
- Railway detectará automáticamente los cambios
- El servidor se reiniciará con las nuevas configuraciones
- Verifica en los logs: "✅ Conectado a MongoDB"

### 3. Verificación de datos
Después del deployment:
1. Crea un nuevo cliente
2. Crea un nuevo producto
3. Reinicia el servidor (redeploy en Railway)
4. Verifica que los datos persistan

---

## 📋 Checklist de migración

- [x] Instalado mongoose en package.json
- [x] Creados 4 modelos MongoDB
- [x] Actualizado server.js con conexión MongoDB
- [x] Migrado clienteService.js a Mongoose
- [x] Migrado productoService.js a Mongoose
- [x] Migrado ventaService.js a Mongoose
- [x] Actualizado todas las rutas a async/await
- [x] Mejorado error handling en rutas
- [x] Creado MONGODB_SETUP.md con instrucciones

---

## 🔄 Cambios de comportamiento

### Antes (JSON)
```
- Datos almacenados en archivos JSON locales
- Se perdían cuando el contenedor se reiniciaba
- Sin relaciones entre colecciones
- Validación limitada
```

### Ahora (MongoDB)
```
- Datos almacenados en base de datos MongoDB
- Persistencia permanente en Railway
- Relaciones mediante referencias (refs)
- Validación en esquema
- Búsquedas más eficientes con índices
```

---

## 📞 Soporte

Si encuentras problemas:

1. **"❌ Error al conectar MongoDB"**
   - Verifica que MONGO_URL esté correctamente configurada en Railway
   - Revisa que la URL no tenga espacios o caracteres especiales

2. **"No puedo crear productos/clientes"**
   - Espera 2-3 segundos (MongoDB es más lento que JSON)
   - Revisa la consola del navegador (Dev Tools) para errores

3. **"Los datos desaparecen después de reiniciar"**
   - Verifica que MongoDB esté ejecutándose en Railway
   - Revisa los logs del servidor en Railway

---

## ✨ Beneficios de la migración

✅ **Persistencia de datos**: Los datos no se pierden en restarts
✅ **Escalabilidad**: Mejor rendimiento con grandes volúmenes
✅ **Integridad**: Validación y relaciones en la base de datos
✅ **Mantenibilidad**: Código más limpio con async/await
✅ **Seguridad**: Validación de tipos con Mongoose
✅ **Profesionalismo**: Usar una BD real en producción

---

## 📖 Documentación

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Railway MongoDB Setup](https://railway.app/docs/databases/mongodb)

---

**Migración completada exitosamente ✅**
Ahora tu sistema tiene persistencia de datos en Railway!
