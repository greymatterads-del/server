/**
 * CONFIGURACIÓN DE CORS
 * Whitelist de orígenes permitidos
 */

// Dominios permitidos
const allowedOrigins = [
  // Desarrollo local
  'http://localhost:3000',
  'http://localhost:8000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8000',
  'http://localhost',
  // Producción - Vercel
  'https://inventario-sistema-front.vercel.app',
  'https://gestion-three-green.vercel.app',
  // VPS/Otros
  'http://148.230.72.182',
];

// Verificar si el origen está permitido
function isOriginAllowed(origin) {
  if (!origin) return true; // Sin origin en requests simples
  return allowedOrigins.includes(origin);
}

// Middleware CORS personalizado
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  // Siempre responder con CORS headers si el origen está permitido
  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '3600');
  }

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}

module.exports = corsMiddleware;
