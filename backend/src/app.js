const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE RUTAS ESTÁTICAS (FRONTEND) ---
// En Hostinger, subimos dos niveles para salir de 'backend/src' y entrar a 'frontend/dist'
const frontendPath = path.resolve(__dirname, '..', '..', 'frontend', 'dist');

// Servir archivos estáticos (JS, CSS, Imágenes) con caché desactivada para pruebas
app.use(express.static(frontendPath, { etag: false }));

// --- IMPORTAR RUTAS API ---
const erpOrderRoutes = require('./routes/erp/orderRoutes');
const erpClientRoutes = require('./routes/erp/clientRoutes');
const erpServiceRoutes = require('./routes/erp/serviceRoutes');

// --- REGISTRO DE RUTAS API ---
app.use('/api/erp/orders', erpOrderRoutes);
app.use('/api/erp/clients', erpClientRoutes);
app.use('/api/erp/services', erpServiceRoutes);

// --- MANEJO DEL FRONTEND (SPA) ---
app.get('*', (req, res) => {
  // Si la ruta NO comienza con /api, entregamos el index.html
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        // Si ves este error en el navegador, revisa que la carpeta 'dist' exista en GitHub
        res.status(500).send("Error de despliegue: No se encontró el build en " + frontendPath);
      }
    });
  } else {
    res.status(404).json({ error: 'Ruta de API no encontrada' });
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ===========================================
  ✅ Servidor Full Stack Funcionando en Hostinger
  📡 Puerto: ${PORT}
  📂 Ruta Frontend Detectada: ${frontendPath}
  ===========================================
  `);
});