const db = require('../../config/db');

// Obtener catálogo de servicios
exports.getServices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM erp_services ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear servicio (con datos SAT)
exports.createService = async (req, res) => {
  const { nombre, precio, unidad, unidad_texto, clave_sat, impuesto_tasa } = req.body;
  try {
    const sql = `
      INSERT INTO erp_services (nombre, precio, unidad, unidad_texto, clave_sat, impuesto_tasa) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [nombre, precio, unidad, unidad_texto, clave_sat, impuesto_tasa]);
    res.status(201).json({ id: result.insertId, message: "Servicio creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};