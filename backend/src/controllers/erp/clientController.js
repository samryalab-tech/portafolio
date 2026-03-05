const db = require('../../config/db');

// Obtener todos los clientes (ERP)
exports.getClients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM erp_clients ORDER BY razon_social ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo cliente fiscal
exports.createClient = async (req, res) => {
  const { 
    razon_social, rfc, regimen, cp, calle, num_ext, num_int, 
    colonia, municipio, estado, uso_cfdi, forma_pago, metodo_pago 
  } = req.body;

  try {
    const sql = `
      INSERT INTO erp_clients 
      (razon_social, rfc, regimen, cp, calle, num_ext, num_int, colonia, municipio, estado, uso_cfdi, forma_pago, metodo_pago) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [
      razon_social, rfc, regimen, cp, calle, num_ext, num_int, 
      colonia, municipio, estado, uso_cfdi, forma_pago, metodo_pago
    ]);

    res.status(201).json({ id: result.insertId, message: "Cliente fiscal registrado con éxito" });
  } catch (error) {
    // Manejo de error si el RFC ya existe o hay datos faltantes
    res.status(500).json({ error: error.message });
  }
};