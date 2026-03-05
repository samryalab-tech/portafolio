const Checklist = require('../models/Checklist');

const getChecklist = async (req, res) => {
  try {
    const { clienteId } = req.params;
    let checklist = await Checklist.findOne({ cliente: clienteId });
    if (!checklist) {
      checklist = await Checklist.create({ cliente: clienteId });
    }
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChecklist = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const updates = req.body;  // { tipoPropiedad, zona, presupuesto, habitaciones }

    const checklist = await Checklist.findOneAndUpdate(
      { cliente: clienteId },
      { ...updates, fechaActualizacion: Date.now() },
      { new: true, upsert: true }
    );

    // Marcar completado si todos los campos tienen valor
    checklist.completado = checklist.tipoPropiedad && checklist.zona && checklist.presupuesto && checklist.habitaciones ? true : false;
    await checklist.save();

    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getChecklist, updateChecklist };
