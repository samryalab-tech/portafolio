const express = require('express');
const cors = require('cors');
const path = require('path'); // Necesario para manejar rutas de archivos
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- 1. SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND ---
// Esta línea le dice a Node que la carpeta 'dist' (donde está tu React build) es pública
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// --- IMPORTAR RUTAS ERP ---
const erpOrderRoutes = require('./routes/erp/orderRoutes');
const erpClientRoutes = require('./routes/erp/clientRoutes');
const erpServiceRoutes = require('./routes/erp/serviceRoutes'); // Ya lo tienes listo

// --- REGISTRO DE RUTAS (API) ---
app.use('/api/erp/orders', erpOrderRoutes);
app.use('/api/erp/clients', erpClientRoutes);
app.use('/api/erp/services', erpServiceRoutes);

// --- 2. RUTA PARA EL FRONTEND (SPA) ---
// Si la ruta no empieza con /api, entregamos el index.html de React
// Esto permite que el Front maneje sus propias rutas (como /ventas o /clientes)
app.get('*', (req, res) => {
  // Solo mandamos el index si no es una petición de API
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
  } else {
    res.status(404).json({ error: 'Ruta de API no encontrada' });
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ===========================================
  ✅ Servidor Full Stack Iniciado
  📡 URL: http://localhost:${PORT}
  🚀 Front: Servido desde ../../frontend/dist
  📂 API: /api/erp/... activa
  ===========================================
  `);
});