## 📝 EJEMPLOS DE PRUEBA COMPLETA

A continuación, un flujo paso a paso para probar el sistema completo.

---

## 🔐 PASO 1: LOGIN

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "contraseña": "admin123"
  }'
```

**Respuesta esperada:**
```json
{
  "exito": true,
  "usuario": {
    "id": "admin-001",
    "usuario": "admin",
    "nombre": "Administrador",
    "rol": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Copia el token para las próximas peticiones:**
```
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 PASO 2: CREAR PRODUCTOS

### Producto 1: Laptop
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Laptop Dell XPS 13",
    "costo": 600.00,
    "precio_venta": 999.99,
    "stock_minimo": 2,
    "unidad": "unidad"
  }'
```

### Producto 2: Mouse
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Mouse Logitech MX Master 3",
    "costo": 40.00,
    "precio_venta": 99.99,
    "stock_minimo": 5,
    "unidad": "unidad"
  }'
```

### Producto 3: Teclado
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Teclado Mecánico Corsair K95",
    "costo": 80.00,
    "precio_venta": 189.99,
    "stock_minimo": 3,
    "unidad": "unidad"
  }'
```

---

## 📦 PASO 3: AGREGAR STOCK A PRODUCTOS

```bash
# Laptop: 10 unidades
curl -X POST http://localhost:3000/api/productos/prod-001/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cantidad": 10,
    "tipo": "entrada"
  }'

# Mouse: 50 unidades
curl -X POST http://localhost:3000/api/productos/prod-002/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cantidad": 50,
    "tipo": "entrada"
  }'

# Teclado: 25 unidades
curl -X POST http://localhost:3000/api/productos/prod-003/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cantidad": 25,
    "tipo": "entrada"
  }'
```

---

## 👥 PASO 4: CREAR CLIENTES

### Cliente 1
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "José Martinez",
    "email": "jose@empresa.com",
    "telefono": "555-0101",
    "direccion": "Avenida Principal 500",
    "ciudad": "Buenos Aires"
  }'
```

### Cliente 2
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Ana Rodríguez",
    "email": "ana@empresa.com",
    "telefono": "555-0102",
    "direccion": "Calle Secundaria 250",
    "ciudad": "CABA"
  }'
```

---

## 🛒 PASO 5: CREAR Y COMPLETAR VENTA 1

### 5.1 Crear venta (estado: pendiente)
```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_cliente": "cli-001"
  }'
```

**Respuesta:** Obtén el `id_venta` (ej: vta-123456-789)

### 5.2 Agregar item 1: Laptop (cantidad: 2)
```bash
curl -X POST http://localhost:3000/api/ventas/vta-123456-789/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_producto": "prod-001",
    "cantidad": 2,
    "precio_unitario": 999.99,
    "descuento": 0
  }'
```

**Cálculo:**
- Subtotal: 2 × 999.99 = 1,999.98
- Descuento: 0%
- Total: 1,999.98
- Costo: 2 × 600 = 1,200
- Ganancia: (999.99 - 600) × 2 = 799.98

### 5.3 Agregar item 2: Mouse (cantidad: 5, con descuento 10%)
```bash
curl -X POST http://localhost:3000/api/ventas/vta-123456-789/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_producto": "prod-002",
    "cantidad": 5,
    "precio_unitario": 99.99,
    "descuento": 10
  }'
```

**Cálculo:**
- Subtotal: 5 × 99.99 = 499.95
- Descuento 10%: 49.99
- Total item: 449.96
- Costo: 5 × 40 = 200
- Ganancia: (99.99 - 40) × 5 - 49.99 = 249.96

### 5.4 Ver venta completa
```bash
curl -X GET http://localhost:3000/api/ventas/vta-123456-789 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "exito": true,
  "venta": {
    "id_venta": "vta-123456-789",
    "cliente": "cli-001",
    "cliente_nombre": "José Martinez",
    "fecha": "2025-12-15T10:30:00Z",
    "subtotal": 2499.93,
    "descuento": 49.99,
    "total": 2449.94,
    "estado": "pendiente",
    "items_cantidad": 2,
    "ganancia_total": 1049.94
  },
  "detalles": [
    {
      "id_detalle": "det-001",
      "id_venta": "vta-123456-789",
      "id_producto": "prod-001",
      "producto_nombre": "Laptop Dell XPS 13",
      "cantidad": 2,
      "precio_unitario": 999.99,
      "costo_unitario": 600.00,
      "subtotal": 1999.98,
      "descuento_porcentaje": 0,
      "descuento_monto": 0.00,
      "subtotal_con_descuento": 1999.98,
      "ganancia": 799.98
    },
    {
      "id_detalle": "det-002",
      "id_venta": "vta-123456-789",
      "id_producto": "prod-002",
      "producto_nombre": "Mouse Logitech MX Master 3",
      "cantidad": 5,
      "precio_unitario": 99.99,
      "costo_unitario": 40.00,
      "subtotal": 499.95,
      "descuento_porcentaje": 10,
      "descuento_monto": 49.99,
      "subtotal_con_descuento": 449.96,
      "ganancia": 249.96
    }
  ]
}
```

### 5.5 Confirmar venta
```bash
curl -X POST http://localhost:3000/api/ventas/vta-123456-789/confirmar \
  -H "Authorization: Bearer $TOKEN"
```

**Lo que sucede:**
✅ Estado cambia a "confirmada"
✅ Stock se descuenta:
   - Laptop: 10 - 2 = 8
   - Mouse: 50 - 5 = 45
✅ Deuda se registra en cliente: 2,449.94

---

## 🛒 PASO 6: CREAR VENTA 2 (DIFERENTE CLIENTE)

