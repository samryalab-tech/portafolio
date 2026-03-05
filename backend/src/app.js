const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE RUTAS ESTÁTICAS (FRONTEND) ---
// Resolvemos la ruta absoluta hacia frontend/dist subiendo dos niveles desde backend/src
const frontendPath = path.resolve(__dirname, '..', '..', 'frontend', 'dist');

// Servir archivos estáticos (JS, CSS, Imágenes)
app.use(express.static(frontendPath));

// --- IMPORTAR RUTAS API ---
const erpOrderRoutes = require('./routes/erp/orderRoutes');
const erpClientRoutes = require('./routes/erp/clientRoutes');
const erpServiceRoutes = require('./routes/erp/serviceRoutes');

// --- REGISTRO DE RUTAS API ---
app.use('/api/erp/orders', erpOrderRoutes);
app.use('/api/erp/clients', erpClientRoutes);
app.use('/api/erp/services', erpServiceRoutes);

// --- MANEJO DEL FRONTEND (SPA) ---
// Captura cualquier ruta que no sea de la API y entrega el index.html de React
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        // Si hay error, enviamos un mensaje claro para debuguear en el navegador
        res.status(500).send("Error: No se encontró el index.html en: " + frontendPath);
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
  ✅ Servidor Full Stack Funcionando
  📡 Puerto: ${PORT}
  📂 Ruta Frontend: ${frontendPath}
  ====================== vamos a ver si funciona
  `);
});