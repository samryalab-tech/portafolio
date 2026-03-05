const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- IMPORTAR RUTAS ERP ---
const erpOrderRoutes = require('./routes/erp/orderRoutes');
const erpClientRoutes = require('./routes/erp/clientRoutes');
// const erpServiceRoutes = require('./routes/erp/serviceRoutes'); // Listo para cuando lo crees

// --- IMPORTAR RUTAS CRM ---
// const crmLeadRoutes = require('./routes/crm/leadRoutes');
// const crmDealRoutes = require('./routes/crm/dealRoutes');

// --- REGISTRO DE RUTAS (ENDPOINTS) ---

// Módulo ERP
app.use('/api/erp/orders', erpOrderRoutes);
app.use('/api/erp/clients', erpClientRoutes);
// app.use('/api/erp/services', erpServiceRoutes);

// Módulo CRM
// app.use('/api/crm/leads', crmLeadRoutes);
// app.use('/api/crm/deals', crmDealRoutes);

// --- RUTA DE VERIFICACIÓN (HOSTINGER) ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Online',
    message: '🚀 ERP & CRM Backend funcionando correctamente',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- MANEJO DE RUTAS NO ENCONTRADAS (404) ---
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ===========================================
  ✅ Servidor iniciado con éxito
  📡 Puerto: ${PORT}
  📂 Módulos: ERP (Activo), CRM (Estructurado)
  ===========================================
  `);
});