### 6.1 Crear venta para Ana
```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_cliente": "cli-002"
  }'
```

### 6.2 Agregar Teclado (cantidad: 1, con descuento 15%)
```bash
curl -X POST http://localhost:3000/api/ventas/vta-XXXXX-XXXXX/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_producto": "prod-003",
    "cantidad": 1,
    "precio_unitario": 189.99,
    "descuento": 15
  }'
```

**Cálculo:**
- Subtotal: 189.99
- Descuento 15%: 28.50
- Total: 161.49
- Ganancia: 109.99 - 28.50 = 81.49

### 6.3 Confirmar venta
```bash
curl -X POST http://localhost:3000/api/ventas/vta-XXXXX-XXXXX/confirmar \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 PASO 7: VER REPORTES

### Ganancias del mes actual
```bash
curl -X GET "http://localhost:3000/api/reportes/ganancias-mensuales?mes=12&anio=2025" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "exito": true,
  "reporte": {
    "mes": 12,
    "anio": 2025,
    "cantidad_ventas": 2,
    "venta_total": 2611.43,
    "costo_total": 1561.49,
    "ganancia_total": 1049.94,
    "ganancia_promedio_venta": 524.97,
    "ventas_detalle": [
      {
        "id_venta": "vta-123456-789",
        "fecha": "2025-12-15T10:30:00Z",
        "cliente": "José Martinez",
        "total": 2449.94,
        "ganancia": 1049.94
      },
      {
        "id_venta": "vta-XXXXX-XXXXX",
        "fecha": "2025-12-15T10:35:00Z",
        "cliente": "Ana Rodríguez",
        "total": 161.49,
        "ganancia": 81.49
      }
    ]
  }
}
```

### Top 5 productos más vendidos
```bash
curl -X GET "http://localhost:3000/api/reportes/top-productos?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "exito": true,
  "cantidad": 2,
  "productos": [
    {
      "id_producto": "prod-002",
      "nombre": "Mouse Logitech MX Master 3",
      "total_cantidad_vendida": 5,
      "total_ingresos": 449.96,
      "total_ganancia": 249.96,
      "cantidad_transacciones": 1
    },
    {
      "id_producto": "prod-001",
      "nombre": "Laptop Dell XPS 13",
      "total_cantidad_vendida": 2,
      "total_ingresos": 1999.98,
      "total_ganancia": 799.98,
      "cantidad_transacciones": 1
    }
  ]
}
```

### Stock bajo
```bash
curl -X GET "http://localhost:3000/api/reportes/stock-bajo" \
  -H "Authorization: Bearer $TOKEN"
```

### Resumen general
```bash
curl -X GET "http://localhost:3000/api/reportes/resumen-general" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💳 PASO 8: GESTIÓN DE DEUDAS

### Ver cliente y su deuda
```bash
curl -X GET http://localhost:3000/api/clientes/cli-001 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
{
  "exito": true,
  "cliente": {
    "id": "cli-001",
    "nombre": "José Martinez",
    "email": "jose@empresa.com",
    "telefono": "555-0101",
    "direccion": "Avenida Principal 500",
    "ciudad": "Buenos Aires",
    "deuda_total": 2449.94,
    "activo": true,
    "fecha_registro": "2025-12-15T10:30:00Z"
  }
}
```

### Pagar parte de la deuda
```bash
curl -X POST http://localhost:3000/api/clientes/cli-001/pagar-deuda \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "monto": 500.00
  }'
```

**Respuesta:**
```json
{
  "exito": true,
  "deuda_anterior": 2449.94,
  "deuda_actual": 1949.94,
  "cliente": {
    "deuda_total": 1949.94,
    ...
  }
}
```

---

## 🔄 PASO 9: PRUEBA DE VALIDACIONES

### Intentar vender más stock del disponible
```bash
curl -X POST http://localhost:3000/api/ventas/vta-NEW/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_producto": "prod-001",
    "cantidad": 100,
    "descuento": 0
  }'
```

**Respuesta:**
```json
{
  "error": "Stock insuficiente. Stock disponible: 8"
}
```

### Intentar crear descuento inválido
```bash
curl -X POST http://localhost:3000/api/ventas/vta-123/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_producto": "prod-001",
    "cantidad": 1,
    "descuento": 150
  }'
```

**Respuesta:**
```json
{
  "error": "El descuento debe estar entre 0 y 100"
}
```

---

## 🚫 PASO 10: PRUEBA DE ANULACIÓN

### Anular una venta confirmada
```bash
curl -X POST http://localhost:3000/api/ventas/vta-123456-789/anular \
  -H "Authorization: Bearer $TOKEN"
```

**Lo que sucede:**
✅ Estado cambia a "anulada"
✅ Stock se devuelve:
   - Laptop: 8 + 2 = 10
   - Mouse: 45 + 5 = 50
✅ Deuda se cancela: cliente paga 2,449.94

---

## ✅ RESUMEN DE PRUEBAS

| Paso | Acción | Resultado |
|------|--------|-----------|
| 1 | Login | Token obtenido |
| 2 | Crear 3 productos | Productos creados |
| 3 | Agregar stock | Stock actualizado |
| 4 | Crear 2 clientes | Clientes creados |
| 5 | Venta 1 (2 items) | Confirmada, deuda registrada |
| 6 | Venta 2 (1 item) | Confirmada, deuda registrada |
| 7 | Reportes | Ganancias mensuales, top productos |
| 8 | Pagar deuda | Deuda parcialmente pagada |
| 9 | Validaciones | Errores correctos |
| 10 | Anular venta | Stock devuelto, deuda cancelada |

¡Todo funciona correctamente! 🎉

---
