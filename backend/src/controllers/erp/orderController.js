const db = require('../../config/db');

// Obtener órdenes listas para facturar (Módulo Ventas)
exports.getBillableOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, c.razon_social as clientName 
      FROM erp_orders o
      JOIN erp_clients c ON o.client_id = c.id
      WHERE o.estado = 'Finalizada' 
        AND o.listo_para_cobrar = 1 
        AND o.en_cobranza = 0
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva orden (ERP)
exports.createOrder = async (req, res) => {
  const { folio, client_id, prioridad, monto_total, descripcion } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO erp_orders (folio, client_id, prioridad, monto_total, saldo_pendiente) VALUES (?, ?, ?, ?, ?)',
      [folio, client_id, prioridad, monto_total, monto_total]
    );
    res.status(201).json({ id: result.insertId, message: "Orden creada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};