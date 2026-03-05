const Asesor = require('../models/Asesor');
const Cliente = require('../models/Cliente');

const listarAsesores = async (req, res) => {
  try {
    const asesores = await Asesor.find({ activo: true });
    res.json(asesores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const asignarAsesor = async (req, res) => {
  try {
    const { clienteId, asesorId } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    cliente.asesorAsignado = asesorId;
    await cliente.save();

    res.json({ mensaje: 'Asesor asignado correctamente', cliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { listarAsesores, asignarAsesor };
