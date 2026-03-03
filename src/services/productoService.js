const { leerJSON, escribirJSON, generarId, esNumeroPositivo } = require('../utils/helpers');

/**
 * SERVICIO DE PRODUCTOS
 */

function obtenerProductos(filtros = {}) {
  const datos = leerJSON('productos');
  if (!datos) return [];

  let productos = datos.productos || [];

  if (filtros.activo !== undefined) {
    productos = productos.filter(p => p.activo === filtros.activo);
  }

  if (filtros.stock_bajo) {
    productos = productos.filter(p => p.stock_actual <= p.stock_minimo);
  }

  return productos;
}

function obtenerProductoPorId(id) {
  const datos = leerJSON('productos');
  if (!datos) return null;

  return (datos.productos || []).find(p => p.id === id);
}

function crearProducto(nombre, costo, precio_venta, stock_minimo, unidad = 'unidad') {
  // Validaciones
  if (!nombre || nombre.trim() === '') {
    return { error: 'El nombre del producto es requerido' };
  }

  if (!esNumeroPositivo(costo) || !esNumeroPositivo(precio_venta)) {
    return { error: 'El costo y precio de venta deben ser números positivos' };
  }

  if (precio_venta < costo) {
    return { error: 'El precio de venta no puede ser menor que el costo' };
  }

  if (!esNumeroPositivo(stock_minimo)) {
    return { error: 'El stock mínimo debe ser un número positivo' };
  }

  const datos = leerJSON('productos');
  if (!datos) return { error: 'Error al leer datos' };

  const nuevoProducto = {
    id: generarId('prod'),
    nombre: nombre.trim(),
    costo: parseFloat(costo),
    precio_venta: parseFloat(precio_venta),
    fecha_ingreso: new Date().toISOString(),
    stock_actual: 0,
    stock_minimo: parseInt(stock_minimo),
    unidad: unidad,
    activo: true,
    descuento_aplicado: 0
  };

  datos.productos.push(nuevoProducto);
  escribirJSON('productos', datos);

  return { exito: true, producto: nuevoProducto };
}

function actualizarStock(idProducto, cantidad, tipo = 'entrada') {
  const datos = leerJSON('productos');
  if (!datos) return { error: 'Error al leer datos' };

  const producto = datos.productos.find(p => p.id === idProducto);
  if (!producto) {
    return { error: 'Producto no encontrado' };
  }

  if (tipo === 'salida') {
    if (producto.stock_actual < cantidad) {
      return { error: `Stock insuficiente. Stock actual: ${producto.stock_actual}` };
    }
    producto.stock_actual -= cantidad;
  } else if (tipo === 'entrada') {
    producto.stock_actual += cantidad;
  } else {
    return { error: 'Tipo de movimiento inválido' };
  }

  escribirJSON('productos', datos);

  return { 
    exito: true, 
    stock_anterior: tipo === 'salida' ? producto.stock_actual + cantidad : producto.stock_actual - cantidad,
    stock_actual: producto.stock_actual,
    producto: producto
  };
}

function devolverStock(idProducto, cantidad) {
  return actualizarStock(idProducto, cantidad, 'entrada');
}

function aplicarDescuentoProducto(idProducto, porcentaje) {
  if (porcentaje < 0 || porcentaje > 100) {
    return { error: 'El porcentaje de descuento debe estar entre 0 y 100' };
  }

  const datos = leerJSON('productos');
  if (!datos) return { error: 'Error al leer datos' };

  const producto = datos.productos.find(p => p.id === idProducto);
  if (!producto) {
    return { error: 'Producto no encontrado' };
  }

  producto.descuento_aplicado = porcentaje;
  escribirJSON('productos', datos);

  return { exito: true, producto: producto };
}

function actualizarProducto(idProducto, datos_actualizacion) {
  const datos = leerJSON('productos');
  if (!datos) return { error: 'Error al leer datos' };

  const producto = datos.productos.find(p => p.id === idProducto);
  if (!producto) {
    return { error: 'Producto no encontrado' };
  }

  // Validaciones
  if (datos_actualizacion.stock_actual !== undefined) {
    if (!esNumeroPositivo(datos_actualizacion.stock_actual) && datos_actualizacion.stock_actual !== 0) {
      return { error: 'El stock actual debe ser un número no negativo' };
    }
    producto.stock_actual = parseFloat(datos_actualizacion.stock_actual);
  }

  if (datos_actualizacion.stock_minimo !== undefined) {
    if (!esNumeroPositivo(datos_actualizacion.stock_minimo)) {
      return { error: 'El stock mínimo debe ser un número positivo' };
    }
    producto.stock_minimo = parseInt(datos_actualizacion.stock_minimo);
  }

  if (datos_actualizacion.costo !== undefined) {
    if (!esNumeroPositivo(datos_actualizacion.costo)) {
      return { error: 'El costo debe ser un número positivo' };
    }
    producto.costo = parseFloat(datos_actualizacion.costo);
  }

  if (datos_actualizacion.precio_venta !== undefined) {
    if (!esNumeroPositivo(datos_actualizacion.precio_venta)) {
      return { error: 'El precio de venta debe ser un número positivo' };
    }
    if (datos_actualizacion.precio_venta < producto.costo) {
      return { error: 'El precio de venta no puede ser menor que el costo' };
    }
    producto.precio_venta = parseFloat(datos_actualizacion.precio_venta);
  }

  if (datos_actualizacion.nombre !== undefined) {
    if (!datos_actualizacion.nombre.trim()) {
      return { error: 'El nombre del producto no puede estar vacío' };
    }
    producto.nombre = datos_actualizacion.nombre.trim();
  }

  producto.updatedAt = new Date().toISOString();
  escribirJSON('productos', datos);

  return { exito: true, producto: producto };
}

function eliminarProducto(idProducto) {
  const datos = leerJSON('productos');
  if (!datos) return { error: 'Error al leer datos' };

  const indice = datos.productos.findIndex(p => p.id === idProducto);
  if (indice === -1) {
    return { error: 'Producto no encontrado' };
  }

  const productoEliminado = datos.productos.splice(indice, 1)[0];
  escribirJSON('productos', datos);

  return { exito: true, mensaje: `Producto "${productoEliminado.nombre}" eliminado correctamente`, producto: productoEliminado };
}

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarStock,
  devolverStock,
  aplicarDescuentoProducto,
  actualizarProducto,
  eliminarProducto
};
